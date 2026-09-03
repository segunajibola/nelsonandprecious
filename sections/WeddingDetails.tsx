"use client";

import { House, MapPin, PartyPopper, Shirt } from "lucide-react";
import { ceremonyVenue, event } from "@/lib/data";
import type { VenueDetail } from "@/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-[color:var(--gold)]" />
      <div>
        <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">{label}</p>
        <p className="font-sans text-sm text-[color:var(--ink)]">{value}</p>
      </div>
    </div>
  );
}

function VenueCard({ venue, icon: Icon }: { venue: VenueDetail; icon: React.ElementType }) {
  return (
    <Card className="flex h-full w-full flex-col gap-5">
      <Icon size={28} className="text-[color:var(--gold)]" />
      <h3 className="font-serif text-2xl text-[color:var(--ink)]">{venue.heading}</h3>
      <div className="flex flex-col gap-4">
        <DetailRow icon={MapPin} label="Venue" value={venue.name} />
        <DetailRow icon={PartyPopper} label="Date &amp; Time" value={`${venue.date} at ${venue.time}`} />
        <DetailRow icon={MapPin} label="Address" value={venue.address} />
        {venue.dressCode && <DetailRow icon={Shirt} label="Dress Code" value={venue.dressCode} />}
        {venue.parking && <DetailRow icon={MapPin} label="Parking" value={venue.parking} />}
      </div>
      {venue.mapsUrl && (
        <Button href={venue.mapsUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-auto w-full">
          Open in Google Maps
        </Button>
      )}
    </Card>
  );
}

export function WeddingDetails() {
  return (
    <Section id="details" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="Wedding Details"
        title="Where & When"
        description="Everything you need to know to celebrate with us."
        className="mb-16"
      />

      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
        <Reveal>
          <VenueCard venue={ceremonyVenue} icon={House} />
        </Reveal>
        <Reveal delay={0.1}>
          <VenueCard venue={event} icon={PartyPopper} />
        </Reveal>
      </div>
    </Section>
  );
}
