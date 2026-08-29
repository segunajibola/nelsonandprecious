"use client";

import { Heart, Images, MapPinned } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { Container } from "@/components/ui/Container";
import { RSVP } from "@/sections/RSVP";
import { couple } from "@/lib/data";

export function RsvpPageClient({
  inviteCode,
  guestName,
  maxGuests,
}: {
  inviteCode: string;
  guestName: string;
  maxGuests: number;
}) {
  const { isPlaying, toggle } = useBackgroundMusic("/music/chike-apple.mp3");

  return (
    <>
      <ScrollProgress />
      <Navbar isMusicPlaying={isPlaying} onToggleMusic={toggle} />

      <main className="flex-1">
        <Container className="flex flex-col items-center gap-3 pt-32 pb-4 text-center sm:pt-40">
          <Heart size={22} className="text-[color:var(--gold)]" fill="currentColor" />
          <h1 className="font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">
            You&apos;re Invited, {guestName}!
          </h1>
          <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)] sm:text-base">
            {couple.groomName} &amp; {couple.brideName} would love to have you at their wedding on{" "}
            {couple.weddingDateDisplay}.
          </p>
        </Container>

        <RSVP inviteCode={inviteCode} guestName={guestName} maxGuests={maxGuests} />

        <Container className="flex flex-col items-center gap-4 pb-24 text-center">
          <p className="font-sans text-sm text-[color:var(--ink-muted)]">
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
        </Container>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
