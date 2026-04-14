import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StatusDot = ({ up }) => (
  <span className={`inline-block w-2.5 h-2.5 rounded-full ${up ? 'bg-emerald-400' : 'bg-rose-400'} mr-2`}></span>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [backendUp, setBackendUp] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Check backend health
    api.get('/medicines/search?query=dolo')
      .then(() => setBackendUp(true))
      .catch(() => setBackendUp(false));

    // Cart count
    try {
      const cart = JSON.parse(localStorage.getItem('pharmazone_cart') || '[]');
      setCartCount(Array.isArray(cart) ? cart.reduce((acc, i) => acc + (i.quantity || 1), 0) : 0);
    } catch { setCartCount(0); }

    // Recent orders
    if (user?.userId) {
      api.get(`/orders/customer/${user.userId}`)
        .then(res => setRecentOrders((res.data || []).slice(0, 3)))
        .catch(() => setRecentOrders([]));
    }
  }, [user]);

  const quickLinks = [
    { to: '/search', icon: '🔍', label: 'Find Medicines', desc: 'Search with AI substitutes', color: 'from-emerald-50 to-teal-50 border-emerald-100' },
    { to: '/cart', icon: '🛒', label: 'My Cart', desc: `${cartCount} item${cartCount !== 1 ? 's' : ''} waiting`, color: 'from-amber-50 to-orange-50 border-amber-100', badge: cartCount },
    { to: '/orders', icon: '📦', label: 'My Orders', desc: 'Track & manage orders', color: 'from-sky-50 to-blue-50 border-sky-100' },
    { to: '/orders?tab=consultations', icon: '👨‍⚕️', label: 'Consultations', desc: 'Chat with doctors', color: 'from-violet-50 to-purple-50 border-violet-100' },
  ];

  const statusItems = [
    { label: 'Spring Boot API', up: backendUp, note: 'localhost:8080' },
    { label: 'Claude AI (ChatBot)', up: true, note: 'api.anthropic.com' },
    { label: 'MySQL Database', up: backendUp, note: 'pharmazone_db' },
    { label: 'Vite Dev Server', up: true, note: 'localhost:5173' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8f9]">
      {/* Header */}
      <div className="bg-[#15342C] px-6 py-8 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-300/70 text-sm font-medium font-['Outfit'] uppercase tracking-widest mb-1">Welcome back</p>
              <h1 className="text-3xl md:text-4xl font-black text-white font-['Outfit'] tracking-tight">
                {user?.fullName || 'User'} 👋
              </h1>
              <p className="text-white/50 text-sm mt-1.5">{user?.email} · <span className="text-[#F4A522] font-bold">{user?.role || 'CUSTOMER'}</span></p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-white/40 hover:text-rose-400 transition-colors text-sm font-bold hidden md:block"
            >
              Logout →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 space-y-8">
        
        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-black text-slate-800 font-['Outfit'] mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`relative bg-gradient-to-br ${link.color} border rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group`}
              >
                {link.badge > 0 && (
                  <span className="absolute top-3 right-3 bg-[#F4A522] text-[#15342C] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
                <div className="text-3xl mb-3">{link.icon}</div>
                <p className="font-black text-slate-800 text-sm font-['Outfit']">{link.label}</p>
                <p className="text-slate-500 text-xs mt-0.5 leading-snug">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-slate-800 font-['Outfit']">System Status</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${backendUp === null ? 'bg-slate-100 text-slate-500' : backendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {backendUp === null ? 'Checking...' : backendUp ? '✓ All Systems Go' : '⚠ Backend Offline'}
              </span>
            </div>
            <div className="space-y-3">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StatusDot up={item.up} />
                    <span className="text-sm text-slate-700 font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{item.note}</span>
                </div>
              ))}
            </div>

            {backendUp === false && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-800 font-medium">Backend offline — run: <span className="font-mono bg-amber-100 px-1 rounded">mvn spring-boot:run</span></p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 font-['Outfit'] mb-5">Account Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Name', value: user?.fullName || '—' },
                { label: 'Email', value: user?.email || '—' },
                { label: 'Role', value: user?.role || 'CUSTOMER' },
                { label: 'User ID', value: `#${user?.userId || '—'}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-500 font-medium">{label}</span>
                  <span className="text-sm text-slate-800 font-bold">{value}</span>
                </div>
              ))}
            </div>

            {(user?.role === 'ADMIN' || user?.role === 'DOCTOR' || user?.role === 'PHARMA_VENDOR') && (
              <Link to="/admin" className="mt-4 w-full bg-[#15342C] text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1c4a3a] transition-colors">
                Go to Admin Panel →
              </Link>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-slate-800 font-['Outfit']">Recent Orders</h3>
            <Link to="/orders" className="text-sm text-[#F4A522] font-bold hover:underline">View All →</Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-slate-800">#{order.orderNumber || order.id}</p>
                    <p className="text-xs text-slate-500">₹{order.totalAmount}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{order.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-slate-500 text-sm">No orders yet</p>
              <Link to="/search" className="mt-3 inline-block text-sm text-[#F4A522] font-bold hover:underline">Search medicines →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
