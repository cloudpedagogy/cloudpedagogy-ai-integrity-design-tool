import React, { useState } from 'react';
import type { AppState } from '../types';
import { getPositionLabel, generatePlainTextSummary } from '../utils/summary';

interface OutputAreaProps {
  state: AppState;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ state }) => {
  const { meta, integrityProfile, institutionalNotes } = state;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleCopy = async () => {
    const textToCopy = generatePlainTextSummary(state);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopyStatus('success');
        setTimeout(() => setCopyStatus('idle'), 2500);
        return;
      }
      // Fallback for older browsers or non-secure contexts
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) {
        setCopyStatus('success');
        setTimeout(() => setCopyStatus('idle'), 2500);
      } else {
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 3000);
      }
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const positionLabel = getPositionLabel(
    integrityProfile.aiUsagePosition || (integrityProfile.stance as string) || ''
  );

  return (
    <div className="cp-card cp-output-area printable-summary">
      <div className="flex justify-between items-center mb-4 cp-hide-print">
        <h2 className="cp-card-title mb-0">Generated Guidance Summary</h2>
        <div className="flex gap-2" style={{ gap: '0.5rem' }}>
          <button 
            type="button"
            className="cp-button-primary"
            onClick={() => window.print()}
            aria-label="Print or save AI Integrity Statement as PDF"
          >
            Print / Save to PDF
          </button>
          <button 
            type="button"
            className="cp-button-secondary"
            onClick={handleCopy}
            aria-label="Copy summary to clipboard"
          >
            {copyStatus === 'success' 
              ? '✓ Copied!' 
              : copyStatus === 'error' 
              ? '✕ Copy Failed' 
              : 'Copy Summary'}
          </button>
        </div>
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
            <strong>{positionLabel}</strong>
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

        {(integrityProfile.acknowledgementRequired !== undefined || integrityProfile.acknowledgementFormat) && (
          <div className="cp-output-section">
            <div className="cp-output-heading">Acknowledgement Requirements</div>
            <div className="cp-output-content">
              {integrityProfile.acknowledgementRequired !== undefined && (
                <div>
                  <strong>Declaration Required:</strong>{' '}
                  {typeof integrityProfile.acknowledgementRequired === 'boolean'
                    ? (integrityProfile.acknowledgementRequired ? 'Yes' : 'No')
                    : integrityProfile.acknowledgementRequired}
                </div>
              )}
              {integrityProfile.acknowledgementFormat && (
                <div style={{ marginTop: '0.25rem' }}>
                  <strong>Expected Format:</strong> {integrityProfile.acknowledgementFormat}
                </div>
              )}
            </div>
          </div>
        )}

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

        {integrityProfile.reviewNotes && (
          <div className="cp-output-section">
            <div className="cp-output-heading">Review Notes</div>
            <div className="cp-output-content">
              {integrityProfile.reviewNotes}
            </div>
          </div>
        )}

        {integrityProfile.aiInvolvement && (
          <div className="cp-output-section">
            <div className="cp-output-heading">AI Involvement</div>
            <div className="cp-output-content">
              {integrityProfile.aiInvolvement}
            </div>
          </div>
        )}

        {integrityProfile.assumptions && (
          <div className="cp-output-section">
            <div className="cp-output-heading">Assumptions</div>
            <div className="cp-output-content">
              {integrityProfile.assumptions}
            </div>
          </div>
        )}

        <div className="cp-output-section">
          <div className="cp-output-heading">Institutional Notes & Policy Alignment</div>
          <div className="cp-output-content">
            {institutionalNotes.policyReference && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Policy Reference:</strong> {institutionalNotes.policyReference}
              </div>
            )}
            {institutionalNotes.generalNotes ? (
              <div>{institutionalNotes.generalNotes}</div>
            ) : (
              !institutionalNotes.policyReference && 'None specified.'
            )}
            {institutionalNotes.staffMonitoringStrategy && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Monitoring Strategy:</strong> {institutionalNotes.staffMonitoringStrategy}
              </div>
            )}
            {institutionalNotes.reviewDate && (
              <div style={{ marginTop: '0.25rem' }}>
                <strong>Review Date:</strong> {institutionalNotes.reviewDate}
              </div>
            )}
          </div>
        </div>

        {(integrityProfile.capabilityNotes || integrityProfile.governanceNotes) && (
          <div className="cp-output-section">
            <div className="cp-output-heading">Capability and Governance Reflection</div>
            <div className="cp-output-content">
              {integrityProfile.capabilityNotes && (
                <div className="mb-2">
                  <strong>Capability:</strong> {integrityProfile.capabilityNotes}
                </div>
              )}
              {integrityProfile.governanceNotes && (
                <div>
                  <strong>Governance:</strong> {integrityProfile.governanceNotes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
