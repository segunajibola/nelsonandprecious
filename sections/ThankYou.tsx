"use client";

import { HeartHandshake } from "lucide-react";
import { thankYouNote, couple } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function ThankYou() {
  return (
    <Section id="thank-you">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <HeartHandshake size={28} className="text-[color:var(--gold)]" />
        <p className="font-serif text-2xl italic leading-relaxed text-[color:var(--ink)] sm:text-3xl">
          {thankYouNote}
        </p>
        <span className="font-sans text-sm uppercase tracking-[0.3em] text-[color:var(--gold)]">
          {couple.brideName} &amp; {couple.groomName}
        </span>
      </Reveal>
    </Section>
  );
}
