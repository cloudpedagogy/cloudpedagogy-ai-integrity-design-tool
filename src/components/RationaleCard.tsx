import React from 'react';
import type { IntegrityProfile } from '../types';

interface RationaleCardProps {
  profile: IntegrityProfile;
  onChange: (field: keyof IntegrityProfile, value: string) => void;
}

export const RationaleCard: React.FC<RationaleCardProps> = ({ profile, onChange }) => {
  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Rationale & Integrity Design</h2>
        <p className="cp-card-description">Document the reasoning and institutional notes for the chosen AI position.</p>
      </div>

      <div className="cp-form-group">
        <label className="cp-label">Student Guidance text</label>
        <textarea 
          className="cp-textarea" 
          value={profile.studentGuidance || ''} 
          onChange={(e) => onChange('studentGuidance', e.target.value)} 
          placeholder="Clear, direct guidance meant for students to read..."
        />
      </div>

      <div className="cp-form-group">
        <label className="cp-label">Staff Rationale text</label>
        <textarea 
          className="cp-textarea" 
          value={profile.staffRationale || ''} 
          onChange={(e) => onChange('staffRationale', e.target.value)} 
          placeholder="Internal reasoning for teaching teams or reviewers..."
        />
      </div>

      <div className="cp-form-group">
        <label className="cp-label">Authenticity Notes</label>
        <textarea 
          className="cp-textarea" 
          value={profile.authenticityNotes || ''} 
          onChange={(e) => onChange('authenticityNotes', e.target.value)} 
          placeholder="How will originality and authentic learning be verified?"
        />
      </div>

      <div className="grid-2">
        <div className="cp-form-group">
          <label className="cp-label">Risks or Concerns</label>
          <textarea 
            className="cp-textarea" 
            value={profile.risksOrConcerns || ''} 
            onChange={(e) => onChange('risksOrConcerns', e.target.value)} 
            placeholder="Any residual concerns about misconduct..."
          />
        </div>
        <div className="cp-form-group">
          <label className="cp-label">Review Notes (Optional)</label>
          <textarea 
            className="cp-textarea" 
            value={profile.reviewNotes || ''} 
            onChange={(e) => onChange('reviewNotes', e.target.value)} 
            placeholder="Notes for the next module iteration..."
          />
        </div>
      </div>

      <div className="grid-2 mt-4">
        <div className="cp-form-group">
          <label className="cp-label">AI Involvement (Optional)</label>
          <textarea 
            className="cp-textarea" 
            value={profile.aiInvolvement || ''} 
            onChange={(e) => onChange('aiInvolvement', e.target.value)} 
            placeholder="How was AI used in creating this design?"
          />
        </div>
        <div className="cp-form-group">
          <label className="cp-label">Assumptions (Optional)</label>
          <textarea 
            className="cp-textarea" 
            value={profile.assumptions || ''} 
            onChange={(e) => onChange('assumptions', e.target.value)} 
            placeholder="Key assumptions made during this design..."
          />
        </div>
      </div>
    </div>
  );
};
