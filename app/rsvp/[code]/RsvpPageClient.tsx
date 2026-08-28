"use client";

import { Heart } from "lucide-react";
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
  maxGuests,
}: {
  inviteCode: string;
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
            You&apos;re Invited!
          </h1>
          <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)] sm:text-base">
            {couple.groomName} &amp; {couple.brideName} would love to have you at their wedding on{" "}
            {couple.weddingDateDisplay}. Your invitation covers up to {maxGuests} guest
            {maxGuests === 1 ? "" : "s"}.
          </p>
        </Container>

        <RSVP inviteCode={inviteCode} maxGuests={maxGuests} />
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
