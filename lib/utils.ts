import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function scrollToId(id: string) {
  const el = document.querySelector(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// "Check-In time" in Airtable must be a Date field with "include a time
// field" enabled, or it reads back date-only (no `T`) and any displayed
// clock time would be misleadingly wrong (midnight) — returns null in that
// case so callers can omit the timestamp entirely rather than show it wrong.
export function formatCheckInTimestamp(iso: string | null): string | null {
  if (!iso || !iso.includes("T")) return null;
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
