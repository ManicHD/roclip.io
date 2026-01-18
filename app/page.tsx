"use client";

import Hero from "./components/Hero";
import WhyBloxClips from "./components/WhyBloxClips";
import HowItWorks from "./components/HowItWorks";
import CTASection from "./components/CTASection";


export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Hero />
      <WhyBloxClips />
      <HowItWorks />
      <CTASection />
    </main>
  );
}


