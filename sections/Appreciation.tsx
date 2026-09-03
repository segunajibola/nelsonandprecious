"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { appreciation } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Appreciation() {
  return (
    <Section id="appreciation" className="bg-[color:var(--surface)]/40">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
        <div className="relative size-24 overflow-hidden rounded-full border-2 border-[color:var(--gold)] shadow-lg sm:size-28">
          <Image
            src="/images/couple-candid-1.jpeg"
            alt="Nelson and Precious"
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <Heart size={20} className="fill-[color:var(--gold)] text-[color:var(--gold)]" />
        <p className="font-serif text-2xl italic leading-relaxed text-[color:var(--ink)] sm:text-3xl">
          {appreciation}
        </p>
      </Reveal>
    </Section>
  );
}
