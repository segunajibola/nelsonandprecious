import { airtableConfigured, createInvite, listInvites } from "@/lib/airtable";

function isAuthorized(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const provided = request.headers.get("x-admin-password");
  return provided === password;
}

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

  if (!Number.isFinite(maxGuests) || maxGuests < 1 || maxGuests > 20) {
    return Response.json({ error: "Max guests must be a number between 1 and 20." }, { status: 400 });
  }

  try {
    const invite = await createInvite(maxGuests, label);
    return Response.json({ ok: true, invite });
  } catch (error) {
    console.error("Failed to create invite:", error);
    return Response.json({ error: "Couldn't create the invite right now." }, { status: 502 });
  }
}
