import { ceremonyVenue, event as receptionVenue } from "@/lib/data";
import { buildIcs } from "@/lib/calendar";

export async function GET(_request: Request, ctx: RouteContext<"/api/calendar/[event]">) {
  const { event: eventSlug } = await ctx.params;
  const venue =
    eventSlug === "ceremony" ? ceremonyVenue : eventSlug === "reception" ? receptionVenue : null;

  if (!venue) {
    return new Response("Not found", { status: 404 });
  }

  const ics = buildIcs(venue, `${eventSlug}-nelson-precious-wedding@preciousandnelson.vercel.app`);
  if (!ics) {
    return new Response("Calendar details aren't available yet", { status: 404 });
  }

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${eventSlug}.ics"`,
    },
  });
}
