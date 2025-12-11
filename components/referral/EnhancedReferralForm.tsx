'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface EnhancedReferralFormProps {
  referralCode?: string;
  onSuccess?: () => void;
}

export default function EnhancedReferralForm({ referralCode, onSuccess }: EnhancedReferralFormProps) {
  const [formData, setFormData] = useState({
    // Referrer information
    referrer_name: '',
    referrer_email: '',
    referrer_phone: '',
    // Person being referred
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    // Context
    lead_message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

      // Attach auth token if logged in so the referral is tied to the user
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch('/api/referral/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          referral_code: referralCode,
          utm_source,
          utm_medium,
          utm_campaign,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your referral has been submitted successfully. We\'ll reach out to them soon.',
        });
        
        // Reset form
        setFormData({
          referrer_name: '',
          referrer_email: '',
          referrer_phone: '',
          lead_name: '',
          lead_email: '',
          lead_phone: '',
          lead_message: '',
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || data.details || 'Failed to submit referral. Please try again.',
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
    <div className="enhanced-referral-form-container">
      <div className="form-header">
        <h2>Refer Someone Who Needs Our Help</h2>
        <p className="form-description">
          Simple form: tell us who you are, who you’re referring, and why they need help.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="enhanced-referral-form">
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

        {/* Section: Referrer Information */}
        <div className="form-section">
          <h3 className="section-title">Your Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="referrer_name" className="form-label">
                Your Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="referrer_name"
                name="referrer_name"
                value={formData.referrer_name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="referrer_email" className="form-label">
                Your Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="referrer_email"
                name="referrer_email"
                value={formData.referrer_email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="referrer_phone" className="form-label">
                Your Phone (optional)
              </label>
              <input
                type="tel"
                id="referrer_phone"
                name="referrer_phone"
                value={formData.referrer_phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Section: Person Being Referred */}
        <div className="form-section">
          <h3 className="section-title">Person You're Referring</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lead_name" className="form-label">
                Their Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lead_name"
                name="lead_name"
                value={formData.lead_name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Full name of the person you're referring"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lead_email" className="form-label">
                Their Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="lead_email"
                name="lead_email"
                value={formData.lead_email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="their.email@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lead_phone" className="form-label">
                Their Phone (optional)
              </label>
              <input
                type="tel"
                id="lead_phone"
                name="lead_phone"
                value={formData.lead_phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+1 (555) 987-6543"
              />
            </div>
          </div>
        </div>

        {/* Section: Reason */}
        <div className="form-section">
          <h3 className="section-title">Reason for Referral</h3>
          <div className="form-group">
            <label htmlFor="lead_message" className="form-label">
              Describe the situation <span className="required">*</span>
            </label>
            <textarea
              id="lead_message"
              name="lead_message"
              value={formData.lead_message}
              onChange={handleChange}
              rows={4}
              required
              className="form-input"
              placeholder="Briefly describe the accident or reason for referral. Include any important details we should know."
            />
          </div>
        </div>

        {referralCode && (
          <div className="referral-code-display">
            <small>Tracking code: <strong>{referralCode}</strong></small>
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
            By submitting this referral, you agree that we can contact the person you're referring about our services.
          </small>
        </p>
      </form>

      <style jsx>{`
        .enhanced-referral-form-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-header h2 {
          font-size: 2rem;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .form-description {
          font-size: 1.1rem;
          color: #4a4a4a;
          line-height: 1.6;
        }

        .enhanced-referral-form {
          background: #fff;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .form-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .section-title {
          font-size: 1.25rem;
          color: #1a1a1a;
          margin-bottom: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .alert {
          padding: 1rem 1.25rem;
          margin-bottom: 2rem;
          border-radius: 8px;
          font-size: 0.95rem;
          line-height: 1.5;
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
          font-size: 0.95rem;
        }

        .required {
          color: #dc3545;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 100px;
        }

        select.form-input {
          cursor: pointer;
        }

        .referral-code-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .referral-code-display .icon {
          font-size: 1.25rem;
        }

        .btn-submit {
          width: 100%;
          padding: 1.125rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-submit:disabled {
          background: #999;
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
        }

        .form-notice {
          margin-top: 1.5rem;
          text-align: center;
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .enhanced-referral-form-container {
            padding: 1rem;
          }

          .enhanced-referral-form {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-header h2 {
            font-size: 1.5rem;
          }

          .form-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

