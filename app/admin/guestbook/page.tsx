"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleCheck, LoaderCircle, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminGate } from "@/components/admin/AdminGate";

interface GuestbookEntry {
  recordId: string;
  createdTime: string;
  name: string;
  message: string;
  approved: boolean;
}

export default function AdminGuestbookPage() {
  const { password, authed, checkingAuth, authError, login } = useAdminAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guestbook", { headers: { "x-admin-password": password } });
      const body = await res.json();
      setEntries(body.entries ?? []);
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    // Deferred so the state updates inside loadEntries happen outside this
    // effect's own synchronous call frame.
    queueMicrotask(() => {
      loadEntries();
    });
  }, [loadEntries]);

  async function approve(recordId: string) {
    setActingId(recordId);
    try {
      await fetch("/api/admin/guestbook", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ recordId }),
      });
      await loadEntries();
    } finally {
      setActingId(null);
    }
  }

  async function remove(recordId: string) {
    setActingId(recordId);
    try {
      await fetch("/api/admin/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ recordId }),
      });
      await loadEntries();
    } finally {
      setActingId(null);
    }
  }

  return (
    <AdminGate checkingAuth={checkingAuth} authed={authed} authError={authError} onLogin={login}>
      <main className="mx-auto min-h-svh w-full max-w-2xl px-6 py-16">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 font-sans text-sm text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--gold)]"
        >
          <ArrowLeft size={15} /> Invites
        </Link>
        <h1 className="mt-3 font-serif text-3xl text-[color:var(--ink)]">Guestbook Moderation</h1>
        <p className="mt-1 font-sans text-sm text-[color:var(--ink-muted)]">
          Approve messages to make them visible on the public guestbook page, or delete anything
          inappropriate.
        </p>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <LoaderCircle size={20} className="animate-spin text-[color:var(--gold)]" />
          </div>
        ) : entries.length === 0 ? (
          <p className="mt-6 font-sans text-sm text-[color:var(--ink-muted)]">No messages yet.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {entries.map((entry) => (
              <div
                key={entry.recordId}
                className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-sm text-[color:var(--ink)]">{entry.message}</p>
                    <p className="mt-1 font-sans text-xs uppercase tracking-wide text-[color:var(--gold)]">
                      — {entry.name}
                    </p>
                  </div>
                  {entry.approved && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 font-sans text-xs text-green-600">
                      <CircleCheck size={12} /> Approved
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {!entry.approved && (
                    <button
                      type="button"
                      onClick={() => approve(entry.recordId)}
                      disabled={actingId === entry.recordId}
                      className="flex items-center gap-1.5 rounded-full bg-[color:var(--gold)] px-3 py-1.5 font-sans text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      <CircleCheck size={13} /> Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(entry.recordId)}
                    disabled={actingId === entry.recordId}
                    className="flex items-center gap-1.5 rounded-full border border-red-300 px-3 py-1.5 font-sans text-xs text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminGate>
  );
}
