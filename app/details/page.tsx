"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { Hero } from "@/sections/Hero";
import { WeddingDetails } from "@/sections/WeddingDetails";
import { VenueMap } from "@/sections/VenueMap";
import { ZoomMeeting } from "@/sections/ZoomMeeting";
import { RSVP } from "@/sections/RSVP";
import { Schedule } from "@/sections/Schedule";
import { PhotoOrder } from "@/sections/PhotoOrder";
import { ColorPalette } from "@/sections/ColorPalette";
import { Appreciation } from "@/sections/Appreciation";
import { FAQ } from "@/sections/FAQ";

export default function DetailsPage() {
  const { isPlaying, toggle } = useBackgroundMusic("/music/chike-apple.mp3");

  return (
    <>
      <ScrollProgress />
      <Navbar isMusicPlaying={isPlaying} onToggleMusic={toggle} />

      <main className="flex-1">
        <Hero />
        <WeddingDetails />
        <VenueMap />
        <ZoomMeeting />
        <RSVP />
        <Schedule />
        <PhotoOrder />
        <ColorPalette />
        <Appreciation />
        <FAQ />
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
