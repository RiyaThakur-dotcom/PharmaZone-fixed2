import React, { useState, useMemo } from 'react';

/* ─────────────────────────────────────────────────────────
   PriceCompareTable.jsx
   New feature: "How many tablets can I get in ₹X?" calculator
   - Budget slider + custom input
   - Per-platform tablet count displayed inline
   - Best value highlighted automatically
───────────────────────────────────────────────────────── */

const PLATFORM_ICONS = {
  '1mg': '🔵',
  'PharmEasy': '🟢',
  'Netmeds': '🟣',
  'Apollo247': '🔴',
  'MedPlus': '🟠',
};

const PriceCompareTable = ({ comparisons, predictions, showAi }) => {
  const [budget, setBudget] = useState(200);
  const [budgetInput, setBudgetInput] = useState('200');
  const [showCalc, setShowCalc] = useState(true);
  const [perUnit, setPerUnit] = useState(10); // tablets per strip

  if (!comparisons || comparisons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-slate-400 font-medium">No price comparison data available.</p>
      </div>
    );
  }

  const sorted = useMemo(() =>
    [...comparisons].sort((a, b) => {
      const priceA = a.discountedPrice ?? a.price ?? Infinity;
      const priceB = b.discountedPrice ?? b.price ?? Infinity;
      return priceA - priceB;
    }),
    [comparisons]
  );

  const cheapestPrice = sorted[0]?.discountedPrice ?? sorted[0]?.price ?? 0;

  /* Tablets calculation */
  const getTablets = (comp) => {
    const stripPrice = comp.discountedPrice ?? comp.price;
    if (!stripPrice || stripPrice <= 0 || !budget) return 0;
    const strips = Math.floor(budget / stripPrice);
    return strips * perUnit;
  };

  const maxTablets = useMemo(() =>
    Math.max(...sorted.map(c => getTablets(c)), 1),
    [sorted, budget, perUnit]
  );

  const handleBudgetInput = (val) => {
    setBudgetInput(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0 && num <= 10000) setBudget(num);
  };

  return (
    <div className="space-y-5">

      {/* ── TABLET CALCULATOR CARD ── */}
      <div className="bg-gradient-to-br from-[#15342C] to-[#1c4a3a] rounded-[1.75rem] p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F4A522] rounded-xl flex items-center justify-center text-[#15342C] font-black text-lg">💊</div>
            <div>
              <h4 className="font-['Outfit'] font-black text-base">Tablet Budget Calculator</h4>
              <p className="text-white/50 text-xs">How many tablets can you get in your budget?</p>
            </div>
          </div>
          <button
            onClick={() => setShowCalc(v => !v)}
            className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            {showCalc ? 'Hide ↑' : 'Show ↓'}
          </button>
        </div>

        {showCalc && (
          <>
            {/* Budget + Unit controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block mb-2">Your Budget</label>
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
                  <span className="text-[#F4A522] font-black text-lg">₹</span>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={e => handleBudgetInput(e.target.value)}
                    className="bg-transparent text-white font-black text-xl w-full focus:outline-none placeholder:text-white/30"
                    placeholder="200"
                    min={1} max={10000}
                  />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-[10px] font-black uppercase tracking-widest block mb-2">Tablets per Strip</label>
                <div className="flex gap-2">
                  {[10, 15, 20, 30].map(n => (
                    <button
                      key={n}
                      onClick={() => setPerUnit(n)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${perUnit === n ? 'bg-[#F4A522] text-[#15342C]' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget slider */}
            <div className="mb-5">
              <input
                type="range" min={50} max={2000} step={50} value={Math.min(budget, 2000)}
                onChange={e => { setBudget(Number(e.target.value)); setBudgetInput(String(e.target.value)); }}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{ background: `linear-gradient(to right, #F4A522 ${Math.min(budget,2000)/2000*100}%, rgba(255,255,255,0.15) 0%)` }}
              />
              <div className="flex justify-between text-white/30 text-[10px] mt-1">
                <span>₹50</span><span>₹500</span><span>₹1000</span><span>₹2000</span>
              </div>
            </div>

            {/* Per-platform tablet counts */}
            <div className="space-y-2.5">
              {sorted.map((comp, i) => {
                const tablets = getTablets(comp);
                const pct = maxTablets > 0 ? Math.round((tablets / maxTablets) * 100) : 0;
                const isBest = i === 0;
                const stripPrice = comp.discountedPrice ?? comp.price;
                const strips = stripPrice > 0 ? Math.floor(budget / stripPrice) : 0;

                return (
                  <div key={comp.id || comp.platformName}
                    className={`rounded-xl px-4 py-3 ${isBest ? 'bg-[#F4A522]/15 border border-[#F4A522]/30' : 'bg-white/5 border border-white/8'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{PLATFORM_ICONS[comp.platformName] || '🏪'}</span>
                        <span className={`font-bold text-sm ${isBest ? 'text-[#F4A522]' : 'text-white/80'}`}>
                          {comp.platformName}
                        </span>
                        {isBest && (
                          <span className="bg-[#F4A522] text-[#15342C] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Best Value
                          </span>
                        )}
                        {!comp.inStock && (
                          <span className="bg-rose-500/20 text-rose-300 text-[9px] font-black px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`font-['Outfit'] font-black text-lg ${isBest ? 'text-[#F4A522]' : 'text-white'}`}>
                          {tablets.toLocaleString()} tabs
                        </span>
                        <div className="text-white/35 text-[10px]">
                          {strips} strip{strips !== 1 ? 's' : ''} × {perUnit} tabs
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isBest ? 'bg-[#F4A522]' : 'bg-white/30'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-white/30 text-[10px] mt-1">
                      ₹{stripPrice?.toFixed(2)} per strip · {pct}% of max possible
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary insight */}
            {budget > 0 && sorted[0] && (
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-center">
                <span className="text-emerald-300 text-sm font-medium">
                  💡 With <span className="font-black text-white">₹{budget}</span> on{' '}
                  <span className="font-black text-[#F4A522]">{sorted[0].platformName}</span>, you get{' '}
                  <span className="font-black text-white">{getTablets(sorted[0]).toLocaleString()} tablets</span>{' '}
                  — {sorted.length > 1 ? `vs only ${getTablets(sorted[sorted.length-1])} on the most expensive platform` : ''}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── PRICE TABLE ── */}
      <div className="bg-white rounded-[1.75rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-['Outfit'] font-black text-[#15342C] text-sm uppercase tracking-widest">
            Price Comparison
          </h4>
          <span className="text-slate-400 text-xs font-bold">{sorted.length} platforms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</th>
                <th className="px-4 py-3.5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Base</th>
                <th className="px-4 py-3.5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount</th>
                <th className="px-4 py-3.5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Final</th>
                <th className="px-4 py-3.5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">In ₹{budget}</th>
                {showAi && <th className="px-4 py-3.5 text-right text-[10px] font-black text-violet-400 uppercase tracking-widest">AI Forecast</th>}
                <th className="px-6 py-3.5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((comp, i) => {
                const prediction = predictions?.find(p => p.platform_name === comp.platformName);
                const finalPrice = comp.discountedPrice ?? comp.price;
                const tablets = getTablets(comp);
                const isBest = i === 0;
                const savings = cheapestPrice > 0 && finalPrice
                  ? ((finalPrice - cheapestPrice) / finalPrice * 100).toFixed(0)
                  : 0;

                return (
                  <tr key={comp.id || comp.platformName}
                    className={`border-b border-slate-50 last:border-0 transition-colors ${isBest ? 'bg-amber-50/60' : 'hover:bg-slate-50/80'}`}>

                    {/* Platform */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{PLATFORM_ICONS[comp.platformName] || '🏪'}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#15342C] text-sm">{comp.platformName}</span>
                            {isBest && (
                              <span className="bg-[#F4A522] text-[#15342C] text-[9px] font-black px-2 py-0.5 rounded-full">
                                Cheapest
                              </span>
                            )}
                            {!comp.inStock && (
                              <span className="bg-rose-100 text-rose-500 text-[9px] font-black px-2 py-0.5 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </div>
                          {!isBest && finalPrice && cheapestPrice > 0 && (
                            <div className="text-rose-400 text-[10px] font-bold mt-0.5">
                              +₹{(finalPrice - cheapestPrice).toFixed(2)} vs cheapest
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Delivery */}
                    <td className="px-4 py-4">
                      <div className="text-slate-600 text-sm font-medium">{comp.deliveryDays} day{comp.deliveryDays !== 1 ? 's' : ''}</div>
                      {comp.deliveryNote && (
                        <div className="text-slate-400 text-[11px] mt-0.5">{comp.deliveryNote}</div>
                      )}
                    </td>

                    {/* Base price */}
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm ${comp.discountPercent > 0 ? 'line-through text-slate-400' : 'font-bold text-slate-700'}`}>
                        ₹{comp.price?.toFixed(2)}
                      </span>
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-4 text-right">
                      {comp.discountPercent > 0 ? (
                        <span className="bg-emerald-50 text-emerald-600 font-black text-xs px-2.5 py-1 rounded-lg">
                          {comp.discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Final price */}
                    <td className="px-4 py-4 text-right">
                      <span className={`font-['Outfit'] font-black text-lg ${isBest ? 'text-[#F4A522]' : 'text-[#15342C]'}`}>
                        ₹{finalPrice?.toFixed(2)}
                      </span>
                    </td>

                    {/* Tablet count for budget */}
                    <td className="px-4 py-4 text-right">
                      <div className={`font-['Outfit'] font-black text-base ${isBest ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {tablets > 0 ? `${tablets.toLocaleString()} tabs` : <span className="text-slate-300 text-sm">—</span>}
                      </div>
                      {tablets > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {Math.floor(budget / (finalPrice ?? 1))} strips
                        </div>
                      )}
                    </td>

                    {/* AI Prediction */}
                    {showAi && (
                      <td className="px-4 py-4 text-right bg-violet-50/30">
                        {prediction ? (
                          <div>
                            <div className="font-['Outfit'] font-bold text-violet-600 text-sm">
                              ₹{prediction.predicted_price?.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {prediction.confidence}% conf.
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-sm">N/A</span>
                        )}
                      </td>
                    )}

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <a
                        href={comp.buyUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => !comp.inStock && e.preventDefault()}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          comp.inStock
                            ? isBest
                              ? 'bg-[#F4A522] text-[#15342C] hover:bg-[#e09a1e] shadow-[0_4px_12px_rgba(244,165,34,0.3)]'
                              : 'bg-[#15342C] text-white hover:bg-[#1c4a3a]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}>
                        {comp.inStock ? (
                          <>
                            Buy Now
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        ) : 'Check Site'}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <span className="text-slate-400 text-[10px]">💡</span>
          <span className="text-slate-400 text-[10px]">
            Prices updated every 6 hours. "In ₹{budget}" column shows tablets you can buy at your set budget ({perUnit} tabs/strip).
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceCompareTable;
