"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CalendarX, CircleCheck, KeyRound, LoaderCircle, Users } from "lucide-react";
import type { RsvpFormData, RsvpResult } from "@/types";
import { couple } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, SelectInput, TextArea, TextInput } from "@/components/ui/FormField";

function fireConfetti() {
  const colors = ["#1c2841", "#ffb98a", "#ffd9b3", "#fffaf5"];
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
    colors,
  });
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0 }, colors });
    confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1 }, colors });
  }, 250);
}

const initialForm: RsvpFormData = {
  email: "",
  phone: "",
  attending: "",
  guests: "1",
  message: "",
  inviteCode: "",
};

export function RSVP({
  inviteCode,
  guestName,
  maxGuests,
  deadlinePassed = false,
}: {
  /** Personal invite code from /rsvp/[code]. */
  inviteCode: string;
  /** The invite's fixed, non-editable guest name — set by the couple, shown but never editable here. */
  guestName: string;
  /** Caps the Number of Guests field to 1..maxGuests. */
  maxGuests: number;
  /** When true, the form is replaced with a closed-RSVP message instead of being submittable. */
  deadlinePassed?: boolean;
}) {
  const [form, setForm] = useState<RsvpFormData>({ ...initialForm, inviteCode });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<RsvpResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof RsvpFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || "Something went wrong.");
      }

      setResult(body as RsvpResult);
      setSubmitted(true);
      fireConfetti();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const guestOptions = Array.from({ length: Math.min(maxGuests, 20) }, (_, i) => i + 1);

  return (
    <Section id="rsvp" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="RSVP"
        title="Join Our Celebration"
        description={`Kindly respond by ${couple.rsvpDeadlineDisplay} so we can prepare a seat with your name on it.`}
        className="mb-8"
      />

      <Reveal className="mx-auto mb-10 flex max-w-2xl justify-center">
        <div className="flex items-center gap-2.5 rounded-full border-2 border-[color:var(--gold)] bg-[color:var(--gold)]/10 px-6 py-2.5">
          <Users size={20} className="text-[color:var(--gold)]" />
          <span className="font-serif text-lg font-bold text-[color:var(--gold)] sm:text-xl">
            Your invitation covers up to {maxGuests} guest{maxGuests === 1 ? "" : "s"}
          </span>
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-2xl">
        <Card>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                >
                  <CircleCheck size={56} className="text-[color:var(--gold)]" />
                </motion.div>
                <h3 className="font-serif text-3xl text-[color:var(--ink)]">Thank You, {result?.name ?? guestName}!</h3>
                <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)]">
                  {result?.attending === "yes"
                    ? "We can't wait to celebrate with you! A confirmation has been noted, and we've sent the details to your email."
                    : "We're sorry you can't make it, but thank you for letting us know — you'll be in our hearts."}
                </p>

                {result?.attending === "yes" && result?.accessCode && (
                  <div className="mt-2 flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-6">
                    <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
                      Guests: {result.guests}
                    </p>

                    <div className="flex flex-col items-center gap-1.5">
                      <span className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
                        <KeyRound size={13} /> Your Access Code
                      </span>
                      <span className="font-serif text-2xl tracking-[0.15em] text-[color:var(--gold)]">
                        {result.accessCode}
                      </span>
                    </div>

                    {result.qrToken && (
                      // eslint-disable-next-line @next/next/no-img-element -- token-keyed dynamic image, not a static asset next/image can optimize
                      <img
                        src={`/api/qr/${encodeURIComponent(result.qrToken)}`}
                        alt="Check-in QR code"
                        width={128}
                        height={128}
                        className="h-32 w-32 rounded-xl border border-[color:var(--border-soft)]"
                      />
                    )}

                    <p className="font-sans text-xs text-[color:var(--ink-muted)]">
                      Save a screenshot of this code — present it or your access code at the door.
                    </p>
                  </div>
                )}

                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setResult(null);
                    setForm({ ...initialForm, inviteCode });
                  }}
                >
                  Update My Response
                </Button>
              </motion.div>
            ) : deadlinePassed ? (
              <motion.div
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-10 text-center"
              >
                <CalendarX size={40} className="text-[color:var(--gold)]" />
                <h3 className="font-serif text-2xl text-[color:var(--ink)]">RSVP Is Now Closed</h3>
                <p className="max-w-sm font-sans text-sm text-[color:var(--ink-muted)]">
                  The RSVP deadline ({couple.rsvpDeadlineDisplay}) has passed. If you still need to
                  respond, please reach out to us directly.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="grid gap-5 sm:grid-cols-2"
              >
                <p className="font-sans text-xs text-[color:var(--ink-muted)] sm:col-span-2">
                  Fields marked <span className="text-[color:var(--gold)]">*</span> are required.
                </p>
                <FormField label="Name" htmlFor="name" required className="sm:col-span-2">
                  <p
                    id="name"
                    className="w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3 font-sans text-sm text-[color:var(--ink)]"
                  >
                    {guestName}
                  </p>
                </FormField>
                <FormField label="Email" htmlFor="email" required>
                  <TextInput id="email" type="email" required value={form.email} onChange={handleChange("email")} />
                </FormField>
                <FormField label="Phone" htmlFor="phone">
                  <TextInput id="phone" type="tel" value={form.phone} onChange={handleChange("phone")} />
                </FormField>
                <FormField label="Will you attend?" htmlFor="attending" required>
                  <SelectInput id="attending" required value={form.attending} onChange={handleChange("attending")}>
                    <option value="" disabled>Select an option</option>
                    <option value="yes">Joyfully accepts</option>
                    <option value="no">Regretfully declines</option>
                  </SelectInput>
                </FormField>
                <FormField label={`Number of Guests (up to ${maxGuests})`} htmlFor="guests">
                  <SelectInput id="guests" value={form.guests} onChange={handleChange("guests")}>
                    {guestOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </SelectInput>
                </FormField>
                <FormField label="Message to the Couple" htmlFor="message" className="sm:col-span-2">
                  <TextArea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder={`Share your wishes for ${couple.groomName} & ${couple.brideName}...`}
                  />
                </FormField>

                {error && (
                  <p className="font-sans text-sm text-red-500 sm:col-span-2">{error}</p>
                )}

                <Button type="submit" disabled={submitting} className="sm:col-span-2">
                  {submitting ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit RSVP"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>
      </Reveal>
    </Section>
  );
}
