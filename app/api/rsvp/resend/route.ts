import { airtableConfigured, findGuestByInviteCode } from "@/lib/airtable";
import { sendGuestConfirmationEmail } from "@/lib/guestEmail";

// Re-sends the exact same confirmation email a guest already received, in
// case they lost it. Trust model matches the rest of the RSVP flow: anyone
// with the invite link can already view/change that RSVP, so resending to
// whatever email is already on file (never a client-supplied address)
// doesn't introduce a new way to leak someone else's information.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const inviteCode = typeof body?.inviteCode === "string" ? body.inviteCode.trim() : "";

  if (!inviteCode) {
    return Response.json({ error: "Missing invite code." }, { status: 400 });
  }
  if (!airtableConfigured()) {
    return Response.json({ error: "RSVP collection isn't configured yet." }, { status: 500 });
  }

  try {
    const guest = await findGuestByInviteCode(inviteCode);
    if (!guest) {
      return Response.json(
        { error: "This invite link isn't valid. Please contact us directly." },
        { status: 400 },
      );
    }
    if (!guest.attending) {
      return Response.json(
        { error: "You haven't submitted an RSVP yet — please fill out the form first." },
        { status: 400 },
      );
    }
    if (!guest.email) {
      return Response.json(
        { error: "No email address is on file for this invite. Please contact us directly." },
        { status: 400 },
      );
    }

    const sent = await sendGuestConfirmationEmail({
      to: guest.email,
      name: guest.name,
      attending: guest.attending,
      guests: guest.guests ?? 1,
      accessCode: guest.accessCode,
      qrToken: guest.qrToken,
    });

    if (!sent) {
      return Response.json(
        { error: "Couldn't send the email right now. Please try again shortly." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, email: guest.email });
  } catch (error) {
    console.error("RSVP resend failed:", error);
    return Response.json({ error: "Something went wrong. Please try again shortly." }, { status: 502 });
  }
}
