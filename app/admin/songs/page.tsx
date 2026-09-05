"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Music } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminGate } from "@/components/admin/AdminGate";

interface SongRequest {
  recordId: string;
  createdTime: string;
  name: string;
  song: string;
}

export default function AdminSongsPage() {
  const { password, authed, checkingAuth, authError, login } = useAdminAuth();
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!password) return;
    // Deferred so these state updates happen outside this effect's own
    // synchronous call frame.
    queueMicrotask(() => {
      setLoading(true);
      fetch("/api/admin/songs", { headers: { "x-admin-password": password } })
        .then((res) => res.json())
        .then((body) => setRequests(body.requests ?? []))
        .finally(() => setLoading(false));
    });
  }, [password]);

  return (
    <AdminGate checkingAuth={checkingAuth} authed={authed} authError={authError} onLogin={login}>
      <main className="mx-auto min-h-svh w-full max-w-2xl px-6 py-16">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 font-sans text-sm text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--gold)]"
        >
          <ArrowLeft size={15} /> Invites
        </Link>
        <h1 className="mt-3 flex items-center gap-2 font-serif text-3xl text-[color:var(--ink)]">
          <Music size={26} className="text-[color:var(--gold)]" /> Song Requests
        </h1>
        <p className="mt-1 font-sans text-sm text-[color:var(--ink-muted)]">
          {requests.length} request{requests.length === 1 ? "" : "s"} from guests.
        </p>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <LoaderCircle size={20} className="animate-spin text-[color:var(--gold)]" />
          </div>
        ) : requests.length === 0 ? (
          <p className="mt-6 font-sans text-sm text-[color:var(--ink-muted)]">No requests yet.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-2">
            {requests.map((r) => (
              <div
                key={r.recordId}
                className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3"
              >
                <span className="font-sans text-sm text-[color:var(--ink)]">{r.song}</span>
                <span className="font-sans text-xs text-[color:var(--ink-muted)]">— {r.name}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminGate>
  );
}
