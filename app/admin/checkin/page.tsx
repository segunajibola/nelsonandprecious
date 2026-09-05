"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleCheck,
  LoaderCircle,
  QrCode,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import { useAdminAuth, type InviteListItem } from "@/hooks/useAdminAuth";
import { AdminGate } from "@/components/admin/AdminGate";
import { QrScanner } from "@/components/admin/QrScanner";
import { formatCheckInTimestamp } from "@/lib/utils";

type Feedback = { type: "success" | "error"; message: string };

const RESCAN_COOLDOWN_MS = 3000;

// The QR now encodes a full /checkin/[token] URL (see /api/qr/[token]), so
// pull the token back out of it. Falls back to treating the scanned text as
// a bare token for any already-generated QR images that predate that change.
function extractToken(raw: string): string {
  try {
    const url = new URL(raw);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || raw;
  } catch {
    return raw;
  }
}

export default function CheckInPage() {
  const { password, authed, checkingAuth, authError, invites, loadingInvites, login, refetch } =
    useAdminAuth();

  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const lastScan = useRef<{ token: string; at: number } | null>(null);

  const attendingGuests = useMemo(
    () => invites.filter((invite) => invite.attending === "yes"),
    [invites],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return attendingGuests;
    return attendingGuests.filter(
      (invite) =>
        invite.label.toLowerCase().includes(q) ||
        invite.inviteCode.toLowerCase().includes(q) ||
        (invite.accessCode ?? "").toLowerCase().includes(q),
    );
  }, [attendingGuests, search]);

  const stats = useMemo(
    () => ({
      total: attendingGuests.length,
      checkedIn: attendingGuests.filter((g) => g.checkedIn).length,
    }),
    [attendingGuests],
  );

  const checkInGuest = useCallback(
    async (invite: InviteListItem) => {
      if (invite.checkedIn) {
        setFeedback({ type: "success", message: `${invite.label} is already checked in.` });
        return;
      }

      setCheckingInId(invite.recordId);
      try {
        const res = await fetch("/api/admin/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-password": password },
          body: JSON.stringify({ recordId: invite.recordId }),
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || "Something went wrong.");

        setFeedback({
          type: "success",
          message: body.alreadyCheckedIn
            ? `${invite.label} was already checked in.`
            : `Checked in ${invite.label} (${invite.guestsConfirmed ?? body.guests} guest${(invite.guestsConfirmed ?? body.guests) === 1 ? "" : "s"}).`,
        });
        await refetch();
      } catch (err) {
        setFeedback({
          type: "error",
          message: err instanceof Error ? err.message : "Couldn't check in this guest.",
        });
      } finally {
        setCheckingInId(null);
      }
    },
    [password, refetch],
  );

  const handleScan = useCallback(
    (decodedText: string) => {
      const token = extractToken(decodedText);
      const now = Date.now();
      if (lastScan.current && lastScan.current.token === token && now - lastScan.current.at < RESCAN_COOLDOWN_MS) {
        return;
      }
      lastScan.current = { token, at: now };

      const match = attendingGuests.find((invite) => invite.qrToken === token);
      if (!match) {
        setFeedback({ type: "error", message: "That QR code doesn't match any confirmed guest." });
        return;
      }
      checkInGuest(match);
    },
    [attendingGuests, checkInGuest],
  );

  return (
    <AdminGate checkingAuth={checkingAuth} authed={authed} authError={authError} onLogin={login}>
      <main className="mx-auto min-h-svh w-full max-w-2xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 font-sans text-sm text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--gold)]"
            >
              <ArrowLeft size={15} /> Invites
            </Link>
          </div>
          <span className="rounded-full bg-[color:var(--gold)]/10 px-4 py-1.5 font-sans text-sm font-medium text-[color:var(--gold)]">
            {stats.checkedIn} / {stats.total} checked in
          </span>
        </div>

        <h1 className="mt-3 font-serif text-3xl text-[color:var(--ink)]">Day-of Check-In</h1>
        <p className="mt-1 font-sans text-sm text-[color:var(--ink-muted)]">
          Scan a guest&apos;s QR code, or search by name or access code to check them in by hand.
        </p>

        {feedback && (
          <div
            className={`mt-5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 font-sans text-sm ${
              feedback.type === "success"
                ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-[color:var(--ink)]"
                : "border-red-300 bg-red-500/10 text-red-600"
            }`}
          >
            <span className="flex items-center gap-2">
              {feedback.type === "success" ? <CircleCheck size={16} /> : <X size={16} />}
              {feedback.message}
            </span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink)]"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6">
          {scannerOpen ? (
            <>
              <QrScanner onScan={handleScan} />
              <button
                type="button"
                onClick={() => setScannerOpen(false)}
                className="flex items-center gap-1.5 rounded-full border border-[color:var(--border-soft)] px-5 py-2 font-sans text-sm text-[color:var(--ink)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
              >
                <X size={15} /> Close Scanner
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[color:var(--gold)] px-6 py-3 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <QrCode size={16} /> Scan Guest QR Code
            </button>
          )}
        </div>

        <div className="relative mt-8">
          <Search size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-[color:var(--ink-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or access code..."
            className="w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] py-3 pr-4 pl-11 font-sans text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--gold)]"
          />
        </div>

        {loadingInvites ? (
          <div className="mt-8 flex justify-center">
            <LoaderCircle size={20} className="animate-spin text-[color:var(--gold)]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-6 font-sans text-sm text-[color:var(--ink-muted)]">
            {attendingGuests.length === 0 ? "No confirmed guests yet." : "No guests match that search."}
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {filtered.map((invite) => (
              <div
                key={invite.recordId}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-sans text-sm font-medium text-[color:var(--ink)]">
                    {invite.label || "(unnamed invite)"}
                  </span>
                  <span className="font-sans text-xs text-[color:var(--ink-muted)]">
                    {invite.guestsConfirmed ?? 0} guest{(invite.guestsConfirmed ?? 0) === 1 ? "" : "s"}
                    {invite.accessCode ? ` · Code: ${invite.accessCode}` : ""}
                  </span>
                </div>

                {invite.checkedIn ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--gold)]/10 px-3 py-1.5 font-sans text-xs font-medium text-[color:var(--gold)]">
                    <UserCheck size={13} />
                    Checked in{formatCheckInTimestamp(invite.checkInTime) ? ` on ${formatCheckInTimestamp(invite.checkInTime)}` : ""}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => checkInGuest(invite)}
                    disabled={checkingInId === invite.recordId}
                    className="flex items-center gap-1.5 rounded-full bg-[color:var(--gold)] px-4 py-1.5 font-sans text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {checkingInId === invite.recordId ? (
                      <LoaderCircle size={13} className="animate-spin" />
                    ) : (
                      <UserCheck size={13} />
                    )}
                    Check In
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminGate>
  );
}
