import React from 'react';
import type { AIUsagePosition } from '../types';

interface AIUsagePositionCardProps {
  position: AIUsagePosition;
  onChange: (position: AIUsagePosition) => void;
}

export const AIUsagePositionCard: React.FC<AIUsagePositionCardProps> = ({ position, onChange }) => {
  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">AI Usage Position</h2>
        <p className="cp-card-description">State the headline position for generative AI use in this assessment.</p>
      </div>

      <div className="cp-form-group">
        <div className="cp-radio-group">
          <label className="cp-radio-label">
            <input 
              type="radio" 
              name="aiUsagePosition" 
              value="allowed" 
              checked={position === 'allowed'} 
              onChange={() => onChange('allowed')} 
            />
            <div className="cp-radio-text">
              <span className="cp-radio-title">Allowed</span>
              <span className="cp-radio-desc">Generative AI use is broadly permitted or required for this task.</span>
            </div>
          </label>

          <label className="cp-radio-label">
            <input 
              type="radio" 
              name="aiUsagePosition" 
              value="not_allowed" 
              checked={position === 'not_allowed'} 
              onChange={() => onChange('not_allowed')} 
            />
            <div className="cp-radio-text">
              <span className="cp-radio-title">Not Allowed</span>
              <span className="cp-radio-desc">Generative AI use is strictly prohibited for this task.</span>
            </div>
          </label>

          <label className="cp-radio-label">
            <input 
              type="radio" 
              name="aiUsagePosition" 
              value="conditional" 
              checked={position === 'conditional'} 
              onChange={() => onChange('conditional')} 
            />
            <div className="cp-radio-text">
              <span className="cp-radio-title">Conditional</span>
              <span className="cp-radio-desc">Generative AI may be used under specific conditions, constraints, or for certain stages only.</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
