"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: `${Math.round((id / count) * 100 + (id % 3) * 2)}%`,
        size: 3 + (id % 4) * 2,
        duration: 10 + (id % 6) * 2.5,
        delay: (id % 5) * 1.3,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[color:var(--gold-soft)]/70"
          style={{ left: p.left, width: p.size, height: p.size, bottom: "-5%" }}
          animate={{ y: ["0%", "-120vh"], opacity: [0, 0.8, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
