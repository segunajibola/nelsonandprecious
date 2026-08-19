"use client";

import { Quote } from "lucide-react";
import { aboutEachOther } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";

export function AboutEachOther() {
  return (
    <Section className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="In Their Words"
        title="What We Love About Each Other"
        className="mb-14"
      />

      <StaggerGroup className="grid gap-6 sm:grid-cols-2">
        {aboutEachOther.map((entry) => (
          <Reveal key={entry.from}>
            <Card className="flex h-full flex-col gap-4">
              <Quote size={22} className="text-[color:var(--gold)]" />
              <p className="font-sans text-base italic leading-relaxed text-[color:var(--ink-muted)]">
                &ldquo;{entry.text}&rdquo;
              </p>
              <p className="mt-auto font-serif text-lg text-[color:var(--ink)]">
                — {entry.from}, on {entry.about}
              </p>
            </Card>
          </Reveal>
        ))}
      </StaggerGroup>
    </Section>
  );
}
