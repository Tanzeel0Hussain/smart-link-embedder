import React from 'react';
import { CheckCircle, Download, RotateCcw } from 'lucide-react';

const SuccessView = ({ onReset, downloadUrl, downloadName }) => {
  return (
    <div className="fade-in">
      <div className="success-icon-container">
        <CheckCircle size={40} />
      </div>
      <div className="success-message">
        <h2>File Ready!</h2>
        <p>Your smart linked file has been generated successfully.</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <a href={downloadUrl} download={downloadName} style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ width: '100%' }}>
            <Download size={20} /> Download File
          </button>
        </a>
        <button 
          className="btn-primary" 
          onClick={onReset}
          style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
        >
          <RotateCcw size={20} /> Create Another
        </button>
      </div>
    </div>
  );
};

export default SuccessView;
