import React from 'react';
import type { Meta, IntegrityProfile } from '../types';

interface ContextCardProps {
  meta: Meta;
  profile: IntegrityProfile;
  onMetaChange: (field: keyof Meta, value: string) => void;
  onProfileChange: (field: keyof IntegrityProfile, value: string) => void;
}

export const ContextCard: React.FC<ContextCardProps> = ({ meta, profile, onMetaChange, onProfileChange }) => {
  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Assessment Context</h2>
        <p className="cp-card-description">Set the academic context for this AI integrity design.</p>
      </div>

      <div className="grid-2">
        <div className="cp-form-group">
          <label className="cp-label">Programme Name</label>
          <input 
            type="text" 
            className="cp-input" 
            value={meta.programmeName || ''} 
            onChange={(e) => onMetaChange('programmeName', e.target.value)} 
            placeholder="e.g. BSc Computer Science"
          />
        </div>
        <div className="cp-form-group">
          <label className="cp-label">Module Name</label>
          <input 
            type="text" 
            className="cp-input" 
            value={meta.moduleName || ''} 
            onChange={(e) => onMetaChange('moduleName', e.target.value)} 
            placeholder="e.g. Introduction to Software Engineering"
          />
        </div>
        <div className="cp-form-group">
          <label className="cp-label">Assessment Title</label>
          <input 
            type="text" 
            className="cp-input" 
            value={meta.assessmentTitle || ''} 
            onChange={(e) => onMetaChange('assessmentTitle', e.target.value)} 
            placeholder="e.g. Final Group Project"
          />
        </div>
        <div className="cp-form-group">
          <label className="cp-label">Level</label>
          <input 
            type="text" 
            className="cp-input" 
            value={meta.level || ''} 
            onChange={(e) => onMetaChange('level', e.target.value)} 
            placeholder="e.g. L5"
          />
        </div>
        <div className="cp-form-group">
          <label className="cp-label">Assessment Type</label>
          <select 
            className="cp-select"
            value={meta.assessmentType || ''}
            onChange={(e) => onMetaChange('assessmentType', e.target.value)}
          >
            <option value="">Select Type...</option>
            <option value="Essay">Essay</option>
            <option value="Report">Report</option>
            <option value="Presentation">Presentation</option>
            <option value="Project">Project</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Case Study">Case Study</option>
            <option value="Reflective Writing">Reflective Writing</option>
            <option value="Practical / Lab Task">Practical / Lab Task</option>
            <option value="Group Assignment">Group Assignment</option>
            <option value="Exam">Exam</option>
            <option value="Quiz / Test">Quiz / Test</option>
            <option value="Dissertation / Major Study">Dissertation / Major Study</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="cp-form-group mt-4">
        <label className="cp-label">Short Context Description</label>
        <textarea 
          className="cp-textarea" 
          value={profile.contextDescription || ''} 
          onChange={(e) => onProfileChange('contextDescription', e.target.value)} 
          placeholder="Briefly describe the assessment task..."
        />
      </div>
    </div>
  );
};
