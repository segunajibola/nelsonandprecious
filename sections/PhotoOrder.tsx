"use client";

import { Camera } from "lucide-react";
import { photoOrder } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";

export function PhotoOrder() {
  return (
    <Section id="photo-order">
      <SectionHeading
        eyebrow="Photographs"
        title="Order of Photographs"
        description="A guide for the photography sessions after the reception."
        className="mb-14"
      />

      <StaggerGroup className="mx-auto flex max-w-xl flex-col gap-4">
        {photoOrder.map((item) => (
          <Reveal key={item.order}>
            <div className="flex items-center gap-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--gold)] font-serif text-sm text-white">
                {item.order}
              </span>
              <div>
                <p className="font-sans text-base text-[color:var(--ink)]">{item.title}</p>
                {item.description && (
                  <p className="font-sans text-sm text-[color:var(--ink-muted)]">{item.description}</p>
                )}
              </div>
              <Camera size={16} className="ml-auto shrink-0 text-[color:var(--gold)]" />
            </div>
          </Reveal>
        ))}
      </StaggerGroup>
    </Section>
  );
}
