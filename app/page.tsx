"use client";

import Hero from "./components/Hero";
import BentoGrid from "./components/BentoGrid";
import HowItWorks from "./components/HowItWorks";


export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Hero />
      <BentoGrid />
      <HowItWorks />
    </main>
  );
}
