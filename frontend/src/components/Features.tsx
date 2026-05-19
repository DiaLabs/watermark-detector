import React from 'react';

export const Features = () => {
  const features = [
    {
      icon: "/clean_icon_0.png",
      title: "Detect Visible Watermarks",
      desc: "Accurately identify logos, text, and overlays in images."
    },
    {
      icon: "/clean_icon_1.png",
      title: "Find Invisible Watermarks",
      desc: "Our AI reveals hidden patterns and embedded watermarks."
    },
    {
      icon: "/clean_icon_2.png",
      title: "High Accuracy AI Engine",
      desc: "Advanced deep learning model ensures reliable and precise detection."
    },
    {
      icon: "/clean_icon_3.png",
      title: "Detailed Confidence Report",
      desc: "Get confidence scores and heatmaps for better insights."
    }
  ];

  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tight-tracking">
          Smart Detection. Trusted Results.
        </h2>
        <div className="w-24 h-1 bg-success rounded-full mx-auto mt-4 opacity-50 relative">
           <svg className="absolute -top-6 -right-12 text-primary opacity-30" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
           </svg>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          // Define card-specific accent backgrounds matching the extracted icon backgrounds
          const bgColors = [
            'bg-[#f6f5fd] hover:shadow-[0_20px_40px_rgba(92,74,211,0.08)]',
            'bg-[#f2f8f7] hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)]',
            'bg-[#f7f5fe] hover:shadow-[0_20px_40px_rgba(138,126,243,0.08)]',
            'bg-[#f2f8f7] hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)]'
          ];
          
          return (
            <div 
              key={i} 
              className={`${bgColors[i]} rounded-3xl p-8 md:p-10 flex flex-col items-center text-center min-h-[360px] transition-all duration-300 cursor-pointer group hover:-translate-y-2`}
            >
              <div className="w-36 h-36 mb-6 flex items-center justify-center overflow-hidden rounded-2xl">
                <img 
                  src={f.icon} 
                  alt="Feature Icon" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 mix-blend-multiply"
                />
              </div>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed max-w-[220px]">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
