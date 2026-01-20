"use client";

import Hero from "./components/Hero";
import WhyBloxClips from "./components/WhyBloxClips";
import HowItWorks from "./components/HowItWorks";
import CTASection from "./components/CTASection";
import Navbar from "./components/Navbar";


import GlobalSpotlight from "./components/GlobalSpotlight";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <GlobalSpotlight />
      <Navbar />
      <Hero />
      <WhyBloxClips />
      <HowItWorks />
      <CTASection />
    </main>
  );
}


