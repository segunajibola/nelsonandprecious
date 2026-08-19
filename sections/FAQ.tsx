"use client";

import { faqs } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";

export function FAQ() {
  return (
    <Section id="faq" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="FAQ"
        title="Good to Know"
        description="Answers to the questions we hear most often."
        className="mb-16"
      />

      <Reveal className="mx-auto max-w-2xl">
        <Accordion items={faqs} />
      </Reveal>
    </Section>
  );
}
