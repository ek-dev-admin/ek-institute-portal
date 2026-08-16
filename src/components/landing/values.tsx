import { Building2, Diamond, Globe2, ShieldCheck } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Trust first", text: "Institutional-grade verification and governance to protect people, capital and reputation." },
  { icon: Globe2, title: "Global network", text: "Connecting verified partners, institutions and opportunities across the world." },
  { icon: Building2, title: "Institutional standard", text: "Built on compliance, transparency and best practices recognized by global institutions." },
  { icon: Diamond, title: "Long-term impact", text: "Creating sustainable value for businesses, communities and generations to come." },
];

export function Values() {
  return (
    <section id="ecosystem" className="relative z-20 mx-auto -mt-14 max-w-7xl px-5">
      <div className="grid overflow-hidden rounded-xl border border-gold/20 bg-panel/90 shadow-2xl backdrop-blur-md md:grid-cols-2 lg:grid-cols-4">
        {values.map(({ icon: Icon, title, text }) => (
          <article key={title} className="relative p-8 text-center after:absolute after:right-0 after:top-1/4 after:hidden after:h-1/2 after:w-px after:bg-gold/20 lg:after:block lg:last:after:hidden">
            <Icon className="mx-auto mb-5 text-gold" size={42} strokeWidth={1.4} />
            <h2 className="font-display text-sm uppercase tracking-[0.08em] text-gold">{title}</h2>
            <p className="mt-3 text-xs leading-6 text-white/65">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
