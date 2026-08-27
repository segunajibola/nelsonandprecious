"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CircleCheck, KeyRound, LoaderCircle, QrCode } from "lucide-react";
import type { RsvpFormData, RsvpResult } from "@/types";
import { couple } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField, SelectInput, TextArea, TextInput } from "@/components/ui/FormField";

const initialForm: RsvpFormData = {
  name: "",
  email: "",
  phone: "",
  attending: "",
  guests: "1",
  message: "",
};

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

export function RSVP() {
  const [form, setForm] = useState<RsvpFormData>(initialForm);
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

  return (
    <Section id="rsvp" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="RSVP"
        title="Join Our Celebration"
        description="Kindly respond by September 21, 2026 so we can prepare a seat with your name on it."
        className="mb-16"
      />

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
                <h3 className="font-serif text-3xl text-[color:var(--ink)]">Thank You, {result?.name ?? form.name}!</h3>
                <p className="max-w-md font-sans text-sm text-[color:var(--ink-muted)]">
                  {result?.attending === "yes"
                    ? "We can't wait to celebrate with you! A confirmation has been noted."
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

                    <div className="flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[color:var(--border-soft)] text-[color:var(--ink-muted)]">
                      <QrCode size={28} />
                      <span className="font-sans text-[0.65rem]">QR code coming soon</span>
                    </div>

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
                    setForm(initialForm);
                  }}
                >
                  Submit Another Response
                </Button>
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
                  Fields marked <span className="text-[color:var(--gold)]">*</span> are required — everything else is optional.
                </p>
                <FormField label="Name" htmlFor="name" required className="sm:col-span-2">
                  <TextInput id="name" required value={form.name} onChange={handleChange("name")} />
                </FormField>
                <FormField label="Email" htmlFor="email">
                  <TextInput id="email" type="email" value={form.email} onChange={handleChange("email")} />
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
                <FormField label="Number of Guests" htmlFor="guests">
                  <TextInput
                    id="guests"
                    type="number"
                    min={1}
                    value={form.guests}
                    onChange={handleChange("guests")}
                  />
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
