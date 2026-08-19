"use client";

import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloralAccent({
  className,
  size = 48,
  duration = 8,
}: {
  className?: string;
  size?: number;
  duration?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute text-[color:var(--gold-soft)]", className)}
      animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <Flower2 size={size} strokeWidth={1} />
    </motion.div>
  );
}
