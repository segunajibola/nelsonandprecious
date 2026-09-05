"use client";

import { ArrowUp } from "lucide-react";
import { couple } from "@/lib/data";
import { Container } from "@/components/ui/Container";

const WHATSAPP_MESSAGE = `Hi Segun! I saw ${couple.groomName} & ${couple.brideName}'s wedding website and I'd like to create one for my own wedding.`;
const WHATSAPP_LINK = `https://wa.me/2348105729893?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border-soft)] bg-[color:var(--surface)] py-14">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="font-serif text-3xl text-[color:var(--ink)]">
          {couple.brideName} &amp; {couple.groomName}
        </span>
        <p className="font-sans text-sm uppercase tracking-[0.25em] text-[color:var(--gold)]">
          {couple.weddingDateDisplay}
        </p>

        <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)]">
          Thank you for being part of our story and for celebrating this next
          chapter with us.
        </p>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="mt-2 flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-soft)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
        >
          <ArrowUp size={18} />
        </button>

        <p className="mt-4 font-sans text-xs text-[color:var(--ink-muted)]">
          Page developed and designed by{" "}
          <a
            href="https://wa.me/2348105729893"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--gold)] hover:underline"
          >
            Segun.
          </a>
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-[color:var(--gold)] hover:underline"
        >
          Want to create your wedding page, click here.
        </a>

        <div className="mt-2 h-px w-24 bg-[color:var(--border-soft)]" />

        <p className="text-center font-sans text-xs text-[color:var(--ink-muted)]">
          <a href="/admin" className="hover:underline">
            Admin
          </a>
        </p>
      </Container>
    </footer>
  );
}
