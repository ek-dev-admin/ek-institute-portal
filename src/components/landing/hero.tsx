import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[920px] items-center justify-center pt-28">
      <Image src="/images/hero-bg.png" alt="Earth from space" fill priority className="object-cover object-center opacity-65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(1,7,14,.2)_38%,rgba(1,7,14,.96)_88%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        <div className="relative mx-auto mb-4 h-72 w-72 sm:h-96 sm:w-96">
          <div className="absolute inset-6 rounded-full border border-gold/65 shadow-[0_0_70px_rgba(213,167,77,.18)]" />
          <Image src="/images/hero-logo.png" alt="Executive Cooperation emblem" fill className="object-contain" priority />
        </div>

        <p className="mb-3 font-display text-sm uppercase tracking-[0.42em] text-gold">Executive Cooperation</p>
        <h1 className="font-display text-4xl font-medium uppercase leading-[1.12] sm:text-6xl lg:text-7xl">
          The architecture of<br /><span className="text-gold-gradient">global prosperity</span>
        </h1>
        <div className="mx-auto my-7 h-px w-52 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="mx-auto max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
          Building the institutional trust infrastructure for global trade, investment and project development.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-x-10 gap-y-3 font-display text-sm uppercase tracking-[0.18em] text-gold sm:text-base">
          <span>Strategy</span><span>Trust</span><span>Execution</span><span>Prosperity</span>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="#ecosystem">Explore EK ecosystem <ArrowRight size={17} /></Button>
          <Button href="/white-paper.pdf" variant="outline">Download white paper <Download size={17} /></Button>
        </div>
      </div>
    </section>
  );
}
