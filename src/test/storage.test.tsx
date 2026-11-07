import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { STORAGE_KEY, STORAGE_BACKUP_KEY } from '../utils/validation';
import { DEMO_STATE } from '../types';

describe('localStorage Persistence and Safeguards', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('restores valid saved state from localStorage on initial render', () => {
    const saved = {
      ...DEMO_STATE,
      meta: {
        ...DEMO_STATE.meta,
        moduleName: 'Persisted Biology 101'
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    render(<App />);

    expect(screen.getByDisplayValue('Persisted Biology 101')).toBeInTheDocument();
  });

  it('non-destructively handles corrupted JSON without overwriting it on mount', async () => {
    const corruptedJSON = '{"meta": { "moduleName": "Broken JSON ...';
    localStorage.setItem(STORAGE_KEY, corruptedJSON);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<App />);

    // UI renders default empty state without crashing
    expect(screen.getByRole('heading', { name: /CloudPedagogy AI Integrity Design Tool/i })).toBeInTheDocument();

    // Verify raw corrupted data in STORAGE_KEY was NOT overwritten on mount
    expect(localStorage.getItem(STORAGE_KEY)).toBe(corruptedJSON);

    // Verify backup was saved to STORAGE_BACKUP_KEY
    expect(localStorage.getItem(STORAGE_BACKUP_KEY)).toBe(corruptedJSON);

    warnSpy.mockRestore();
  });

  it('preserves existing corrupted backup and never overwrites it', () => {
    const originalCorrupted = '{"corrupted": "first original error"';
    const secondCorrupted = '{"corrupted": "second subsequent error"';

    localStorage.setItem(STORAGE_KEY, originalCorrupted);
    localStorage.setItem(STORAGE_BACKUP_KEY, originalCorrupted);

    // Now storage key has second corrupted string
    localStorage.setItem(STORAGE_KEY, secondCorrupted);

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<App />);

    // Existing backup must still be the first original backup
    expect(localStorage.getItem(STORAGE_BACKUP_KEY)).toBe(originalCorrupted);
  });

  it('safely handles non-object payloads in localStorage', () => {
    const nonObject = '"simple primitive string"';
    localStorage.setItem(STORAGE_KEY, nonObject);

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<App />);

    expect(localStorage.getItem(STORAGE_KEY)).toBe(nonObject);
    expect(localStorage.getItem(STORAGE_BACKUP_KEY)).toBe(nonObject);
  });

  it('handles localStorage read failure gracefully without crashing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: LocalStorage disabled');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    expect(screen.getByRole('heading', { name: /CloudPedagogy AI Integrity Design Tool/i })).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('handles localStorage write failure gracefully when user modifies state', async () => {
    render(<App />);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const programmeInput = screen.getByPlaceholderText('e.g. BSc Computer Science');
    fireEvent.change(programmeInput, { target: { value: 'MSc Data Science' } });

    await waitFor(() => {
      expect(programmeInput).toHaveValue('MSc Data Science');
    });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('overwrites storage with new valid state once the user actually modifies data', async () => {
    const corruptedJSON = '{"invalid": true';
    localStorage.setItem(STORAGE_KEY, corruptedJSON);
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<App />);

    // Storage is preserved initially
    expect(localStorage.getItem(STORAGE_KEY)).toBe(corruptedJSON);

    // User modifies a field
    const moduleInput = screen.getByPlaceholderText('e.g. Introduction to Software Engineering');
    fireEvent.change(moduleInput, { target: { value: 'New Module Title' } });

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(stored.meta.moduleName).toBe('New Module Title');
    });

    // Backup is still safely preserved
    expect(localStorage.getItem(STORAGE_BACKUP_KEY)).toBe(corruptedJSON);
  });
});
