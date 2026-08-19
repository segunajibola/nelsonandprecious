"use client";

import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function getParts(targetISO: string): CountdownParts {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isPast: false };
}

const initialParts: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isPast: false,
};

export function useCountdown(targetISO: string): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(initialParts);

  useEffect(() => {
    // Date.now()-derived values can't be computed during SSR/first paint without risking
    // a hydration mismatch, so we render static zeros initially and sync the real
    // countdown in on mount, then keep it ticking every second.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParts(getParts(targetISO));
    const interval = setInterval(() => setParts(getParts(targetISO)), 1000);
    return () => clearInterval(interval);
  }, [targetISO]);

  return parts;
}
