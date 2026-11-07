import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { generatePlainTextSummary } from '../utils/summary';
import { DEMO_STATE } from '../types';

describe('Print / PDF Output & Summary Reliability Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Print Layout & Controls', () => {
    it('wraps editing forms and action buttons in cp-hide-print, and marks summary as printable-summary', () => {
      const { container } = render(<App />);

      const hidePrintElements = container.querySelectorAll('.cp-hide-print');
      expect(hidePrintElements.length).toBeGreaterThanOrEqual(2);

      // Printable summary container exists and is not hidden
      const printableSummary = container.querySelector('.printable-summary');
      expect(printableSummary).toBeInTheDocument();
      expect(printableSummary?.classList.contains('cp-hide-print')).toBe(false);

      // Buttons inside printable summary header are hidden in print
      const summaryHeader = printableSummary?.querySelector('.cp-hide-print');
      expect(summaryHeader).toBeInTheDocument();
    });

    it('triggers window.print when Print / Save to PDF button is clicked', () => {
      const printMock = vi.fn();
      window.print = printMock;

      render(<App />);

      const printButtons = screen.getAllByRole('button', { name: /print/i });
      expect(printButtons.length).toBeGreaterThanOrEqual(1);

      fireEvent.click(printButtons[0]);
      expect(printMock).toHaveBeenCalledTimes(1);
    });

    it('includes all relevant assessment metadata and integrity details in the printable output', () => {
      localStorage.setItem('cp-ai-integrity-state', JSON.stringify({
        ...DEMO_STATE,
        integrityProfile: {
          ...DEMO_STATE.integrityProfile,
          acknowledgementRequired: true,
          acknowledgementFormat: 'APA 7th AI Citation'
        }
      }));

      const { container } = render(<App />);
      const printableSummary = container.querySelector('.printable-summary');
      expect(printableSummary).not.toBeNull();

      expect(printableSummary).toHaveTextContent(/Health Policy Analysis/);
      expect(printableSummary).toHaveTextContent(/Master of Public Health/);
      expect(printableSummary).toHaveTextContent(/Policy Analysis Essay/);
      expect(printableSummary).toHaveTextContent(/Conditional/);
      expect(printableSummary).toHaveTextContent(/Brainstorming possible policy angles/);
      expect(printableSummary).toHaveTextContent(/Generating the full essay/);
      expect(printableSummary).toHaveTextContent(/Students must remain responsible/);
      expect(printableSummary).toHaveTextContent(/Declaration Required:/);
      expect(printableSummary).toHaveTextContent(/APA 7th AI Citation/);
      expect(printableSummary).toHaveTextContent(/This assessment is designed to evaluate/);
      expect(printableSummary).toHaveTextContent(/Refer to local institutional guidance/);
    });
  });

  describe('Plaintext Statement Generation', () => {
    it('generates well-structured plaintext statement with all domain sections', () => {
      const fullState = {
        ...DEMO_STATE,
        integrityProfile: {
          ...DEMO_STATE.integrityProfile,
          acknowledgementRequired: true,
          acknowledgementFormat: 'IEEE standard disclosure'
        }
      };

      const plainText = generatePlainTextSummary(fullState);

      expect(plainText).toContain('AI INTEGRITY STATEMENT & GUIDANCE');
      expect(plainText).toContain('--- ASSESSMENT CONTEXT ---');
      expect(plainText).toContain('Module: Health Policy Analysis');
      expect(plainText).toContain('--- AI USAGE POSITION ---');
      expect(plainText).toContain('Position: Conditional');
      expect(plainText).toContain('--- ACCEPTABLE USES ---');
      expect(plainText).toContain('• Brainstorming possible policy angles or questions');
      expect(plainText).toContain('--- UNACCEPTABLE USES ---');
      expect(plainText).toContain('• Generating the full essay or substantial sections');
      expect(plainText).toContain('--- CONDITIONS / CAVEATS ---');
      expect(plainText).toContain('--- ACKNOWLEDGEMENT REQUIREMENTS ---');
      expect(plainText).toContain('Declaration Required: Yes');
      expect(plainText).toContain('Format: IEEE standard disclosure');
      expect(plainText).toContain('--- STUDENT GUIDANCE ---');
      expect(plainText).toContain('--- STAFF RATIONALE ---');
      expect(plainText).toContain('--- INSTITUTIONAL NOTES ---');
      expect(plainText).toContain('Policy Reference: Refer to local institutional guidance');
    });

    it('handles empty or missing sections gracefully in statement generation', () => {
      const minimalState = {
        meta: {},
        integrityProfile: {
          id: 'min',
          title: '',
          contextDescription: '',
          aiUsagePosition: '' as const,
          acceptableUses: [],
          unacceptableUses: [],
          conditions: [],
          studentGuidance: '',
          staffRationale: '',
          authenticityNotes: '',
          risksOrConcerns: ''
        },
        institutionalNotes: {},
        lastUpdated: new Date().toISOString()
      };

      const plainText = generatePlainTextSummary(minimalState);
      expect(plainText).toContain('Module: N/A');
      expect(plainText).toContain('Position: Not Defined');
      expect(plainText).toContain('None specified.');
    });
  });

  describe('Clipboard Copying & Feedback', () => {
    it('successfully copies plain-text statement and displays visual feedback', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<App />);

      const copyBtn = screen.getByRole('button', { name: /Copy summary/i });
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledTimes(1);
        expect(writeTextMock.mock.calls[0][0]).toContain('AI INTEGRITY STATEMENT & GUIDANCE');
      });

      // Visual feedback
      expect(screen.getByText('✓ Copied!')).toBeInTheDocument();
    });

    it('handles clipboard failure gracefully and presents failure feedback', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<App />);

      const copyBtn = screen.getByRole('button', { name: /Copy summary/i });
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(screen.getByText('✕ Copy Failed')).toBeInTheDocument();
      });
    });
  });
});
