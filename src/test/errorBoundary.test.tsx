import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { STORAGE_KEY } from '../utils/validation';

const ThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test crash in child component');
  }
  return <div>Component rendered normally</div>;
};

const TestContainer: React.FC = () => {
  const [hasCrash, setHasCrash] = useState(false);
  return (
    <ErrorBoundary>
      <button onClick={() => setHasCrash(true)}>Trigger Error</button>
      <ThrowingComponent shouldThrow={hasCrash} />
    </ErrorBoundary>
  );
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('catches render errors, displays recovery guidance, and preserves localStorage without destructive reset', () => {
    // Populate storage with user data
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ existingData: 'must-be-preserved' }));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<TestContainer />);

    expect(screen.getByText('Component rendered normally')).toBeInTheDocument();

    // Trigger error
    fireEvent.click(screen.getByText('Trigger Error'));

    // Boundary caught error
    expect(screen.getByText('Application Error')).toBeInTheDocument();
    expect(screen.getByText(/Your existing assessment and integrity data in local storage has/i)).toBeInTheDocument();
    expect(screen.getByText(/Test crash in child component/i)).toBeInTheDocument();

    // Buttons
    expect(screen.getByRole('button', { name: /Reload Application/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();

    // Critical check: storage was NOT wiped
    expect(localStorage.getItem(STORAGE_KEY)).toContain('must-be-preserved');

    // Destructive reset controls must NOT exist
    expect(screen.queryByRole('button', { name: /Clear data/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Reset storage/i })).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('triggers reload on Reload Application button click', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock window.location.reload
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: reloadMock }
    });

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /Reload Application/i });
    fireEvent.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
