"use client";

import { Church, MapPin, PartyPopper, Shirt } from "lucide-react";
import { event } from "@/lib/data";
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

export function WeddingDetails() {
  return (
    <Section id="details" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="Wedding Details"
        title="Where & When"
        description="Everything you need to know to celebrate with us."
        className="mb-16"
      />

      <div className="grid gap-8">
        <Reveal>
          <Card className="mx-auto flex h-full w-full max-w-xl flex-col gap-5">
            <Church size={28} className="text-[color:var(--gold)]" />
            <h3 className="font-serif text-2xl text-[color:var(--ink)]">{event.heading}</h3>
            <div className="flex flex-col gap-4">
              <DetailRow icon={MapPin} label="Venue" value={event.name} />
              <DetailRow icon={PartyPopper} label="Date &amp; Time" value={`${event.date} at ${event.time}`} />
              <DetailRow icon={MapPin} label="Address" value={event.address} />
              <DetailRow icon={Shirt} label="Dress Code" value={event.dressCode ?? ""} />
              <DetailRow icon={MapPin} label="Parking" value={event.parking ?? ""} />
            </div>
            <Button href={event.mapsUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-auto w-full">
              Open in Google Maps
            </Button>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
