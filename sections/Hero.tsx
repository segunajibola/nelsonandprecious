"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { couple } from "@/lib/data";
import { scrollToId } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CountdownDisplay } from "@/components/ui/CountdownDisplay";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { FloralAccent } from "@/components/ui/FloralAccent";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src={couple.heroImage}
          alt={`${couple.brideName} and ${couple.groomName}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </motion.div>

      <FloatingParticles />
      <FloralAccent className="left-6 top-24 hidden sm:block" size={56} duration={9} />
      <FloralAccent className="right-8 top-40 hidden sm:block" size={40} duration={7} />
      <FloralAccent className="bottom-32 left-16 hidden md:block" size={36} duration={11} />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-lg italic tracking-wide text-white/90 sm:text-xl"
        >
          {couple.tagline}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-6xl leading-none text-white sm:text-8xl"
        >
          {couple.brideName}
          <span className="mx-4 text-[color:var(--gold-soft)]">&amp;</span>
          {couple.groomName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-sm uppercase tracking-[0.3em] text-white/80 sm:text-base"
        >
          {couple.weddingDateDisplay}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CountdownDisplay targetISO={couple.weddingDateISO} tone="light" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button onClick={() => scrollToId("#rsvp")}>RSVP Now</Button>
          <Button variant="outline-light" href="/gallery">
            Gallery &amp; Our Story
          </Button>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToId("#details")}
        aria-label="Scroll to next section"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 z-10 text-white/80 transition-colors hover:text-white"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
}
