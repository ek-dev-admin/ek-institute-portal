"use client";

import { Globe2, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = ["About EK", "Ecosystem", "Solutions", "Membership", "Insights", "Contact"];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/5 bg-black/10 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="EK logo" width={52} height={52} className="h-12 w-12 object-contain" priority />
          <span className="hidden border-l border-gold/40 pl-3 font-display text-[10px] uppercase leading-4 tracking-[0.2em] text-gold sm:block">
            Executive<br />Cooperation
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 transition hover:text-gold">
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/signup" className="rounded-sm border border-gold/60 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-black">
            Sign Up
          </Link>
          <Link href="/login" className="rounded-sm border border-gold/60 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-black">
            Login
          </Link>
          <button aria-label="Change language" className="flex items-center gap-2 text-xs text-white/80">
            <Globe2 size={16} /> EN
          </button>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-ink/95 px-5 py-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {navigation.map((item) => <Link key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setOpen(false)}>{item}</Link>)}
            <Link href="/login" className="text-gold">Request access</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
