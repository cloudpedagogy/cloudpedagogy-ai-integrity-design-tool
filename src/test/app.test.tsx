import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { STORAGE_KEY } from '../utils/validation';
import { DEMO_STATE } from '../types';

describe('App End-to-End Workflow & Regression Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders application header, forms, and output area with initial empty state', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /CloudPedagogy AI Integrity Design Tool/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Load Demo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Tool/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export JSON/i })).toBeInTheDocument();
    expect(screen.getByText(/Import JSON/i)).toBeInTheDocument();

    // Cards (using getAllByText where text appears in both form header and output area)
    expect(screen.getAllByText('Assessment Context').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('AI Usage Position').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Acceptable Uses').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Unacceptable Uses').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Conditions / Caveats').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Rationale & Integrity Design')).toBeInTheDocument();
    expect(screen.getByText('Institutional Notes (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Generated Guidance Summary')).toBeInTheDocument();
  });

  it('allows editing assessment metadata and reflects changes in output area', async () => {
    render(<App />);

    const programmeInput = screen.getByPlaceholderText('e.g. BSc Computer Science');
    fireEvent.change(programmeInput, { target: { value: 'BSc Cyber Security' } });

    const moduleInput = screen.getByPlaceholderText('e.g. Introduction to Software Engineering');
    fireEvent.change(moduleInput, { target: { value: 'Network Security' } });

    const assessmentInput = screen.getByPlaceholderText('e.g. Final Group Project');
    fireEvent.change(assessmentInput, { target: { value: 'Vulnerability Analysis Brief' } });

    await waitFor(() => {
      expect(programmeInput).toHaveValue('BSc Cyber Security');
      expect(moduleInput).toHaveValue('Network Security');
      expect(assessmentInput).toHaveValue('Vulnerability Analysis Brief');
    });

    // Check output summary reflects metadata
    expect(screen.getByText(/Network Security/i)).toBeInTheDocument();
    expect(screen.getByText(/BSc Cyber Security/i)).toBeInTheDocument();
  });

  it('allows selecting AI usage positions (allowed, not_allowed, conditional)', async () => {
    render(<App />);

    const allowedRadio = screen.getByDisplayValue('allowed') as HTMLInputElement;
    const conditionalRadio = screen.getByDisplayValue('conditional') as HTMLInputElement;
    const notAllowedRadio = screen.getByDisplayValue('not_allowed') as HTMLInputElement;

    // Select Allowed
    fireEvent.click(allowedRadio);
    expect(allowedRadio.checked).toBe(true);

    // Select Conditional
    fireEvent.click(conditionalRadio);
    expect(conditionalRadio.checked).toBe(true);
    expect(allowedRadio.checked).toBe(false);

    // Select Not Allowed
    fireEvent.click(notAllowedRadio);
    expect(notAllowedRadio.checked).toBe(true);
  });

  it('allows adding, removing, and selecting starter items in list editors', async () => {
    render(<App />);

    // Click a starter example for acceptable uses
    const starterBtn = screen.getByRole('button', { name: '+ Brainstorming ideas' });
    fireEvent.click(starterBtn);

    expect(screen.getAllByText('Brainstorming ideas').length).toBeGreaterThanOrEqual(1);

    // Type a custom item
    const customInput = screen.getAllByPlaceholderText('Type a new item and press Enter...')[0];
    const addBtn = screen.getAllByRole('button', { name: 'Add' })[0];

    fireEvent.change(customInput, { target: { value: 'Drafting presentation slide outlines' } });
    fireEvent.click(addBtn);

    expect(screen.getAllByText('Drafting presentation slide outlines').length).toBeGreaterThanOrEqual(1);

    // Remove the custom item
    const removeButtons = screen.getAllByRole('button', { name: 'Remove item' });
    fireEvent.click(removeButtons[removeButtons.length - 1]);

    expect(screen.queryByText('Drafting presentation slide outlines')).not.toBeInTheDocument();
  });

  it('loads demo state when confirmed and populates fields and output summary', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<App />);

    const loadDemoBtn = screen.getByRole('button', { name: /Load Demo/i });
    fireEvent.click(loadDemoBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue(DEMO_STATE.meta.moduleName!)).toBeInTheDocument();
      expect(screen.getByDisplayValue(DEMO_STATE.meta.programmeName!)).toBeInTheDocument();
      expect(screen.getAllByText(DEMO_STATE.integrityProfile.acceptableUses[0]).length).toBeGreaterThanOrEqual(1);
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.meta.moduleName).toBe(DEMO_STATE.meta.moduleName);
  });

  it('resets tool when confirmed', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STATE));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<App />);

    expect(screen.getByDisplayValue(DEMO_STATE.meta.moduleName!)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset Tool/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      const moduleInput = screen.getByPlaceholderText('e.g. Introduction to Software Engineering');
      expect(moduleInput).toHaveValue('');
    });
  });

  it('handles JSON file import safely, updating state when valid', async () => {
    const importData = {
      meta: {
        moduleName: 'Imported Ethics in AI',
        programmeName: 'Philosophy',
        assessmentTitle: 'Term Paper'
      },
      integrityProfile: {
        id: 'imported-prof',
        title: 'Ethics Paper',
        contextDescription: 'Ethics discussion',
        aiUsagePosition: 'conditional',
        acceptableUses: ['Citation assistance'],
        unacceptableUses: ['Ghost writing'],
        conditions: ['Formal declaration'],
        studentGuidance: 'Please disclose prompt transcripts',
        staffRationale: 'Preserve authentic evaluation'
      },
      institutionalNotes: {
        generalNotes: 'Approved by ethics committee'
      }
    };

    const jsonText = JSON.stringify(importData);

    class MockFileReader {
      onload: ((e: { target: { result: string } }) => void) | null = null;
      readAsText() {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: jsonText } });
          }
        }, 10);
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    render(<App />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const file = new File([jsonText], 'integrity.json', { type: 'application/json' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Imported Ethics in AI')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Philosophy')).toBeInTheDocument();
      expect(screen.getAllByText('Citation assistance').length).toBeGreaterThanOrEqual(1);
    });

    vi.unstubAllGlobals();
  });

  it('rejects invalid JSON file import and leaves current state intact', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STATE));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    class MockFileReaderBroken {
      onload: ((e: { target: { result: string } }) => void) | null = null;
      readAsText() {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: '{ malformed json ...' } });
          }
        }, 10);
      }
    }

    vi.stubGlobal('FileReader', MockFileReaderBroken);

    render(<App />);

    expect(screen.getByDisplayValue(DEMO_STATE.meta.moduleName!)).toBeInTheDocument();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const invalidFile = new File(['{ malformed json ...'], 'broken.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to read JSON'));
    });

    // Existing data is still loaded
    expect(screen.getByDisplayValue(DEMO_STATE.meta.moduleName!)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
