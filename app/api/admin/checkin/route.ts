import { airtableConfigured, checkInGuest } from "@/lib/airtable";
import { isAuthorized } from "@/lib/adminAuth";

// Marks a guest checked in. Idempotent — calling this twice for the same
// guest doesn't overwrite their original check-in time, it just reports
// that they were already in. Lookup/search happens entirely client-side
// against the already-fetched invite list (see /api/admin/invites), so this
// route only ever needs a recordId, not a search query.
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!airtableConfigured()) {
    return Response.json({ error: "Airtable isn't configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const recordId = typeof body?.recordId === "string" ? body.recordId.trim() : "";
  if (!recordId) {
    return Response.json({ error: "Missing guest record." }, { status: 400 });
  }

  try {
    const result = await checkInGuest(recordId);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Check-in failed:", error);
    return Response.json({ error: "Couldn't check in this guest right now." }, { status: 502 });
  }
}
