"use client";

import { useState } from "react";
import { CircleCheck, KeyRound, LoaderCircle, UserCheck, Users } from "lucide-react";
import { formatCheckInTimestamp } from "@/lib/utils";

export function CheckInVerifyClient({
  token,
  name,
  guests,
  accessCode,
  initialCheckedIn,
  initialCheckInTime,
}: {
  token: string;
  name: string;
  guests: number;
  accessCode: string | null;
  initialCheckedIn: boolean;
  initialCheckInTime: string | null;
}) {
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn);
  const [checkInTime, setCheckInTime] = useState(initialCheckInTime);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckIn() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/checkin/${encodeURIComponent(token)}`, { method: "POST" });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Something went wrong.");
      setCheckedIn(true);
      setCheckInTime(body.checkInTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-8 text-center shadow-[0_20px_60px_-30px_rgba(43,36,32,0.35)]">
        <CircleCheck size={40} className="text-[color:var(--gold)]" />
        <div>
          <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
            RSVP Confirmed
          </p>
          <h1 className="font-serif text-2xl text-[color:var(--ink)]">{name}</h1>
        </div>

        <div className="flex w-full flex-col gap-3 rounded-2xl border border-[color:var(--border-soft)] p-5">
          <div className="flex items-center justify-between font-sans text-sm">
            <span className="flex items-center gap-1.5 text-[color:var(--ink-muted)]">
              <Users size={14} /> Guests
            </span>
            <span className="font-medium text-[color:var(--ink)]">{guests}</span>
          </div>
          {accessCode && (
            <div className="flex items-center justify-between font-sans text-sm">
              <span className="flex items-center gap-1.5 text-[color:var(--ink-muted)]">
                <KeyRound size={14} /> Access Code
              </span>
              <span className="font-medium tracking-wide text-[color:var(--ink)]">{accessCode}</span>
            </div>
          )}
        </div>

        {error && <p className="font-sans text-sm text-red-500">{error}</p>}

        {checkedIn ? (
          <div className="flex items-center gap-1.5 rounded-full bg-[color:var(--gold)]/10 px-4 py-2 font-sans text-sm font-medium text-[color:var(--gold)]">
            <UserCheck size={15} />
            Checked in{formatCheckInTimestamp(checkInTime) ? ` on ${formatCheckInTimestamp(checkInTime)}` : ""}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--gold)] px-6 py-3 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <UserCheck size={16} />}
            Check In Now
          </button>
        )}
      </div>
    </main>
  );
}
