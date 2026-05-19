import React from 'react';
import { Camera, PenTool, Briefcase, BookOpen, Globe, UserCheck } from 'lucide-react';

export const UseCases = () => {
  const chips = [
    { icon: <Camera size={16} />, label: "Photographers" },
    { icon: <PenTool size={16} />, label: "Designers" },
    { icon: <Briefcase size={16} />, label: "Businesses" },
    { icon: <BookOpen size={16} />, label: "Educators" },
    { icon: <Globe size={16} />, label: "Platforms" }
  ];

  return (
    <section id="use-cases" className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative">
        
        {/* Left Side: Illustration */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          {/* mix-blend-multiply seamlessly removes the white background of the image */}
          <img 
            src="/last_section_illustration.png" 
            alt="Built for Everyone Illustration" 
            className="relative z-10 w-full max-w-[500px] h-auto mix-blend-multiply" 
          />
        </div>
        
        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 space-y-8 relative z-10">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1E1B4B] tight-tracking mb-4">Built for Everyone</h2>
            <p className="text-[16px] text-slate-500 font-medium max-w-lg leading-relaxed">
              Useful for photographers, designers, businesses, educators, and content platforms looking to verify asset authenticity.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            {chips.map((chip, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-transparent border-[1.5px] border-[#E0DDF7] px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#1E1B4B] hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default">
                <span className="text-primary">{chip.icon}</span>
                {chip.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
