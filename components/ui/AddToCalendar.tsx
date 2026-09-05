"use client";

import { CalendarPlus, Download } from "lucide-react";
import type { VenueDetail } from "@/types";
import { googleCalendarUrl } from "@/lib/calendar";

export function AddToCalendar({
  venue,
  eventSlug,
}: {
  venue: VenueDetail;
  eventSlug: "ceremony" | "reception";
}) {
  const googleUrl = googleCalendarUrl(venue);
  if (!googleUrl) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 font-sans text-xs text-[color:var(--ink-muted)] underline decoration-dotted transition-colors hover:text-[color:var(--gold)]"
      >
        <CalendarPlus size={13} /> Google Calendar
      </a>
      <a
        href={`/api/calendar/${eventSlug}`}
        className="flex items-center gap-1.5 font-sans text-xs text-[color:var(--ink-muted)] underline decoration-dotted transition-colors hover:text-[color:var(--gold)]"
      >
        <Download size={13} /> Download .ics
      </a>
    </div>
  );
}
