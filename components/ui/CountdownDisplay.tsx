"use client";

import { useCountdown } from "@/hooks/useCountdown";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownDisplay({
  targetISO,
  tone = "light",
}: {
  targetISO: string;
  tone?: "light" | "dark";
}) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetISO);

  if (isPast) {
    return (
      <p className="font-serif text-2xl italic text-[color:var(--gold-soft)]">
        We&apos;re married!
      </p>
    );
  }

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-5" role="timer" aria-label="Countdown to the wedding">
      {units.map((unit) => (
        <div
          key={unit.label}
          className={
            tone === "light"
              ? "flex w-16 flex-col items-center gap-1 rounded-2xl border border-white/25 bg-white/10 py-3 backdrop-blur-md sm:w-20"
              : "flex w-16 flex-col items-center gap-1 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] py-3 sm:w-20"
          }
        >
          <span
            className={
              tone === "light"
                ? "font-serif text-2xl text-white sm:text-3xl"
                : "font-serif text-2xl text-[color:var(--ink)] sm:text-3xl"
            }
          >
            {pad(unit.value)}
          </span>
          <span
            className={
              tone === "light"
                ? "text-[10px] uppercase tracking-[0.15em] text-white/70"
                : "text-[10px] uppercase tracking-[0.15em] text-[color:var(--ink-muted)]"
            }
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
