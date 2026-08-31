import QRCode from "qrcode";

// Renders a QR code PNG for any token string — used both by the RSVP success
// screen and embedded directly in the guest's confirmation email (as a plain
// image URL, since most email clients strip inline data-URI images). This
// endpoint doesn't touch Airtable at all; it's a pure "string in, PNG out"
// utility, so it stays fast and has nothing to fail except the render itself.
export async function GET(_request: Request, ctx: RouteContext<"/api/qr/[token]">) {
  const { token } = await ctx.params;
  const value = decodeURIComponent(token);

  if (!value || value.length > 200) {
    return new Response("Invalid token", { status: 400 });
  }

  try {
    const buffer = await QRCode.toBuffer(value, {
      type: "png",
      width: 320,
      margin: 1,
      color: { dark: "#1c2841", light: "#ffffff" },
    });

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        // The same token always renders the same QR code, so this is safe to cache forever.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("QR code generation failed:", error);
    return new Response("Failed to generate QR code", { status: 500 });
  }
}
