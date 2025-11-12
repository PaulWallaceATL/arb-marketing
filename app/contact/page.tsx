'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  website: string;
  currentNeeds: string;
  message: string;
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactFormData>();

  const services = [
    { value: 'referral-solutions', label: 'Premium Referral Solutions' },
    { value: 'content-marketing', label: 'Content Marketing' },
    { value: 'strategic-consulting', label: 'Strategic Consulting' },
    { value: 'custom-campaigns', label: 'Custom Campaigns' },
    { value: 'partnership-marketing', label: 'Partnership Marketing' },
    { value: 'website-design-seo', label: 'Website Design and SEO' },
  ];

  const selectService = (value: string, label: string) => {
    setSelectedService(label);
    setValue('currentNeeds', value);
    setDropdownOpen(false);
  };

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
      setSelectedService('');
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-dropdown {
          position: relative;
          width: 100%;
        }
        .aximo-main-field.dropdown-field {
          border-bottom: none !important;
          padding-bottom: 0 !important;
        }
        .aximo-main-field.dropdown-field::after {
          display: none !important;
        }
        .custom-dropdown-selected {
          font-family: 'Libre Baskerville', serif;
          padding: 15px 20px;
          border: 2px solid #B39FD5;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        .custom-dropdown-selected:hover {
          border-color: #9B7FC5;
          background: #F9F7FC;
        }
        .custom-dropdown-selected.active {
          border-color: #B39FD5;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          background: #F9F7FC;
        }
        .custom-dropdown-arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #B39FD5;
          transition: transform 0.3s ease;
        }
        .custom-dropdown-selected.active .custom-dropdown-arrow {
          transform: rotate(180deg);
        }
        .custom-dropdown-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #B39FD5;
          border-top: none;
          border-radius: 0 0 8px 8px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          z-index: 10;
          box-shadow: 0 4px 6px rgba(179, 159, 213, 0.1);
        }
        .custom-dropdown-options.active {
          max-height: 300px;
          overflow-y: auto;
        }
        .custom-dropdown-option {
          font-family: 'Libre Baskerville', serif;
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .custom-dropdown-option:hover {
          background: #F3EFFC;
          color: #6B46A8;
        }
        .custom-dropdown-option:last-child {
          border-radius: 0 0 6px 6px;
        }
        .custom-dropdown-placeholder {
          color: #999;
        }
      `}</style>

      <div className="section aximo-section-padding extra-side-margin">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="aximo-section-title">
                <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>
                  <span className="aximo-title-animation">
                    Experience the
                  </span>
                  difference
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-5 order-lg-2">
              <div className="aximo-contact-thumb wow fadeInRight" data-wow-delay="0.1s" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d424143.47484722535!2d-84.38800199999999!3d33.7489954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" 
                  width="100%" 
                  height="600" 
                  style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            
            <div className="col-lg-7">
              <div className="aximo-main-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="aximo-main-field">
                    <label style={{ fontFamily: "'Libre Baskerville', serif" }}>Your name</label>
                    <input 
                      type="text" 
                      style={{ fontFamily: "'Libre Baskerville', serif", borderRadius: '8px' }}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                  </div>
                  
                  <div className="aximo-main-field">
                    <label style={{ fontFamily: "'Libre Baskerville', serif" }}>Email Address</label>
                    <input 
                      type="email" 
                      style={{ fontFamily: "'Libre Baskerville', serif", borderRadius: '8px' }}
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
                  
                  <div className="aximo-main-field">
                    <label style={{ fontFamily: "'Libre Baskerville', serif" }}>Phone Number</label>
                    <input 
                      type="text" 
                      style={{ fontFamily: "'Libre Baskerville', serif", borderRadius: '8px' }}
                      {...register('phone')}
                    />
                  </div>
                  
                  <div className="aximo-main-field">
                    <label style={{ fontFamily: "'Libre Baskerville', serif" }}>Firm Website</label>
                    <input 
                      type="url" 
                      style={{ fontFamily: "'Libre Baskerville', serif", borderRadius: '8px' }} 
                      placeholder="https://example.com"
                      {...register('website')}
                    />
                  </div>
                  
                  <div className="aximo-main-field dropdown-field">
                    <label style={{ fontFamily: "'Libre Baskerville', serif" }}>Current Needs</label>
                    <div className="custom-dropdown">
                      <div 
                        className={`custom-dropdown-selected ${dropdownOpen ? 'active' : ''}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <span className={selectedService ? '' : 'custom-dropdown-placeholder'}>
                          {selectedService || 'Select a service...'}
                        </span>
                        <div className="custom-dropdown-arrow"></div>
                      </div>
                      <div className={`custom-dropdown-options ${dropdownOpen ? 'active' : ''}`}>
                        {services.map(service => (
                          <div 
                            key={service.value}
                            className="custom-dropdown-option"
                            onClick={() => selectService(service.value, service.label)}
                          >
                            {service.label}
                          </div>
                        ))}
                      </div>
                      <input type="hidden" {...register('currentNeeds')} />
                    </div>
                  </div>
                  
                  <div className="aximo-main-field" style={{ borderBottom: 'none', marginBottom: '30px' }}>
                    <label style={{ fontFamily: "'Libre Baskerville', serif" }}>Write your message here...</label>
                    <input 
                      type="text" 
                      placeholder="Tell us about your needs..."
                      style={{ fontFamily: "'Libre Baskerville', serif", borderRadius: '8px' }}
                      {...register('message')}
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="alert alert-success mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="alert alert-danger mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      Oops! Something went wrong. Please try again.
                    </div>
                  )}
                  
                  <button 
                    className="aximo-default-btn aximo-header-btn outline-btn" 
                    type="submit"
                    disabled={isSubmitting}
                    style={{ fontFamily: "'Libre Baskerville', serif", color: '#000 !important', border: '2px solid #B39FD5 !important', background: 'transparent !important' }}
                  >
                    <span className="aximo-label-up" style={{ color: '#000 !important' }}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                    <span className="aximo-label-up" style={{ color: '#000 !important' }}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aximo-contact-info-section extra-side-margin">
        <div className="container">
          <div className="aximo-contact-info-title">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>
              <span className="aximo-title-animation">
                Contact Information
              </span>
            </h2>
          </div>
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <a href="">
                <div className="aximo-contact-info-box wow fadeInUpX" data-wow-delay="0.1s">
                  <div className="aximo-contact-info-icon">
                    <img src="/assets/img/icons/icon-orange-phone.svg" alt="" />
                  </div>
                  <div className="aximo-contact-info-data">
                    <span style={{ fontFamily: "'Roxborough CF', serif" }}>Call us</span>
                    <p style={{ fontFamily: "'Libre Baskerville', serif" }}>+088-234-6532-789</p>
                    <p style={{ fontFamily: "'Libre Baskerville', serif" }}>+088-456-3217-005</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-xl-4 col-md-6">
              <a href="">
                <div className="aximo-contact-info-box wow fadeInUpX" data-wow-delay="0.2s">
                  <div className="aximo-contact-info-icon">
                    <img src="/assets/images/icon/email.svg" alt="" />
                  </div>
                  <div className="aximo-contact-info-data">
                    <span style={{ fontFamily: "'Roxborough CF', serif" }}>Email us</span>
                    <p style={{ fontFamily: "'Libre Baskerville', serif" }}>example@gmail.com</p>
                    <p style={{ fontFamily: "'Libre Baskerville', serif" }}>example@gmail.com</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="aximo-contact-info-box wow fadeInUpX" data-wow-delay="0.3s">
                <div className="aximo-contact-info-icon">
                  <img src="/assets/images/icon/map.svg" alt="" />
                </div>
                <div className="aximo-contact-info-data">
                  <span style={{ fontFamily: "'Roxborough CF', serif" }}>Office address</span>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>4132 Thornridge City, New York.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

