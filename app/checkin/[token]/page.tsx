import type { Metadata } from "next";
import { MessageCircleWarning } from "lucide-react";
import { airtableConfigured, findGuestByQrToken } from "@/lib/airtable";
import { couple } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { CheckInVerifyClient } from "./CheckInVerifyClient";

export const metadata: Metadata = {
  title: `Guest Check-In | ${couple.brideName} & ${couple.groomName}`,
};

// Public verification screen a guest's QR code (see /api/qr/[token]) opens
// when scanned by any ordinary phone camera — not just the admin dashboard's
// scanner. Lets any door staff member confirm a real RSVP and check the
// guest in without needing to be logged into /admin.
export default async function CheckInVerifyPage(props: PageProps<"/checkin/[token]">) {
  const { token } = await props.params;

  const guest = airtableConfigured() ? await findGuestByQrToken(decodeURIComponent(token)) : null;

  if (!guest || guest.attending !== "yes") {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <Container className="flex max-w-lg flex-col items-center gap-4 py-24 text-center">
          <MessageCircleWarning size={40} className="text-[color:var(--gold)]" />
          <h1 className="font-serif text-3xl text-[color:var(--ink)]">QR Code Not Recognized</h1>
          <p className="font-sans text-sm text-[color:var(--ink-muted)]">
            This QR code doesn&apos;t match a confirmed guest. Please double-check the code, or use
            the check-in dashboard to search by name instead.
          </p>
        </Container>
      </main>
    );
  }

  return (
    <CheckInVerifyClient
      token={token}
      name={guest.name}
      guests={guest.guests ?? 1}
      accessCode={guest.accessCode}
      initialCheckedIn={guest.checkedIn}
      initialCheckInTime={guest.checkInTime}
    />
  );
}
