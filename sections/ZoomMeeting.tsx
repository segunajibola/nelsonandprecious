"use client";

import Image from "next/image";
import { Video } from "lucide-react";
import { zoomMeeting } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ZoomMeeting() {
  return (
    <Section id="zoom" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="Joining Remotely"
        title="Can't Be There in Person?"
        className="mb-12"
      />

      <Reveal className="mx-auto max-w-xl">
        <Card className="flex flex-col items-center gap-5 overflow-hidden p-0 text-center">
          {zoomMeeting.image ? (
            <div className="relative h-48 w-full">
              <Image
                src={zoomMeeting.image}
                alt="Guests joining the wedding celebration over a video call"
                fill
                sizes="(min-width: 640px) 576px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--surface)] via-transparent to-transparent" />
              <div className="absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-[color:var(--gold)] shadow-lg">
                <Video size={18} className="text-white" />
              </div>
            </div>
          ) : (
            <Video size={28} className="mt-6 text-[color:var(--gold)]" />
          )}
          <div className="flex w-full flex-col items-center gap-5 px-6 pb-6">
            {zoomMeeting.link ? (
              <>
                <div className="flex flex-col gap-2">
                  {zoomMeeting.meetingId && (
                    <p className="font-sans text-sm text-[color:var(--ink-muted)]">
                      Meeting ID: <span className="text-[color:var(--ink)]">{zoomMeeting.meetingId}</span>
                    </p>
                  )}
                  {zoomMeeting.passcode && (
                    <p className="font-sans text-sm text-[color:var(--ink-muted)]">
                      Passcode: <span className="text-[color:var(--ink)]">{zoomMeeting.passcode}</span>
                    </p>
                  )}
                </div>
                <Button href={zoomMeeting.link} target="_blank" rel="noopener noreferrer">
                  Join the Livestream
                </Button>
              </>
            ) : (
              <p className="font-sans text-sm leading-relaxed text-[color:var(--ink-muted)]">
                {zoomMeeting.note}
              </p>
            )}
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
