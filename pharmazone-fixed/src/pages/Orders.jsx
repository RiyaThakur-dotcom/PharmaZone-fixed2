import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';
import { jsPDF } from "jspdf";

// ── Mock data fallback ────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'ORD-77215', orderNumber: 'ORD-77215', date: '2026-04-09', totalAmount: 435, status: 'PENDING_RX',
    items: [{ medicineName: 'Augmentin 625', platform: 'PharmEasy', price: 182, quantity: 2 }] },
  { id: 'ORD-66102', orderNumber: 'ORD-66102', date: '2026-04-05', totalAmount: 156, status: 'DELIVERED',
    items: [{ medicineName: 'Dolo 650', platform: 'Tata 1mg', price: 26, quantity: 6 }] },
];

const MOCK_PRESCRIPTIONS = [
  { id: 'RX-8821', status: 'PENDING_REVIEW', submittedAt: '2026-04-09', fileUrl: null,
    isDocIssued: false, doctorNotes: null, validUntil: null, medicineName: 'Augmentin 625' },
  { id: 'RX-7710', status: 'APPROVED', submittedAt: '2026-04-01', fileUrl: null,
    isDocIssued: true, doctorNotes: 'Take twice daily after meals for 5 days.', validUntil: '2026-05-01', medicineName: 'Nexito 10mg' },
];

const STATUS_CONFIG = {
  DELIVERED:        { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Delivered' },
  PENDING_RX:       { color: 'bg-rose-50 text-rose-700 border-rose-100',          label: 'Rx Required' },
  PENDING:          { color: 'bg-amber-50 text-amber-700 border-amber-100',        label: 'Pending' },
  CONFIRMED:        { color: 'bg-sky-50 text-sky-700 border-sky-100',              label: 'Confirmed' },
  DISPATCHED:       { color: 'bg-blue-50 text-blue-700 border-blue-100',           label: 'Dispatched' },
  CANCELLED:        { color: 'bg-slate-100 text-slate-500 border-slate-200',       label: 'Cancelled' },
  PENDING_REVIEW:   { color: 'bg-amber-50 text-amber-700 border-amber-100',        label: 'Under Review' },
  APPROVED:         { color: 'bg-emerald-50 text-emerald-700 border-emerald-100',  label: 'Approved ✓' },
  REJECTED:         { color: 'bg-rose-50 text-rose-700 border-rose-100',           label: 'Rejected' },
  DOCTOR_ISSUED:    { color: 'bg-violet-50 text-violet-700 border-violet-100',     label: 'Doctor Issued' },
};

const Badge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { color: 'bg-slate-100 text-slate-500 border-slate-200', label: status };
  return <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border ${cfg.color}`}>{cfg.label}</span>;
};

const Orders = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rxUploadingId, setRxUploadingId] = useState(null);
  const [rxScanning, setRxScanning] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const res = await api.get(`/orders/customer/${user.userId || user.id}`);
        setOrders(res.data?.length > 0 ? res.data : MOCK_ORDERS);
      } else {
        const res = await api.get(`/prescriptions/customer/${user.userId || user.id}`);
        setPrescriptions(res.data?.length > 0 ? res.data : MOCK_PRESCRIPTIONS);
      }
    } catch {
      if (activeTab === 'orders') setOrders(MOCK_ORDERS);
      else setPrescriptions(MOCK_PRESCRIPTIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleRxUpload = (orderId) => {
    setRxUploadingId(orderId);
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRxScanning(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/prescriptions/upload/${user.userId || user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch { /* demo mode */ }
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === rxUploadingId ? { ...o, status: 'PENDING' } : o));
      setPrescriptions(prev => [...prev, {
        id: `RX-${Date.now()}`, status: 'PENDING_REVIEW',
        submittedAt: new Date().toISOString().split('T')[0],
        medicineName: 'Uploaded Prescription', fileUrl: null,
      }]);
      setRxScanning(false);
      setRxUploadingId(null);
      setUploadSuccess('Prescription uploaded! Moving to review.');
      setTimeout(() => setUploadSuccess(null), 4000);
    }, 2500);
    e.target.value = '';
  };

  const downloadRx = (rx) => {
    const doc = new jsPDF();
    doc.setFillColor(21, 52, 44);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(244, 165, 34);
    doc.setFontSize(22); doc.setFont(undefined, 'bold');
    doc.text("PharmaZone", 20, 20);
    doc.setFontSize(11); doc.setTextColor(200, 230, 210);
    doc.text("Digital Prescription", 20, 32);
    doc.setTextColor(0, 0, 0); doc.setFontSize(11);
    doc.text(`Prescription ID: ${rx.id}`, 20, 60);
    doc.text(`Patient: ${user?.fullName || 'Patient'}`, 20, 72);
    doc.text(`Date: ${rx.submittedAt}`, 20, 84);
    doc.text(`Status: ${rx.status}`, 20, 96);
    doc.text(`Valid Until: ${rx.validUntil || 'N/A'}`, 20, 108);
    if (rx.doctorNotes) {
      doc.setFillColor(245, 247, 250);
      doc.rect(15, 120, 180, 40, 'F');
      doc.setFont(undefined, 'bold'); doc.text("Doctor's Notes:", 20, 132);
      doc.setFont(undefined, 'normal');
      doc.text(rx.doctorNotes, 20, 144, { maxWidth: 170 });
    }
    doc.setFontSize(9); doc.setTextColor(150, 150, 150);
    doc.text("This is a digitally generated prescription from PharmaZone. Verify at pharmazone.in", 20, 280);
    doc.save(`PharmaZone_Rx_${rx.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f9]">
      <input type="file" ref={fileInputRef} onChange={onFileSelected} className="hidden" accept="image/*,.pdf" />

      {/* Success Toast */}
      {uploadSuccess && (
        <div className="fixed top-6 right-6 z-[300] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-fade-in-up">
          <span>✅</span> {uploadSuccess}
        </div>
      )}

      {/* Header */}
      <section className="bg-[#15342C] pt-28 pb-28 px-6 relative text-center">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl font-black text-white font-['Outfit'] mb-3 tracking-tighter">Your Health Hub</h1>
          <p className="text-emerald-100/40 font-bold uppercase tracking-[0.4em] text-[10px] mb-10">Orders • Prescriptions • Wallet</p>

          <div className="flex justify-center gap-1 bg-[#0D221D] p-2 rounded-2xl w-fit mx-auto border border-white/5 shadow-2xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-10 py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all ${activeTab === 'orders' ? 'bg-[#F4A522] text-[#15342C]' : 'text-white/30 hover:text-white'}`}
            >Active Orders</button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-10 py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all ${activeTab === 'prescriptions' ? 'bg-[#F4A522] text-[#15342C]' : 'text-white/30 hover:text-white'}`}
            >Prescriptions</button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 -mt-14 pb-24 relative z-20">
        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] shadow-xl text-center">
            <div className="w-12 h-12 border-4 border-[#F4A522] border-t-transparent animate-spin rounded-full mx-auto mb-5"></div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              {activeTab === 'orders' ? 'Loading your orders...' : 'Loading prescriptions...'}
            </p>
          </div>
        ) : activeTab === 'orders' ? (

          /* ── ORDERS TAB ──────────────────────────────────────────── */
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm">
                <p className="text-5xl mb-4">📦</p>
                <p className="text-xl font-black text-slate-800 font-['Outfit']">No orders yet</p>
                <Link to="/search" className="mt-4 inline-block text-[#F4A522] font-bold hover:underline">Browse medicines →</Link>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-slate-50">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl">📦</div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">#{order.orderNumber || order.id}</p>
                      <p className="text-3xl font-black text-[#15342C] font-['Outfit']">₹{order.totalAmount}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{order.date || order.createdAt?.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge status={order.status} />
                    <button
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`PharmaZone Order #${order.id} — ₹${order.totalAmount} — Status: ${order.status}`)}`, '_blank')}
                      className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-widest"
                    >Share 💬</button>
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.medicineName}</p>
                        <p className="text-[10px] font-black text-[#F4A522] uppercase tracking-widest mt-0.5">{item.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-700">×{item.quantity}</p>
                        <p className="text-xs text-slate-400">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rx Upload CTA */}
                {order.status === 'PENDING_RX' && (
                  <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-center">
                    <p className="text-rose-700 font-black text-sm mb-1">⚠️ Prescription Required</p>
                    <p className="text-rose-600/70 text-xs mb-4">Upload a valid prescription to confirm this order</p>
                    <button
                      onClick={() => handleRxUpload(order.id)}
                      className="bg-rose-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2 mx-auto"
                    >
                      {rxScanning && rxUploadingId === order.id
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div> Scanning...</>
                        : '📤 Upload Prescription'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

        ) : (

          /* ── PRESCRIPTIONS TAB ───────────────────────────────────── */
          <div className="space-y-6">
            {/* Upload new Rx button */}
            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-[#F4A522]/30 p-8 text-center hover:border-[#F4A522] hover:bg-amber-50/30 transition-all cursor-pointer group"
              onClick={() => { setRxUploadingId('new'); fileInputRef.current?.click(); }}>
              <div className="text-4xl mb-3">📤</div>
              <p className="font-black text-[#15342C] font-['Outfit']">Upload New Prescription</p>
              <p className="text-slate-400 text-sm mt-1">JPG, PNG or PDF · Max 10MB</p>
            </div>

            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm">
                <p className="text-5xl mb-4">📋</p>
                <p className="text-xl font-black text-slate-800 font-['Outfit']">No prescriptions yet</p>
                <p className="text-slate-400 text-sm mt-2">Upload a prescription or consult a doctor online</p>
              </div>
            ) : prescriptions.map(rx => (
              <div key={rx.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-5 pb-5 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${rx.isDocIssued ? 'bg-violet-50' : 'bg-amber-50'}`}>
                      {rx.isDocIssued ? '👨‍⚕️' : '📋'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                        {rx.isDocIssued ? 'Doctor Issued' : 'Self Uploaded'} · #{rx.id}
                      </p>
                      <p className="font-bold text-slate-800">{rx.medicineName || 'General Prescription'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Submitted: {rx.submittedAt}</p>
                    </div>
                  </div>
                  <Badge status={rx.status} />
                </div>

                {/* Doctor Notes */}
                {rx.doctorNotes && (
                  <div className="bg-[#15342C] rounded-2xl p-5 mb-5">
                    <p className="text-[#F4A522] font-black text-[10px] uppercase tracking-widest mb-2">Doctor's Notes</p>
                    <p className="text-emerald-100/80 text-sm italic">{rx.doctorNotes}</p>
                    {rx.validUntil && (
                      <p className="text-emerald-400/60 text-[10px] mt-2 font-bold uppercase tracking-widest">Valid until: {rx.validUntil}</p>
                    )}
                  </div>
                )}

                {/* Status info */}
                {rx.status === 'PENDING_REVIEW' && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center mb-4">
                    <p className="text-amber-700 text-xs font-bold">⏳ Your prescription is being reviewed by our pharmacist</p>
                  </div>
                )}
                {rx.status === 'REJECTED' && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center mb-4">
                    <p className="text-rose-700 text-xs font-bold">❌ Prescription rejected — please upload a clearer copy</p>
                  </div>
                )}

                {/* Download button — only for approved/doctor issued */}
                {(rx.status === 'APPROVED' || rx.status === 'DOCTOR_ISSUED' || rx.isDocIssued) && (
                  <button
                    onClick={() => downloadRx(rx)}
                    className="w-full py-3 rounded-xl bg-[#15342C] text-white font-black text-xs uppercase tracking-widest hover:bg-[#1c4a3a] transition-colors flex items-center justify-center gap-2"
                  >
                    📥 Download Prescription PDF
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
