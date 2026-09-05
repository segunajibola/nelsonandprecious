"use client";

import { useState } from "react";
import { LoaderCircle, Music, PartyPopper, Send } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, TextInput } from "@/components/ui/FormField";
import { couple } from "@/lib/data";

export default function SongRequestsPage() {
  const { isPlaying, toggle } = useBackgroundMusic("/music/chike-apple.mp3");
  const [name, setName] = useState("");
  const [song, setSong] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, song }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Something went wrong.");
      setSent(true);
      setSong("");
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
          <Music size={28} className="text-[color:var(--gold)]" />
          <h1 className="font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">Song Requests</h1>
          <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)]">
            Help us fill the dance floor! Tell us a song you&apos;d love to hear at the reception.
          </p>
        </Container>

        <Container className="mt-10 max-w-xl">
          <Card>
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <PartyPopper size={32} className="text-[color:var(--gold)]" />
                <h3 className="font-serif text-xl text-[color:var(--ink)]">Request Received!</h3>
                <p className="font-sans text-sm text-[color:var(--ink-muted)]">
                  Thanks — we&apos;ve passed it along to the DJ.
                </p>
                <Button variant="secondary" onClick={() => setSent(false)}>
                  Request Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FormField label="Your Name" htmlFor="song-name">
                  <TextInput id="song-name" value={name} onChange={(e) => setName(e.target.value)} />
                </FormField>
                <FormField label="Song Title & Artist" htmlFor="song-title" required>
                  <TextInput
                    id="song-title"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    placeholder={`e.g. "Perfect" by Ed Sheeran`}
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
                  Send Request
                </Button>
              </form>
            )}
          </Card>
        </Container>

        <Container className="mt-8 max-w-xl text-center">
          <p className="font-sans text-xs text-[color:var(--ink-muted)]">
            With love, {couple.groomName} &amp; {couple.brideName}
          </p>
        </Container>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
