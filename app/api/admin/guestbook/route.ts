import {
  approveGuestbookEntry,
  deleteGuestbookEntry,
  guestbookConfigured,
  listGuestbookEntries,
} from "@/lib/airtable";
import { isAuthorized } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!guestbookConfigured()) {
    return Response.json({ error: "The guestbook isn't set up yet." }, { status: 500 });
  }

  try {
    const entries = await listGuestbookEntries(false);
    return Response.json({ entries });
  } catch (error) {
    console.error("Failed to load guestbook for moderation:", error);
    return Response.json({ error: "Couldn't load the guestbook right now." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!guestbookConfigured()) {
    return Response.json({ error: "The guestbook isn't set up yet." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const recordId = typeof body?.recordId === "string" ? body.recordId : "";
  if (!recordId) {
    return Response.json({ error: "Missing entry." }, { status: 400 });
  }

  try {
    await approveGuestbookEntry(recordId);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to approve guestbook entry:", error);
    return Response.json({ error: "Couldn't approve this message right now." }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!guestbookConfigured()) {
    return Response.json({ error: "The guestbook isn't set up yet." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const recordId = typeof body?.recordId === "string" ? body.recordId : "";
  if (!recordId) {
    return Response.json({ error: "Missing entry." }, { status: 400 });
  }

  try {
    await deleteGuestbookEntry(recordId);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete guestbook entry:", error);
    return Response.json({ error: "Couldn't delete this message right now." }, { status: 502 });
  }
}
