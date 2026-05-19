import React from 'react';
import { Logo } from './Illustrations';

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-12 bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="font-bold text-sm leading-tight text-foreground">Watermark Detection System</h1>
            <p className="text-[10px] text-slate-500 font-medium">Detect. Verify. Trust.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8 text-xs font-semibold text-slate-500">
          <a href="#workspace" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-primary transition-colors">Use Cases</a>
          <a href="#use-cases" className="hover:text-primary transition-colors">About</a>
        </div>
        
        <div className="text-[10px] text-slate-400 font-medium">
          © {new Date().getFullYear()} Watermark Detection System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
