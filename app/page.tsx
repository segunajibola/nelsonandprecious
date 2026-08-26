import Image from "next/image";
import { Download } from "lucide-react";
import { couple } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { CountdownDisplay } from "@/components/ui/CountdownDisplay";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { FloralAccent } from "@/components/ui/FloralAccent";

export default function Landing() {
  return (
    <main className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={couple.heroImage}
          alt={`${couple.brideName} and ${couple.groomName}`}
          fill
          priority
          className="scale-110 object-cover blur-md"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
      </div>

      <FloatingParticles />
      <FloralAccent className="left-6 top-16 hidden sm:block" size={56} duration={9} />
      <FloralAccent className="right-8 top-32 hidden sm:block" size={40} duration={7} />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-24 text-center">
        <span className="font-sans text-sm font-medium uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
          {couple.hashtag}
        </span>

        <h1 className="flex flex-wrap items-baseline justify-center font-serif text-4xl leading-tight text-white sm:text-6xl sm:leading-none md:text-8xl">
          {couple.brideName}
          <span className="mx-2 text-[color:var(--gold-soft)] sm:mx-4">&amp;</span>
          {couple.groomName}
        </h1>

        <p className="font-sans text-sm uppercase tracking-[0.3em] text-white/80 sm:text-base">
          {couple.weddingDateDisplay}
        </p>

        <CountdownDisplay targetISO={couple.weddingDateISO} tone="light" />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button href="/details">View Details</Button>
          <Button variant="outline-light" href="/details#rsvp">
            RSVP
          </Button>
        </div>

        <div className="mt-2 flex flex-col items-center gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-white/60">
            Download Invitation
          </span>
          <div className="flex items-center gap-5">
            <a
              href="/invitation/nelson-and-precious-invitation.png"
              download
              className="inline-flex items-center gap-1.5 font-sans text-sm text-white/85 transition-colors hover:text-white"
            >
              <Download size={14} /> Image
            </a>
            <a
              href="/invitation/nelson-and-precious-invitation.pdf"
              download
              className="inline-flex items-center gap-1.5 font-sans text-sm text-white/85 transition-colors hover:text-white"
            >
              <Download size={14} /> PDF
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
