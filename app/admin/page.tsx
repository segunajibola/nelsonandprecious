"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CircleCheck,
  CircleX,
  Clock,
  Copy,
  PlusCircle,
  QrCode,
  UserCheck,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminGate } from "@/components/admin/AdminGate";

function inviteUrl(code: string) {
  if (typeof window === "undefined") return `/rsvp/${code}`;
  return `${window.location.origin}/rsvp/${code}`;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3">
      <span className="font-serif text-2xl text-[color:var(--ink)]">{value}</span>
      <span className="font-sans text-xs text-[color:var(--ink-muted)]">{label}</span>
    </div>
  );
}

export default function AdminPage() {
  const { password, authed, checkingAuth, authError, invites, loadingInvites, login, refetch } =
    useAdminAuth();

  const [label, setLabel] = useState("");
  const [maxGuests, setMaxGuests] = useState("1");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [justCreated, setJustCreated] = useState<{ inviteCode: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const stats = useMemo(() => {
    const responded = invites.filter((i) => i.attending !== null);
    const attending = invites.filter((i) => i.attending === "yes");
    return {
      total: invites.length,
      pending: invites.length - responded.length,
      attending: attending.length,
      declined: invites.filter((i) => i.attending === "no").length,
      guestsConfirmed: attending.reduce((sum, i) => sum + (i.guestsConfirmed ?? 0), 0),
      checkedIn: invites.filter((i) => i.checkedIn).length,
    };
  }, [invites]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setJustCreated(null);

    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ label, maxGuests: Number(maxGuests) }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Something went wrong.");

      setJustCreated({ inviteCode: body.invite.inviteCode });
      setLabel("");
      setMaxGuests("1");
      await refetch();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  function copyLink(code: string) {
    navigator.clipboard.writeText(inviteUrl(code)).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 1500);
    });
  }

  return (
    <AdminGate checkingAuth={checkingAuth} authed={authed} authError={authError} onLogin={login}>
      <main className="mx-auto min-h-svh w-full max-w-3xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl text-[color:var(--ink)]">Guest Invites</h1>
          <Link
            href="/admin/checkin"
            className="flex items-center gap-1.5 rounded-full border border-[color:var(--border-soft)] px-4 py-2 font-sans text-sm text-[color:var(--ink)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
          >
            <QrCode size={15} /> Day-of Check-In
          </Link>
        </div>
        <p className="mt-1 font-sans text-sm text-[color:var(--ink-muted)]">
          Generate a personal RSVP link for a family, capped at however many guests they&apos;re
          allowed to bring. The name you enter here is shown on their invite and can&apos;t be
          changed by them.
        </p>

        {invites.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <StatCard label="Invites sent" value={stats.total} />
            <StatCard label="Attending" value={stats.attending} />
            <StatCard label="Declined" value={stats.declined} />
            <StatCard label="No response yet" value={stats.pending} />
            <StatCard label="Guests confirmed" value={stats.guestsConfirmed} />
            <StatCard label="Checked in" value={stats.checkedIn} />
          </div>
        )}

        <form
          onSubmit={handleCreate}
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6 sm:flex-row sm:items-end"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
              Name shown on their invite <span className="text-[color:var(--gold)]">*</span>
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. The Okafor Family"
              required
              className="w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-2.5 font-sans text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
              Max Guests
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="w-24 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-2.5 font-sans text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="flex items-center justify-center gap-2 rounded-full bg-[color:var(--gold)] px-6 py-2.5 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {creating ? <UserCheck size={16} className="animate-spin" /> : <PlusCircle size={16} />}
            Generate Link
          </button>
        </form>

        {createError && <p className="mt-3 font-sans text-sm text-red-500">{createError}</p>}

        {justCreated && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color:var(--gold)] bg-[color:var(--gold)]/10 px-4 py-3">
            <span className="break-all font-sans text-sm text-[color:var(--ink)]">
              {inviteUrl(justCreated.inviteCode)}
            </span>
            <button
              type="button"
              onClick={() => copyLink(justCreated.inviteCode)}
              className="flex items-center gap-1.5 rounded-full border border-[color:var(--gold)] px-4 py-1.5 font-sans text-xs font-medium text-[color:var(--gold)] transition-colors hover:bg-[color:var(--gold)] hover:text-white"
            >
              <Copy size={13} /> {copiedCode === justCreated.inviteCode ? "Copied!" : "Copy Link"}
            </button>
          </div>
        )}

        <h2 className="mt-12 font-serif text-xl text-[color:var(--ink)]">
          All Invites {invites.length > 0 && `(${invites.length})`}
        </h2>

        {loadingInvites ? (
          <div className="mt-6 flex justify-center">
            <UserCheck size={20} className="animate-spin text-[color:var(--gold)]" />
          </div>
        ) : invites.length === 0 ? (
          <p className="mt-4 font-sans text-sm text-[color:var(--ink-muted)]">
            No invites generated yet.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {invites.map((invite) => (
              <div
                key={invite.recordId}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-sans text-sm font-medium text-[color:var(--ink)]">
                    {invite.label || "(unnamed invite)"}
                  </span>
                  <span className="font-sans text-xs text-[color:var(--ink-muted)]">
                    Code: {invite.inviteCode}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 font-sans text-xs text-[color:var(--ink-muted)]">
                  <Users size={13} /> up to {invite.maxGuests}
                </span>

                {invite.attending === "yes" ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 font-sans text-xs font-medium text-green-600">
                    <CircleCheck size={13} /> Attending ({invite.guestsConfirmed})
                  </span>
                ) : invite.attending === "no" ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 font-sans text-xs font-medium text-red-500">
                    <CircleX size={13} /> Not attending
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--ink-muted)]/10 px-3 py-1 font-sans text-xs font-medium text-[color:var(--ink-muted)]">
                    <Clock size={13} /> No response yet
                  </span>
                )}

                {invite.checkedIn && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[color:var(--gold)]/10 px-3 py-1 font-sans text-xs font-medium text-[color:var(--gold)]">
                    <UserCheck size={13} /> Checked in
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => copyLink(invite.inviteCode)}
                  className="flex items-center gap-1.5 rounded-full border border-[color:var(--border-soft)] px-3 py-1.5 font-sans text-xs text-[color:var(--ink-muted)] transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
                >
                  <Copy size={12} /> {copiedCode === invite.inviteCode ? "Copied!" : "Copy Link"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminGate>
  );
}
