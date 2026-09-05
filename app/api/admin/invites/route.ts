import { airtableConfigured, createInvite, listInvites } from "@/lib/airtable";
import { isAuthorized } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!airtableConfigured()) {
    return Response.json({ error: "Airtable isn't configured." }, { status: 500 });
  }

  try {
    const invites = await listInvites();
    return Response.json({ ok: true, invites });
  } catch (error) {
    console.error("Failed to list invites:", error);
    return Response.json({ error: "Couldn't load invites right now." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!airtableConfigured()) {
    return Response.json({ error: "Airtable isn't configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const label = typeof body?.label === "string" ? body.label.trim().slice(0, 200) : "";
  const maxGuestsRaw = Number(body?.maxGuests);
  const maxGuests = Number.isFinite(maxGuestsRaw) ? Math.floor(maxGuestsRaw) : NaN;
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 200) : "";

  if (!label) {
    return Response.json({ error: "Please enter a name for this invite — it's shown to the guest and can't be changed." }, { status: 400 });
  }
  if (!Number.isFinite(maxGuests) || maxGuests < 1 || maxGuests > 20) {
    return Response.json({ error: "Max guests must be a number between 1 and 20." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address, or leave it blank." }, { status: 400 });
  }

  try {
    const invite = await createInvite(maxGuests, label, email || undefined);
    return Response.json({ ok: true, invite });
  } catch (error) {
    console.error("Failed to create invite:", error);
    return Response.json({ error: "Couldn't create the invite right now." }, { status: 502 });
  }
}
