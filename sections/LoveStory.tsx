"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { loveStory } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function LoveStory() {
  return (
    <Section id="our-story">
      <SectionHeading
        eyebrow="Our Story"
        title="A Love Written Slowly"
        description="Every couple has a story. Here is a little of ours — from a chance meeting to the promise of forever."
        className="mb-16 sm:mb-20"
      />

      <div className="relative">
        <div
          className="absolute left-6 top-0 hidden h-full w-px bg-[color:var(--border-soft)] sm:block md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-16 md:gap-24">
          {loveStory.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={event.id}
                className={cn(
                  "relative flex flex-col gap-6 sm:pl-16 md:grid md:grid-cols-2 md:items-center md:gap-12 md:pl-0",
                  !isEven && "md:[&>*:first-child]:order-2",
                )}
              >
                <span
                  className="absolute left-3.5 top-1 hidden h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-[color:var(--gold)] sm:flex md:left-1/2"
                  aria-hidden="true"
                >
                  <Heart size={9} className="fill-white text-white" />
                </span>

                <Reveal className={cn(isEven ? "md:pr-12" : "md:pl-12")}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(43,36,32,0.4)]">
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 40vw, 90vw"
                      />
                    </motion.div>
                  </div>
                </Reveal>

                <Reveal delay={0.1} className={cn(isEven ? "md:pl-12" : "md:pr-12")}>
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-[color:var(--gold)]">
                    {event.date}
                  </span>
                  <h3 className="mt-3 font-serif text-3xl text-[color:var(--ink)] sm:text-4xl">
                    {event.title}
                  </h3>
                  <p className="mt-4 font-sans text-base leading-relaxed text-[color:var(--ink-muted)]">
                    {event.description}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
