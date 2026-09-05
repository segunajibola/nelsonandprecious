"use client";

import { useState } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle, XCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, TextArea, TextInput } from "@/components/ui/FormField";
import { couple } from "@/lib/data";

// Airtable's attachment-upload endpoint takes the file as base64 in a JSON
// body, so this mirrors the server-side cap in /api/photos (base64 inflates
// the payload by ~33%, and serverless request bodies have their own limits).
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

interface FileStatus {
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function SharePhotosPage() {
  const { isPlaying, toggle } = useBackgroundMusic("/music/chike-apple.mp3");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const oversized = selected.find((file) => file.size > MAX_PHOTO_BYTES);
    if (oversized) {
      setError(`"${oversized.name}" is over 3MB — please choose a smaller photo.`);
      return;
    }
    setError("");
    setFiles(selected);
    setStatuses([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please choose at least one photo.");
      return;
    }
    setUploading(true);
    setError("");
    setStatuses(files.map((file) => ({ name: file.name, status: "uploading" })));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const base64 = await readFileAsBase64(file);
        const res = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, message, filename: file.name, contentType: file.type, base64 }),
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || "Upload failed.");
        setStatuses((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: "done" } : s)));
      } catch (err) {
        setStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: "error", error: err instanceof Error ? err.message : "Upload failed." }
              : s,
          ),
        );
      }
    }

    setUploading(false);
    setFiles([]);
  }

  return (
    <>
      <ScrollProgress />
      <Navbar isMusicPlaying={isPlaying} onToggleMusic={toggle} />

      <main className="flex-1 pt-32 pb-20 sm:pt-40">
        <Container className="flex flex-col items-center gap-3 text-center">
          <ImagePlus size={28} className="text-[color:var(--gold)]" />
          <h1 className="font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">Share Your Photos</h1>
          <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)]">
            Got great shots from the day? Upload them here for {couple.groomName} &amp;{" "}
            {couple.brideName} to see.
          </p>
        </Container>

        <Container className="mt-10 max-w-xl">
          <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FormField label="Your Name" htmlFor="photo-name">
                <TextInput id="photo-name" value={name} onChange={(e) => setName(e.target.value)} />
              </FormField>
              <FormField label="Caption (optional)" htmlFor="photo-message">
                <TextArea
                  id="photo-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormField>
              <FormField label="Photos (up to 3MB each)" htmlFor="photo-files" required>
                <input
                  id="photo-files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3 font-sans text-sm text-[color:var(--ink)] outline-none file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--gold)] file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white"
                />
              </FormField>

              {statuses.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {statuses.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between gap-2 font-sans text-xs text-[color:var(--ink-muted)]"
                    >
                      <span className="truncate">{s.name}</span>
                      {s.status === "uploading" && <LoaderCircle size={13} className="animate-spin" />}
                      {s.status === "done" && <CheckCircle2 size={13} className="text-green-600" />}
                      {s.status === "error" && (
                        <span title={s.error}>
                          <XCircle size={13} className="text-red-500" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="font-sans text-sm text-red-500">{error}</p>}

              <Button type="submit" disabled={uploading || files.length === 0}>
                {uploading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <ImagePlus size={16} />
                )}
                Upload Photos
              </Button>
            </form>
          </Card>
        </Container>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
