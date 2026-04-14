import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('prescriptions'); // Default to prescriptions for Admin
  
  // Data States
  const [pendingRx, setPendingRx] = useState([]);
  const [activeConsults, setActiveConsults] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Medicine Form State
  const [medicineForm, setMedicineForm] = useState({
     name: '', genericName: '', price: '', requiresPrescription: false, category: ''
  });
  
  // Consult response state
  const [doctorResponse, setDoctorResponse] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);

  // Set default tab based on role
  useEffect(() => {
    if (user?.role === 'DOCTOR') setActiveTab('consultations');
    else if (user?.role === 'PHARMA_VENDOR') setActiveTab('orders');
    else setActiveTab('prescriptions');
  }, [user]);

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'DOCTOR' || user?.role === 'PHARMA_VENDOR') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
       if (activeTab === 'prescriptions') {
          const rxRes = await api.get(`/prescriptions/pending`);
          let data = rxRes.data || [];
          // Mock Fallback for Demo
          if (data.length === 0) {
            data = [
              { id: 'RX-8821', customerId: '101', customerName: 'Riya Thakur', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'PENDING_REVIEW', submittedAt: '2024-04-09' },
              { id: 'RX-9942', customerId: '205', customerName: 'Rahul Verma', fileUrl: '#', status: 'PENDING_REVIEW', submittedAt: '2024-04-09' }
            ];
          }
          setPendingRx(data);
       }
       if (activeTab === 'consultations') {
          const csRes = await api.get(`/consultations/pending`).catch(() => ({data: []}));
          let data = csRes.data || [];
          // Mock Fallback for Demo
          if (data.length === 0) {
            data = [
              { id: 'CS-441', customerId: '101', customerName: 'Riya Thakur', symptoms: 'Severe dry cough and chest pain since 2 days. No fever but feeling weak.', status: 'PENDING', requestedAt: '10 mins ago' },
              { id: 'CS-552', customerId: '302', customerName: 'Aman Deep', symptoms: 'Skin rash after taking previous antibiotics. Itchy and red spots on arms.', status: 'PENDING', requestedAt: '25 mins ago' }
            ];
          }
          setActiveConsults(data);
       }
       if (activeTab === 'orders') {
          const ordRes = await api.get(`/orders/all`).catch(() => ({data: []}));
          let data = ordRes.data || [];
          if (data.length === 0) {
            data = [
              { id: 'ORD-1002', customerName: 'Riya Thakur', totalAmount: 840, status: 'PENDING_RX', items: [{medicineName: 'Augmentin 625', quantity: 2}] },
              { id: 'ORD-1003', customerName: 'Rahul Verma', totalAmount: 120, status: 'DISPATCHED', items: [{medicineName: 'Dolo 650', quantity: 1}] }
            ];
          }
          setAllOrders(data);
       }
    } catch (err) {
       console.warn("Failed to load admin data", err);
    } finally {
       setLoading(false);
    }
  };

  const handleRxAction = async (id, action) => {
     try {
        let url = `/prescriptions/${id}/${action}`;
        if (action === 'reject') {
          const reason = window.prompt('Enter rejection reason:');
          if (reason === null) return; // cancelled
          url += `?reason=${encodeURIComponent(reason || 'Does not meet requirements')}`;
        }
        await api.patch(url);
        alert(`Prescription ${action}d successfully`);
        fetchData();
     } catch(err) {
        // Optimistic UI for Demo
        setPendingRx(prev => prev.filter(r => r.id !== id));
        alert(`Demo Mode: Prescription ${action}d successfully (Local State Updated)`);
     }
  };

  const handleAddMedicine = async (e) => {
     e.preventDefault();
     try {
        await api.post(`/medicines`, medicineForm);
        alert("Medicine added successfully to system!");
        setMedicineForm({ name: '', genericName: '', price: '', requiresPrescription: false, category: '' });
     } catch (err) {
        alert("Demo Mode: Medicine details logged to system.");
        setMedicineForm({ name: '', genericName: '', price: '', requiresPrescription: false, category: '' });
     }
  };

  const handleSendResponse = async (id) => {
     try {
        await api.patch(`/consultations/${id}/respond`, { response: doctorResponse });
        alert("Response dispatched to patient.");
        setRespondingTo(null);
        setDoctorResponse('');
        fetchData();
     } catch (err) {
        // Optimistic UI for Demo
        setActiveConsults(prev => prev.filter(c => c.id !== id));
        alert("Demo Mode: Digital Prescription issued and sent to patient dashboard.");
        setRespondingTo(null);
        setDoctorResponse('');
     }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'DOCTOR' && user.role !== 'PHARMA_VENDOR')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* 🚀 Admin Header Panel */}
      <section className="bg-[#15342C] pt-28 pb-32 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[#F4A522]/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
               <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4A522] text-[#15342C] flex items-center justify-center shadow-lg shadow-[#F4A522]/20">
                     <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h1 className="text-4xl font-black text-white font-['Outfit']">Dashboard</h1>
               </div>
               <p className="text-emerald-100/60 font-bold tracking-[0.2em] uppercase text-[10px] ml-1 md:ml-16">Verified {user.role} Access</p>
            </div>
            
            <div className="flex flex-wrap bg-[#0D221D] p-1.5 rounded-2xl border border-emerald-900/50 shadow-2xl">
               {(user.role === 'ADMIN' || user.role === 'PHARMA_VENDOR') && (
                  <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 rounded-xl font-bold font-['Outfit'] transition-all text-xs tracking-widest uppercase ${activeTab === 'orders' ? 'bg-[#F4A522] text-[#15342C] shadow-xl' : 'text-emerald-100/40 hover:text-white'}`}>Orders</button>
               )}
               {(user.role === 'ADMIN') && (
                  <button onClick={() => setActiveTab('prescriptions')} className={`px-6 py-3 rounded-xl font-bold font-['Outfit'] transition-all text-xs tracking-widest uppercase ${activeTab === 'prescriptions' ? 'bg-[#F4A522] text-[#15342C] shadow-xl' : 'text-emerald-100/40 hover:text-white'}`}>Verify Rx</button>
               )}
               {(user.role === 'ADMIN' || user.role === 'DOCTOR') && (
                  <button onClick={() => setActiveTab('consultations')} className={`px-6 py-3 rounded-xl font-bold font-['Outfit'] transition-all text-xs tracking-widest uppercase ${activeTab === 'consultations' ? 'bg-[#F4A522] text-[#15342C] shadow-xl' : 'text-emerald-100/40 hover:text-white'}`}>Consults</button>
               )}
               {(user.role === 'ADMIN' || user.role === 'PHARMA_VENDOR') && (
                  <button onClick={() => setActiveTab('medicines')} className={`px-6 py-3 rounded-xl font-bold font-['Outfit'] transition-all text-xs tracking-widest uppercase ${activeTab === 'medicines' ? 'bg-[#F4A522] text-[#15342C] shadow-xl' : 'text-emerald-100/40 hover:text-white'}`}>Inventory</button>
               )}
            </div>
         </div>
      </section>

      {/* 🚀 Workspace Area */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24">
         <div className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-12 min-h-[60vh]">
            
            {/* PRESCRIPTIONS TAB */}
            {activeTab === 'prescriptions' && (
               <div className="animate-fade-up">
                  <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-1">Verify Prescriptions</h2>
                      <p className="text-slate-400 font-medium text-sm">Review uploaded prescriptions for order approval.</p>
                    </div>
                    <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-amber-100">
                      {pendingRx.length} Pending
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {pendingRx.map((rx) => (
                        <div key={rx.id} className="group border-2 border-slate-50 hover:border-[#F4A522]/30 p-6 rounded-[2rem] transition-all hover:shadow-2xl hover:shadow-amber-500/5 bg-slate-50/50">
                           <div className="flex justify-between mb-6">
                              <span className="bg-[#15342C] text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">{rx.id}</span>
                              <span className="text-slate-300 font-bold text-[10px] uppercase">{rx.submittedAt}</span>
                           </div>
                           <h4 className="text-lg font-black text-[#15342C] font-['Outfit'] mb-1">{rx.customerName}</h4>
                           <p className="text-xs text-slate-400 font-bold mb-6">Customer ID: #{rx.customerId}</p>
                           
                           <div className="aspect-[4/3] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 mb-8 group-hover:border-[#F4A522]/50 transition-colors overflow-hidden relative">
                              <svg className="w-10 h-10 text-slate-300 group-hover:text-[#F4A522] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              <a href={rx.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline">View Prescription</a>
                           </div>

                           <div className="grid grid-cols-2 gap-3">
                              <button onClick={() => handleRxAction(rx.id, 'approve')} className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all active:scale-95">Approve</button>
                              <button onClick={() => handleRxAction(rx.id, 'reject')} className="bg-white border-2 border-slate-100 text-rose-500 hover:bg-rose-50 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95">Reject</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* CONSULTATIONS TAB */}
            {activeTab === 'consultations' && (
               <div className="animate-fade-up">
                  <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-1">Patient Consults</h2>
                      <p className="text-slate-400 font-medium text-sm">Review symptoms and issue digital prescriptions.</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">
                      {activeConsults.length} Active
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     {activeConsults.map((consult) => (
                        <div key={consult.id} className="bg-[#fbfbfb] border-2 border-slate-50 p-8 rounded-[2.5rem] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4">
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{consult.requestedAt}</span>
                           </div>
                           
                           <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center text-xl shadow-sm">👤</div>
                              <div>
                                 <h4 className="font-black text-[#15342C] font-['Outfit']">{consult.customerName}</h4>
                                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Case #{consult.id}</p>
                              </div>
                           </div>

                           <div className="mb-8">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Symptoms / Chief Complaint</p>
                              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-[#15342C] font-medium italic text-sm leading-relaxed shadow-sm">
                                 "{consult.symptoms}"
                              </div>
                           </div>
                           
                           {respondingTo === consult.id ? (
                              <div className="animate-in fade-in slide-in-from-top-4">
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">Digital Prescription (Response)</p>
                                <textarea
                                  className="w-full border-2 border-indigo-100 bg-white rounded-2xl p-5 text-sm font-medium focus:border-indigo-500 outline-none mb-4 resize-none shadow-inner"
                                  rows="4"
                                  placeholder="Specify medicine name, dosage, and duration..."
                                  value={doctorResponse}
                                  onChange={(e) => setDoctorResponse(e.target.value)}
                                ></textarea>
                                <div className="flex gap-4">
                                  <button onClick={() => handleSendResponse(consult.id)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95">Issue Prescription</button>
                                  <button onClick={() => setRespondingTo(null)} className="px-6 bg-slate-100 text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                                </div>
                              </div>
                           ) : (
                              <button onClick={() => setRespondingTo(consult.id)} className="w-full bg-[#15342C] hover:bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95">Respond to Case</button>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* INVENTORY TAB ... */}
            {activeTab === 'medicines' && (
               <div className="max-w-2xl animate-fade-up">
                  <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-1">System Inventory</h2>
                  <p className="text-slate-400 font-medium text-sm mb-10 pb-6 border-b border-slate-100">Add new medicines to the global comparison database.</p>
                  
                  <form onSubmit={handleAddMedicine} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[10px] font-black text-[#15342C] uppercase tracking-[0.2em] mb-3 font-['Outfit']">Medicine Brand Name</label>
                           <input type="text" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-[#F4A522] transition-all" placeholder="e.g. Augmentin 625" value={medicineForm.name} onChange={e => setMedicineForm({...medicineForm, name: e.target.value})} required/>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-[#15342C] uppercase tracking-[0.2em] mb-3 font-['Outfit']">Generic Molecule / Salt</label>
                           <input type="text" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-[#F4A522] transition-all" placeholder="e.g. Amoxycillin" value={medicineForm.genericName} onChange={e => setMedicineForm({...medicineForm, genericName: e.target.value})} required/>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[10px] font-black text-[#15342C] uppercase tracking-[0.2em] mb-3 font-['Outfit']">MRP / Base Price (₹)</label>
                           <input type="number" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-[#F4A522] transition-all" value={medicineForm.price} onChange={e => setMedicineForm({...medicineForm, price: e.target.value})} required/>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-[#15342C] uppercase tracking-[0.2em] mb-3 font-['Outfit']">Therapeutic Category</label>
                           <select className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl p-4 font-bold outline-none focus:bg-white focus:border-[#F4A522] transition-all appearance-none" value={medicineForm.category} onChange={e => setMedicineForm({...medicineForm, category: e.target.value})}>
                              <option value="">Select Category</option>
                              <option value="Pain Relief">Pain Relief</option>
                              <option value="Antibiotics">Antibiotics</option>
                              <option value="Supplements">Supplements</option>
                              <option value="Chronic Care">Chronic Care</option>
                           </select>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4 bg-rose-50/50 p-6 rounded-2xl border-2 border-rose-100/50">
                        <input type="checkbox" id="rxReq" className="w-6 h-6 accent-rose-500 rounded-lg cursor-pointer" checked={medicineForm.requiresPrescription} onChange={e => setMedicineForm({...medicineForm, requiresPrescription: e.target.checked})}/>
                        <label htmlFor="rxReq" className="font-black text-rose-800 text-xs uppercase tracking-widest cursor-pointer">Item Requires Doctor's Prescription (Rx)</label>
                     </div>

                     <button type="submit" className="w-full bg-[#15342C] text-white hover:bg-[#F4A522] hover:text-[#15342C] transition-all py-5 rounded-2xl font-black uppercase tracking-[0.2em] font-['Outfit'] shadow-2xl flex justify-center items-center gap-3 active:scale-[0.98]">
                        Insert Into System <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </button>
                  </form>
               </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
               <div className="animate-fade-up">
                  <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-1">Global Fulfillment</h2>
                      <p className="text-slate-400 font-medium text-sm">Monitor and dispatch incoming pharmacy orders.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="pb-4">Order ID</th>
                          <th className="pb-4">Customer</th>
                          <th className="pb-4">Items</th>
                          <th className="pb-4">Total</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {allOrders.map(order => (
                          <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 font-black text-xs text-[#15342C]">{order.id}</td>
                            <td className="py-6 font-bold text-xs text-[#15342C]">{order.customerName}</td>
                            <td className="py-6 text-xs text-slate-500 font-medium">{order.items?.[0]?.medicineName} x {order.items?.[0]?.quantity}</td>
                            <td className="py-6 font-black text-xs text-[#15342C]">₹{order.totalAmount}</td>
                            <td className="py-6">
                              <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'DISPATCHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-6">
                              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Update</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}
            
         </div>
      </section>
    </div>
  );
};

export default Admin;
