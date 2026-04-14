import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        <span>{message}</span>
        <button className="btn" style={{ padding: '0.2rem', marginLeft: '1rem', background:'transparent', border:'none', cursor:'pointer' }} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
