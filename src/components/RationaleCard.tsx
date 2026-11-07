import React from 'react';
import type { IntegrityProfile } from '../types';

interface RationaleCardProps {
  profile: IntegrityProfile;
  onChange: <K extends keyof IntegrityProfile>(field: K, value: IntegrityProfile[K]) => void;
}

export const RationaleCard: React.FC<RationaleCardProps> = ({ profile, onChange }) => {
  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Rationale & Integrity Design</h2>
        <p className="cp-card-description">Document the reasoning, authenticity considerations, and conditions for the chosen AI position.</p>
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

      <div className="grid-2 mt-4">
        <div className="cp-form-group">
          <label className="cp-label" htmlFor="ack-required-select">Acknowledgement Required (Optional)</label>
          <select
            id="ack-required-select"
            aria-label="Acknowledgement Required"
            className="cp-select"
            value={
              profile.acknowledgementRequired === true || profile.acknowledgementRequired === 'true'
                ? 'true'
                : profile.acknowledgementRequired === false || profile.acknowledgementRequired === 'false'
                ? 'false'
                : ''
            }
            onChange={(e) => {
              const val = e.target.value;
              onChange('acknowledgementRequired', val === '' ? undefined : val === 'true');
            }}
          >
            <option value="">Not Specified</option>
            <option value="true">Yes — AI usage declaration required</option>
            <option value="false">No — Formal declaration not required</option>
          </select>
        </div>
        <div className="cp-form-group">
          <label className="cp-label" htmlFor="ack-format-input">Acknowledgement Format / Standard (Optional)</label>
          <input 
            id="ack-format-input"
            aria-label="Acknowledgement Format"
            type="text"
            className="cp-input" 
            value={profile.acknowledgementFormat || ''} 
            onChange={(e) => onChange('acknowledgementFormat', e.target.value)} 
            placeholder="e.g. Standard declaration form, APA 7th AI citation standard"
          />
        </div>
      </div>
    </div>
  );
};
