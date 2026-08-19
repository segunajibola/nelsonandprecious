"use client";

import { Clock } from "lucide-react";
import { schedule } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";

export function Schedule() {
  return (
    <Section id="schedule">
      <SectionHeading
        eyebrow="Schedule"
        title="Order of the Day"
        description="A gentle guide to how our celebration will unfold."
        className="mb-16"
      />

      <StaggerGroup className="mx-auto flex max-w-2xl flex-col">
        {schedule.map((item, index) => (
          <Reveal key={item.time} delay={index * 0.03}>
            <div className="flex gap-6 border-l border-[color:var(--border-soft)] pb-10 pl-8 last:pb-0">
              <div className="relative -ml-[calc(2rem+9px)] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[color:var(--gold)]">
                <Clock size={9} className="text-white" />
              </div>
              <div className="-mt-1.5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="w-24 shrink-0 font-serif text-lg text-[color:var(--gold)]">
                  {item.time}
                </span>
                <div>
                  <p className="font-sans text-base font-medium text-[color:var(--ink)]">{item.title}</p>
                  {item.description && (
                    <p className="font-sans text-sm text-[color:var(--ink-muted)]">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </StaggerGroup>
    </Section>
  );
}
