"use client";

import { useEffect, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";

const SCANNER_ELEMENT_ID = "qr-scanner-viewport";

// Camera lifecycle only ever runs once per mount — `onScan` is read from a
// ref so the parent can pass a fresh closure each render without tearing
// down and restarting the camera stream.
export function QrScanner({ onScan }: { onScan: (decodedText: string) => void }) {
  const onScanRef = useRef(onScan);

  const [error, setError] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    onScanRef.current = onScan;
  });

  useEffect(() => {
    let cancelled = false;
    let scanner: Html5Qrcode | null = null;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled) return;
      scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 240 },
          (decodedText) => onScanRef.current(decodedText),
          () => {},
        )
        .then(() => {
          if (!cancelled) setActive(true);
        })
        .catch((err) => {
          if (!cancelled) {
            setError("Couldn't access the camera. Check permissions and try again.");
          }
          console.error("QR scanner start failed:", err);
        });
    });

    return () => {
      cancelled = true;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner!.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        id={SCANNER_ELEMENT_ID}
        className="w-full max-w-xs overflow-hidden rounded-xl [&_video]:rounded-xl"
      />
      {error && <p className="font-sans text-sm text-red-500">{error}</p>}
      {!active && !error && (
        <p className="font-sans text-xs text-[color:var(--ink-muted)]">Starting camera…</p>
      )}
    </div>
  );
}
