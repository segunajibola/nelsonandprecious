"use client";

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
        <Card className="flex flex-col items-center gap-5 text-center">
          <Video size={28} className="text-[color:var(--gold)]" />
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
        </Card>
      </Reveal>
    </Section>
  );
}
