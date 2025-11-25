'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

/**
 * Error Fallback Component
 * Displays when an error occurs within the error boundary
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="error-boundary-fallback">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p className="error-message">{error.message}</p>
        <button onClick={resetErrorBoundary} className="error-reset-button">
          Try again
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre>{error.stack}</pre>
          </details>
        )}
      </div>

      <style jsx>{`
        .error-boundary-fallback {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .error-container {
          max-width: 600px;
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        h2 {
          font-family: var(--font-roxborough-cf);
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .error-message {
          font-family: var(--font-libre-baskerville);
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .error-reset-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .error-reset-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .error-details {
          margin-top: 2rem;
          text-align: left;
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .error-details summary {
          cursor: pointer;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .error-details pre {
          margin-top: 1rem;
          font-size: 0.75rem;
          color: #6b7280;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        @media (max-width: 768px) {
          .error-container {
            padding: 2rem 1.5rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          .error-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Error logger function
 * Logs errors to console and potentially to external service
 */
function logError(error: Error, errorInfo: React.ErrorInfo) {
  console.error('Error caught by boundary:', error);
  console.error('Error info:', errorInfo);
  
  // TODO: Send to error tracking service (e.g., Sentry)
  // Sentry.captureException(error, { contexts: { react: errorInfo } });
}

/**
 * Main Error Boundary Component
 * Wraps parts of the app that need error handling
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || ErrorFallback}
      onError={logError}
      onReset={() => {
        // Reset app state if needed
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Utility hook to manually trigger error boundary
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  
  if (error) {
    throw error;
  }
  
  return setError;
}

