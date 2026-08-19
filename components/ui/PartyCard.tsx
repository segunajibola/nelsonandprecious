"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { WeddingPartyMember } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PartyCard({ member }: { member: WeddingPartyMember }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6 text-center shadow-[0_20px_50px_-35px_rgba(43,36,32,0.4)]"
    >
      <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full ring-4 ring-[color:var(--gold-soft)]">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
        ) : (
          <span className="font-serif text-3xl text-[color:var(--gold)]">{initials(member.name)}</span>
        )}
      </div>
      <div>
        <h4 className="font-serif text-xl text-[color:var(--ink)]">{member.name}</h4>
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">
          {member.role}
        </p>
      </div>
      {member.message && (
        <p className="font-sans text-sm italic leading-relaxed text-[color:var(--ink-muted)]">
          &ldquo;{member.message}&rdquo;
        </p>
      )}
    </motion.div>
  );
}
