"use client";

import { useState } from "react";
import { Lock, LoaderCircle } from "lucide-react";

export function AdminGate({
  checkingAuth,
  authed,
  authError,
  onLogin,
  children,
}: {
  checkingAuth: boolean;
  authed: boolean;
  authError: string;
  onLogin: (password: string) => void;
  children: React.ReactNode;
}) {
  const [input, setInput] = useState("");

  if (checkingAuth) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <LoaderCircle size={24} className="animate-spin text-[color:var(--gold)]" />
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="flex min-h-svh items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(input);
          }}
          className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-8"
        >
          <Lock size={22} className="text-[color:var(--gold)]" />
          <h1 className="font-serif text-2xl text-[color:var(--ink)]">Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3 font-sans text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--gold)]"
            autoFocus
          />
          {authError && <p className="font-sans text-sm text-red-500">{authError}</p>}
          <button
            type="submit"
            className="rounded-full bg-[color:var(--gold)] px-6 py-3 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Enter
          </button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
