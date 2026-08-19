import { Resend } from "resend";
import type { RsvpFormData } from "@/types";

async function sendFallbackEmail(data: RsvpFormData & { submittedAt: string }) {
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
  const data = (await request.json()) as RsvpFormData;

  if (!data.name || !data.attending) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  const payload = { ...data, submittedAt: new Date().toISOString() };
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Sheet webhook responded with ${res.status}`);
      return Response.json({ ok: true });
    } catch (error) {
      console.error("RSVP sheet submission failed, trying email fallback:", error);
      if (await sendFallbackEmail(payload)) {
        return Response.json({ ok: true });
      }
      return Response.json(
        { error: "We couldn't save your RSVP right now. Please try again shortly." },
        { status: 502 },
      );
    }
  }

  // No sheet configured — email is the only path.
  if (await sendFallbackEmail(payload)) {
    return Response.json({ ok: true });
  }

  return Response.json(
    { error: "RSVP collection isn't configured yet. Please contact the couple directly." },
    { status: 500 },
  );
}
