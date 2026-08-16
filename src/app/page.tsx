import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";
import { Navbar } from "@/components/landing/navbar";
import { Signature } from "@/components/landing/signature";
import { Statistics } from "@/components/landing/statistics";
import { Values } from "@/components/landing/values";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink text-white">
      <Navbar />
      <Hero />
      <Values />
      <Statistics />
      <Introduction />
      <Signature />
      <Footer />
    </main>
  );
}
