"use client";

import React, { useState } from 'react';
import { Logo } from './Illustrations';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset for sticky or padded navbars
      const yOffset = -20; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full sticky top-0 bg-[#FCFBFF]/80 backdrop-blur-md border-b border-[#E0DDF7]/50 z-50 transition-all duration-300">
      <nav className="flex items-center justify-between py-4 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
          <Logo />
          <div>
            <h1 className="font-bold text-lg leading-tight text-foreground">Watermark</h1>
            <p className="text-xs text-slate-500 font-medium">Detection System</p>
          </div>
        </div>
        
        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a 
            href="#workspace" 
            onClick={(e) => handleScroll(e, 'workspace')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Workspace
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleScroll(e, 'features')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Features
          </a>
          <a 
            href="#use-cases" 
            onClick={(e) => handleScroll(e, 'use-cases')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Use Cases
          </a>
        </div>
        
        {/* Actions (Desktop CTA & Mobile Hamburger Toggle) */}
        <div className="flex items-center gap-4">
          <a 
            href="#workspace" 
            onClick={(e) => handleScroll(e, 'workspace')}
            className="hidden sm:inline-block brand-gradient text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5"
          >
            Get Started
          </a>
          
          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Out Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-[#E0DDF7] shadow-xl p-6 flex flex-col gap-5 animate-fade-in-down z-50">
          <a 
            href="#workspace" 
            onClick={(e) => handleScroll(e, 'workspace')}
            className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
          >
            Workspace
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleScroll(e, 'features')}
            className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
          >
            Features
          </a>
          <a 
            href="#use-cases" 
            onClick={(e) => handleScroll(e, 'use-cases')}
            className="text-base font-semibold text-slate-600 hover:text-primary py-2 border-b border-slate-100 transition-colors"
          >
            Use Cases
          </a>
          <a 
            href="#workspace" 
            onClick={(e) => handleScroll(e, 'workspace')}
            className="brand-gradient text-white text-center py-3 rounded-full text-base font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all mt-2"
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
};
