import Image from "next/image";

export function Signature() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-gold/30 bg-panel/70 px-7 py-7 text-center md:flex-row md:text-left">
        <Image src="/images/logo.png" alt="EK logo" width={72} height={72} className="h-16 w-16 object-contain" />
        <p className="font-display text-sm uppercase leading-7 tracking-[0.12em] text-gold-light sm:text-base">
          EK is not a broker. EK is not a bank. EK is not an escrow company.<br />
          <span className="text-white/80">EK is the institutional trust framework that connects them all.</span>
        </p>
      </div>
    </section>
  );
}
