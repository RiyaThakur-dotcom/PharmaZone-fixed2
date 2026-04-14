import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import MedicineDetail from './pages/MedicineDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import ConsultDoctors from './pages/ConsultDoctors';
import LabTests from './pages/LabTests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/medicine/:id" element={<MedicineDetail />} />
            <Route path="/consult" element={<ConsultDoctors />} />
            <Route path="/lab-tests" element={<LabTests />} />
            
            {/* Protected Routes */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Route */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
          <ChatBot />
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
