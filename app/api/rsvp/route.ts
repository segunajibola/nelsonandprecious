import { Resend } from "resend";
import type { RsvpFormData } from "@/types";
import { ceremonyVenue, couple, event } from "@/lib/data";
import {
  airtableConfigured,
  escapeFormulaValue,
  findInviteByCode,
  findRecordByFormula,
  updateRecord,
} from "@/lib/airtable";

const SITE_URL = process.env.SITE_URL || "https://preciousandnelson.vercel.app";

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
  const to = process.env.RSVP_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) return false;

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

// Sends the guest their own confirmation — the whole reason email is required.
async function sendGuestConfirmationEmail(data: {
  to: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  accessCode: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const detailsUrl = `${SITE_URL}/details`;

  try {
    const resend = new Resend(apiKey);

    if (data.attending === "no") {
      const { error } = await resend.emails.send({
        from,
        to: data.to,
        subject: `We'll miss you — ${couple.groomName} & ${couple.brideName}'s Wedding`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1c2841;">
            <p>Dear ${escapeHtml(data.name)},</p>
            <p>Thank you for letting us know you won't be able to join us on ${couple.weddingDateDisplay}. You'll be in our hearts on the day.</p>
            <p style="margin-top: 32px;">With love,<br />${couple.groomName} &amp; ${couple.brideName}</p>
          </div>
        `,
      });
      if (error) throw error;
      return true;
    }

    const { error } = await resend.emails.send({
      from,
      to: data.to,
      subject: `You're Confirmed! 🎉 ${couple.groomName} & ${couple.brideName}'s Wedding`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1c2841;">
          <p>Dear ${escapeHtml(data.name)},</p>
          <p>We're so glad you'll be celebrating with us! Here's everything you need for the day.</p>

          <div style="background: #fdf6f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 12px; font-weight: bold;">Ceremony — ${escapeHtml(ceremonyVenue.name)}</p>
            <p style="margin: 0 0 16px; font-size: 14px;">${couple.weddingDateDisplay}, ${escapeHtml(ceremonyVenue.time)}</p>
            <p style="margin: 0 0 12px; font-weight: bold;">Reception — ${escapeHtml(event.name)}</p>
            <p style="margin: 0 0 4px; font-size: 14px;">${couple.weddingDateDisplay}, ${escapeHtml(event.time)}</p>
            <p style="margin: 0 0 16px; font-size: 14px;">${escapeHtml(event.address)}</p>
            ${event.dressCode ? `<p style="margin: 0; font-size: 14px;"><strong>Dress code:</strong> ${escapeHtml(event.dressCode)}</p>` : ""}
          </div>

          <p>Guests confirmed: <strong>${data.guests}</strong></p>

          <div style="text-align: center; background: #1c2841; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 6px; color: #ffd9b3; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Your Access Code</p>
            <p style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 4px; font-weight: bold;">${data.accessCode}</p>
          </div>

          <p style="font-size: 14px;">Please present this code at the entrance on the day — a screenshot works fine.</p>

          <p style="text-align: center; margin: 32px 0;">
            <a href="${detailsUrl}" style="background: #1c2841; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-size: 14px;">View Full Wedding Details</a>
          </p>

          <p style="margin-top: 32px;">With love,<br />${couple.groomName} &amp; ${couple.brideName}</p>
        </div>
      `,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Guest confirmation email failed:", error);
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
    // set here either — only the (not yet built) check-in flow writes those.

    await updateRecord(invite.recordId, fields);

    await sendGuestConfirmationEmail({
      to: email,
      name: invite.name,
      attending,
      guests,
      accessCode,
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
