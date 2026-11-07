import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import type { 
  AppState, 
  Meta, 
  IntegrityProfile 
} from './types';
import { 
  createEmptyState, 
  DEMO_STATE 
} from './types';
import { 
  STORAGE_KEY, 
  isRecord, 
  normalizeState, 
  saveCorruptedBackup, 
  validateImportJSON 
} from './utils/validation';
import { exportStateAsJSON } from './utils/export';
import { Header } from './components/Header';
import { ContextCard } from './components/ContextCard';
import { AIUsagePositionCard } from './components/AIUsagePositionCard';
import { ListEditorCard } from './components/ListEditorCard';
import { RationaleCard } from './components/RationaleCard';
import { CapabilityGovernanceSection } from './components/CapabilityGovernanceSection';
import { OutputArea } from './components/OutputArea';

function App() {
  const isDirtyRef = useRef(false);

  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(saved);
        } catch (e) {
          console.warn('Storage contains invalid JSON; preserving raw data non-destructively', e);
          saveCorruptedBackup(saved);
          return createEmptyState();
        }

        if (isRecord(parsed)) {
          return normalizeState(parsed);
        } else {
          console.warn('Storage contains non-object payload; preserving raw data non-destructively');
          saveCorruptedBackup(saved);
          return createEmptyState();
        }
      }
    } catch (e) {
      console.error('Failed to read from localStorage', e);
    }
    return createEmptyState();
  });

  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      // Non-destructive safeguard: if storage held unparseable data and user hasn't made mutations,
      // avoid silently overwriting the original raw data on mount.
      if (existing && !isDirtyRef.current) {
        try {
          const parsed = JSON.parse(existing);
          if (!isRecord(parsed)) {
            return;
          }
        } catch {
          return;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }, [state]);

  const updateMeta = (field: keyof Meta, value: string) => {
    isDirtyRef.current = true;
    setState(prev => ({
      ...prev,
      meta: { ...prev.meta, [field]: value },
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateProfile = <K extends keyof IntegrityProfile>(field: K, value: IntegrityProfile[K]) => {
    isDirtyRef.current = true;
    setState(prev => {
      const updatedProfile = { ...prev.integrityProfile, [field]: value };
      if (field === 'aiUsagePosition') {
        updatedProfile.stance = value as IntegrityProfile['stance'];
      }
      return {
        ...prev,
        integrityProfile: updatedProfile,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const handleExport = () => {
    exportStateAsJSON(state);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawText = event.target?.result as string;
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          alert('Failed to read JSON: File is not valid JSON.');
          return;
        }

        const validation = validateImportJSON(parsed);
        if (validation.success) {
          isDirtyRef.current = true;
          setState(validation.data);
        } else {
          alert(validation.error);
        }
      } catch {
        alert('Failed to process JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleLoadDemo = () => {
    if (window.confirm('This will overwrite current data. Load demo?')) {
      isDirtyRef.current = true;
      setState(DEMO_STATE);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to completely reset the tool? All current data will be lost.')) {
      isDirtyRef.current = true;
      setState(createEmptyState());
    }
  };

  return (
    <div className="app-container">
      <Header 
        onExport={handleExport} 
        onImport={handleImport} 
        onLoadDemo={handleLoadDemo} 
        onReset={handleReset} 
      />

      <main>
        <div className="cp-hide-print">
          <ContextCard 
            meta={state.meta} 
            profile={state.integrityProfile}
            onMetaChange={updateMeta}
            onProfileChange={updateProfile}
          />

          <AIUsagePositionCard 
            position={state.integrityProfile.aiUsagePosition}
            onChange={(val) => updateProfile('aiUsagePosition', val)}
          />

          <ListEditorCard 
            title="Acceptable Uses"
            description="Clarify permitted AI-supported activity for this assessment."
            items={state.integrityProfile.acceptableUses}
            onChange={(items) => updateProfile('acceptableUses', items)}
            starterExamples={[
              'Brainstorming ideas',
              'Improving structure',
              'Checking clarity',
              'Summarising notes',
              'Creating draft outlines',
              'Language refinement'
            ]}
          />

          <ListEditorCard 
            title="Unacceptable Uses"
            description="Clarify what crosses the line and is considered misconduct."
            items={state.integrityProfile.unacceptableUses}
            onChange={(items) => updateProfile('unacceptableUses', items)}
            starterExamples={[
              'Generating the full submission',
              'Producing undisclosed final answers',
              'Fabricating references',
              'Replacing personal reflection',
              'Completing individual work in full without attribution'
            ]}
          />

          <ListEditorCard 
            title="Conditions / Caveats"
            description="Define disclosure requirements, citation expectations, or task-stage restrictions."
            items={state.integrityProfile.conditions}
            onChange={(items) => updateProfile('conditions', items)}
            starterExamples={[
              'All AI assistance must be disclosed in a methodology statement',
              'Only grammar/spell-checking tools are allowed',
              'AI may only be used during the initial research phase'
            ]}
          />

          <RationaleCard 
            profile={state.integrityProfile}
            onChange={updateProfile}
          />

          <div className="cp-card cp-form-group">
            <div className="cp-card-header">
              <h2 className="cp-card-title">Institutional Notes (Optional)</h2>
              <p className="cp-card-description">Reference institutional policies, codes of conduct, or monitoring notes.</p>
            </div>
            <div className="cp-form-group">
              <label className="cp-label">Policy Reference</label>
              <input 
                type="text"
                className="cp-input"
                placeholder="e.g. University Code of Academic Integrity 2026, Section 4.2"
                value={state.institutionalNotes.policyReference || ''}
                onChange={(e) => {
                  isDirtyRef.current = true;
                  setState(prev => ({
                    ...prev,
                    institutionalNotes: { ...prev.institutionalNotes, policyReference: e.target.value },
                    lastUpdated: new Date().toISOString()
                  }));
                }}
              />
            </div>
            <div className="cp-form-group">
              <label className="cp-label">General Institutional Notes</label>
              <textarea 
                className="cp-textarea"
                placeholder="E.g. Policy references, alignment with university code of conduct"
                value={state.institutionalNotes.generalNotes || ''}
                onChange={(e) => {
                  isDirtyRef.current = true;
                  setState(prev => ({
                    ...prev,
                    institutionalNotes: { ...prev.institutionalNotes, generalNotes: e.target.value },
                    lastUpdated: new Date().toISOString()
                  }));
                }}
              />
            </div>
          </div>

          <CapabilityGovernanceSection 
            profile={state.integrityProfile}
            onChange={updateProfile}
          />
        </div>

        <OutputArea state={state} />
      </main>
    </div>
  );
}

export default App;
