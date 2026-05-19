import React from 'react';

export const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#F0EDFB" />
    <path d="M20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6Z" stroke="#5C4AD3" strokeWidth="2" />
    <path d="M13 16L16.5 24L20 17L23.5 24L27 16" stroke="#5C4AD3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HeroIllustration = () => (
  <div className="relative w-full max-w-2xl lg:max-w-none mx-auto aspect-video flex items-center justify-center">
    <img 
      src="/onboarding_illustration.png" 
      alt="Watermark Detection Onboarding" 
      className="w-full h-auto drop-shadow-[0_20px_50px_rgba(92,74,211,0.15)] hover:scale-102 transition-transform duration-500 relative z-10" 
    />
  </div>
);

export const Doodles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
    {/* Top Left Sparkle */}
    <img 
      src="/doodles/doodle_1.png" 
      alt="" 
      className="absolute top-24 left-[5%] w-16 h-auto opacity-35 mix-blend-multiply animate-float-slow"
    />
    {/* Top Right Dashed Sparkle */}
    <img 
      src="/doodles/doodle_6.png" 
      alt="" 
      className="absolute top-44 right-[8%] w-24 h-auto opacity-35 mix-blend-multiply animate-float-slower"
    />
    {/* Upper Right Tiny Star (new) */}
    <img 
      src="/doodles/doodle_2.png" 
      alt="" 
      className="absolute top-[520px] right-[12%] w-12 h-auto opacity-40 mix-blend-multiply animate-float-slow"
    />
    {/* Mid Left Swirl (behind Workspace) */}
    <img 
      src="/doodles/doodle_13.png" 
      alt="" 
      className="absolute top-[800px] left-[3%] w-28 h-auto opacity-30 mix-blend-multiply animate-float-slower"
    />
    {/* Mid Right Tall Swirl (behind Features) */}
    <img 
      src="/doodles/doodle_17.png" 
      alt="" 
      className="absolute top-[1350px] right-[4%] w-24 h-auto opacity-30 mix-blend-multiply animate-float-slow"
    />
    {/* Lower Left Mid-size Swirl (new) */}
    <img 
      src="/doodles/doodle_5.png" 
      alt="" 
      className="absolute top-[1650px] left-[8%] w-24 h-auto opacity-35 mix-blend-multiply animate-float-slower"
    />
    {/* Bottom Left Cloud/Spiral (behind Use Cases) */}
    <img 
      src="/doodles/doodle_7.png" 
      alt="" 
      className="absolute top-[2050px] left-[5%] w-28 h-auto opacity-30 mix-blend-multiply animate-float-slower"
    />
    {/* Bottom Right Wave Loop */}
    <img 
      src="/doodles/doodle_14.png" 
      alt="" 
      className="absolute top-[2450px] right-[6%] w-24 h-auto opacity-30 mix-blend-multiply animate-float-slow"
    />
    {/* Very Bottom Right Swirl (new) */}
    <img 
      src="/doodles/doodle_15.png" 
      alt="" 
      className="absolute top-[2800px] right-[8%] w-20 h-auto opacity-35 mix-blend-multiply animate-float-slower"
    />
  </div>
);
