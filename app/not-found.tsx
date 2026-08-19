import Link from "next/link";
import { Heart } from "lucide-react";
import { couple } from "@/lib/data";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-[color:var(--background)] px-6 text-center">
      <Heart size={40} className="text-[color:var(--gold)]" strokeWidth={1.2} />
      <span className="font-sans text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">
        404
      </span>
      <h1 className="font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">
        This Page Wandered Off
      </h1>
      <p className="max-w-md font-sans text-base text-[color:var(--ink-muted)]">
        We couldn&apos;t find what you were looking for, but you&apos;re always welcome at{" "}
        {couple.brideName} &amp; {couple.groomName}&apos;s celebration.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-[#fffef6] transition-transform hover:-translate-y-0.5"
      >
        Return Home
      </Link>
    </div>
  );
}
