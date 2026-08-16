import { Coins, Handshake, Infinity, Users } from "lucide-react";

const statistics = [
  { icon: Users, value: "100+", label: "Countries", text: "Operating and connecting across the globe." },
  { icon: Handshake, value: "1000+", label: "Verified partners", text: "A trusted network of institutions and companies." },
  { icon: Coins, value: "50B+", label: "Transaction capacity", text: "USD capacity in structured transactions and projects." },
  { icon: Infinity, value: "∞", label: "Opportunities", text: "Endless possibilities through trusted cooperation." },
];

export function Statistics() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map(({ icon: Icon, value, label, text }) => (
          <article key={label} className="text-center lg:border-r lg:border-gold/20 lg:last:border-0">
            <Icon className="mx-auto mb-3 text-gold" size={42} strokeWidth={1.4} />
            <p className="font-display text-5xl text-gold-gradient">{value}</p>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-[0.14em]">{label}</h3>
            <p className="mx-auto mt-3 max-w-52 text-xs leading-6 text-white/55">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
