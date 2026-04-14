import React from 'react';
import { Link } from 'react-router-dom';

const SubstitutesList = ({ substitutes, isAiSource }) => {
  if (!substitutes || substitutes.length === 0) {
    return <div className="text-center py-8 text-muted">No substitutes found.</div>;
  }

  return (
    <div className="grid grid-cols-2 mt-4">
      {substitutes.map((sub, idx) => (
        <div key={sub.medicine_id || sub.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{sub.name}</h4>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>By {sub.manufacturer}</div>
            </div>
            {isAiSource && sub.ai_rank && (
              <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                AI Rank #{sub.ai_rank}
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-4" style={{ flexGrow: 1 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              ${sub.price?.toFixed(2)}
            </div>
            {(sub.savings_pct > 0 || sub.savingsPercent > 0) && (
              <div className="text-success" style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>
                Save {sub.savings_pct || sub.savingsPercent}%<br/>
                <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>(${sub.savings_amount || sub.savingsAmount})</span>
              </div>
            )}
          </div>

          {sub.reason && (
            <div style={{ 
              background: 'rgba(37, 99, 235, 0.05)', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              color: 'var(--text-main)'
            }}>
              <strong className="text-primary">AI Insight:</strong> {sub.reason}
            </div>
          )}
          
          <Link to={`/medicine/${sub.medicine_id || sub.id}`} className="btn btn-outline" style={{ width: '100%' }}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SubstitutesList;
