import { Resend } from "resend";
import type { RsvpFormData } from "@/types";
import {
  airtableConfigured,
  createRecord,
  escapeFormulaValue,
  findInviteByCode,
  findRecordByFormula,
  updateRecord,
} from "@/lib/airtable";

// Characters chosen to avoid visual ambiguity (no I, O, 0, 1). 32 chars so
// byte % 32 has no modulo bias against the 0-255 range of a random byte.
const ACCESS_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ACCESS_CODE_LENGTH = 5;
const ACCESS_CODE_PREFIX = "WED-";
const MAX_ACCESS_CODE_ATTEMPTS = 8;

interface ValidatedRsvp {
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
  inviteCode: string;
}

function validateRsvp(
  data: Partial<RsvpFormData> & { inviteCode?: string },
): { error: string } | { data: ValidatedRsvp } {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (!name) return { error: "Please tell us your name." };
  if (name.length > 200) return { error: "That name looks too long — please shorten it." };

  if (data.attending !== "yes" && data.attending !== "no") {
    return { error: "Please let us know if you'll be attending." };
  }

  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim().slice(0, 2000) : "";
  const inviteCode = typeof data.inviteCode === "string" ? data.inviteCode.trim() : "";

  const guestsRaw = Number(data.guests);
  const guests = Number.isFinite(guestsRaw) && guestsRaw >= 1 ? Math.min(Math.floor(guestsRaw), 20) : 1;

  return { data: { name, email, phone, attending: data.attending, guests, message, inviteCode } };
}

function generateAccessCode(): string {
  const bytes = new Uint8Array(ACCESS_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (let i = 0; i < ACCESS_CODE_LENGTH; i++) {
    suffix += ACCESS_CODE_ALPHABET[bytes[i] % ACCESS_CODE_ALPHABET.length];
  }
  return `${ACCESS_CODE_PREFIX}${suffix}`;
}

function generateQrToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function accessCodeExists(code: string): Promise<boolean> {
  const record = await findRecordByFormula(`{Access code} = "${escapeFormulaValue(code)}"`);
  return record !== null;
}

async function generateUniqueAccessCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_ACCESS_CODE_ATTEMPTS; attempt++) {
    const code = generateAccessCode();
    if (!(await accessCodeExists(code))) return code;
  }
  throw new Error("Could not generate a unique access code after several attempts.");
}

async function sendFallbackEmail(data: Omit<RsvpFormData, "guests"> & { guests: number; submittedAt: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RSVP_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) return false;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `RSVP: ${data.name} — ${data.attending === "yes" ? "Attending" : "Not attending"}`,
      text: [
        `Name: ${data.name}`,
        `Attending: ${data.attending === "yes" ? "Yes" : "No"}`,
        `Guests: ${data.guests}`,
        data.email && `Email: ${data.email}`,
        data.phone && `Phone: ${data.phone}`,
        data.message && `Message: ${data.message}`,
        `Submitted: ${data.submittedAt}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("RSVP fallback email failed:", error);
    return false;
  }
}

export async function POST(request: Request) {
  let raw: Partial<RsvpFormData> & { inviteCode?: string };
  try {
    raw = (await request.json()) as Partial<RsvpFormData> & { inviteCode?: string };
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateRsvp(raw);
  if ("error" in validation) {
    return Response.json({ error: validation.error }, { status: 400 });
  }
  const { name, email, phone, attending, guests, message, inviteCode } = validation.data;

  if (airtableConfigured()) {
    try {
      // A personal invite link caps how many guests this specific family can bring.
      // The cap is re-checked here from Airtable — never trusted from the client —
      // since the browser could otherwise just submit any number.
      let invite: { recordId: string; maxGuests: number } | null = null;
      if (inviteCode) {
        const found = await findInviteByCode(inviteCode);
        if (!found) {
          return Response.json(
            { error: "This invite link isn't valid. Please use the link from your invitation, or contact us directly." },
            { status: 400 },
          );
        }
        if (guests > found.maxGuests) {
          return Response.json(
            {
              error: `Your invitation allows up to ${found.maxGuests} guest${found.maxGuests === 1 ? "" : "s"}. Please adjust your guest count.`,
            },
            { status: 400 },
          );
        }
        invite = { recordId: found.recordId, maxGuests: found.maxGuests };
      }

      let accessCode: string | null = null;
      let qrToken: string | null = null;

      // Only guests who are attending get a check-in code — there's nothing to check in otherwise.
      if (attending === "yes") {
        accessCode = await generateUniqueAccessCode();
        qrToken = generateQrToken();
      }

      const fields: Record<string, unknown> = {
        Name: name,
        "Will you attend?": attending === "yes" ? "Yes" : "No",
        "Number of guests": guests,
      };
      // For invite rows, this overwrites the couple's private placeholder
      // label with the guest's own name — the whole point of letting them type it.
      if (email) fields["Email"] = email;
      if (phone) fields["Phone"] = phone;
      if (message) fields["Message to the couple"] = message;
      if (accessCode) fields["Access code"] = accessCode;
      if (qrToken) fields["QR code"] = qrToken;
      // "Checked In" and "Check-In time" are intentionally never set here —
      // only the check-in flow (not yet built) is allowed to write those.

      if (invite) {
        await updateRecord(invite.recordId, fields);
      } else {
        await createRecord(fields);
      }

      return Response.json({
        ok: true,
        name,
        attending,
        guests,
        accessCode: accessCode ?? undefined,
        qrToken: qrToken ?? undefined,
      });
    } catch (error) {
      console.error("Airtable RSVP save failed, falling back to email:", error);
      // Fall through to the legacy path below so the RSVP still reaches the couple —
      // just without a check-in code, since it was never persisted to Airtable.
    }
  }

  const submittedAt = new Date().toISOString();
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const fallbackPayload = { name, email, phone, attending, guests, message, submittedAt };

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackPayload),
      });

      if (!res.ok) throw new Error(`Sheet webhook responded with ${res.status}`);
      return Response.json({ ok: true, name, attending, guests });
    } catch (error) {
      console.error("RSVP sheet submission failed, trying email fallback:", error);
      if (await sendFallbackEmail(fallbackPayload)) {
        return Response.json({ ok: true, name, attending, guests });
      }
      return Response.json(
        { error: "We couldn't save your RSVP right now. Please try again shortly." },
        { status: 502 },
      );
    }
  }

  if (await sendFallbackEmail(fallbackPayload)) {
    return Response.json({ ok: true, name, attending, guests });
  }

  return Response.json(
    { error: "RSVP collection isn't configured yet. Please contact the couple directly." },
    { status: 500 },
  );
}
