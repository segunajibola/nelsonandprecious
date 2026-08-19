"use client";

import { Landmark, MapPin, Navigation, ParkingSquare } from "lucide-react";
import { event } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function VenueMap() {
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`;

  return (
    <Section id="venue">
      <SectionHeading
        eyebrow="Find Us"
        title="Getting to the Venue"
        description="We can't wait to celebrate with you — here's everything you need to find your way."
        className="mb-16"
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="h-[420px] w-full overflow-hidden rounded-3xl border border-[color:var(--border-soft)] shadow-[0_20px_60px_-30px_rgba(43,36,32,0.4)]">
            <iframe
              title="Venue location map"
              src={embedSrc}
              className="h-full w-full grayscale-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <Card className="flex h-full flex-col gap-6">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-[color:var(--gold)]" />
              <div>
                <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">Address</p>
                <p className="font-sans text-sm text-[color:var(--ink)]">{event.name}, {event.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ParkingSquare size={20} className="mt-0.5 shrink-0 text-[color:var(--gold)]" />
              <div>
                <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">Parking</p>
                <p className="font-sans text-sm text-[color:var(--ink)]">{event.parking}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Landmark size={20} className="mt-0.5 shrink-0 text-[color:var(--gold)]" />
              <div>
                <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">Nearby Landmarks</p>
                <p className="font-sans text-sm text-[color:var(--ink)]">
                  Located beside MFM Southwest 1 Headquarters in Obantoko, Abeokuta
                </p>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Navigation size={16} /> Get Directions
              </Button>
              <Button
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full"
              >
                Open in Google Maps
              </Button>
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
