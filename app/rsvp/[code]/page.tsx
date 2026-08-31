import type { Metadata } from "next";
import { MessageCircleWarning } from "lucide-react";
import { findInviteByCode, airtableConfigured } from "@/lib/airtable";
import { couple } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RsvpPageClient } from "./RsvpPageClient";

export const metadata: Metadata = {
  title: `You're Invited | ${couple.brideName} & ${couple.groomName}`,
};

// Plain helper, not a component — keeps the request-time Date.now() read out
// of the page component body itself, since that read is what makes this
// route render fresh per-request rather than get statically cached.
function getDeadlineState(deadlineISO: string) {
  const msRemaining = new Date(deadlineISO).getTime() - Date.now();
  const deadlinePassed = msRemaining <= 0;
  const daysLeft = deadlinePassed ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  return { deadlinePassed, daysLeft };
}

export default async function PersonalInvitePage(props: PageProps<"/rsvp/[code]">) {
  const { code } = await props.params;

  const invite = airtableConfigured() ? await findInviteByCode(decodeURIComponent(code)) : null;

  if (!invite) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center">
        <Container className="flex max-w-lg flex-col items-center gap-4 py-24 text-center">
          <MessageCircleWarning size={40} className="text-[color:var(--gold)]" />
          <h1 className="font-serif text-3xl text-[color:var(--ink)]">Invite Not Found</h1>
          <p className="font-sans text-sm text-[color:var(--ink-muted)]">
            We couldn&apos;t find an invitation for this link. Please double-check the link from
            your invitation, or reach out to {couple.groomName} &amp; {couple.brideName} directly.
          </p>
          <Button href="https://wa.me/2348171982162" target="_blank" rel="noopener noreferrer">
            Message Us on WhatsApp
          </Button>
        </Container>
      </main>
    );
  }

  const { deadlinePassed, daysLeft } = getDeadlineState(couple.rsvpDeadlineISO);

  return (
    <RsvpPageClient
      inviteCode={code}
      guestName={invite.name}
      maxGuests={invite.maxGuests}
      deadlinePassed={deadlinePassed}
      daysLeft={daysLeft}
    />
  );
}
