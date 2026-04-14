import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMedicineById, findSubstitutes, getSortedPlatformPrices } from '../services/medicinesDB';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PLATFORM_DISPLAY = {
  'BLINKIT':'Blinkit','PHARMEASY':'PharmEasy',
  'NETMEDS':'Netmeds','APOLLO':'Apollo Pharmacy','TATA_1MG':'Tata 1mg',
};
const PLATFORM_COLORS = {
  'PharmEasy':      {bg:'bg-orange-50',text:'text-orange-600',border:'border-orange-200',icon:'🟠'},
  'Tata 1mg':       {bg:'bg-rose-50',  text:'text-rose-600',  border:'border-rose-200',  icon:'🔴'},
  'Apollo Pharmacy':{bg:'bg-sky-50',   text:'text-sky-600',   border:'border-sky-200',   icon:'🔵'},
  'Netmeds':        {bg:'bg-violet-50',text:'text-violet-600',border:'border-violet-200',icon:'🟣'},
  'Blinkit':        {bg:'bg-yellow-50',text:'text-yellow-700',border:'border-yellow-200',icon:'🟡'},
};

function normalizeAIPrices(aiData) {
  const preds = aiData?.data?.predictions || aiData?.predictions || [];
  if (!preds.length) return null;
  return [...preds].sort((a,b)=>(a.predicted_price||a.price)-(b.predicted_price||b.price))
    .map((p,i)=>({
      platformName: PLATFORM_DISPLAY[p.platform_name]||p.platform_name,
      price: p.predicted_price||p.price||0, mrp: p.base_price||null,
      isCheapest: i===0, confidence: p.confidence,
      discountPct: p.predicted_discount_pct||0, isAIPredicted: true,
    }));
}
function normalizeAISubstitutes(aiData, fallback) {
  const ranked = aiData?.data?.ranked_substitutes||aiData?.ranked_substitutes||[];
  if (!ranked.length) return fallback;
  return ranked.map(s=>({
    id:s.medicine_id,name:s.name,price:s.price,cheapestPrice:s.price,
    savings:s.savings_pct||0,manufacturer:s.manufacturer||'',
    aiRank:s.ai_rank,aiScore:s.ai_score,reason:s.reason,salt:'',
  }));
}

// ─── IN-APP BUY MODAL ───────────────────────────────────────────────────
const BuyNowModal = ({ medicine, platform, onClose, user, navigate }) => {
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState('confirm');
  const [address, setAddress] = useState({name:user?.fullName||'',phone:'',line1:'',city:'',pin:''});
  const [payMethod, setPayMethod] = useState('upi');
  const [placing, setPlacing] = useState(false);
  const total = (platform.price * qty).toFixed(2);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post(`/orders/customer/${user?.userId||1}`, {
        totalAmount: parseFloat(total),
        items:[{medicineId:medicine.id,quantity:qty,platform:platform.platformName,price:platform.price}]
      });
    } catch {}
    setTimeout(()=>{setPlacing(false);setStep('success');},1200);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#15342C]/70 backdrop-blur-md"
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="bg-[#15342C] px-7 py-5 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">
              {step==='confirm'?'Order Summary':step==='address'?'Delivery Address':step==='payment'?'Payment':'Order Placed!'}
            </p>
            <p className="text-white font-black text-lg font-[\'Outfit\']">{medicine.name}</p>
          </div>
          {step!=='success'&&<button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors text-lg font-black">×</button>}
        </div>
        <div className="p-7">
          {step==='confirm'&&(
            <>
              <div className="bg-slate-50 rounded-2xl p-5 mb-5 border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F4A522]/10 flex items-center justify-center text-2xl">{PLATFORM_COLORS[platform.platformName]?.icon||'💊'}</div>
                  <div><p className="font-black text-[#15342C] font-[\'Outfit\']">{platform.platformName}</p><p className="text-slate-500 text-xs">In Stock · Fast Delivery</p></div>
                  {platform.isCheapest&&<span className="ml-auto bg-[#F4A522] text-[#15342C] text-[9px] font-black px-3 py-1 rounded-full uppercase">Best Deal</span>}
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-slate-500 text-sm">Price per strip</span>
                  <span className="font-black text-[#15342C] font-[\'Outfit\']">₹{platform.price}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-[#15342C]">Quantity (strips)</span>
                <div className="flex items-center gap-4 bg-slate-100 rounded-xl px-4 py-2">
                  <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-[#15342C] hover:bg-[#F4A522] transition-colors text-lg">−</button>
                  <span className="font-black text-[#15342C] w-6 text-center">{qty}</span>
                  <button onClick={()=>setQty(q=>Math.min(10,q+1))} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-[#15342C] hover:bg-[#F4A522] transition-colors text-lg">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-[#15342C] text-white rounded-2xl px-5 py-4 mb-6">
                <span className="font-bold">Total Amount</span>
                <span className="font-[\'Outfit\'] font-black text-2xl">₹{total}</span>
              </div>
              {!user
                ?<button onClick={()=>{onClose();navigate('/login');}} className="w-full bg-[#F4A522] text-[#15342C] font-black py-4 rounded-xl font-[\'Outfit\'] uppercase tracking-wide hover:bg-[#e09a1e] transition-colors">Login to Place Order</button>
                :<button onClick={()=>setStep('address')} className="w-full bg-[#F4A522] text-[#15342C] font-black py-4 rounded-xl font-[\'Outfit\'] uppercase tracking-wide hover:bg-[#e09a1e] transition-colors">Continue → Add Address</button>
              }
            </>
          )}
          {step==='address'&&(
            <>
              <div className="space-y-3 mb-6">
                {[{key:'name',label:'Full Name',ph:'Riya Thakur',type:'text'},{key:'phone',label:'Phone',ph:'+91 98765 43210',type:'tel'},{key:'line1',label:'Address Line',ph:'House No, Street, Area',type:'text'},{key:'city',label:'City',ph:'Jaipur',type:'text'},{key:'pin',label:'PIN Code',ph:'302001',type:'text'}].map(f=>(
                  <div key={f.key}>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">{f.label}</label>
                    <input type={f.type} value={address[f.key]} onChange={e=>setAddress(a=>({...a,[f.key]:e.target.value}))} placeholder={f.ph}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 focus:border-[#F4A522] focus:bg-white focus:outline-none font-medium transition-all text-sm"/>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setStep('confirm')} className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-colors">← Back</button>
                <button onClick={()=>setStep('payment')} className="flex-1 py-3.5 rounded-xl bg-[#F4A522] text-[#15342C] font-black text-sm hover:bg-[#e09a1e] transition-colors uppercase tracking-wide">Payment →</button>
              </div>
            </>
          )}
          {step==='payment'&&(
            <>
              <p className="text-slate-500 text-sm mb-5">Choose payment method</p>
              <div className="space-y-3 mb-6">
                {[{id:'upi',label:'UPI / QR Code',icon:'📱',desc:'Google Pay, PhonePe, Paytm'},{id:'cod',label:'Cash on Delivery',icon:'💵',desc:'Pay when medicine arrives'},{id:'card',label:'Credit / Debit Card',icon:'💳',desc:'All major cards accepted'}].map(m=>(
                  <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod===m.id?'border-[#F4A522] bg-amber-50':'border-slate-100 hover:border-slate-300'}`}>
                    <input type="radio" name="pay" value={m.id} checked={payMethod===m.id} onChange={()=>setPayMethod(m.id)} className="hidden"/>
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1"><div className="font-black text-[#15342C] text-sm">{m.label}</div><div className="text-slate-400 text-xs">{m.desc}</div></div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod===m.id?'border-[#F4A522] bg-[#F4A522]':'border-slate-300'}`}>
                      {payMethod===m.id&&<div className="w-2 h-2 rounded-full bg-white"/>}
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-slate-50 rounded-xl px-5 py-3 mb-5 flex justify-between">
                <span className="text-slate-500 text-sm">Total to pay</span>
                <span className="font-[\'Outfit\'] font-black text-[#15342C]">₹{total}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setStep('address')} className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-colors">← Back</button>
                <button onClick={placeOrder} disabled={placing}
                  className="flex-1 py-3.5 rounded-xl bg-[#15342C] text-[#F4A522] font-black text-sm transition-colors uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70">
                  {placing?<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Placing...</>:'Place Order ✓'}
                </button>
              </div>
            </>
          )}
          {step==='success'&&(
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="font-[\'Outfit\'] font-black text-2xl text-[#15342C] mb-2">Order Placed! 🎉</h3>
              <p className="text-slate-500 text-sm mb-2">Your medicine will be delivered in 2–4 days</p>
              <p className="text-[#F4A522] font-black text-sm mb-6">Delivery right to your door — no external app needed!</p>
              <div className="flex gap-3">
                <button onClick={()=>{onClose();navigate('/orders');}} className="flex-1 py-3 rounded-xl bg-[#15342C] text-white font-black text-sm hover:bg-[#1c4a3a] transition-colors">Track Order</button>
                <button onClick={()=>{onClose();navigate('/search');}} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-colors">Shop More</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
const MedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medicine,setMedicine]         = useState(null);
  const [substitutes,setSubstitutes]   = useState([]);
  const [platformPrices,setPlatformPrices] = useState([]);
  const [priceSource,setPriceSource]   = useState('local');
  const [subsSource,setSubsSource]     = useState('local');
  const [loading,setLoading]           = useState(true);
  const [addedToCart,setAddedToCart]   = useState(false);
  const [buyModal,setBuyModal]         = useState(null);

  useEffect(()=>{
    setLoading(true);
    const load = async()=>{
      let med=null,prices=[],source='local';
      try{const r=await api.get(`/medicines/${id}`);med=r.data;}catch{med=getMedicineById(id);}
      if(!med){setLoading(false);return;}
      setMedicine(med);
      try{const r=await api.get(`/ai/price-compare/${id}`);const ap=normalizeAIPrices(r.data);if(ap?.length>0){prices=ap;source='ai';}}catch{}
      if(!prices.length){try{const r=await api.get(`/medicines/${id}/compare-prices`);if(r.data?.length>0){prices=r.data.sort((a,b)=>a.price-b.price).map((p,i)=>({...p,isCheapest:i===0}));source='db';}}catch{}}
      if(!prices.length){prices=getSortedPlatformPrices(med);source='local';}
      setPlatformPrices(prices);setPriceSource(source);
      try{const r=await api.get(`/ai/substitutes/${id}`);setSubstitutes(normalizeAISubstitutes(r.data,findSubstitutes(med)));setSubsSource(r.data?.source==='ai'?'ai':'fallback');}
      catch{setSubstitutes(findSubstitutes(med));setSubsSource('local');}
      setLoading(false);
    };
    load();
  },[id]);

  const addToCart=(med,priceObj=null)=>{
    let cart=[];try{cart=JSON.parse(localStorage.getItem('pharmazone_cart'))||[];}catch{}
    if(!Array.isArray(cart))cart=[];
    const cheapest=platformPrices[0];
    const price=priceObj?.price??cheapest?.price??med.price;
    const platform=priceObj?.platformName??cheapest?.platformName??'PharmaZone Direct';
    const ei=cart.findIndex(i=>i.id===med.id&&i.platform===platform);
    if(ei>-1)cart[ei].quantity+=1;
    else cart.push({id:med.id,name:med.name,genericName:med.genericName||med.salt,price,platform,quantity:1,requiresPrescription:med.requiresPrescription});
    localStorage.setItem('pharmazone_cart',JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedToCart(true);setTimeout(()=>setAddedToCart(false),2000);
  };

  if(loading)return(
    <div className="min-h-[70vh] flex flex-col justify-center items-center bg-[#fbfbfb] gap-4">
      <svg className="animate-spin h-12 w-12 text-[#F4A522]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      <p className="font-bold text-[#15342C] font-[\'Outfit\'] text-lg animate-pulse">Fetching best prices...</p>
    </div>
  );
  if(!medicine)return(
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center">
        <div className="text-5xl mb-4">💊</div>
        <h2 className="text-2xl font-black font-[\'Outfit\'] text-[#15342C] mb-4">Medicine Not Found</h2>
        <button onClick={()=>navigate('/search')} className="bg-[#F4A522] text-[#15342C] font-black px-8 py-3 rounded-full w-full">Back to Search</button>
      </div>
    </div>
  );

  const cheapest=platformPrices[0];
  const savings=cheapest&&medicine.price>cheapest.price?Math.round(((medicine.price-cheapest.price)/medicine.price)*100):0;
  const srcBadge={
    ai:{label:'🤖 AI Predicted',cls:'bg-violet-100 text-violet-700 border-violet-200'},
    db:{label:'🔄 Live from DB',cls:'bg-emerald-100 text-emerald-700 border-emerald-200'},
    local:{label:'📦 Stored Data',cls:'bg-slate-100 text-slate-600 border-slate-200'},
  };

  return(
    <div className="min-h-screen bg-[#fbfbfb] pb-24">
      <section className="bg-[#15342C] pt-32 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F4A522]/10 rounded-full blur-[120px] pointer-events-none"/>
        <div className="max-w-7xl mx-auto relative z-10 text-white">
          <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-bold mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>Back
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                {medicine.requiresPrescription?<span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Rx Required</span>:<span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">OTC</span>}
                {medicine.category&&<span className="bg-white/10 text-white/70 border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{medicine.category}</span>}
                {medicine.manufacturer&&<span className="bg-white/10 text-white/70 border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{medicine.manufacturer}</span>}
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-[\'Outfit\'] mb-3 leading-tight">{medicine.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-[#F4A522] text-lg font-bold">{medicine.salt||medicine.saltComposition}</p>
                {medicine.tabletCount && (
                  <span className="bg-white/10 text-white/50 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-white/10">
                    {medicine.tabletCount}
                  </span>
                )}
              </div>
              {medicine.uses&&<p className="text-emerald-100/60 text-sm mb-8"><span className="font-bold text-white/80">Primary Use:</span> {medicine.uses}</p>}
              <div className="flex items-end gap-6 mb-8">
                <div><p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">MRP</p><p className="text-3xl font-black font-[\'Outfit\'] line-through text-white/40">₹{medicine.price}</p></div>
                {cheapest&&<div><p className="text-[#F4A522] text-xs font-bold uppercase tracking-widest mb-1">Best on {cheapest.platformName}</p><p className="text-6xl font-black font-[\'Outfit\'] text-white">₹{cheapest.price}</p></div>}
                {savings>0&&<div className="bg-[#F4A522] text-[#15342C] px-4 py-2 rounded-2xl font-black text-lg mb-1">Save {savings}%</div>}
              </div>
              <div className="flex gap-4 flex-wrap">
                <button onClick={()=>setBuyModal(cheapest||platformPrices[0])}
                  className="flex items-center gap-3 px-8 py-4 rounded-full font-black transition-all duration-300 font-[\'Outfit\'] uppercase tracking-wide shadow-lg bg-[#F4A522] text-[#15342C] hover:bg-[#F39C12] hover:-translate-y-1 shadow-[#F4A522]/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"/></svg>
                  Buy Now ₹{cheapest?.price||medicine.price}
                </button>
                <button onClick={()=>addToCart(medicine)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full font-black transition-all duration-300 font-[\'Outfit\'] uppercase tracking-wide border-2 ${addedToCart?'border-emerald-400 bg-emerald-500/10 text-emerald-300':'border-white/20 text-white hover:border-[#F4A522] hover:text-[#F4A522]'}`}>
                  {addedToCart?'✓ Added to Cart':'+ Add to Cart'}
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#F4A522] mb-6">Salt Composition</h3>
                <div className="space-y-4">
                  {(medicine.salt||medicine.saltComposition||'').split('+').map((s,i)=>(
                    <div key={i} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-[#F4A522]/20 text-[#F4A522] flex items-center justify-center font-black text-lg">{i+1}</div>
                      <div><p className="font-bold text-white font-[\'Outfit\']">{s.trim()}</p><p className="text-white/40 text-xs">Active Ingredient</p></div>
                    </div>
                  ))}
                </div>
                {medicine.saltAnalysis&&<div className="mt-6 pt-6 border-t border-white/10"><p className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">🧪 Detailed Analysis</p><p className="text-white/60 text-sm leading-relaxed">{medicine.saltAnalysis}</p></div>}
                {medicine.sideEffects&&<div className="mt-6 pt-6 border-t border-white/10"><p className="text-xs font-black uppercase tracking-widest text-rose-400 mb-2">⚠️ Safety Advice</p><p className="text-white/60 text-sm leading-relaxed">{medicine.sideEffects}. Consult doctor immediately if symptoms persist.</p></div>}
                <div className="mt-6 pt-6 border-t border-white/10 text-[10px] text-white/30 italic">
                  *Unit price shown per {medicine.tabletCount || 'strip'}. Data last updated today 6:00 AM.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full left-0 translate-y-[1px]">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto"><path d="M0 0C360 80 1080 80 1440 0V100H0V0Z" fill="#fbfbfb"/></svg>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-20 relative z-20 mb-16">
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-12 h-fit">
          <div className="flex items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <div><h2 className="text-2xl font-black text-[#15342C] font-[\'Outfit\']">Price Comparison</h2><p className="text-slate-400 text-sm">Cheapest first · Unit: {medicine.tabletCount || '1 Strip'}</p></div>
            </div>
            <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${srcBadge[priceSource].cls}`}>{srcBadge[priceSource].label}</span>
          </div>
          {platformPrices.length===0?(
            <div className="text-center py-12 text-slate-400"><p className="text-4xl mb-3">🔍</p><p className="font-bold">No platform prices available yet</p></div>
          ):(
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {platformPrices.map((p,idx)=>{
                  const colors=PLATFORM_COLORS[p.platformName]||{bg:'bg-slate-50',text:'text-slate-600',border:'border-slate-200',icon:'💊'};
                  const discPct=p.discountPct||(p.mrp&&p.price<p.mrp?Math.round((1-p.price/p.mrp)*100):0);
                  return(
                    <div key={idx} className={`relative rounded-2xl border-2 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group ${p.isCheapest?'border-[#F4A522] shadow-[0_8px_30px_rgba(244,165,34,0.2)]':'border-slate-100'}`}>
                      {p.isCheapest&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F4A522] text-[#15342C] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">🏆 Best Price</div>}
                      {p.isAIPredicted&&<div className="absolute -top-2.5 right-3 bg-violet-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">AI</div>}
                      <div>
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-4 text-xl`}>{colors.icon}</div>
                        <p className="font-bold text-[#15342C] text-sm font-[\'Outfit\'] mb-1">{p.platformName}</p>
                        {discPct>0&&<span className={`text-[10px] font-black ${colors.text} uppercase tracking-widest`}>{discPct}% off MRP</span>}
                        {p.confidence&&<div className="mt-1 text-[10px] text-slate-400">Confidence: {Math.round(p.confidence*100)}%</div>}
                        <div className="flex items-end gap-2 mt-3 mb-4">
                          <span className={`text-3xl font-black font-[\'Outfit\'] ${p.isCheapest?'text-[#F4A522]':'text-[#15342C]'}`}>₹{p.price}</span>
                          {p.mrp&&p.mrp>p.price&&<span className="text-xs text-slate-400 line-through mb-1">₹{p.mrp}</span>}
                        </div>
                      </div>
                      <button onClick={()=>setBuyModal(p)} className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${p.isCheapest?'bg-[#15342C] text-[#F4A522] group-hover:bg-[#F4A522] group-hover:text-[#15342C]':'bg-slate-100 text-slate-600 group-hover:bg-[#15342C] group-hover:text-white'}`}>
                        Order Here →
                      </button>
                    </div>
                  );
                })}
              </div>
              {cheapest&&<div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex items-start gap-4">
                <span className="text-2xl shrink-0">💡</span>
                <div><p className="font-black text-emerald-800 text-sm">PharmaZone Tip</p><p className="text-emerald-700 text-sm mt-0.5">Order directly here — medicines delivered to your door. No need to visit any other website!{cheapest.platformName&&<span className="font-bold"> {cheapest.platformName} is cheapest at ₹{cheapest.price} right now.</span>}</p></div>
              </div>}
            </>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 p-8 h-fit">
          <h3 className="text-lg font-black text-[#15342C] font-[\'Outfit\'] mb-6 flex items-center gap-2">
            <span className="text-emerald-500">ℹ️</span> Vital Information
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F4A522] mb-2">How it works</p>
              <p className="text-slate-500 text-sm leading-relaxed">{medicine.saltAnalysis || "Take exactly as directed by your physician. Do not crush or chew tablets unless advised."}</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Safety Warning</p>
              <p className="text-rose-800 text-xs leading-relaxed font-semibold">Alcohol consumption is highly unsafe while taking this medicine. May cause dizziness.</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#15342C] mb-4">Common FAQs</p>
              <div className="space-y-4">
                <details className="group border-b border-slate-100 pb-3">
                  <summary className="list-none text-xs font-bold text-slate-700 cursor-pointer flex justify-between items-center group-open:text-[#F4A522]">
                    Is it safe during pregnancy?
                    <span className="group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Please consult your doctor. Studies show potential risk, medical supervision is required.</p>
                </details>
                <details className="group border-b border-slate-100 pb-3">
                  <summary className="list-none text-xs font-bold text-slate-700 cursor-pointer flex justify-between items-center group-open:text-[#F4A522]">
                    What if I miss a dose?
                    <span className="group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Take it as soon as possible. If it\'s time for next dose, skip the missed one. Do not double dose.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {substitutes.length>0&&(
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <div><h2 className="text-3xl font-black text-[#15342C] font-[\'Outfit\']">Generic Alternatives</h2><p className="text-slate-400 text-sm">Same active salt · Clinically identical · {subsSource==='ai'?'🤖 AI-ranked':'📦 Sorted by price'}</p></div>
            <div className="ml-auto bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{substitutes.length} Found</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {substitutes.map((sub,idx)=>(
              <div key={sub.id||idx} onClick={()=>navigate(`/medicine/${sub.id}`)}
                className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-teal-400 hover:shadow-[0_15px_40px_rgba(20,184,166,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    {sub.savings>0?<span className="bg-teal-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Save {Math.round(sub.savings)}%</span>:<span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Same Salt</span>}
                    {sub.aiRank&&<span className="text-[10px] font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">AI #{sub.aiRank}</span>}
                  </div>
                  <h3 className="text-lg font-black text-[#15342C] font-[\'Outfit\'] mb-1">{sub.name}</h3>
                  {sub.salt&&<p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wide">{sub.salt}</p>}
                  {sub.manufacturer&&<p className="text-xs text-slate-400 mb-2">{sub.manufacturer}</p>}
                  {sub.reason&&<p className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg mb-3 font-medium">{sub.reason}</p>}
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-[#15342C] font-[\'Outfit\']">₹{sub.cheapestPrice||sub.price}</span>
                    {sub.savings>0&&<span className="text-sm text-slate-400 line-through mb-1">₹{medicine.price}</span>}
                  </div>
                </div>
                <button className="mt-5 w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-teal-500 group-hover:text-white text-slate-600 text-xs font-black uppercase tracking-widest transition-all duration-300 border border-slate-100 group-hover:border-teal-500">View & Order →</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {buyModal&&<BuyNowModal medicine={medicine} platform={buyModal} onClose={()=>setBuyModal(null)} user={user} navigate={navigate}/>}
    </div>
  );
};

export default MedicineDetail;
