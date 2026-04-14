import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = React.useState(0);

  const getCartCount = () => {
    try {
      const stored = localStorage.getItem('pharmazone_cart');
      const cart = stored ? JSON.parse(stored) : [];
      if (Array.isArray(cart)) return cart.reduce((acc, item) => acc + (item?.quantity || 1), 0);
      return 0;
    } catch { return 0; }
  };

  React.useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={`${isHome ? 'absolute top-0 left-0 w-full z-50 pt-6 px-6 lg:px-12 bg-transparent' : 'sticky top-0 z-50 bg-[#15342C] shadow-lg shadow-[#15342C]/20 border-b border-white/10 px-6 py-4'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-[10px] bg-[#F4A522] flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-md shadow-[#F4A522]/30">
            <span className="text-[#15342C] font-black text-xl leading-none pt-0.5">+</span>
          </div>
          <span className="font-['Outfit'] font-black text-2xl tracking-tight text-white">PharmaZone</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-bold font-['Outfit'] text-[15px] tracking-wide">
          <Link to="/" className="text-white hover:text-[#F4A522] transition-colors">Home</Link>
          <Link to="/search" className="text-white/80 hover:text-[#F4A522] transition-colors">Medicines</Link>
          <Link to="/cart" className="text-white/80 hover:text-[#F4A522] transition-colors relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-5 bg-[#F4A522] text-[#15342C] w-5 h-5 flex items-center justify-center rounded-full text-[11px] shadow-sm font-black border-2 border-[#15342C]">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-5 border-l border-white/20 pl-6">
              <Link to="/orders" className="text-white/80 hover:text-[#F4A522] transition-colors text-sm uppercase tracking-widest">
                {user.role === 'CUSTOMER' ? 'My Account' : 'Dashboard'}
              </Link>
              {(user.role === 'ADMIN' || user.role === 'DOCTOR' || user.role === 'PHARMA_VENDOR') && (
                <Link to="/admin" className="text-[#F4A522] hover:text-white transition-colors text-sm uppercase tracking-widest font-black">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-sm border border-white/20 uppercase">
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
                <button onClick={() => { logout(); navigate('/login'); }} className="text-white/50 hover:text-rose-400 transition-colors text-sm font-bold">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
              <Link to="/login" className="text-white hover:text-white/80 transition-colors">Sign in</Link>
              <Link to="/register" className="bg-[#F4A522] text-[#15342C] hover:bg-[#F39C12] hover:-translate-y-0.5 transition-all duration-300 px-6 py-2.5 rounded-full font-black shadow-[0_4px_15px_rgba(244,165,34,0.3)]">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
