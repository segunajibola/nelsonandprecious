"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminGate } from "@/components/admin/AdminGate";
import { couple } from "@/lib/data";

// Deliberately plain black-on-white styling (not the site's dark theme
// tokens) — this exists to be printed on paper as a door-staff backup, not
// to look on-brand on screen.
export default function PrintCheckInSheet() {
  const { authed, checkingAuth, authError, invites, loadingInvites, login } = useAdminAuth();

  const attending = useMemo(
    () =>
      invites
        .filter((invite) => invite.attending === "yes")
        .sort((a, b) => a.label.localeCompare(b.label)),
    [invites],
  );

  return (
    <AdminGate checkingAuth={checkingAuth} authed={authed} authError={authError} onLogin={login}>
      <main className="mx-auto min-h-svh w-full max-w-3xl bg-white px-6 py-16 text-black print:p-4">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 font-sans text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft size={15} /> Invites
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Printer size={15} /> Print
          </button>
        </div>

        <h1 className="mt-6 font-serif text-2xl text-black print:mt-0">
          {couple.groomName} &amp; {couple.brideName} — Guest Check-In Sheet
        </h1>
        <p className="mt-1 font-sans text-sm text-gray-500 print:hidden">
          Paper backup for door staff — {attending.length} confirmed guest{attending.length === 1 ? "" : "s"}.
        </p>

        {loadingInvites ? (
          <p className="mt-6 font-sans text-sm text-gray-500 print:hidden">Loading…</p>
        ) : attending.length === 0 ? (
          <p className="mt-6 font-sans text-sm text-gray-500">No confirmed guests yet.</p>
        ) : (
          <table className="mt-6 w-full border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b-2 border-black text-left">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Guests</th>
                <th className="py-2 pr-3">Access Code</th>
                <th className="py-2">Checked In</th>
              </tr>
            </thead>
            <tbody>
              {attending.map((invite) => (
                <tr key={invite.recordId} className="border-b border-gray-300">
                  <td className="py-2 pr-3">{invite.label}</td>
                  <td className="py-2 pr-3">{invite.guestsConfirmed ?? 1}</td>
                  <td className="py-2 pr-3">{invite.accessCode}</td>
                  <td className="py-2">☐</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </AdminGate>
  );
}
