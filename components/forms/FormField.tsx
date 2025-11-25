'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Form Field Wrapper Component
 * Provides consistent styling and error handling for form fields
 */
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function FormField({
  label,
  error,
  required = false,
  helpText,
  children,
  htmlFor,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('form-field', error && 'form-field-error', className)}>
      <label htmlFor={htmlFor} className="form-label">
        {label}
        {required && <span className="required-indicator" aria-label="required">*</span>}
      </label>

      {children}

      {helpText && !error && (
        <p className="help-text" id={`${htmlFor}-help`}>
          {helpText}
        </p>
      )}

      {error && (
        <p className="error-text" role="alert" id={`${htmlFor}-error`}>
          {error}
        </p>
      )}

      <style jsx>{`
        .form-field {
          margin-bottom: 1.5rem;
        }

        .form-field-error :global(input),
        .form-field-error :global(textarea),
        .form-field-error :global(select) {
          border-color: #dc2626;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.95rem;
        }

        .required-indicator {
          color: #dc2626;
          margin-left: 0.25rem;
        }

        .help-text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .error-text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #dc2626;
          font-weight: 500;
        }

        @media (prefers-color-scheme: dark) {
          .form-label {
            color: #e5e7eb;
          }

          .help-text {
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Text Input Component
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <>
      <input
        className={cn('form-input', error && 'form-input-error', className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : props['aria-describedby']}
        {...props}
      />

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
          font-family: inherit;
          background: white;
          color: #1f2937;
        }

        .form-input:focus {
          outline: none;
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }

        .form-input-error {
          border-color: #dc2626;
        }

        .form-input:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        @media (prefers-color-scheme: dark) {
          .form-input {
            background: #1f2937;
            border-color: #374151;
            color: #f9fafb;
          }

          .form-input:disabled {
            background: #111827;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Textarea Component
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <>
      <textarea
        className={cn('form-textarea', error && 'form-textarea-error', className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : props['aria-describedby']}
        {...props}
      />

      <style jsx>{`
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
          font-family: inherit;
          background: white;
          color: #1f2937;
          resize: vertical;
          min-height: 100px;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }

        .form-textarea-error {
          border-color: #dc2626;
        }

        .form-textarea:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        @media (prefers-color-scheme: dark) {
          .form-textarea {
            background: #1f2937;
            border-color: #374151;
            color: #f9fafb;
          }

          .form-textarea:disabled {
            background: #111827;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Select Component
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function Select({ error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <>
      <select
        className={cn('form-select', error && 'form-select-error', className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : props['aria-describedby']}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <style jsx>{`
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
          font-family: inherit;
          background: white;
          color: #1f2937;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.5rem;
          padding-right: 3rem;
        }

        .form-select:focus {
          outline: none;
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }

        .form-select-error {
          border-color: #dc2626;
        }

        .form-select:disabled {
          background-color: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        @media (prefers-color-scheme: dark) {
          .form-select {
            background-color: #1f2937;
            border-color: #374151;
            color: #f9fafb;
          }

          .form-select:disabled {
            background-color: #111827;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Checkbox Component
 */
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export function Checkbox({ label, error, className, ...props }: CheckboxProps) {
  return (
    <div className={cn('checkbox-wrapper', className)}>
      <label className="checkbox-label">
        <input
          type="checkbox"
          className="checkbox-input"
          aria-invalid={!!error}
          {...props}
        />
        <span className="checkbox-text">{label}</span>
      </label>

      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}

      <style jsx>{`
        .checkbox-wrapper {
          margin-bottom: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .checkbox-input {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.25rem;
          cursor: pointer;
          accent-color: #9333ea;
        }

        .checkbox-text {
          color: #374151;
          font-size: 0.95rem;
        }

        .error-text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #dc2626;
          font-weight: 500;
        }

        @media (prefers-color-scheme: dark) {
          .checkbox-input {
            border-color: #374151;
          }

          .checkbox-text {
            color: #e5e7eb;
          }
        }
      `}</style>
    </div>
  );
}

