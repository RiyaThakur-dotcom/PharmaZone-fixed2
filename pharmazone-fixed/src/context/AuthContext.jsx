import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on page load
    try {
      const token    = localStorage.getItem('accessToken');
      const role     = localStorage.getItem('role');
      const fullName = localStorage.getItem('fullName');
      const userId   = localStorage.getItem('userId');
      const email    = localStorage.getItem('email');

      if (token && userId) {
        setUser({ token, role, fullName, userId, email });
      }
    } catch {}
    setLoading(false);
  }, []);

  /**
   * login(data) — called by Login.jsx and Register.jsx
   * Accepts the response object from the backend OR a demo user object
   * Supports both { accessToken } and { token } field naming
   */
  const login = (data) => {
    const token    = data.accessToken || data.token || '';
    const role     = data.role     || 'CUSTOMER';
    const fullName = data.fullName || data.name || '';
    const userId   = data.userId   || data.id   || '';
    const email    = data.email    || '';

    localStorage.setItem('accessToken', token);
    localStorage.setItem('role',        role);
    localStorage.setItem('fullName',    fullName);
    localStorage.setItem('userId',      String(userId));
    localStorage.setItem('email',       email);

    setUser({ token, role, fullName, userId: String(userId), email });
  };

  const logout = () => {
    ['accessToken', 'refreshToken', 'userId', 'role', 'fullName', 'email']
      .forEach(k => localStorage.removeItem(k));
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#F4A522]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-slate-400 font-bold font-['Outfit'] tracking-widest text-sm uppercase">Loading PharmaZone...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
