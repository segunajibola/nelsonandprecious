import { createGuestbookEntry, guestbookConfigured, listGuestbookEntries } from "@/lib/airtable";

// Public — anyone can read approved messages and leave one. Submissions
// default to unapproved (see createGuestbookEntry) so the couple can
// moderate before anything shows up here.
export async function GET() {
  if (!guestbookConfigured()) {
    return Response.json({ entries: [] });
  }

  try {
    const entries = await listGuestbookEntries(true);
    return Response.json({ entries });
  } catch (error) {
    console.error("Failed to load guestbook:", error);
    return Response.json({ error: "Couldn't load the guestbook right now." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!guestbookConfigured()) {
    return Response.json({ error: "The guestbook isn't set up yet." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1000) : "";

  if (!name) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!message) {
    return Response.json({ error: "Please write a message." }, { status: 400 });
  }

  try {
    await createGuestbookEntry(name, message);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to create guestbook entry:", error);
    return Response.json({ error: "Couldn't save your message right now." }, { status: 502 });
  }
}
