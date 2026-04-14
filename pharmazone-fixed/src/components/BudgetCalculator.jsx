import React, { useState, useEffect } from 'react';

const MEDICINE_DATA = {
  'Dolo 650mg': { pricePerTab: 2.1, genericPrice: 0.42, salt: 'Paracetamol 650mg' },
  'Augmentin 625 Duo': { pricePerTab: 18.2, genericPrice: 4.8, salt: 'Amoxycillin + Clavulanic Acid' },
  'Allegra 120mg': { pricePerTab: 12.5, genericPrice: 2.9, salt: 'Fexofenadine 120mg' },
  'Pantop 40mg': { pricePerTab: 9.8, genericPrice: 1.8, salt: 'Pantoprazole 40mg' },
  'Crocin 650': { pricePerTab: 1.9, genericPrice: 0.38, salt: 'Paracetamol 650mg' },
  'Combiflam': { pricePerTab: 2.5, genericPrice: 0.60, salt: 'Ibuprofen + Paracetamol' },
  'Telma 40': { pricePerTab: 8.5, genericPrice: 1.4, salt: 'Telmisartan 40mg' },
  'Glycomet 500': { pricePerTab: 4.2, genericPrice: 0.85, salt: 'Metformin 500mg' },
  'Thyronorm 50': { pricePerTab: 5.6, genericPrice: 1.1, salt: 'Thyroxine 50mcg' },
  'Azithral 500': { pricePerTab: 28.0, genericPrice: 6.5, salt: 'Azithromycin 500mg' },
  'Shelcal 500': { pricePerTab: 7.2, genericPrice: 1.8, salt: 'Calcium + Vit D3' },
  'Amlokind 5': { pricePerTab: 3.8, genericPrice: 0.65, salt: 'Amlodipine 5mg' },
};

const BudgetCalculator = ({ onClose }) => {
  const [budget, setBudget] = useState(200);
  const [med, setMed] = useState('Dolo 650');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const data = MEDICINE_DATA[med];
    if (data) {
      setResults({
        branded: Math.floor(budget / data.pricePerTab),
        generic: Math.floor(budget / data.genericPrice),
        savings: Math.floor(budget * 0.75), // Est savings
        salt: data.salt
      });
    }
  }, [budget, med]);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-[#15342C]/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 font-['Outfit']">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F4A522] via-emerald-500 to-[#F4A522]"></div>
        
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-[#15342C]">Smart Budget Planner</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">See how much your money can buy</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Monthly Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#15342C] font-black text-lg">₹</span>
                <input 
                  type="number" 
                  value={budget} 
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[#15342C] focus:outline-none focus:ring-2 focus:ring-[#F4A522]/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Medicine</label>
              <select 
                value={med} 
                onChange={e => setMed(e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#15342C] focus:outline-none appearance-none">
                {Object.keys(MEDICINE_DATA).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="bg-[#15342C] rounded-[2rem] p-8 text-center relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <p className="text-[#F4A522] text-[10px] font-black uppercase tracking-[0.2em] mb-4">PharmaZone Optimization</p>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-white/40 text-[9px] font-black uppercase mb-1">Branded</p>
                    <p className="text-3xl font-black text-white/50">{results.branded}</p>
                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Tablets</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center scale-110">
                    <p className="text-emerald-400 text-[9px] font-black uppercase mb-1">Generic</p>
                    <p className="text-5xl font-black text-emerald-500">{results.generic}</p>
                    <p className="text-[9px] text-emerald-400/60 font-black uppercase tracking-widest">Tablets</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-[#F4A522] rounded-full animate-ping" />
                  <p className="text-white/80 text-xs font-medium">Extra <span className="text-[#F4A522] font-black">{results.generic - results.branded} tablets</span> found for the same ₹{budget}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-amber-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F4A522] rounded-xl flex items-center justify-center text-white shadow-lg">💡</div>
                  <div>
                    <p className="text-xs font-bold text-[#15342C]">Estimated Monthly Savings</p>
                    <p className="text-[10px] text-slate-500">Based on salt: {results.salt}</p>
                  </div>
                </div>
                <p className="text-xl font-black text-[#15342C]">₹{results.savings}</p>
              </div>
            </div>
          )}
          
          <p className="text-[10px] text-slate-400 text-center mt-8 italic">*Calculation based on current market average prices. Actual prices may vary by platform.</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
