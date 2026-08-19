"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/data";
import type { GalleryCategory } from "@/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

const categories: (GalleryCategory | "All")[] = [
  "All",
  "Candid",
  "Traditional",
  "Proposal",
];

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | "All">("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "All" ? galleryImages : galleryImages.filter((img) => img.category === filter),
    [filter],
  );

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Gallery"
        title="Moments We Cherish"
        description="A collection of our favorite memories together — from quiet moments to grand adventures."
        className="mb-12"
      />

      <Reveal className="mb-12 flex flex-wrap items-center justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={cn(
              "rounded-full border px-5 py-2 font-sans text-sm tracking-wide transition-colors duration-300",
              filter === category
                ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[#fffef6]"
                : "border-[color:var(--border-soft)] text-[color:var(--ink-muted)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]",
            )}
          >
            {category}
          </button>
        ))}
      </Reveal>

      <div className="columns-2 gap-4 sm:columns-3 sm:gap-5 [&>*]:mb-4 sm:[&>*]:mb-5">
        {filtered.map((image, index) => (
          <Reveal key={image.id} delay={(index % 6) * 0.05} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full overflow-hidden rounded-2xl"
              aria-label={`View image: ${image.alt}`}
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={filtered}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </Section>
  );
}
