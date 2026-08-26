"use client";

import { videoMoments } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function VideoMoments() {
  return (
    <Section id="videos">
      <SectionHeading
        eyebrow="Watch"
        title="Moments in Motion"
        description="A few seconds of us, just being us."
        className="mb-12"
      />

      <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
        {videoMoments.map((video, index) => (
          <Reveal key={video.id} delay={index * 0.1}>
            <div
              className="overflow-hidden rounded-2xl bg-black"
              style={{ aspectRatio: `${video.width} / ${video.height}` }}
            >
              <video
                src={video.src}
                controls
                loop
                playsInline
                aria-label={video.caption}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
