import { photosConfigured, uploadPhoto } from "@/lib/airtable";

// Airtable's attachment-upload endpoint takes the file inline as base64 in a
// JSON body, so this caps file size well under typical serverless request
// body limits (base64 inflates the payload by ~33%).
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

export async function POST(request: Request) {
  if (!photosConfigured()) {
    return Response.json({ error: "Photo sharing isn't set up yet." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 500) : "";
  const filename = typeof body?.filename === "string" ? body.filename.slice(0, 200) : "photo.jpg";
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";
  const base64 = typeof body?.base64 === "string" ? body.base64 : "";

  if (!contentType.startsWith("image/")) {
    return Response.json({ error: "Only image files are supported." }, { status: 400 });
  }
  if (!base64) {
    return Response.json({ error: "Missing file data." }, { status: 400 });
  }
  if ((base64.length * 3) / 4 > MAX_PHOTO_BYTES) {
    return Response.json({ error: "Photos must be under 3MB each." }, { status: 400 });
  }

  try {
    await uploadPhoto(name || "Anonymous", message, { contentType, filename, base64 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Photo upload failed:", error);
    return Response.json({ error: "Couldn't upload this photo right now." }, { status: 502 });
  }
}
