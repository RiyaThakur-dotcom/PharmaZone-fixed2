import React from 'react';
import { Link } from 'react-router-dom';

const MedicineCard = ({ medicine, isAiResult = false }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem', flexGrow: 1 }}>
        <div className="flex justify-between items-center mb-2">
          {isAiResult && <span className="badge badge-ai">✦ AI Pick</span>}
          {medicine.requiresPrescription && <span className="badge badge-warning">Rx Required</span>}
        </div>
        <h3 style={{ marginBottom: '0.25rem', color: 'var(--primary)' }}>{medicine.name}</h3>
        <p className="text-muted" style={{ fontStyle: 'italic', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {medicine.genericName}
        </p>
        
        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <div className="flex justify-between">
            <span className="text-muted">Form:</span>
            <span>{medicine.dosageForm}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Category:</span>
            <span>{medicine.category}</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '1.5rem', 
        borderTop: '1px solid var(--border-color)', 
        background: '#f8fafc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
          ${medicine.price ? medicine.price.toFixed(2) : 'N/A'}
        </div>
        <Link to={`/medicine/${medicine.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
          Compare Prices
        </Link>
      </div>
    </div>
  );
};

export default MedicineCard;
