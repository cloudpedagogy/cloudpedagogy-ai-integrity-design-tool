import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleResetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="app-container" style={{ padding: '2rem 1rem' }}>
          <div 
            className="cp-card" 
            style={{ 
              borderLeft: '4px solid var(--cp-danger)',
              backgroundColor: '#FEF2F2',
              borderColor: '#FCA5A5'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.75rem', lineHeight: 1 }} role="img" aria-label="Warning">⚠️</span>
              <div>
                <h2 style={{ color: '#991B1B', marginBottom: '0.25rem' }}>Application Error</h2>
                <p style={{ color: '#7F1D1D', marginBottom: 0, fontSize: '0.875rem' }}>
                  An unexpected error occurred while displaying the application.
                </p>
              </div>
            </div>

            <p style={{ color: '#7F1D1D', marginBottom: '1rem' }}>
              Your existing assessment and integrity data in local storage has <strong>not</strong> been deleted or overwritten.
            </p>

            {this.state.error?.message && (
              <pre 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  padding: '12px', 
                  borderRadius: 'var(--cp-radius)',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  marginBottom: '1.5rem'
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button"
                className="cp-button-primary" 
                onClick={this.handleReload}
              >
                Reload Application
              </button>
              <button 
                type="button"
                className="cp-button-secondary" 
                onClick={this.handleResetError}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
