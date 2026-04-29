import React, { useState, useEffect } from 'react';
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
import { Header } from './components/Header';
import { ContextCard } from './components/ContextCard';
import { AIUsagePositionCard } from './components/AIUsagePositionCard';
import { ListEditorCard } from './components/ListEditorCard';
import { RationaleCard } from './components/RationaleCard';
import { CapabilityGovernanceSection } from './components/CapabilityGovernanceSection';
import { OutputArea } from './components/OutputArea';

const STORAGE_KEY = 'cp-ai-integrity-state';

function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    return createEmptyState();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateMeta = (field: keyof Meta, value: string) => {
    setState(prev => ({
      ...prev,
      meta: { ...prev.meta, [field]: value },
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateProfile = (field: keyof IntegrityProfile, value: any) => {
    setState(prev => ({
      ...prev,
      integrityProfile: { ...prev.integrityProfile, [field]: value },
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "ai-integrity-design.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.integrityProfile) {
          setState(imported);
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (err) {
        alert('Failed to read JSON.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleLoadDemo = () => {
    if (window.confirm('This will overwrite current data. Load demo?')) {
      setState(DEMO_STATE);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to completely reset the tool? All current data will be lost.')) {
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

        <div className="cp-form-group cp-card">
          <label className="cp-label">Institutional Notes (Optional)</label>
          <textarea 
            className="cp-textarea"
            placeholder="E.g. Policy references, alignment with university code of conduct"
            value={state.institutionalNotes.generalNotes || ''}
            onChange={(e) => setState(prev => ({
              ...prev,
              institutionalNotes: { ...prev.institutionalNotes, generalNotes: e.target.value }
            }))}
          />
        </div>

        <CapabilityGovernanceSection 
          profile={state.integrityProfile}
          onChange={updateProfile}
        />

        <OutputArea state={state} />
      </main>
    </div>
  );
}

export default App;
