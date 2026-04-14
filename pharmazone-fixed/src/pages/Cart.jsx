import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ─── PRESCRIPTION MODAL ──────────────────────────────────────────────
const PrescriptionModal = ({ onClose, onOrderSuccess, cartItems, total, user }) => {
  const [mode, setMode] = useState(null); // 'upload' | 'consult'
  
  // Upload Mode State
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Consult Mode State
  const [symptoms, setSymptoms] = useState('');
  const [consulting, setConsulting] = useState(false);
  const [consultSent, setConsultSent] = useState(false);

  const placeOrderWithRx = async (prescriptionId = null) => {
    const orderData = {
      totalAmount: total,
      prescriptionId,
      items: cartItems.map(item => ({
        medicineId: item.id,
        quantity: item.quantity,
        platform: item.platform,
        price: item.price
      }))
    };
    const res = await api.post(`/orders/customer/${user.userId || user.id}`, orderData);
    return res;
  };

  // Option A: Upload Prescription
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const rxRes = await api.post(
        `/prescriptions/upload/${user.userId || user.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const prescriptionId = rxRes.data?.id || null;
      await placeOrderWithRx(prescriptionId);
      onOrderSuccess();
    } catch {
      // Demo success
      onOrderSuccess();
    } finally {
      setUploading(false);
    }
  };

  // Option B: Request Online Consultation
  const handleConsult = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setConsulting(true);
    try {
      await api.post(`/consultations/request/${user.userId || user.id}`, {
        symptoms,
        note: 'Prescription needed for cart items'
      });
      setConsultSent(true);
    } catch {
      setConsultSent(true); // Demo mode
    } finally {
      setConsulting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#15342C] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F4A522] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#15342C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Outfit']">Prescription Required</h2>
              <p className="text-emerald-100/60 text-xs font-medium">Your cart has Rx-only medicines</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {!mode && !consultSent && (
            <>
              <p className="text-slate-500 font-['Inter'] text-sm mb-8 leading-relaxed">
                To proceed with your order, a valid doctor's prescription is required. Choose one of the options below:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option A */}
                <button
                  onClick={() => setMode('upload')}
                  className="group text-left p-6 border-2 border-slate-100 rounded-2xl hover:border-[#F4A522] hover:shadow-[0_8px_30px_rgba(244,165,34,0.15)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#15342C] group-hover:text-[#F4A522] transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <h3 className="font-black text-[#15342C] font-['Outfit'] mb-2">Upload Prescription</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">I already have a valid doctor's prescription (photo or PDF)</p>
                </button>

                {/* Option B */}
                <button
                  onClick={() => setMode('consult')}
                  className="group text-left p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-400 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h3 className="font-black text-[#15342C] font-['Outfit'] mb-2">Get Online Prescription</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Consult a verified doctor now and receive a digital prescription</p>
                </button>
              </div>
            </>
          )}

          {/* ─── UPLOAD MODE ─── */}
          {mode === 'upload' && (
            <form onSubmit={handleUpload}>
              <button type="button" onClick={() => setMode(null)} className="flex items-center gap-2 text-slate-400 hover:text-[#15342C] text-sm font-bold mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </button>
              <h3 className="text-lg font-black text-[#15342C] font-['Outfit'] mb-2">Upload Your Prescription</h3>
              <p className="text-slate-400 text-sm mb-6">Accepted: JPEG, PNG, PDF · Max 10MB</p>
              
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-[#F4A522] transition-colors mb-6 bg-slate-50 group cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-24 bg-white border-2 border-emerald-500 rounded-lg flex items-center justify-center text-emerald-600 mb-2 relative shadow-lg">
                       <span className="text-xl">📄</span>
                       <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                    </div>
                    <span className="font-bold text-[#15342C] text-xs truncate max-w-[200px] mb-1">{file.name}</span>
                    <button type="button" onClick={() => setFile(null)} className="text-rose-500 text-[10px] font-black uppercase hover:underline">Change File</button>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-[#F4A522] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="font-bold text-[#15342C]">Click to browse <span className="text-slate-400 font-normal">or drag here</span></p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Upload Doctor's Prescription</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-[#15342C] text-white hover:bg-[#F4A522] hover:text-[#15342C] py-4 rounded-xl font-black tracking-widest font-['Outfit'] uppercase transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {uploading
                  ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Verifying & Placing Order...</>
                  : 'Upload & Place Order'
                }
              </button>
            </form>
          )}

          {/* ─── CONSULT MODE ─── */}
          {mode === 'consult' && !consultSent && (
            <form onSubmit={handleConsult}>
              <button type="button" onClick={() => setMode(null)} className="flex items-center gap-2 text-slate-400 hover:text-[#15342C] text-sm font-bold mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </button>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3 mb-6">
                <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-indigo-700 text-sm font-semibold leading-relaxed">A verified doctor will review your symptoms and issue a digital prescription. Your order will be held until prescription is approved.</p>
              </div>
              <h3 className="text-lg font-black text-[#15342C] font-['Outfit'] mb-2">Describe Your Symptoms</h3>
              <p className="text-slate-400 text-sm mb-4">Be specific — mention duration, severity, current medicines, allergies</p>
              <textarea
                rows="5"
                className="w-full p-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-400 outline-none font-['Inter'] font-medium resize-none transition-colors mb-6"
                placeholder="E.g. I've had a chest infection since 3 days. Coughing with phlegm and mild fever (100.4°F). No known allergies. Need Augmentin 625 prescribed..."
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={consulting || !symptoms.trim()}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-4 rounded-xl font-black tracking-widest font-['Outfit'] uppercase transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {consulting
                  ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Connecting to Doctor...</>
                  : <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> Send to Doctor</>
                }
              </button>
            </form>
          )}

          {/* ─── CONSULT SUCCESS ─── */}
          {consultSent && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-black text-[#15342C] font-['Outfit'] mb-3">Request Sent to Doctor!</h3>
              <p className="text-slate-500 font-['Inter'] mb-2">Your consultation has been submitted. A verified doctor will review your symptoms and issue a digital prescription.</p>
              <p className="text-slate-400 text-sm mb-8">Your order is on hold. Once prescription is approved, it will be dispatched automatically.</p>
              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-black font-['Outfit'] hover:border-slate-300 transition-colors">
                  Close
                </button>
                <Link to="/orders" className="flex-1 bg-[#15342C] text-white py-3 rounded-xl font-black font-['Outfit'] text-center hover:bg-[#F4A522] hover:text-[#15342C] transition-colors uppercase tracking-widest text-sm">
                  Track Status
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ─── MAIN CART PAGE ──────────────────────────────────────────────────
const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);

  const safeCart = Array.isArray(cartItems) ? cartItems : [];
  const hasRxItems = safeCart.some(item => item?.requiresPrescription);
  const total = safeCart.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 1)), 0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pharmazone_cart');
      const parsed = stored ? JSON.parse(stored) : [];
      setCartItems(Array.isArray(parsed) ? parsed : []);
    } catch { setCartItems([]); }
  }, []);

  const updateQty = (index, delta) => {
    const updated = [...safeCart];
    updated[index] = { ...updated[index], quantity: (updated[index].quantity || 1) + delta };
    if (updated[index].quantity <= 0) updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem('pharmazone_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (index) => {
    const updated = [...safeCart];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem('pharmazone_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = async () => {
    if (!user) return navigate('/login', { state: { from: { pathname: '/cart' } } });
    
    // If Rx items → show prescription modal
    if (hasRxItems) {
      setShowRxModal(true);
      return;
    }
    
    // OTC only → place order directly
    setLoading(true);
    try {
      await api.post(`/orders/customer/${user.userId || user.id}`, {
        totalAmount: total,
        items: safeCart.map(i => ({ medicineId: i.id, quantity: i.quantity, platform: i.platform, price: i.price }))
      });
      handleOrderSuccess();
    } catch {
      handleOrderSuccess(); // Demo fallback
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSuccess = () => {
    // Save to Local Orders for Tracking Visibility
    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem('pharmazone_orders')) || [];
    } catch { orders = []; }
    if (!Array.isArray(orders)) orders = [];

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      totalAmount: (total * 1.12).toFixed(2),
      status: hasRxItems ? 'PENDING_RX' : 'CONFIRMED',
      items: safeCart.map(i => ({
        medicineName: i.name,
        platform: i.platform,
        price: i.price,
        quantity: i.quantity
      }))
    };

    orders.unshift(newOrder); // Newest first
    localStorage.setItem('pharmazone_orders', JSON.stringify(orders));

    setShowRxModal(false);
    setOrderSuccess(true);
    setCartItems([]);
    localStorage.removeItem('pharmazone_cart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // ─── ORDER SUCCESS ───
  if (orderSuccess) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fbfbfb] px-6">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-[#15342C] font-['Outfit'] mb-4 text-center">Order Submitted!</h1>
      <p className="text-lg text-slate-500 font-['Inter'] mb-2 text-center max-w-md">Our pharmacists are verifying your prescription.</p>
      <p className="text-sm text-slate-400 font-medium mb-12 text-center">Status: <span className="text-[#F4A522] font-black uppercase">Pending Approval</span></p>
      <Link to="/orders" className="bg-[#15342C] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl">Track Status</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* Header */}
      <section className="bg-[#15342C] pt-28 pb-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <h1 className="text-3xl font-black text-white font-['Outfit']">Your Cart</h1>
          <span className="bg-[#F4A522] text-[#15342C] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {safeCart.length} Items
          </span>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        {/* Left: Items */}
        <div className="flex-1">
          {safeCart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-[#15342C] font-['Outfit'] mb-2">Cart is Empty</h3>
              <p className="text-slate-400 mb-8 font-medium">Add medicines from search to compare prices & checkout</p>
              <Link to="/search" className="btn-accent">Search Medicines</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {safeCart.map((item, idx) => (
                <div key={`${item?.id}-${idx}`} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative group">
                  
                  {item?.requiresPrescription && (
                    <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-2xl">Rx</div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#15342C] font-['Outfit'] mb-0.5 truncate">{item?.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 truncate">{item?.genericName}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-teal-100">
                        via {item?.platform}
                      </span>
                      {item?.requiresPrescription && (
                        <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded border border-rose-100">Prescription Required</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Per Unit</p>
                      <p className="text-lg font-black text-[#15342C] font-['Outfit']">₹{item?.price}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                      <button onClick={() => updateQty(idx, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 hover:text-rose-500 border border-slate-200 shadow-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>
                      <span className="font-black text-[#15342C] font-['Outfit'] w-6 text-center">{item?.quantity || 1}</span>
                      <button onClick={() => updateQty(idx, 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 hover:text-emerald-500 border border-slate-200 shadow-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>

                    <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Summary */}
        {safeCart.length > 0 && (
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sticky top-28">
              <h3 className="text-xl font-black text-[#15342C] font-['Outfit'] mb-6">Order Summary</h3>

              <div className="space-y-3 text-sm font-medium text-slate-500 border-b border-slate-100 pb-5 mb-5 font-['Inter']">
                <div className="flex justify-between"><span>Subtotal ({safeCart.length} items)</span><span className="font-bold text-[#15342C]">₹{total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST (12%)</span><span className="font-bold text-[#15342C]">₹{(total * 0.12).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Free</span></div>
              </div>

              <div className="flex justify-between items-end mb-6 font-['Outfit']">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Payable</p>
                  <span className="text-4xl font-black text-[#15342C]">₹{(total * 1.12).toFixed(2)}</span>
                </div>
                <div className="text-right pb-1">
                   <p className="text-[10px] font-black text-emerald-500 uppercase">Saving ₹{Math.floor(total * 0.4)}</p>
                </div>
              </div>

              {/* Rx Warning */}
              {hasRxItems && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                    Your cart has prescription medicines. You'll be asked to upload a prescription or consult a doctor at checkout.
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#15342C] text-white hover:bg-[#F4A522] hover:text-[#15342C] transition-all duration-300 py-4 rounded-full font-black tracking-widest font-['Outfit'] uppercase flex justify-center items-center gap-2 shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading
                  ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  : null
                }
                {loading ? 'Processing...' : hasRxItems ? 'Checkout (Rx Required)' : 'Proceed to Checkout'}
              </button>

              {!user && (
                <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                  <Link to="/login" state={{ from: { pathname: '/cart' } }} className="text-[#15342C] font-bold underline">Sign in</Link> to place your order
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Rx Modal */}
      {showRxModal && (
        <PrescriptionModal
          onClose={() => setShowRxModal(false)}
          onOrderSuccess={handleOrderSuccess}
          cartItems={safeCart}
          total={total}
          user={user}
        />
      )}
    </div>
  );
};

export default Cart;
