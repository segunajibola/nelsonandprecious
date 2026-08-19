"use client";

import { useState } from "react";
import { Check, Copy, Gift } from "lucide-react";
import { giftAccounts } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import type { BankAccountInfo } from "@/types";

function AccountCard({ account }: { account: BankAccountInfo }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex h-full flex-col items-center gap-6 text-center">
      <Gift size={26} className="text-[color:var(--gold)]" />
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">Bank</p>
          <p className="font-serif text-xl text-[color:var(--ink)]">{account.bankName}</p>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
            Account Number
          </p>
          <p className="font-serif text-2xl tracking-widest text-[color:var(--ink)]">
            {account.accountNumber}
          </p>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
            Account Name
          </p>
          <p className="font-serif text-xl text-[color:var(--ink)]">{account.accountName}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--gold)] px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-[color:var(--ink)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[color:var(--gold)] hover:text-[#fffef6]"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied!" : "Copy Account Number"}
      </button>
    </Card>
  );
}

export function GiftRegistry() {
  return (
    <Section id="registry">
      <SectionHeading
        eyebrow="Gift"
        title="With Love, Not Obligation"
        description="Your presence at our wedding is the greatest gift of all. For those who wish to give, you can send a gift below."
        className="mb-16"
      />

      <StaggerGroup className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {giftAccounts.map((account) => (
          <Reveal key={account.accountNumber}>
            <AccountCard account={account} />
          </Reveal>
        ))}
      </StaggerGroup>
    </Section>
  );
}
