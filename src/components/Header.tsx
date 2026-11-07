import React from 'react';

interface HeaderProps {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadDemo: () => void;
  onReset: () => void;
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onImport, onLoadDemo, onReset, onPrint }) => {
  const handlePrint = onPrint || (() => window.print());

  return (
    <header className="cp-header">
      <div className="flex justify-between items-center">
        <div>
          <h1>CloudPedagogy AI Integrity Design Tool</h1>
          <p>Design clear, consistent AI integration rules and guidance for assessments.</p>
        </div>
        <div className="cp-header-actions cp-hide-print">
          <button type="button" className="cp-button-secondary" onClick={handlePrint} aria-label="Print or save as PDF">
            Print / PDF
          </button>
          <button type="button" className="cp-button-secondary" onClick={onLoadDemo}>
            Load Demo
          </button>
          <button type="button" className="cp-button-danger" onClick={onReset}>
            Reset Tool
          </button>
          <button type="button" className="cp-button-secondary" onClick={onExport}>
            Export JSON
          </button>
          <label className="cp-button-secondary" style={{ cursor: 'pointer' }}>
            Import JSON
            <input 
              type="file" 
              accept=".json" 
              style={{ display: 'none' }} 
              onChange={onImport} 
            />
          </label>
        </div>
      </div>
    </header>
  );
};
