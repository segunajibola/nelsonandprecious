import { airtableConfigured, checkInGuest, findGuestByQrToken } from "@/lib/airtable";

// Public by design — same trust model as the RSVP link and the resend
// endpoint: the qrToken is a long random secret only the guest (via their
// confirmation email/QR image) ever sees, so possessing it is the
// authorization. This lets any door staff member's ordinary phone camera
// check a guest in directly, without needing the /admin login.
export async function POST(_request: Request, ctx: RouteContext<"/api/checkin/[token]">) {
  const { token } = await ctx.params;
  const value = decodeURIComponent(token);

  if (!airtableConfigured()) {
    return Response.json({ error: "Check-in isn't configured yet." }, { status: 500 });
  }
  if (!value) {
    return Response.json({ error: "Missing QR token." }, { status: 400 });
  }

  try {
    const guest = await findGuestByQrToken(value);
    if (!guest) {
      return Response.json({ error: "This QR code isn't recognized." }, { status: 404 });
    }
    if (guest.attending !== "yes") {
      return Response.json({ error: "This guest isn't confirmed as attending." }, { status: 400 });
    }

    const result = await checkInGuest(guest.recordId);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Public check-in failed:", error);
    return Response.json({ error: "Couldn't check in this guest right now." }, { status: 502 });
  }
}
