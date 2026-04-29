import React, { useState } from 'react';
import type { IntegrityProfile } from '../types';

interface CapabilityGovernanceSectionProps {
  profile: IntegrityProfile;
  onChange: (field: keyof IntegrityProfile, value: string) => void;
}

export const CapabilityGovernanceSection: React.FC<CapabilityGovernanceSectionProps> = ({ profile, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="cp-card mt-4" style={{ opacity: 0.9 }}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center bg-transparent border-none p-0 cursor-pointer text-left"
        style={{ color: 'inherit' }}
      >
        <h3 className="cp-card-title m-0" style={{ fontSize: '1rem' }}>
          Capability & Governance Reflection Notes (Optional)
        </h3>
        <span style={{ fontSize: '1.2rem' }}>{isExpanded ? '−' : '+'}</span>
      </button>
      
      {isExpanded && (
        <div className="mt-4 border-t pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <p className="cp-card-description mb-4" style={{ fontSize: '0.85rem' }}>
            // Lightweight capability and governance layer
            <br />
            // Optional, non-blocking, and does not alter core workflow
          </p>

          <div className="cp-form-group">
            <label className="cp-label" style={{ fontSize: '0.8rem' }}>Capability Notes</label>
            <p className="text-muted mb-1" style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#666' }}>
              How does this design support responsible AI capability, professional judgement, or reflective practice?
            </p>
            <textarea 
              className="cp-textarea"
              style={{ fontSize: '0.85rem', minHeight: '80px' }}
              placeholder="Enter capability reflections..."
              value={profile.capabilityNotes || ''}
              onChange={(e) => onChange('capabilityNotes', e.target.value)}
            />
          </div>

          <div className="cp-form-group mt-3">
            <label className="cp-label" style={{ fontSize: '0.8rem' }}>Governance Notes</label>
            <p className="text-muted mb-1" style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#666' }}>
              What governance, review, accountability, or escalation considerations should be recorded beyond the core rationale, risks, and review notes?
            </p>
            <textarea 
              className="cp-textarea"
              style={{ fontSize: '0.85rem', minHeight: '80px' }}
              placeholder="Enter governance considerations..."
              value={profile.governanceNotes || ''}
              onChange={(e) => onChange('governanceNotes', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
