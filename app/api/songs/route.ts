import { createSongRequest, songsConfigured } from "@/lib/airtable";

// Public, write-only from the guest's side — feeds the MC/DJ, no public
// listing. See /admin/songs for the read-only view the couple uses.
export async function POST(request: Request) {
  if (!songsConfigured()) {
    return Response.json({ error: "Song requests aren't set up yet." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "Anonymous";
  const song = typeof body?.song === "string" ? body.song.trim().slice(0, 200) : "";
  const artist = typeof body?.artist === "string" ? body.artist.trim().slice(0, 200) : "";

  if (!song) {
    return Response.json({ error: "Please enter a song title." }, { status: 400 });
  }

  try {
    await createSongRequest(name || "Anonymous", song, artist);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to create song request:", error);
    return Response.json({ error: "Couldn't save your request right now." }, { status: 502 });
  }
}
