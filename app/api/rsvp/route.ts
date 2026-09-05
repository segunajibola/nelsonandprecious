import { Resend } from "resend";
import type { RsvpFormData } from "@/types";
import { couple } from "@/lib/data";
import {
  airtableConfigured,
  escapeFormulaValue,
  findInviteByCode,
  findRecordByFormula,
  updateRecord,
} from "@/lib/airtable";
import { sendGuestConfirmationEmail } from "@/lib/guestEmail";

// Characters chosen to avoid visual ambiguity (no I, O, 0, 1). 32 chars so
// byte % 32 has no modulo bias against the 0-255 range of a random byte.
const ACCESS_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ACCESS_CODE_LENGTH = 5;
const ACCESS_CODE_PREFIX = "PNWED-";
const MAX_ACCESS_CODE_ATTEMPTS = 8;

interface ValidatedRsvp {
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
  inviteCode: string;
}

function validateRsvp(
  data: Partial<RsvpFormData>,
): { error: string } | { data: ValidatedRsvp } {
  const inviteCode =
    typeof data.inviteCode === "string" ? data.inviteCode.trim() : "";
  if (!inviteCode) return { error: "An invite code is required." };

  if (data.attending !== "yes" && data.attending !== "no") {
    return { error: "Please let us know if you'll be attending." };
  }

  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!email)
    return {
      error:
        "Please enter your email address — that's how we'll send your confirmation.",
    };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const message =
    typeof data.message === "string" ? data.message.trim().slice(0, 2000) : "";

  const guestsRaw = Number(data.guests);
  const guests =
    Number.isFinite(guestsRaw) && guestsRaw >= 1
      ? Math.min(Math.floor(guestsRaw), 20)
      : 1;

  return {
    data: {
      email,
      phone,
      attending: data.attending,
      guests,
      message,
      inviteCode,
    },
  };
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
  const record = await findRecordByFormula(
    `{Access code} = "${escapeFormulaValue(code)}"`,
  );
  return record !== null;
}

async function generateUniqueAccessCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_ACCESS_CODE_ATTEMPTS; attempt++) {
    const code = generateAccessCode();
    if (!(await accessCodeExists(code))) return code;
  }
  throw new Error(
    "Could not generate a unique access code after several attempts.",
  );
}

// Notifies the couple directly — only used as a last resort if saving to
// Airtable itself fails, so they still hear about the RSVP some other way.
async function sendFallbackEmail(data: {
  inviteCode: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  message: string;
  submittedAt: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  // Comma-separated so the couple can both be notified, e.g. "a@x.com, b@x.com".
  const to = process.env.RSVP_NOTIFICATION_EMAIL?.split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to?.length || !from) return false;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `RSVP save failed — invite ${data.inviteCode} (${data.attending === "yes" ? "Attending" : "Not attending"})`,
      text: [
        `An RSVP came in but couldn't be saved to Airtable — please follow up manually.`,
        `Invite code: ${data.inviteCode}`,
        `Attending: ${data.attending === "yes" ? "Yes" : "No"}`,
        `Guests: ${data.guests}`,
        `Email: ${data.email}`,
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
  let raw: Partial<RsvpFormData>;
  try {
    raw = (await request.json()) as Partial<RsvpFormData>;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateRsvp(raw);
  if ("error" in validation) {
    return Response.json({ error: validation.error }, { status: 400 });
  }
  const { email, phone, attending, guests, message, inviteCode } =
    validation.data;

  if (!airtableConfigured()) {
    return Response.json(
      {
        error:
          "RSVP collection isn't configured yet. Please contact the couple directly.",
      },
      { status: 500 },
    );
  }

  if (Date.now() > new Date(couple.rsvpDeadlineISO).getTime()) {
    return Response.json(
      {
        error: `The RSVP deadline (${couple.rsvpDeadlineDisplay}) has passed. Please contact us directly if you still need to respond.`,
      },
      { status: 400 },
    );
  }

  try {
    // The guest count cap is re-checked here from Airtable — never trusted
    // from the client — since the browser could otherwise submit any number.
    const invite = await findInviteByCode(inviteCode);
    if (!invite) {
      return Response.json(
        {
          error:
            "This invite link isn't valid. Please use the link from your invitation, or contact us directly.",
        },
        { status: 400 },
      );
    }
    if (guests > invite.maxGuests) {
      return Response.json(
        {
          error: `Your invitation allows up to ${invite.maxGuests} guest${invite.maxGuests === 1 ? "" : "s"}. Please adjust your guest count.`,
        },
        { status: 400 },
      );
    }

    let accessCode: string | null = null;
    let qrToken: string | null = null;

    // Only guests who are attending get a check-in code — there's nothing to check in otherwise.
    if (attending === "yes") {
      accessCode = await generateUniqueAccessCode();
      qrToken = generateQrToken();
    }

    const fields: Record<string, unknown> = {
      "Will you attend?": attending === "yes" ? "Yes" : "No",
      "Number of guests": guests,
      Email: email,
    };
    if (phone) fields["Phone"] = phone;
    if (message) fields["Message to the couple"] = message;
    if (accessCode) fields["Access code"] = accessCode;
    if (qrToken) fields["QR code"] = qrToken;
    // Name is fixed by the couple at invite-creation time and is never
    // touched here. "Checked In" / "Check-In time" are intentionally never
    // set here either — only the check-in dashboard (see checkInGuest in
    // lib/airtable.ts) is allowed to write those.

    await updateRecord(invite.recordId, fields);

    await sendGuestConfirmationEmail({
      to: email,
      name: invite.name,
      attending,
      guests,
      accessCode,
      qrToken,
    });

    return Response.json({
      ok: true,
      name: invite.name,
      attending,
      guests,
      accessCode: accessCode ?? undefined,
      qrToken: qrToken ?? undefined,
    });
  } catch (error) {
    console.error("RSVP submission failed:", error);
    await sendFallbackEmail({
      inviteCode,
      email,
      phone,
      attending,
      guests,
      message,
      submittedAt: new Date().toISOString(),
    });
    return Response.json(
      {
        error:
          "We couldn't save your RSVP right now. Please try again shortly, or contact us directly.",
      },
      { status: 502 },
    );
  }
}
