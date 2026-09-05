"use client";

import { useCallback, useEffect, useState } from "react";

export interface InviteListItem {
  recordId: string;
  createdTime: string;
  label: string;
  maxGuests: number;
  inviteCode: string;
  email: string | null;
  attending: "yes" | "no" | null;
  guestsConfirmed: number | null;
  accessCode: string | null;
  qrToken: string | null;
  checkedIn: boolean;
  checkInTime: string | null;
}

const SESSION_KEY = "wedding-admin-password";

// Shared by every /admin page: password-gate + the one fetch of the full
// invite list every admin view is built on (invite generation, check-in
// search/scan, and the stats they both show all read from this same list).
export function useAdminAuth() {
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");
  const [invites, setInvites] = useState<InviteListItem[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  const loadInvites = useCallback(async (pw: string) => {
    setLoadingInvites(true);
    try {
      const res = await fetch("/api/admin/invites", { headers: { "x-admin-password": pw } });
      const body = await res.json();
      if (!res.ok) {
        setAuthError(body?.error || "Something went wrong.");
        setPassword("");
        sessionStorage.removeItem(SESSION_KEY);
        return false;
      }
      setPassword(pw);
      setAuthError("");
      setInvites(body.invites);
      sessionStorage.setItem(SESSION_KEY, pw);
      return true;
    } catch {
      setAuthError("Couldn't reach the server. Please try again.");
      return false;
    } finally {
      setLoadingInvites(false);
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    // Deferred so state updates happen outside this effect's own synchronous
    // call frame — this only ever runs once on mount to restore a session.
    queueMicrotask(() => {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        loadInvites(stored);
      } else {
        setCheckingAuth(false);
      }
    });
  }, [loadInvites]);

  const refetch = useCallback(() => loadInvites(password), [loadInvites, password]);

  return {
    password,
    authed: Boolean(password),
    checkingAuth,
    authError,
    invites,
    loadingInvites,
    login: loadInvites,
    refetch,
  };
}
