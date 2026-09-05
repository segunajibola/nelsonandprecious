import { listSongRequests, songsConfigured } from "@/lib/airtable";
import { isAuthorized } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  if (!songsConfigured()) {
    return Response.json({ error: "Song requests aren't set up yet." }, { status: 500 });
  }

  try {
    const requests = await listSongRequests();
    return Response.json({ requests });
  } catch (error) {
    console.error("Failed to load song requests:", error);
    return Response.json({ error: "Couldn't load song requests right now." }, { status: 502 });
  }
}
