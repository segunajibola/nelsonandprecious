"use client";

import { useState } from "react";
import { Heart, Images, LoaderCircle, Mail, MapPinned } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { Container } from "@/components/ui/Container";
import { RSVP } from "@/sections/RSVP";
import { couple } from "@/lib/data";

function ResendConfirmation({ inviteCode }: { inviteCode: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleResend() {
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/rsvp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Something went wrong.");
      setStatus("sent");
      setMessage(`Sent! Check ${body.email}.`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending"}
        className="flex items-center gap-1.5 font-sans text-sm text-[color:var(--ink-muted)] underline decoration-dotted transition-colors hover:text-[color:var(--gold)] disabled:opacity-60"
      >
        {status === "sending" ? <LoaderCircle size={14} className="animate-spin" /> : <Mail size={14} />}
        Already responded? Resend my confirmation email
      </button>
      {message && (
        <p
          className={`font-sans text-xs ${status === "error" ? "text-red-500" : "text-[color:var(--gold)]"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function RsvpPageClient({
  inviteCode,
  guestName,
  maxGuests,
  deadlinePassed,
  daysLeft,
}: {
  inviteCode: string;
  guestName: string;
  maxGuests: number;
  deadlinePassed: boolean;
  daysLeft: number;
}) {
  const { isPlaying, toggle } = useBackgroundMusic("/music/chike-apple.mp3");

  return (
    <>
      <ScrollProgress />
      <Navbar isMusicPlaying={isPlaying} onToggleMusic={toggle} />

      <main className="flex-1">
        <Container className="flex flex-col items-center gap-3 pt-32 pb-4 text-center sm:pt-40">
          <Heart
            size={22}
            className="text-[color:var(--gold)]"
            fill="currentColor"
          />
          <h1 className="font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">
            You&apos;re Invited, {guestName}!
          </h1>
          <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)] sm:text-base">
            {couple.groomName} &amp; {couple.brideName} would love to have you
            at their wedding on {couple.weddingDateDisplay}.
          </p>
          {!deadlinePassed && (
            <p className="font-sans text-xs font-medium uppercase tracking-wide text-[color:var(--gold)]">
              {daysLeft <= 1 ? "Last day to RSVP!" : `${daysLeft} days left to RSVP`}
            </p>
          )}
        </Container>

        <RSVP
          inviteCode={inviteCode}
          guestName={guestName}
          maxGuests={maxGuests}
          deadlinePassed={deadlinePassed}
        />

        <Container className="flex flex-col items-center gap-8 py-20 text-center">
          <ResendConfirmation inviteCode={inviteCode} />

          <div className="flex flex-col items-center gap-4">
            <p className="font-sans text-md text-[color:var(--ink-muted)]">
              Want to see more before you decide?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/details"
                className="flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] px-6 py-3 font-sans text-sm text-[color:var(--ink)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
              >
                <MapPinned size={16} /> Wedding Details &amp; Directions
              </a>
              <a
                href="/gallery"
                className="flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] px-6 py-3 font-sans text-sm text-[color:var(--ink)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
              >
                <Images size={16} /> Photos &amp; Our Story
              </a>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
