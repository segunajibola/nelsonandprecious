"use client";

import { asoEbiLadies, asoEbiMen, bridalParty, groomParty } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";
import { PartyCard } from "@/components/ui/PartyCard";
import type { WeddingPartyMember } from "@/types";

function PartyGroup({ title, members }: { title: string; members: WeddingPartyMember[] }) {
  return (
    <div className="mb-16 last:mb-0">
      <Reveal>
        <h3 className="mb-8 text-center font-serif text-2xl italic text-[color:var(--gold)]">
          {title}
        </h3>
      </Reveal>
      <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {members.map((member) => (
          <Reveal key={member.id}>
            <PartyCard member={member} />
          </Reveal>
        ))}
      </StaggerGroup>
    </div>
  );
}

export function WeddingParty() {
  return (
    <Section id="wedding-party" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="Wedding Party"
        title="Standing Beside Us"
        description="The friends and family who have supported our journey to the altar."
        className="mb-16"
      />

      <PartyGroup title="Bride's Side" members={bridalParty} />
      <PartyGroup title="Aso Ebi Ladies" members={asoEbiLadies} />
      <PartyGroup title="Groom's Side" members={groomParty} />
      <PartyGroup title="Aso Ebi Men" members={asoEbiMen} />
    </Section>
  );
}
