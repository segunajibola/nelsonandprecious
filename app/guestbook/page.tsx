"use client";

import { useEffect, useState } from "react";
import { Heart, LoaderCircle, MessageCircleHeart, Send } from "lucide-react";
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

interface GuestbookEntry {
  recordId: string;
  createdTime: string;
  name: string;
  message: string;
}

export default function GuestbookPage() {
  const { isPlaying, toggle } = useBackgroundMusic("/music/chike-apple.mp3");
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((body) => setEntries(body.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Something went wrong.");
      setSent(true);
      setName("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <ScrollProgress />
      <Navbar isMusicPlaying={isPlaying} onToggleMusic={toggle} />

      <main className="flex-1 pt-32 pb-20 sm:pt-40">
        <Container className="flex flex-col items-center gap-3 text-center">
          <MessageCircleHeart size={28} className="text-[color:var(--gold)]" />
          <h1 className="font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">Guestbook</h1>
          <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)]">
            Leave {couple.groomName} &amp; {couple.brideName} a message — well wishes, memories,
            anything from the heart.
          </p>
        </Container>

        <Container className="mt-10 max-w-xl">
          <Card>
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Heart size={32} className="fill-[color:var(--gold)] text-[color:var(--gold)]" />
                <h3 className="font-serif text-xl text-[color:var(--ink)]">Thank You!</h3>
                <p className="font-sans text-sm text-[color:var(--ink-muted)]">
                  Your message has been received and will appear below once reviewed.
                </p>
                <Button variant="secondary" onClick={() => setSent(false)}>
                  Write Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FormField label="Your Name" htmlFor="gb-name" required>
                  <TextInput
                    id="gb-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Your Message" htmlFor="gb-message" required>
                  <TextArea
                    id="gb-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Share your wishes for ${couple.groomName} & ${couple.brideName}...`}
                    required
                  />
                </FormField>
                {error && <p className="font-sans text-sm text-red-500">{error}</p>}
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Sign the Guestbook
                </Button>
              </form>
            )}
          </Card>
        </Container>

        <Container className="mt-16 max-w-2xl">
          {loading ? (
            <div className="flex justify-center">
              <LoaderCircle size={20} className="animate-spin text-[color:var(--gold)]" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-center font-sans text-sm text-[color:var(--ink-muted)]">
              No messages yet — be the first to sign!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {entries.map((entry) => (
                <div
                  key={entry.recordId}
                  className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-5"
                >
                  <p className="font-sans text-sm whitespace-pre-line text-[color:var(--ink)]">
                    {entry.message}
                  </p>
                  <p className="mt-2 font-sans text-xs uppercase tracking-wide text-[color:var(--gold)]">
                    — {entry.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
