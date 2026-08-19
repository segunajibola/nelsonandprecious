"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { LoveStory } from "@/sections/LoveStory";
import { AboutEachOther } from "@/sections/AboutEachOther";
import { Gallery } from "@/sections/Gallery";
import { WeddingParty } from "@/sections/WeddingParty";
import { GiftRegistry } from "@/sections/GiftRegistry";
import { ThankYou } from "@/sections/ThankYou";

export default function GalleryPage() {
  const { isPlaying, toggle, attemptAutoplay } = useBackgroundMusic("/music/chike-apple.mp3");

  useEffect(() => {
    // Browsers may block this until the visitor interacts with the page —
    // the Navbar speaker icon remains available as a manual fallback.
    attemptAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollProgress />
      <Navbar isMusicPlaying={isPlaying} onToggleMusic={toggle} />

      <main className="flex-1">
        <LoveStory />
        <AboutEachOther />
        <Gallery />
        <WeddingParty />
        <GiftRegistry />
        <ThankYou />
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
