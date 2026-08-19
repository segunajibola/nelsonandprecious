"use client";

import { asoEbi, bridalParty, groomParty } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerGroup } from "@/components/ui/Reveal";
import { PartyCard } from "@/components/ui/PartyCard";

export function WeddingParty() {
  return (
    <Section id="wedding-party" className="bg-[color:var(--surface)]/40">
      <SectionHeading
        eyebrow="Wedding Party"
        title="Standing Beside Us"
        description="The friends and family who have supported our journey to the altar."
        className="mb-16"
      />

      <div className="mb-16">
        <Reveal>
          <h3 className="mb-8 text-center font-serif text-2xl italic text-[color:var(--gold)]">
            Bride&apos;s Side
          </h3>
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {bridalParty.map((member) => (
            <Reveal key={member.id}>
              <PartyCard member={member} />
            </Reveal>
          ))}
        </StaggerGroup>
      </div>

      <div className="mb-16">
        <Reveal>
          <h3 className="mb-8 text-center font-serif text-2xl italic text-[color:var(--gold)]">
            Aso Ebi
          </h3>
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {asoEbi.map((member) => (
            <Reveal key={member.id}>
              <PartyCard member={member} />
            </Reveal>
          ))}
        </StaggerGroup>
      </div>

      <div>
        <Reveal>
          <h3 className="mb-8 text-center font-serif text-2xl italic text-[color:var(--gold)]">
            Groom&apos;s Side
          </h3>
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {groomParty.map((member) => (
            <Reveal key={member.id}>
              <PartyCard member={member} />
            </Reveal>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
