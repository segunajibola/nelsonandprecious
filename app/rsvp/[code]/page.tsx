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
          <Button href="/details#rsvp">Go to the General RSVP</Button>
        </Container>
      </main>
    );
  }

  return (
    <RsvpPageClient inviteCode={code} guestName={invite.name} maxGuests={invite.maxGuests} />
  );
}
