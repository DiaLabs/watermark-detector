import React from 'react';
import { Logo } from './Illustrations';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between pt-6 pb-2 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
      <div className="flex items-center gap-3 cursor-pointer">
        <Logo />
        <div>
          <h1 className="font-bold text-lg leading-tight text-foreground">Watermark</h1>
          <p className="text-xs text-slate-500 font-medium">Detection System</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
        <a href="#workspace" className="hover:text-primary transition-colors">How it Works</a>
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
        <a href="#use-cases" className="hover:text-primary transition-colors">About</a>
      </div>
      
      <div>
        <a href="#workspace" className="inline-block brand-gradient text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5">
          Get Started
        </a>
      </div>
    </nav>
  );
};
