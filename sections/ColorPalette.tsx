"use client";

import { weddingColors } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function ColorPalette() {
  return (
    <Section id="colors">
      <SectionHeading
        eyebrow="Wedding Colors"
        title="Our Palette"
        description="We kindly encourage guests to wear these colors as part of our celebration."
        className="mb-12"
      />

      <div className="w-[50%] mx-auto">
        {weddingColors.map((color, index) => (
          <Reveal key={color.name} delay={index * 0.08}>
            <div className="group flex flex-col items-center gap-4 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6 transition-transform duration-300 hover:-translate-y-1">
              <div
                className="h-25 w-25 rounded-full border border-[color:var(--border-soft)] shadow-inner transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <div className="text-center">
                <p className="font-serif text-lg text-[color:var(--ink)]">
                  {color.name}
                </p>
                <p className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                  {color.hex}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
