import React, { useState, useEffect } from 'react';

const PriceRadar = () => {
  const [activeNodes, setActiveNodes] = useState([]);
  const [currentMedIndex, setCurrentMedIndex] = useState(0);
  
  const medicines = [
    { name: 'Dolo 650', basePrice: 20 },
    { name: 'Augmentin 625', basePrice: 150 },
    { name: 'Allegra 120mg', basePrice: 180 },
    { name: 'Telma 40', basePrice: 90 }
  ];

  const platforms = [
    { name: 'Tata 1mg', factor: 0.9, x: 25, y: 35, color: 'bg-[#F4A522]' },
    { name: 'PharmEasy', factor: 1.1, x: 75, y: 25, color: 'bg-emerald-400' },
    { name: 'Apollo', factor: 1.05, x: 55, y: 75, color: 'bg-rose-500' },
    { name: 'Blinkit', factor: 1.2, x: 15, y: 65, color: 'bg-white' },
    { name: 'Netmeds', factor: 1.0, x: 85, y: 55, color: 'bg-indigo-400' },
  ];

  useEffect(() => {
    const medInterval = setInterval(() => {
      setCurrentMedIndex(prev => (prev + 1) % medicines.length);
    }, 4500);

    const scanInterval = setInterval(() => {
      const luckyIndex = Math.floor(Math.random() * platforms.length);
      setActiveNodes(prev => [...prev.slice(-2), luckyIndex]);
    }, 1200);

    return () => {
      clearInterval(medInterval);
      clearInterval(scanInterval);
    };
  }, []);

  const currentMed = medicines[currentMedIndex];
  const sortedPrices = platforms.map(p => ({ ...p, price: Math.round(currentMed.basePrice * p.factor) }))
                                .sort((a, b) => a.price - b.price);
  const cheapestPlatform = sortedPrices[0];

  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-[#0D221D] to-[#081613] rounded-full border-4 border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] flex items-center justify-center p-12 group transition-all duration-1000">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Concentric Circles */}
      {[0.8, 0.6, 0.4].map(scale => (
        <div key={scale} className="absolute border border-white/5 rounded-full" style={{ width: `${scale*100}%`, height: `${scale*100}%` }}></div>
      ))}
      
      {/* Scanning Beam */}
      <div className="absolute inset-0 animate-spin-slow origin-center z-10">
        <div className="absolute top-1/2 left-1/2 w-1/2 h-40 bg-gradient-to-r from-[#F4A522]/40 to-transparent -translate-y-full origin-left blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-[#F4A522] to-transparent origin-left opacity-30"></div>
      </div>

      {/* Central Hub */}
      <div className="relative z-20 w-32 h-32 bg-[#15342C] rounded-full border border-emerald-500/30 flex flex-col items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.2)] animate-float">
         <div className="text-xs font-black text-[#F4A522] uppercase tracking-[0.2em] mb-1 scale-75">Scanning</div>
         <div className="text-sm font-black text-white text-center px-4 leading-tight animate-pulse">{currentMed.name}</div>
         <div className="absolute -inset-4 border border-dashed border-[#F4A522]/10 rounded-full animate-spin-slow"></div>
      </div>

      {/* Data Nodes */}
      {platforms.map((p, i) => {
        const itemPrice = Math.round(currentMed.basePrice * p.factor);
        const isCheapest = p.name === cheapestPlatform.name;
        
        return (
          <div 
            key={i} 
            className="absolute z-30 transition-all duration-700"
            style={{ top: `${p.y}%`, left: `${p.x}%` }}
          >
            {/* Connection Line to center */}
            {activeNodes.includes(i) && (
              <div className="absolute top-1/2 left-1/2 w-[300px] h-px bg-gradient-to-r from-[#F4A522]/30 to-transparent origin-left rotate-180 -z-10 animate-pulse"></div>
            )}

            {/* Node Point */}
            <div className={`w-4 h-4 rounded-full ${p.color} shadow-[0_0_20px_${p.color}] group-hover:scale-125 transition-transform ${activeNodes.includes(i) ? 'animate-ping' : ''}`}></div>
            
            {/* Label Card */}
            <div className={`mt-4 bg-[#15342C] backdrop-blur-2xl border ${isCheapest ? 'border-emerald-400' : 'border-white/20'} p-3 rounded-2xl shadow-2xl transition-all ${activeNodes.includes(i) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}>
               <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em] leading-none">{p.name}</p>
                  {isCheapest && <span className="bg-emerald-500 text-[6px] font-black text-white px-1.5 py-0.5 rounded-full animate-bounce">BEST DEAL</span>}
               </div>
               <p className="text-base font-black text-white leading-none font-['Outfit']">₹{itemPrice}</p>
            </div>
          </div>
        );
      })}

      {/* Floating Insights Box */}
      <div className="absolute bottom-10 inset-x-10 z-40 px-10">
         <div className="bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/10 shadow-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-3 h-3 bg-[#F4A522] rounded-full animate-ping"></div>
               <div>
                  <p className="text-[#F4A522] text-[8px] font-black uppercase tracking-[0.3em] leading-none mb-1.5">Live Market Analysis</p>
                  <h4 className="text-white text-[11px] font-black font-['Outfit'] tracking-tight">Checking 5 Apps for {currentMed.name}...</h4>
               </div>
            </div>
            <div className="text-right">
               <p className="text-emerald-400 text-[8px] font-black uppercase tracking-[0.3em] leading-none mb-1.5">Cheapest App</p>
               <h4 className="text-white text-[11px] font-black font-['Outfit']">{cheapestPlatform.name}</h4>
            </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}} />
    </div>
  );
};

export default PriceRadar;
