import React from 'react';
import type { AppState } from '../types';

interface OutputAreaProps {
  state: AppState;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ state }) => {
  const { meta, integrityProfile, institutionalNotes } = state;

  const formatList = (items: string[]) => {
    if (!items || items.length === 0) return 'None specified.';
    return (
      <ul className="cp-output-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  const getPositionLabel = (pos: string) => {
    switch (pos) {
      case 'allowed': return 'Allowed';
      case 'not_allowed': return 'Not Allowed';
      case 'conditional': return 'Conditional';
      default: return 'Not Defined';
    }
  };

  return (
    <div className="cp-card cp-output-area">
      <div className="flex justify-between items-center mb-4">
        <h2 className="cp-card-title mb-0">Generated Guidance Summary</h2>
        <button 
          className="cp-button-secondary"
          onClick={() => {
            const textToCopy = document.getElementById('summary-content')?.innerText;
            if (textToCopy) navigator.clipboard.writeText(textToCopy);
          }}
        >
          Copy Summary
        </button>
      </div>

      <div id="summary-content">
        <div className="cp-output-section">
          <div className="cp-output-heading">Assessment Context</div>
          <div className="cp-output-content">
            <strong>Module:</strong> {meta.moduleName || 'N/A'}<br/>
            <strong>Programme:</strong> {meta.programmeName || 'N/A'}<br/>
            <strong>Assessment:</strong> {meta.assessmentTitle || 'N/A'} ({meta.assessmentType || 'Type N/A'} - {meta.level || 'Level N/A'})<br/>
            <br/>
            <em>{integrityProfile.contextDescription || 'No description provided.'}</em>
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">AI Usage Position</div>
          <div className="cp-output-content">
            <strong>{getPositionLabel(integrityProfile.aiUsagePosition)}</strong>
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Acceptable Uses</div>
          <div className="cp-output-content">
            {formatList(integrityProfile.acceptableUses)}
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Unacceptable Uses</div>
          <div className="cp-output-content">
            {formatList(integrityProfile.unacceptableUses)}
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Conditions / Caveats</div>
          <div className="cp-output-content">
            {formatList(integrityProfile.conditions)}
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Student Guidance</div>
          <div className="cp-output-content">
            {integrityProfile.studentGuidance || 'None specified.'}
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Staff Rationale</div>
          <div className="cp-output-content">
            {integrityProfile.staffRationale || 'None specified.'}
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Authenticity Notes</div>
          <div className="cp-output-content">
            {integrityProfile.authenticityNotes || 'None specified.'}
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Risks / Concerns</div>
          <div className="cp-output-content">
            {integrityProfile.risksOrConcerns || 'None specified.'}
          </div>
        </div>

        <div className="cp-output-section">
          <div className="cp-output-heading">Institutional Notes</div>
          <div className="cp-output-content">
            {institutionalNotes.generalNotes || 'None specified.'}
          </div>
        </div>
      </div>
    </div>
  );
};
