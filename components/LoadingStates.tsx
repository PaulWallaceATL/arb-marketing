'use client';

import React from 'react';

/**
 * Spinner Component
 * Simple loading spinner
 */
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${className}`}>
      <style jsx>{`
        .spinner {
          border: 3px solid rgba(147, 51, 234, 0.1);
          border-top-color: #9333ea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Full Page Loader
 * Covers entire viewport with loading animation
 */
export function FullPageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="full-page-loader">
      <div className="loader-content">
        <Spinner size="lg" />
        <p className="loader-message">{message}</p>
      </div>

      <style jsx>{`
        .full-page-loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .loader-message {
          font-family: var(--font-libre-baskerville);
          color: #6b7280;
          font-size: 1.125rem;
          margin: 0;
        }

        @media (prefers-color-scheme: dark) {
          .full-page-loader {
            background: rgba(17, 24, 39, 0.95);
          }

          .loader-message {
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton Loader
 * Placeholder for loading content
 */
export function Skeleton({ 
  width = '100%', 
  height = '20px', 
  className = '' 
}: { 
  width?: string; 
  height?: string; 
  className?: string;
}) {
  return (
    <div className={`skeleton ${className}`} style={{ width, height }}>
      <style jsx>{`
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s ease-in-out infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (prefers-color-scheme: dark) {
          .skeleton {
            background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
            background-size: 200% 100%;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Card Skeleton
 * Loading placeholder for card components
 */
export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton height="200px" />
      <div className="card-skeleton-content">
        <Skeleton height="24px" width="70%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="90%" />
        <Skeleton height="40px" width="120px" />
      </div>

      <style jsx>{`
        .card-skeleton {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .card-skeleton-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (prefers-color-scheme: dark) {
          .card-skeleton {
            background: #1f2937;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Table Loading
 * Loading state for tables
 */
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="table-loading">
      <table>
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <Skeleton height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <Skeleton height="16px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .table-loading {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 1rem;
          text-align: left;
        }

        thead {
          background: #f9fafb;
        }

        tbody tr {
          border-bottom: 1px solid #e5e7eb;
        }

        @media (prefers-color-scheme: dark) {
          thead {
            background: #1f2937;
          }

          tbody tr {
            border-bottom-color: #374151;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Button Loading State
 * Shows loading spinner inside button
 */
export function ButtonLoading({ children, isLoading, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading && <Spinner size="sm" className="button-spinner" />}
      {children}
      
      <style jsx>{`
        button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        :global(.button-spinner) {
          margin-right: 0.5rem;
        }
      `}</style>
    </button>
  );
}

/**
 * Progress Bar
 * Shows loading progress
 */
export function ProgressBar({ progress, showPercentage = true }: { progress: number; showPercentage?: boolean }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${clampedProgress}%` }} />
      </div>
      {showPercentage && <span className="progress-text">{Math.round(clampedProgress)}%</span>}

      <style jsx>{`
        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
          border-radius: 9999px;
        }

        .progress-text {
          font-family: var(--font-libre-baskerville);
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 600;
          min-width: 3rem;
          text-align: right;
        }

        @media (prefers-color-scheme: dark) {
          .progress-bar {
            background: #374151;
          }

          .progress-text {
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Pulse Animation
 * Subtle pulsing effect for loading states
 */
export function Pulse({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pulse ${className}`}>
      {children}

      <style jsx>{`
        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

