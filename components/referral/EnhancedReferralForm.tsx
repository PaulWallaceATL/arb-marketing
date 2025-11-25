'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface EnhancedReferralFormProps {
  referralCode?: string;
  onSuccess?: () => void;
}

export default function EnhancedReferralForm({ referralCode, onSuccess }: EnhancedReferralFormProps) {
  const [formData, setFormData] = useState({
    // Lead (person being referred) information
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    lead_company: '',
    lead_job_title: '',
    lead_industry: '',
    lead_company_size: '',
    lead_budget_range: '',
    lead_timeline: '',
    lead_pain_points: '',
    lead_linkedin_url: '',
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

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '🎉 Thank you! Your referral has been submitted successfully. We\'ll reach out to them soon!',
        });
        
        // Reset form
        setFormData({
          lead_name: '',
          lead_email: '',
          lead_phone: '',
          lead_company: '',
          lead_job_title: '',
          lead_industry: '',
          lead_company_size: '',
          lead_budget_range: '',
          lead_timeline: '',
          lead_pain_points: '',
          lead_linkedin_url: '',
          lead_message: '',
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to submit referral. Please try again.',
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
        <h2>📋 Refer Someone Who Needs Our Services</h2>
        <p className="form-description">
          Know someone who could benefit from our marketing solutions? Tell us about them below!
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

        {/* Section: Contact Information */}
        <div className="form-section">
          <h3 className="section-title">👤 Contact Information</h3>
          
          <div className="form-row">
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
                placeholder="John Smith"
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
                placeholder="john.smith@company.com"
              />
            </div>
          </div>

          <div className="form-row">
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
              <label htmlFor="lead_linkedin_url" className="form-label">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="lead_linkedin_url"
                name="lead_linkedin_url"
                value={formData.lead_linkedin_url}
                onChange={handleChange}
                className="form-input"
                placeholder="https://linkedin.com/in/johnsmith"
              />
            </div>
          </div>
        </div>

        {/* Section: Company & Role */}
        <div className="form-section">
          <h3 className="section-title">🏢 Company & Role</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lead_company" className="form-label">
                Company Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lead_company"
                name="lead_company"
                value={formData.lead_company}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Acme Corporation"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lead_job_title" className="form-label">
                Job Title
              </label>
              <input
                type="text"
                id="lead_job_title"
                name="lead_job_title"
                value={formData.lead_job_title}
                onChange={handleChange}
                className="form-input"
                placeholder="Marketing Director"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lead_industry" className="form-label">
                Industry
              </label>
              <select
                id="lead_industry"
                name="lead_industry"
                value={formData.lead_industry}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select industry...</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lead_company_size" className="form-label">
                Company Size
              </label>
              <select
                id="lead_company_size"
                name="lead_company_size"
                value={formData.lead_company_size}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select size...</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Project Details */}
        <div className="form-section">
          <h3 className="section-title">💼 Project Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lead_budget_range" className="form-label">
                Estimated Budget Range
              </label>
              <select
                id="lead_budget_range"
                name="lead_budget_range"
                value={formData.lead_budget_range}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select budget...</option>
                <option value="Under $5k">Under $5,000</option>
                <option value="$5k-$10k">$5,000 - $10,000</option>
                <option value="$10k-$25k">$10,000 - $25,000</option>
                <option value="$25k-$50k">$25,000 - $50,000</option>
                <option value="$50k-$100k">$50,000 - $100,000</option>
                <option value="$100k+">$100,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lead_timeline" className="form-label">
                Timeline
              </label>
              <select
                id="lead_timeline"
                name="lead_timeline"
                value={formData.lead_timeline}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select timeline...</option>
                <option value="Immediate">Immediate (ASAP)</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6+ months">6+ months</option>
                <option value="Just exploring">Just exploring</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lead_pain_points" className="form-label">
              What challenges are they facing?
            </label>
            <textarea
              id="lead_pain_points"
              name="lead_pain_points"
              value={formData.lead_pain_points}
              onChange={handleChange}
              rows={3}
              className="form-input"
              placeholder="e.g., Need to increase lead generation, struggling with brand visibility, looking to launch new product..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="lead_message" className="form-label">
              Additional Notes
            </label>
            <textarea
              id="lead_message"
              name="lead_message"
              value={formData.lead_message}
              onChange={handleChange}
              rows={3}
              className="form-input"
              placeholder="Any other relevant information about this referral..."
            />
          </div>
        </div>

        {referralCode && (
          <div className="referral-code-display">
            <span className="icon">🎯</span>
            <small>Tracking code: <strong>{referralCode}</strong></small>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-submit"
        >
          {isSubmitting ? 'Submitting...' : '🚀 Submit Referral'}
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
          color: #333;
          margin-bottom: 0.75rem;
        }

        .form-description {
          font-size: 1.1rem;
          color: #666;
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
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 1.5rem;
          font-weight: 600;
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

