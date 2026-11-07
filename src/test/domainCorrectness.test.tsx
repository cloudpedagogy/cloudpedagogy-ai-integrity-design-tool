import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { STORAGE_KEY } from '../utils/validation';
import { DEMO_STATE } from '../types';

describe('AI Integrity Domain Correctness Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('switching AI stance does not unexpectedly delete existing guidance or list items', async () => {
    // Start with demo state loaded
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STATE));

    render(<App />);

    expect(screen.getByDisplayValue(DEMO_STATE.integrityProfile.studentGuidance)).toBeInTheDocument();
    expect(screen.getByDisplayValue(DEMO_STATE.integrityProfile.staffRationale)).toBeInTheDocument();
    expect(screen.getAllByText(DEMO_STATE.integrityProfile.acceptableUses[0]).length).toBeGreaterThanOrEqual(1);

    // Switch stance to 'not_allowed'
    const notAllowedRadio = screen.getByDisplayValue('not_allowed');
    fireEvent.click(notAllowedRadio);

    // Verify all existing guidance and list entries remain intact
    expect(screen.getByDisplayValue(DEMO_STATE.integrityProfile.studentGuidance)).toBeInTheDocument();
    expect(screen.getByDisplayValue(DEMO_STATE.integrityProfile.staffRationale)).toBeInTheDocument();
    expect(screen.getAllByText(DEMO_STATE.integrityProfile.acceptableUses[0]).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(DEMO_STATE.integrityProfile.unacceptableUses[0]).length).toBeGreaterThanOrEqual(1);

    // Verify storage has updated stance while retaining guidance
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.integrityProfile.aiUsagePosition).toBe('not_allowed');
    expect(stored.integrityProfile.stance).toBe('not_allowed');
    expect(stored.integrityProfile.studentGuidance).toBe(DEMO_STATE.integrityProfile.studentGuidance);
  });

  it('maintains consistency between conditions and acknowledgement requirements', async () => {
    render(<App />);

    // Select acknowledgement required
    const ackSelect = screen.getByLabelText(/Acknowledgement Required/i);
    fireEvent.change(ackSelect, { target: { value: 'true' } });

    // Enter acknowledgement format
    const formatInput = screen.getByPlaceholderText(/Standard declaration form/i);
    fireEvent.change(formatInput, { target: { value: 'Methodology AI Disclosure Statement' } });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(stored.integrityProfile.acknowledgementRequired).toBe(true);
      expect(stored.integrityProfile.acknowledgementFormat).toBe('Methodology AI Disclosure Statement');
    });

    // Check OutputArea renders acknowledgement section
    expect(screen.getByText('Acknowledgement Requirements')).toBeInTheDocument();
    expect(screen.getByText(/Declaration Required:/i).parentElement).toHaveTextContent('Yes');
    expect(screen.getByText(/Expected Format:/i).parentElement).toHaveTextContent('Methodology AI Disclosure Statement');
  });

  it('keeps institutional notes and policy reference consistent across editing and output', async () => {
    render(<App />);

    const policyInput = screen.getByPlaceholderText(/University Code of Academic Integrity/i);
    fireEvent.change(policyInput, { target: { value: 'Policy Doc 2026/A' } });

    const notesInput = screen.getByPlaceholderText(/Policy references, alignment with university code of conduct/i);
    fireEvent.change(notesInput, { target: { value: 'Sampling 20% of submissions for interview verification.' } });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(stored.institutionalNotes.policyReference).toBe('Policy Doc 2026/A');
      expect(stored.institutionalNotes.generalNotes).toBe('Sampling 20% of submissions for interview verification.');
    });

    // Check OutputArea reflects both
    expect(screen.getByText('Policy Doc 2026/A')).toBeInTheDocument();
    expect(screen.getAllByText('Sampling 20% of submissions for interview verification.').length).toBeGreaterThanOrEqual(1);
  });

  it('preserves governance reflection notes across accordion expand/collapse cycles', async () => {
    render(<App />);

    // Expand accordion
    const toggleButton = screen.getByRole('button', { name: /Capability & Governance Reflection Notes/i });
    fireEvent.click(toggleButton);

    const capInput = screen.getByPlaceholderText('Enter capability reflections...');
    const govInput = screen.getByPlaceholderText('Enter governance considerations...');

    fireEvent.change(capInput, { target: { value: 'Reflective practice embedded in rubric' } });
    fireEvent.change(govInput, { target: { value: 'Audited by Department Quality Lead' } });

    // Collapse accordion
    fireEvent.click(toggleButton);

    // Verify inputs unmounted from active DOM view
    expect(screen.queryByPlaceholderText('Enter capability reflections...')).not.toBeInTheDocument();

    // Verify data remains preserved in OutputArea and localStorage
    expect(screen.getByText(/Reflective practice embedded in rubric/i)).toBeInTheDocument();
    expect(screen.getByText(/Audited by Department Quality Lead/i)).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.integrityProfile.capabilityNotes).toBe('Reflective practice embedded in rubric');
    expect(stored.integrityProfile.governanceNotes).toBe('Audited by Department Quality Lead');

    // Re-expand accordion and verify field values are restored
    fireEvent.click(toggleButton);
    expect(screen.getByDisplayValue('Reflective practice embedded in rubric')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Audited by Department Quality Lead')).toBeInTheDocument();
  });

  it('keeps imported and demo records fully editable', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<App />);

    const loadDemoBtn = screen.getByRole('button', { name: /Load Demo/i });
    fireEvent.click(loadDemoBtn);

    // Verify demo loaded
    const moduleInput = screen.getByDisplayValue('Health Policy Analysis');
    expect(moduleInput).toBeInTheDocument();

    // Edit demo title
    fireEvent.change(moduleInput, { target: { value: 'Global Health Policy Analysis' } });
    expect(moduleInput).toHaveValue('Global Health Policy Analysis');

    // Edit demo guidance
    const guidanceInput = screen.getByDisplayValue(DEMO_STATE.integrityProfile.studentGuidance);
    fireEvent.change(guidanceInput, { target: { value: 'Updated Student Guidance for 2026.' } });
    expect(guidanceInput).toHaveValue('Updated Student Guidance for 2026.');
  });
});
