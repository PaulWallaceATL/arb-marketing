'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Replace with actual API endpoint or email service
      console.log('Form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aximo-all-section">
      {/* Breadcrumb */}
      <div className="aximo-breadcrumb">
        <div className="container">
          <h1 style={{ fontFamily: "'Roxborough CF', serif" }}>Contact Us</h1>
          <nav>
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="active">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contact Content */}
      <div className="section aximo-section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="aximo-default-content">
                <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Let's Build Your Practice Together</h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Ready to take your personal injury firm to the next level? Schedule a free consultation to discuss your goals and how we can help you achieve them.
                </p>
              </div>

              <div className="aximo-contact-info-wrap">
                <div className="aximo-contact-info-item">
                  <div className="aximo-contact-info-icon">
                    <i className="icon-phone"></i>
                  </div>
                  <div className="aximo-contact-info-data">
                    <span style={{ fontFamily: "'Libre Baskerville', serif" }}>Phone</span>
                    <h4 style={{ fontFamily: "'Roxborough CF', serif" }}>+1 (555) 123-4567</h4>
                  </div>
                </div>

                <div className="aximo-contact-info-item">
                  <div className="aximo-contact-info-icon">
                    <i className="icon-mail"></i>
                  </div>
                  <div className="aximo-contact-info-data">
                    <span style={{ fontFamily: "'Libre Baskerville', serif" }}>Email</span>
                    <h4 style={{ fontFamily: "'Roxborough CF', serif" }}>info@arbmarketing.com</h4>
                  </div>
                </div>

                <div className="aximo-contact-info-item">
                  <div className="aximo-contact-info-icon">
                    <i className="icon-location"></i>
                  </div>
                  <div className="aximo-contact-info-data">
                    <span style={{ fontFamily: "'Libre Baskerville', serif" }}>Location</span>
                    <h4 style={{ fontFamily: "'Roxborough CF', serif" }}>Los Angeles, CA</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="aximo-contact-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="aximo-form-field">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      style={{ fontFamily: "'Libre Baskerville', serif" }}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                  </div>

                  <div className="aximo-form-field">
                    <input
                      type="email"
                      placeholder="Your Email *"
                      style={{ fontFamily: "'Libre Baskerville', serif" }}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>

                  <div className="aximo-form-field">
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      style={{ fontFamily: "'Libre Baskerville', serif" }}
                      {...register('phone')}
                    />
                  </div>

                  <div className="aximo-form-field">
                    <input
                      type="text"
                      placeholder="Law Firm Name"
                      style={{ fontFamily: "'Libre Baskerville', serif" }}
                      {...register('company')}
                    />
                  </div>

                  <div className="aximo-form-field">
                    <textarea
                      placeholder="Your Message *"
                      rows={5}
                      style={{ fontFamily: "'Libre Baskerville', serif" }}
                      {...register('message', { required: 'Message is required' })}
                    ></textarea>
                    {errors.message && <span className="error-message">{errors.message.message}</span>}
                  </div>

                  {submitStatus === 'success' && (
                    <div className="alert alert-success" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="alert alert-danger" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      Oops! Something went wrong. Please try again.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="aximo-default-btn" 
                    disabled={isSubmitting}
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    <span className="aximo-label-up">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                    <span className="aximo-label-up">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

