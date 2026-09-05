import type { VenueDetail } from "@/types";

// No server-only dependencies here (no env vars, no fs) — safe to import
// from both server routes and client components.

function toUtcStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function googleCalendarUrl(venue: VenueDetail): string | null {
  if (!venue.startISO || !venue.endISO) return null;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${venue.heading} — ${venue.name}`,
    dates: `${toUtcStamp(venue.startISO)}/${toUtcStamp(venue.endISO)}`,
    details: venue.heading,
    location: venue.address,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

// Uses UTC timestamps throughout (rather than a VTIMEZONE block) so the
// event resolves correctly in every calendar app without needing an IANA
// timezone database entry embedded in the file.
export function buildIcs(venue: VenueDetail, uid: string): string | null {
  if (!venue.startISO || !venue.endISO) return null;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nelson & Precious Wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${toUtcStamp(venue.startISO)}`,
    `DTEND:${toUtcStamp(venue.endISO)}`,
    `SUMMARY:${escapeIcsText(`${venue.heading} — ${venue.name}`)}`,
    `LOCATION:${escapeIcsText(venue.address)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
