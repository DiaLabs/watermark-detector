import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroIllustration, Doodles, Logo } from '@/components/Illustrations';
import { Workspace } from '@/components/Workspace';
import { Features } from '@/components/Features';
import { UseCases } from '@/components/UseCases';
import { Footer } from '@/components/Footer';
import { Play } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      <Doodles />
      
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-0 w-full min-h-[82vh] lg:min-h-[calc(100vh-96px)] relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 lg:mt-[-40px]">
        <div className="w-full lg:w-[48%] space-y-8 text-center lg:text-left flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-[62px] font-extrabold text-[#1E1B4B] tight-tracking leading-[1.1]">
            <span className="block">
              <span className="text-[#5C4AD3]">Detect</span> Watermarks.
            </span>
            <span className="block">
              <span className="text-[#5C4AD3]">Reveal</span> Authenticity.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Our AI-powered system helps you identify visible and invisible watermarks in images with high accuracy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <a href="#workspace" className="w-full sm:w-auto text-center brand-gradient text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1">
              Try Detection Now →
            </a>
            <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-600 px-8 py-4 rounded-full text-base font-bold shadow-sm border border-slate-200 hover:text-primary hover:border-primary/30 transition-all">
               <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                 <Play size={10} fill="currentColor" />
               </span>
               Learn How It Works
            </a>
          </div>
        </div>

        <div className="w-full lg:w-[50%] relative flex justify-center items-center">
          {/* Premium Ambient Background Glow */}
          <div className="absolute w-[450px] h-[450px] bg-[#5C4AD3]/6 rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="relative z-10 w-full">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Workspace Area */}
      <Workspace />

      {/* Features Grid */}
      <Features />

      {/* Use Cases */}
      <UseCases />

      <Footer />
    </main>
  );
}
