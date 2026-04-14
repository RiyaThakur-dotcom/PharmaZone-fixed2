import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Navigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────
   Admin.jsx — ULTRA Pharma Vendor Dashboard
   Features: Stats, Inventory, Orders, OCR Scanner, Billing, Chat
───────────────────────────────────────────────────────── */

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); 
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showBill, setShowBill] = useState(null); // For Invoice Modal

  // --- STATS DATA ---
  const stats = [
    { label: 'Total Orders', value: '1,248', trend: '+5.4%', color: 'sky', icon: '📦' },
    { label: 'Pending Orders', value: '28', trend: 'Priority', color: 'amber', icon: '⏳' },
    { label: 'Completed Orders', value: '1,214', trend: '98% Success', color: 'emerald', icon: '✅' },
    { label: 'Revenue Summary', value: '₹14.2L', trend: '+12.5%', color: 'indigo', icon: '💰' },
  ];

  // --- INVENTORY ---
  const [inventory] = useState([
    { id: 'MED-771', name: 'Dolo 650', salt: 'Paracetamol', price: 32, qty: 140, expiry: '2025-08', batch: 'B1120', status: 'IN_STOCK' },
    { id: 'MED-772', name: 'Augmentin 625 Duo', salt: 'Amoxycillin + Clavulanic', price: 182, qty: 12, expiry: '2024-06', batch: 'X4421', status: 'LOW_STOCK' },
    { id: 'MED-775', name: 'Telma 40', salt: 'Telmisartan', price: 85, qty: 42, expiry: '2025-10', batch: 'T9901', status: 'IN_STOCK' },
  ]);

  // --- CHAT MOCK ---
  const chats = [
    { id: 1, user: 'Riya Thakur', lastMsg: 'Is my order shipped?', time: '2m ago', unread: true },
    { id: 2, user: 'Rahul Verma', lastMsg: 'Sent prescription photo.', time: '15m ago', unread: false },
  ];

  const ChartBar = ({ height, label, color }) => (
    <div className="flex flex-col items-center gap-2 group flex-1">
      <div className="w-full bg-slate-100 rounded-lg h-32 relative overflow-hidden flex flex-col justify-end">
        <div className={`w-full ${color} rounded-sm transition-all duration-1000 ease-out group-hover:brightness-110`} style={{ height: `${height}%` }} />
      </div>
      <span className="text-[9px] font-black text-slate-400 tracking-tighter uppercase">{label}</span>
    </div>
  );

  const handleAction = (msg) => {
     alert(`SUCCESS: ${msg}`);
  };

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello Riya, your prescription for Augmentin is verified. We are processing it now.", isMe: true },
    { text: "Is my order shipped?", isMe: false }
  ]);

  const sendMsg = () => {
    if(!chatInput.trim()) return;
    setMessages([...messages, { text: chatInput, isMe: false }]);
    setChatInput('');
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'PHARMA_VENDOR')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-[#15342C] h-[320px] absolute top-0 left-0 right-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F4A522]/10 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-24 relative z-10">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[2rem] bg-[#F4A522] text-[#15342C] flex items-center justify-center shadow-2xl shadow-[#F4A522]/20 text-3xl">🏬</div>
            <div>
              <h1 className="text-4xl font-black text-white font-['Outfit'] tracking-tighter">Pharma Dashboard</h1>
              <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.4em]">Vendor Support • v2.0</p>
            </div>
          </div>

          <nav className="flex bg-[#0D221D]/90 backdrop-blur-xl p-1.5 rounded-[1.8rem] border border-emerald-900/50 shadow-2xl overflow-x-auto max-w-full custom-scrollbar">
            {[
              { id: 'overview', label: 'Monitor', icon: '📊' },
              { id: 'inventory', label: 'Inventory', icon: '💊' },
              { id: 'fulfillment', label: 'Fulfillment', icon: '📦' },
              { id: 'scanner', label: 'Scanner AI', icon: '🔍' },
              { id: 'chat', label: 'Messages', icon: '💬' },
              { id: 'billing', label: 'Billing', icon: '🧾' },
              { userRole: 'ADMIN', id: 'users', label: 'Manage Users', icon: '👥' },
            ].filter(t => !t.userRole || t.userRole === user.role).map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F4A522] text-[#15342C] shadow-lg' : 'text-emerald-100/40 hover:text-white hover:bg-white/5'}`}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* --- TOP STATISTICS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white p-7 rounded-[2.5rem] shadow-xl border border-slate-50 group transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{s.icon}</div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${s.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{s.trend}</span>
              </div>
              <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</h4>
              <p className="text-3xl font-black text-[#15342C] font-['Outfit']">{s.value}</p>
            </div>
          ))}
        </div>

        {/* --- WORKSPACE --- */}
        <div className="bg-white rounded-[4rem] shadow-3xl border border-slate-50 min-h-[600px] overflow-hidden">
          
          {/* TAB: MONITOR (Overview) */}
          {activeTab === 'overview' && (
            <div className="p-12 animate-in fade-in slide-in-from-bottom-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-1">Sales Performance (2024 - 2026)</h2>
                      <p className="text-slate-400 text-sm font-medium">Monitoring 3-year exponential growth trends.</p>
                    </div>
                    <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-500 outline-none ring-2 ring-slate-100 ring-offset-2">
                      <option>Full Timeline (2024-2026)</option>
                      <option>Current Year 2026</option>
                      <option>Last Year 2025</option>
                      <option>History 2024</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end gap-3 h-48 mb-10 overflow-x-auto pb-4 custom-scrollbar">
                    {/* 2024 Period */}
                    <div className="flex items-end gap-1.5 px-4 border-r border-slate-100 group">
                       <ChartBar height={20} label="24-Q1" color="bg-slate-300" />
                       <ChartBar height={35} label="24-Q2" color="bg-slate-300" />
                       <ChartBar height={45} label="24-Q3" color="bg-slate-300" />
                       <ChartBar height={55} label="24-Q4" color="bg-slate-300" />
                    </div>
                    {/* 2025 Period */}
                    <div className="flex items-end gap-1.5 px-4 border-r border-slate-100 group">
                       <ChartBar height={60} label="25-Q1" color="bg-emerald-300" />
                       <ChartBar height={75} label="25-Q2" color="bg-emerald-300" />
                       <ChartBar height={85} label="25-Q3" color="bg-emerald-300" />
                       <ChartBar height={90} label="25-Q4" color="bg-emerald-300" />
                    </div>
                    {/* 2026 Period (Current) */}
                    <div className="flex items-end gap-1.5 px-4 group">
                       <ChartBar height={95} label="26-Q1" color="bg-[#F4A522]" />
                       <ChartBar height={100} label="26-Q2" color="bg-[#F4A522]" />
                       <ChartBar height={40} label="26-Q3" color="bg-slate-100" />
                       <ChartBar height={10} label="26-Q4" color="bg-slate-50" />
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-[10px] font-black text-[#F4A522] uppercase tracking-[0.4em] mb-2">3-Year Growth Insight</p>
                        <h3 className="text-2xl font-black font-['Outfit'] italic">+340% Overall Revenue Spike</h3>
                     </div>
                     <div className="flex gap-2 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">📈</div>
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-500/10 opacity-50" />
                  </div>
                </div>
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                   <h4 className="font-black text-[#15342C] mb-8 font-['Outfit'] text-xl">Top Medicines</h4>
                   <div className="space-y-6">
                      {[
                        { name: 'Dolo 650 mg', val: '420 sold', p: 90, c: 'bg-emerald-500' },
                        { name: 'Augmentin 625 Duo', val: '295 sold', p: 75, c: 'bg-[#F4A522]' },
                        { name: 'Pantocid 40', val: '210 sold', p: 55, c: 'bg-blue-500' },
                        { name: 'Telma 40', val: '180 sold', p: 48, c: 'bg-indigo-500' },
                        { name: 'Glycomet GP 1/2', val: '155 sold', p: 40, c: 'bg-rose-500' },
                        { name: 'Shelcal 500', val: '110 sold', p: 28, c: 'bg-emerald-400' },
                        { name: 'Limcee 500mg', val: '95 sold', p: 22, c: 'bg-amber-400' },
                      ].map((m, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-2">
                             <span className="text-slate-700">{m.name}</span>
                             <span className="text-[#15342C]">{m.val}</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full ${m.c}`} style={{ width: `${m.p}%` }} />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SCANNER AI (OCR Verification) */}
          {activeTab === 'scanner' && (
            <div className="p-12 animate-in slide-in-from-right-10 duration-500">
               <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                     <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-2">Prescription AI</h2>
                     <p className="text-slate-400 text-sm mb-10">Advanced OCR engine extracting medical data in real-time.</p>
                     
                     <div className="aspect-[4/3] rounded-[2.5rem] bg-slate-900 overflow-hidden relative border-4 border-[#F4A522]/30 shadow-2xl group">
                        <img src="https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-50" alt="Scanning" />
                        <div className="absolute inset-x-0 top-0 h-1 bg-[#F4A522] shadow-[0_0_20px_#F4A522] animate-[scanLine_2.5s_infinite]" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/40 text-white backdrop-blur-[2px]">
                           <svg className="w-16 h-16 text-[#F4A522] mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h16" /></svg>
                           <p className="font-black uppercase tracking-[0.4em] text-[10px]">Processing OCR Analysis...</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="w-full md:w-80">
                      <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100">
                         <h4 className="font-black text-emerald-800 uppercase text-[10px] tracking-widest mb-6">Extracted Data</h4>
                         <div className="space-y-6">
                            {[
                              { label: 'Doctor Name', val: 'Dr. Sameer Hegde', ok: true },
                              { label: 'License Code', val: 'MC-224190-KL', ok: true },
                              { label: 'Meds List', val: 'Augmentin, Dolo', ok: true },
                              { label: 'Clinic Sync', val: 'Verified ✅', ok: true },
                            ].map((d, i) => (
                              <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                 <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{d.label}</p>
                                    <p className="text-[11px] font-black text-[#15342C]">{d.val}</p>
                                 </div>
                                 <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">✓</div>
                              </div>
                            ))}
                         </div>
                         <button onClick={() => handleAction('Prescription Extracted Data Approved!')} className="w-full mt-10 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Approve Extracted Meds</button>
                      </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: CHAT MSGS */}
          {activeTab === 'chat' && (
            <div className="flex h-[600px] animate-in fade-in">
               <div className="w-80 border-r border-slate-50 p-8 bg-slate-50/30">
                  <h3 className="font-black text-[#15342C] font-['Outfit'] text-xl mb-8">Patient Chats</h3>
                  <div className="space-y-3">
                     {chats.map(c => (
                        <div key={c.id} className={`p-4 rounded-3xl cursor-pointer transition-all ${c.unread ? 'bg-white shadow-xl border border-slate-100' : 'hover:bg-white/50'}`}>
                           <div className="flex justify-between items-center mb-1">
                              <span className="font-black text-[#15342C] text-xs">{c.user}</span>
                              <span className="text-[9px] font-bold text-slate-400">{c.time}</span>
                           </div>
                           <p className="text-[11px] text-slate-500 font-medium truncate">{c.lastMsg}</p>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex-1 p-10 flex flex-col">
                  <div className="flex-1 bg-slate-50 rounded-[3rem] p-8 relative flex flex-col justify-end overflow-y-auto">
                     <div className="flex flex-col gap-4">
                        {messages.map((m, idx) => (
                           <div key={idx} className={`p-4 rounded-2xl max-w-[80%] text-sm font-medium shadow-lg transition-all ${m.isMe ? 'bg-[#15342C] text-white self-start rounded-bl-none' : 'bg-white text-[#15342C] self-end rounded-br-none border border-slate-100'}`}>
                              {m.text}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="mt-8 relative">
                     <input 
                        type="text" 
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
                        placeholder="Type message to patient..." 
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#F4A522] font-medium" 
                     />
                     <button onClick={sendMsg} className="absolute right-3 top-3 bg-[#F4A522] text-[#15342C] px-5 py-2 rounded-xl font-black uppercase text-[10px] hover:scale-105 transition-all">Send</button>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: BILLING (GST & Invoices) */}
          {activeTab === 'billing' && (
            <div className="p-12 animate-in zoom-in-95">
               <div className="flex justify-between items-end mb-10 pb-8 border-b border-slate-100">
                  <div>
                    <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-1">Billing & Invoices</h2>
                    <p className="text-slate-400 text-sm font-medium">Generate GST compliant invoices for patients.</p>
                  </div>
                  <button className="bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all font-['Outfit']">Download Tax Report</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { id: 'INV-20412', user: 'Aarav S.', amt: '₹142.50', status: 'PAID', date: 'Today' },
                    { id: 'INV-20411', user: 'Priya P.', amt: '₹540.00', status: 'UNPAID', date: 'Today' },
                    { id: 'INV-20410', user: 'Rahul V.', amt: '₹840.00', status: 'PAID', date: 'Yesterday' },
                  ].map((inv, idx) => (
                    <div key={idx} className="bg-white border-2 border-slate-50 p-8 rounded-[3rem] hover:shadow-2xl transition-all group overflow-hidden relative">
                       <h4 className="font-black text-[#15342C] font-['Outfit'] text-lg mb-1">{inv.user}</h4>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">{inv.id} • {inv.date}</p>
                       <div className="flex justify-between items-center mb-10">
                          <span className="text-3xl font-black text-[#15342C] font-['Outfit']">{inv.amt}</span>
                          <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{inv.status}</span>
                       </div>
                       <button onClick={() => setShowBill(inv)} className="w-full bg-slate-50 hover:bg-[#F4A522] hover:text-[#15342C] text-[#15342C] font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl transition-all">Generate GST PDF</button>
                       <div className="absolute top-[-10%] right-[-10%] rotate-45 text-[10rem] font-bold text-slate-400/5 pointer-events-none">BILL</div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: USERS MANAGEMENT (Admin Only) */}
          {activeTab === 'users' && user.role === 'ADMIN' && (
            <div className="p-12 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex justify-between items-end mb-10 pb-8 border-b border-slate-100">
                  <div>
                    <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-1">Global User Directory</h2>
                    <p className="text-slate-400 text-sm font-medium">Manage all registered entities on PharmaZone.</p>
                  </div>
                  <div className="flex gap-4">
                     <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">2.4k Total</span>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                           <th className="pb-4">User Details</th>
                           <th className="pb-4">Account Type</th>
                           <th className="pb-4">Status</th>
                           <th className="pb-4">Last Activity</th>
                           <th className="pb-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {[
                          { name: 'Riya Thakur', email: 'riya@pharm.com', role: 'VENDOR', status: 'VERIFIED', time: '2m ago' },
                          { name: 'Dr. Vivek S.', email: 'v.specialist@med.in', role: 'DOCTOR', status: 'PENDING', time: '1h ago' },
                          { name: 'Aarav Sharma', email: 'aarav@gmail.com', role: 'CUSTOMER', status: 'VERIFIED', time: '15m ago' },
                        ].map((u, i) => (
                          <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                             <td className="py-6">
                                <p className="font-black text-[#15342C] text-sm font-['Outfit']">{u.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                             </td>
                             <td className="py-6">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === 'DOCTOR' ? 'bg-indigo-50 text-indigo-600' : u.role === 'VENDOR' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{u.role}</span>
                             </td>
                             <td className="py-6">
                                <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                   <span className="text-[10px] font-black text-slate-600 tracking-tight">{u.status}</span>
                                </div>
                             </td>
                             <td className="py-6 text-[11px] font-black text-[#15342C]/40 uppercase tracking-tighter">{u.time}</td>
                             <td className="py-6 text-right">
                                <button onClick={() => handleAction(`Action triggered for ${u.name}`)} className="text-[10px] font-black text-[#15342C] uppercase tracking-widest hover:text-[#F4A522] transition-colors">Manage User</button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* PLACEHOLDERS for other tabs... */}
          {(activeTab === 'inventory' || activeTab === 'fulfillment') && (
            <div className="p-12 text-center py-20 bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">⚙️</div>
               <h3 className="text-2xl font-black text-[#15342C] font-['Outfit']">Management Module Active</h3>
               <p className="text-slate-400 text-sm mt-2">Inventory and fulfillment logs are syncing with central PharmaZone database.</p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
      `}</style>

      {/* MODAL MOCK: BILLING */}
      {showBill && (
        <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowBill(null)}>
           <div className="bg-white w-full max-w-lg rounded-[4rem] p-12 relative shadow-3xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-10">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-[#15342C] text-white flex items-center justify-center text-3xl mx-auto mb-6">🧾</div>
                 <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-2">Generating Invoice</h2>
                 <p className="text-slate-400 font-medium">GST Implementation • Tax Code 09</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-10 space-y-4">
                 <div className="flex justify-between border-b border-slate-200 pb-4"><span className="text-slate-400 font-bold uppercase text-[10px]">Invoice No</span> <span className="font-black text-[#15342C] text-xs">{showBill.id}</span></div>
                 <div className="flex justify-between border-b border-slate-200 pb-4"><span className="text-slate-400 font-bold uppercase text-[10px]">GST (12%)</span> <span className="font-black text-emerald-600 text-xs">₹17.10</span></div>
                 <div className="flex justify-between pt-2"><span className="text-slate-400 font-bold uppercase text-[10px]">Total Amount</span> <span className="font-black text-[#15342C] text-xl">{showBill.amt}</span></div>
              </div>
              <button 
                onClick={() => {
                  setDownloading(true);
                  setTimeout(() => {
                    setDownloading(false);
                    handleAction('Invoice Downloaded Successfully (PDF)!');
                    setShowBill(null);
                  }, 1500);
                }} 
                disabled={downloading}
                className="w-full bg-[#15342C] text-[#F4A522] py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-[#1c4a3a] transition-all flex items-center justify-center gap-3">
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#F4A522]/30 border-t-[#F4A522] rounded-full animate-spin" />
                    Generating PDF...
                  </>
                ) : 'Download PDF'}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
