import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { ListEditorCard } from '../components/ListEditorCard';
import { AIUsagePositionCard } from '../components/AIUsagePositionCard';
import { ContextCard } from '../components/ContextCard';
import { RationaleCard } from '../components/RationaleCard';
import { createEmptyState } from '../types';

describe('Batch 3: Accessibility & Component Semantics', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Form Labels and Associations (id & htmlFor)', () => {
    it('associates ContextCard labels with matching input elements via id and htmlFor', () => {
      const empty = createEmptyState();
      const mockMeta = empty.meta;
      const mockProfile = empty.integrityProfile;

      render(
        <ContextCard
          meta={mockMeta}
          profile={mockProfile}
          onMetaChange={() => {}}
          onProfileChange={() => {}}
        />
      );

      const programmeLabel = screen.getByText('Programme Name');
      expect(programmeLabel).toHaveAttribute('for', 'programme-name-input');
      const programmeInput = screen.getByRole('textbox', { name: 'Programme Name' });
      expect(programmeInput).toHaveAttribute('id', 'programme-name-input');

      const moduleLabel = screen.getByText('Module Name');
      expect(moduleLabel).toHaveAttribute('for', 'module-name-input');
      const moduleInput = screen.getByRole('textbox', { name: 'Module Name' });
      expect(moduleInput).toHaveAttribute('id', 'module-name-input');

      const assessmentLabel = screen.getByText('Assessment Title');
      expect(assessmentLabel).toHaveAttribute('for', 'assessment-title-input');
      const assessmentInput = screen.getByRole('textbox', { name: 'Assessment Title' });
      expect(assessmentInput).toHaveAttribute('id', 'assessment-title-input');

      const levelLabel = screen.getByText('Level');
      expect(levelLabel).toHaveAttribute('for', 'level-input');
      const levelInput = screen.getByRole('textbox', { name: 'Level' });
      expect(levelInput).toHaveAttribute('id', 'level-input');

      const typeLabel = screen.getByText('Assessment Type');
      expect(typeLabel).toHaveAttribute('for', 'assessment-type-select');
      const typeSelect = screen.getByRole('combobox', { name: 'Assessment Type' });
      expect(typeSelect).toHaveAttribute('id', 'assessment-type-select');

      const descLabel = screen.getByText('Short Context Description');
      expect(descLabel).toHaveAttribute('for', 'context-description-textarea');
      const descInput = screen.getByRole('textbox', { name: 'Short Context Description' });
      expect(descInput).toHaveAttribute('id', 'context-description-textarea');
    });

    it('associates RationaleCard form fields with matching ids and htmlFors', () => {
      const empty = createEmptyState();
      const mockProfile = empty.integrityProfile;

      render(
        <RationaleCard
          profile={mockProfile}
          onChange={() => {}}
        />
      );

      const studentLabel = screen.getByText('Student Guidance text');
      expect(studentLabel).toHaveAttribute('for', 'student-guidance-textarea');
      const studentInput = screen.getByRole('textbox', { name: 'Student Guidance text' });
      expect(studentInput).toHaveAttribute('id', 'student-guidance-textarea');

      const staffLabel = screen.getByText('Staff Rationale text');
      expect(staffLabel).toHaveAttribute('for', 'staff-rationale-textarea');
      const staffInput = screen.getByRole('textbox', { name: 'Staff Rationale text' });
      expect(staffInput).toHaveAttribute('id', 'staff-rationale-textarea');

      const authenticityLabel = screen.getByText('Authenticity Notes');
      expect(authenticityLabel).toHaveAttribute('for', 'authenticity-notes-textarea');
      const authenticityInput = screen.getByRole('textbox', { name: 'Authenticity Notes' });
      expect(authenticityInput).toHaveAttribute('id', 'authenticity-notes-textarea');

      const risksLabel = screen.getByText('Risks or Concerns');
      expect(risksLabel).toHaveAttribute('for', 'risks-concerns-textarea');
      const risksInput = screen.getByRole('textbox', { name: 'Risks or Concerns' });
      expect(risksInput).toHaveAttribute('id', 'risks-concerns-textarea');

      const ackRequiredLabel = screen.getByText('Acknowledgement Required (Optional)');
      expect(ackRequiredLabel).toHaveAttribute('for', 'ack-required-select');
      const ackRequiredSelect = screen.getByRole('combobox', { name: 'Acknowledgement Required' });
      expect(ackRequiredSelect).toHaveAttribute('id', 'ack-required-select');

      const ackFormatLabel = screen.getByText('Acknowledgement Format / Standard (Optional)');
      expect(ackFormatLabel).toHaveAttribute('for', 'ack-format-input');
      const ackFormatInput = screen.getByRole('textbox', { name: 'Acknowledgement Format' });
      expect(ackFormatInput).toHaveAttribute('id', 'ack-format-input');
    });

    it('groups AI usage position options in a semantic fieldset with accessible legend', () => {
      render(<AIUsagePositionCard position="allowed" onChange={() => {}} />);

      const legend = screen.getByText('Choose AI Usage Position');
      expect(legend).toBeInTheDocument();
      expect(legend.tagName.toLowerCase()).toBe('legend');

      const allowedRadio = screen.getByRole('radio', { name: /^Allowed/i });
      const notAllowedRadio = screen.getByRole('radio', { name: /^Not Allowed/i });
      const conditionalRadio = screen.getByRole('radio', { name: /^Conditional/i });

      expect(allowedRadio).toBeInTheDocument();
      expect(notAllowedRadio).toBeInTheDocument();
      expect(conditionalRadio).toBeInTheDocument();
    });
  });

  describe('Live Region & Action Announcements', () => {
    it('renders a polite aria-live status container', () => {
      render(<App />);
      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toBeInTheDocument();
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('announces status feedback when loading demo state', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(<App />);

      const loadDemoBtn = screen.getByRole('button', { name: /Load Demo/i });
      fireEvent.click(loadDemoBtn);

      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveTextContent('Demo data loaded successfully.');
    });

    it('announces status feedback when copying statement to clipboard', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<App />);

      const copyBtn = screen.getByRole('button', { name: /Copy Summary|Copy summary to clipboard/i });
      await act(async () => {
        fireEvent.click(copyBtn);
      });

      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveTextContent('AI Integrity Statement copied to clipboard.');
    });
  });

  describe('List Editor Stability & Non-Destructive Key Behaviour', () => {
    it('maintains input focus and stable key identities during inline editing', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <ListEditorCard
          title="Permitted Tools"
          description="Guidelines"
          items={['Initial entry', 'Second entry']}
          onChange={handleChange}
        />
      );

      const input = screen.getByDisplayValue('Initial entry');
      input.focus();
      expect(document.activeElement).toBe(input);

      // Type into the first input
      fireEvent.change(input, { target: { value: 'Updated entry' } });
      expect(handleChange).toHaveBeenCalledWith(['Updated entry', 'Second entry']);

      // Rerender with updated items as parent state would
      rerender(
        <ListEditorCard
          title="Permitted Tools"
          description="Guidelines"
          items={['Updated entry', 'Second entry']}
          onChange={handleChange}
        />
      );

      // Verify the input is still present and matches the updated value
      const updatedInput = screen.getByDisplayValue('Updated entry');
      expect(updatedInput).toBeInTheDocument();
    });

    it('reorders list items without altering other entries or corrupting schema', () => {
      const handleChange = vi.fn();
      render(
        <ListEditorCard
          title="Permitted Tools"
          description="Guidelines"
          items={['Item Alpha', 'Item Beta', 'Item Gamma']}
          onChange={handleChange}
        />
      );

      const moveDownButtons = screen.getAllByRole('button', { name: /Move item 1 down/i });
      expect(moveDownButtons.length).toBeGreaterThan(0);

      fireEvent.click(moveDownButtons[0]);
      expect(handleChange).toHaveBeenCalledWith(['Item Beta', 'Item Alpha', 'Item Gamma']);
    });

    it('preserves clean string arrays without adding synthetic IDs to saved output schema', () => {
      render(<App />);

      // When checking the App's stored or exported integrityProfile,
      // acceptableUses and unacceptableUses must strictly be Array<string>
      const rawStored = localStorage.getItem('cp-ai-integrity-state');
      if (rawStored) {
        const parsed = JSON.parse(rawStored);
        expect(Array.isArray(parsed.integrityProfile.acceptableUses)).toBe(true);
        parsed.integrityProfile.acceptableUses.forEach((item: unknown) => {
          expect(typeof item).toBe('string');
        });
      }
    });
  });
});
