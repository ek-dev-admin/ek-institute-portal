import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Introduction() {
  return (
    <section id="about-ek" className="relative border-y border-gold/15 py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_55%,rgba(213,167,77,.11),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">— A new standard</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">A New Institutional Standard<br />for Global Commerce</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/65">
            EK is building the next-generation infrastructure that enables trusted collaboration, capital flows and project execution at global scale. Our ecosystem of institutions, experts and partners works together to create a more prosperous, secure and sustainable future.
          </p>
          <Button href="/login" variant="outline" className="mt-8">Join the founding network <ArrowRight size={17} /></Button>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-gold/35 shadow-[0_0_0_1px_rgba(213,167,77,0.08),0_20px_60px_rgba(0,0,0,0.35)]">
          <Image src="/images/global-city.png" alt="Connected global city" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
