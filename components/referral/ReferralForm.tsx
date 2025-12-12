'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ReferralFormProps {
  referralCode?: string;
  onSuccess?: () => void;
}

export default function ReferralForm({ referralCode, onSuccess }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    lead_company: '',
    lead_message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get('utm_source') || undefined;
      const utm_medium = urlParams.get('utm_medium') || undefined;
      const utm_campaign = urlParams.get('utm_campaign') || undefined;

      const response = await fetch('/api/referral/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referral_code: referralCode,
          utm_source,
          utm_medium,
          utm_campaign,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your referral has been submitted successfully. We\'ll be in touch soon.',
        });
        
        // Reset form
        setFormData({
          lead_name: '',
          lead_email: '',
          lead_phone: '',
          lead_company: '',
          lead_message: '',
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error('Referral submit failed', data);
        setSubmitStatus({
          type: 'error',
          message:
            data.error ||
            data.details ||
            data.code ||
            'Failed to submit referral. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="referral-form-container">
      <form onSubmit={handleSubmit} className="referral-form">
        {submitStatus.type && (
          <div
            className={`alert ${
              submitStatus.type === 'success' ? 'alert-success' : 'alert-error'
            }`}
            role="alert"
          >
            {submitStatus.message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="lead_name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="lead_name"
            name="lead_name"
            value={formData.lead_name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lead_email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="lead_email"
            name="lead_email"
            value={formData.lead_email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="john@company.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lead_phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="lead_phone"
            name="lead_phone"
            value={formData.lead_phone}
            onChange={handleChange}
            className="form-input"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lead_company" className="form-label">
            Company Name
          </label>
          <input
            type="text"
            id="lead_company"
            name="lead_company"
            value={formData.lead_company}
            onChange={handleChange}
            className="form-input"
            placeholder="Your Company Inc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="lead_message" className="form-label">
            Message
          </label>
          <textarea
            id="lead_message"
            name="lead_message"
            value={formData.lead_message}
            onChange={handleChange}
            rows={4}
            className="form-input"
            placeholder="Tell us about your needs..."
          />
        </div>

        {referralCode && (
          <div className="referral-code-display">
            <small>Referral Code: <strong>{referralCode}</strong></small>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-submit"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </button>

        <p className="form-notice">
          <small>
            By submitting this form, you agree to our privacy policy. 
            Your information will be used to contact you about our services.
          </small>
        </p>
      </form>

      <style jsx>{`
        .referral-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        .referral-form {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .alert {
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .required {
          color: #dc3545;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        textarea.form-input {
          resize: vertical;
          font-family: inherit;
        }

        .referral-code-display {
          padding: 0.75rem;
          background-color: #f8f9fa;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .btn-submit {
          width: 100%;
          padding: 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-submit:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-notice {
          margin-top: 1rem;
          text-align: center;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .referral-form-container {
            padding: 1rem;
          }

          .referral-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

