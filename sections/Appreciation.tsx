"use client";

import { Heart } from "lucide-react";
import { appreciation } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Appreciation() {
  return (
    <Section id="appreciation" className="bg-[color:var(--surface)]/40">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <Heart size={24} className="fill-[color:var(--gold)] text-[color:var(--gold)]" />
        <p className="font-serif text-2xl italic leading-relaxed text-[color:var(--ink)] sm:text-3xl">
          {appreciation}
        </p>
      </Reveal>
    </Section>
  );
}
