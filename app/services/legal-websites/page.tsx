'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LegalWebsitesPage() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? -1 : index);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="section" style={{ background: 'linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%)', paddingTop: '140px', paddingBottom: '100px', position: 'relative' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="aximo-default-content">
                <span style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  color: '#7C3AED', 
                  textTransform: 'uppercase', 
                  letterSpacing: '3px', 
                  fontSize: '12px', 
                  fontWeight: 700,
                  display: 'inline-block',
                  marginBottom: '20px'
                }}>
                  LEGAL WEBSITE DESIGN & DEVELOPMENT
                </span>
                <h1 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '58px', 
                  marginBottom: '28px', 
                  fontWeight: 700, 
                  color: '#0F172A', 
                  lineHeight: '1.15',
                  letterSpacing: '-0.02em'
                }}>
                  Websites That Win Cases
                </h1>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  fontSize: '18px', 
                  lineHeight: '1.75', 
                  marginBottom: '40px', 
                  color: '#475569',
                  maxWidth: '600px'
                }}>
                  Your website is your firm's most powerful marketing asset. We design, develop, and optimize legal websites that don't just look professional—they convert visitors into paying clients while dominating search rankings.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Link href="/contact" className="aximo-default-btn" style={{ 
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%)', 
                    padding: '18px 36px', 
                    whiteSpace: 'nowrap',
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
                    border: 'none'
                  }}>
                    <span className="aximo-label-up" style={{ color: '#ffffff', fontWeight: 600, fontSize: '15px' }}>Get Free Consultation</span>
                    <span className="aximo-label-up" style={{ color: '#ffffff', fontWeight: 600, fontSize: '15px' }}>Get Free Consultation</span>
                  </Link>
                  <a href="#process" className="aximo-default-btn" style={{ 
                    borderColor: '#7C3AED', 
                    color: '#7C3AED', 
                    padding: '18px 36px', 
                    whiteSpace: 'nowrap',
                    borderRadius: '8px',
                    background: 'white',
                    borderWidth: '2px'
                  }}>
                    <span className="aximo-label-up" style={{ fontWeight: 600, fontSize: '15px' }}>See Our Process</span>
                    <span className="aximo-label-up" style={{ fontWeight: 600, fontSize: '15px' }}>See Our Process</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div style={{ padding: '40px 20px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%)', 
                  padding: '60px 45px', 
                  borderRadius: '16px', 
                  boxShadow: '0 20px 60px rgba(124, 58, 237, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'rgba(255,255,255,0.15)', 
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <i className="icon-rating-stars-1" style={{ fontSize: '36px', color: '#ffffff' }}></i>
                  </div>
                  <h3 style={{ 
                    fontFamily: "'Roxborough CF', serif", 
                    fontSize: '28px', 
                    marginBottom: '18px', 
                    color: '#ffffff',
                    fontWeight: 600
                  }}>
                    Built for Legal Excellence
                  </h3>
                  <p style={{ 
                    fontFamily: "'Libre Baskerville', serif", 
                    fontSize: '15px', 
                    color: 'rgba(255,255,255,0.9)', 
                    margin: 0, 
                    lineHeight: '1.7'
                  }}>
                    ADA compliant, mobile-optimized, and engineered to convert prospects into consultations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section" style={{ padding: '100px 0', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        <div className="container" style={{ position: 'relative' }}>
          <div className="row text-center">
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '40px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '56px', 
                  color: '#7C3AED', 
                  marginBottom: '12px', 
                  fontWeight: 700 
                }}>
                  95%
                </h2>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  fontSize: '14px', 
                  color: '#E2E8F0',
                  letterSpacing: '0.5px'
                }}>
                  Average Page Load Speed Score
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '40px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '56px', 
                  color: '#7C3AED', 
                  marginBottom: '12px', 
                  fontWeight: 700 
                }}>
                  3.2x
                </h2>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  fontSize: '14px', 
                  color: '#E2E8F0',
                  letterSpacing: '0.5px'
                }}>
                  Average Increase in Qualified Leads
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '40px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '56px', 
                  color: '#7C3AED', 
                  marginBottom: '12px', 
                  fontWeight: 700 
                }}>
                  100%
                </h2>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  fontSize: '14px', 
                  color: '#E2E8F0',
                  letterSpacing: '0.5px'
                }}>
                  ADA & Mobile Compliant
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '40px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '56px', 
                  color: '#7C3AED', 
                  marginBottom: '12px', 
                  fontWeight: 700 
                }}>
                  #1
                </h2>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  fontSize: '14px', 
                  color: '#E2E8F0',
                  letterSpacing: '0.5px'
                }}>
                  Average Ranking for Target Keywords
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <style jsx>{`
        .feature-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 40px 35px;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .feature-card:hover {
          box-shadow: 0 20px 60px rgba(124, 58, 237, 0.15);
          transform: translateY(-8px);
          border-color: #7C3AED;
        }
        .feature-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.2);
        }
        .feature-icon i {
          font-size: 28px;
          color: #ffffff;
        }
      `}</style>

      <div className="section aximo-section-padding" style={{ background: '#ffffff', paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="aximo-section-title center" style={{ marginBottom: '70px' }}>
            <span style={{ 
              fontFamily: "'Libre Baskerville', serif", 
              color: '#7C3AED', 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              fontSize: '12px', 
              fontWeight: 700,
              display: 'block',
              marginBottom: '16px'
            }}>
              COMPLETE SOLUTIONS
            </span>
            <h2 style={{ 
              fontFamily: "'Roxborough CF', serif", 
              fontSize: '48px', 
              marginBottom: '24px', 
              color: '#0F172A',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              Everything Your Law Firm Needs to Win Online
            </h2>
            <p style={{ 
              fontFamily: "'Libre Baskerville', serif", 
              maxWidth: '720px', 
              margin: '0 auto', 
              fontSize: '17px', 
              color: '#475569', 
              lineHeight: '1.75'
            }}>
              Our legal websites are built with one goal: converting visitors into consultations. Every design decision is backed by data and optimized for results.
            </p>
          </div>

          <div className="row" style={{ marginTop: '60px' }}>
            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-design-thinking"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Custom Design
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  No templates. Every website is custom-designed to reflect your firm's unique brand, values, and positioning in the personal injury market.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-web"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Lightning-Fast Performance
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  Built on modern technology for blazing-fast load times. Speed is a ranking factor and directly impacts conversion rates.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-branding"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Mobile-First Design
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  Over 70% of legal searches happen on mobile. Your site will look perfect and convert on every device.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-target-1"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Advanced SEO Optimization
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  Technical SEO, on-page optimization, schema markup, and local SEO strategies that get you ranking on page one for high-value keywords.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-rating-stars-1"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Legal Compliance
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  ADA compliant, bar association approved, and built with attorney advertising rules in mind. No compliance headaches.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-target-2"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Conversion-Focused
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  Strategic CTAs, trust signals, case results displays, and intake forms designed to maximize consultation bookings.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-web"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Enterprise Security
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  SSL certificates, secure forms, data encryption, and regular security updates to protect your firm and clients.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-rating-stars-1"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Analytics & Tracking
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  Comprehensive tracking setup so you know exactly where leads come from and what's driving ROI.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="icon-branding"></i>
                </div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Ongoing Support
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  fontSize: '15px', 
                  margin: 0 
                }}>
                  Regular updates, security patches, content updates, and technical support to keep your site running flawlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="section aximo-section-padding" style={{ background: 'linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%)', paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" style={{ marginBottom: '50px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%)', 
                padding: '60px 50px', 
                borderRadius: '16px',
                color: '#ffffff',
                boxShadow: '0 20px 60px rgba(124, 58, 237, 0.2)'
              }}>
                <div style={{ 
                  display: 'inline-flex',
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  marginBottom: '30px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <i className="icon-target-1" style={{ fontSize: '24px', marginRight: '12px' }}></i>
                  <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '14px', fontWeight: 600, letterSpacing: '1px' }}>SEO EXCELLENCE</span>
                </div>
                <h2 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '42px', 
                  marginBottom: '28px', 
                  color: '#ffffff',
                  fontWeight: 700,
                  lineHeight: '1.2'
                }}>
                  SEO That Actually Drives Cases
                </h2>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  fontSize: '16px', 
                  lineHeight: '1.8', 
                  marginBottom: '35px', 
                  color: 'rgba(255,255,255,0.95)' 
                }}>
                  We don't just build beautiful websites—we build websites that win. Our SEO strategies are specifically tailored for personal injury law firms competing in crowded markets.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '18px', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="icon-check" style={{ marginRight: '14px', fontSize: '20px', color: '#ffffff', marginTop: '2px' }}></i>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', lineHeight: '1.6' }}>
                      Local SEO to dominate your geographic market
                    </span>
                  </li>
                  <li style={{ marginBottom: '18px', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="icon-check" style={{ marginRight: '14px', fontSize: '20px', color: '#ffffff', marginTop: '2px' }}></i>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', lineHeight: '1.6' }}>
                      High-value keyword targeting for case types you want
                    </span>
                  </li>
                  <li style={{ marginBottom: '18px', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="icon-check" style={{ marginRight: '14px', fontSize: '20px', color: '#ffffff', marginTop: '2px' }}></i>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', lineHeight: '1.6' }}>
                      Content strategy that positions you as the authority
                    </span>
                  </li>
                  <li style={{ marginBottom: '18px', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="icon-check" style={{ marginRight: '14px', fontSize: '20px', color: '#ffffff', marginTop: '2px' }}></i>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', lineHeight: '1.6' }}>
                      Link building from authoritative legal directories
                    </span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <i className="icon-check" style={{ marginRight: '14px', fontSize: '20px', color: '#ffffff', marginTop: '2px' }}></i>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', lineHeight: '1.6' }}>
                      Monthly reporting with clear ROI metrics
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ paddingLeft: '50px' }}>
                <span style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  color: '#7C3AED', 
                  textTransform: 'uppercase', 
                  letterSpacing: '3px', 
                  fontSize: '12px', 
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '16px'
                }}>
                  PROVEN RESULTS
                </span>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '38px', 
                  marginBottom: '28px', 
                  color: '#0F172A',
                  fontWeight: 700,
                  lineHeight: '1.2'
                }}>
                  Case Study: 247% Increase in Organic Leads
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  fontSize: '16px', 
                  lineHeight: '1.75', 
                  marginBottom: '32px', 
                  color: '#475569' 
                }}>
                  A mid-sized personal injury firm came to us ranking on page 3 for their most valuable keywords. Within 6 months of launching their new website with our SEO strategy:
                </p>
                <div style={{ 
                  background: '#ffffff', 
                  padding: '40px', 
                  borderRadius: '12px', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '20px', fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '18px', marginRight: '8px' }}>→</span>
                      <span><strong style={{ color: '#7C3AED' }}>47 keywords</strong> ranking on page one</span>
                    </li>
                    <li style={{ marginBottom: '20px', fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '18px', marginRight: '8px' }}>→</span>
                      <span><strong style={{ color: '#7C3AED' }}>247% increase</strong> in organic consultation requests</span>
                    </li>
                    <li style={{ marginBottom: '20px', fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '18px', marginRight: '8px' }}>→</span>
                      <span><strong style={{ color: '#7C3AED' }}>$2.4M+</strong> in signed cases from organic traffic</span>
                    </li>
                    <li style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '18px', marginRight: '8px' }}>→</span>
                      <span><strong style={{ color: '#7C3AED' }}>9.2x ROI</strong> within the first year</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <style jsx>{`
        .process-step {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 36px 32px;
          margin-bottom: 28px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .process-step:hover {
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.12);
          border-color: #7C3AED;
          transform: translateX(8px);
        }
        .step-number {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: '22px';
          font-weight: 700;
          margin-bottom: 22px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
        }
      `}</style>

      <div id="process" className="section aximo-section-padding" style={{ background: '#ffffff', paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="aximo-section-title center" style={{ marginBottom: '70px' }}>
            <span style={{ 
              fontFamily: "'Libre Baskerville', serif", 
              color: '#7C3AED', 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              fontSize: '12px', 
              fontWeight: 700,
              display: 'block',
              marginBottom: '16px'
            }}>
              OUR PROCESS
            </span>
            <h2 style={{ 
              fontFamily: "'Roxborough CF', serif", 
              fontSize: '48px', 
              marginBottom: '24px', 
              color: '#0F172A',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              Website Design & Development Process
            </h2>
            <p style={{ 
              fontFamily: "'Libre Baskerville', serif", 
              maxWidth: '720px', 
              margin: '0 auto', 
              fontSize: '17px', 
              color: '#475569', 
              lineHeight: '1.75'
            }}>
              From discovery to launch and beyond, we handle everything. You focus on winning cases—we'll make sure you never run out of them.
            </p>
          </div>

          <div className="row" style={{ marginTop: '60px' }}>
            <div className="col-lg-6">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Discovery & Strategy
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  margin: 0, 
                  fontSize: '15px' 
                }}>
                  We dive deep into your firm's goals, target clients, competitive landscape, and brand positioning. We research your market, analyze competitor websites, and identify opportunities to differentiate your firm online.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">2</div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Design & Architecture
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  margin: 0, 
                  fontSize: '15px' 
                }}>
                  Our design team creates custom mockups that reflect your brand while incorporating conversion-focused best practices. We map out site architecture, user flows, and content strategy.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">3</div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Development & SEO
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  margin: 0, 
                  fontSize: '15px' 
                }}>
                  We build your website on modern technology with clean code, fast performance, and SEO best practices baked in from day one. Technical SEO, schema markup, and mobile optimization are all included.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="process-step">
                <div className="step-number">4</div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Content Creation
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  margin: 0, 
                  fontSize: '15px' 
                }}>
                  We craft compelling copy that speaks directly to injury victims while establishing your authority. Every word is written to educate, build trust, and drive consultation requests.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">5</div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Testing & Launch
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  margin: 0, 
                  fontSize: '15px' 
                }}>
                  Before going live, we thoroughly test every page, form, and feature across all devices and browsers. We ensure perfect functionality, then coordinate a seamless launch with minimal downtime.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">6</div>
                <h3 style={{ 
                  fontFamily: "'Roxborough CF', serif", 
                  fontSize: '22px', 
                  marginBottom: '14px', 
                  color: '#0F172A',
                  fontWeight: 600
                }}>
                  Optimization & Growth
                </h3>
                <p style={{ 
                  fontFamily: "'Libre Baskerville', serif", 
                  lineHeight: '1.75', 
                  color: '#64748B', 
                  margin: 0, 
                  fontSize: '15px' 
                }}>
                  Launch is just the beginning. We continuously monitor performance, analyze user behavior, and optimize for better conversions. Monthly SEO updates keep you ranking and competitive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="aximo-cta-section" style={{ padding: '100px 0', background: 'linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        <div className="container" style={{ position: 'relative' }}>
          <div className="aximo-cta-wrap text-center">
            <div className="aximo-cta-content">
              <h2 style={{ 
                fontFamily: "'Roxborough CF', serif", 
                fontSize: '48px', 
                marginBottom: '24px', 
                fontWeight: 700, 
                color: '#ffffff',
                lineHeight: '1.2'
              }}>
                Ready to Dominate Your Market Online?
              </h2>
              <p style={{ 
                fontFamily: "'Libre Baskerville', serif", 
                fontSize: '18px', 
                marginBottom: '45px', 
                maxWidth: '700px', 
                marginLeft: 'auto', 
                marginRight: 'auto', 
                color: 'rgba(255,255,255,0.95)', 
                lineHeight: '1.75'
              }}>
                Let's build you a website that doesn't just look great—it wins cases. Schedule a free consultation to discuss your firm's goals and see how we can help you dominate your market.
              </p>
            </div>
            <div className="aximo-cta-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="aximo-default-btn" style={{ 
                background: '#ffffff', 
                padding: '18px 36px', 
                whiteSpace: 'nowrap',
                borderRadius: '8px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}>
                <span className="aximo-label-up" style={{ color: '#7C3AED', fontWeight: 600, fontSize: '15px' }}>Schedule Consultation</span>
                <span className="aximo-label-up" style={{ color: '#7C3AED', fontWeight: 600, fontSize: '15px' }}>Schedule Consultation</span>
              </Link>
              <Link href="/services" className="aximo-default-btn" style={{ 
                borderColor: '#ffffff', 
                color: '#ffffff', 
                padding: '18px 36px', 
                whiteSpace: 'nowrap',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderWidth: '2px'
              }}>
                <span className="aximo-label-up" style={{ fontWeight: 600, fontSize: '15px' }}>View All Services</span>
                <span className="aximo-label-up" style={{ fontWeight: 600, fontSize: '15px' }}>View All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <style jsx>{`
        .faq-accordion-item {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-accordion-item:hover {
          border-color: #7C3AED;
        }
        .faq-accordion-item.open {
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.12);
          border-color: #7C3AED;
        }
        .faq-accordion-header {
          padding: 28px 32px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }
        .faq-accordion-header:hover {
          background: #F8F9FB;
        }
        .faq-accordion-body {
          padding: 0 32px 28px 32px;
        }
        .faq-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: 700;
          flex-shrink: 0;
        }
      `}</style>

      <div className="section aximo-section-padding" style={{ background: 'linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%)', paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="aximo-section-title center" style={{ marginBottom: '70px' }}>
            <span style={{ 
              fontFamily: "'Libre Baskerville', serif", 
              color: '#7C3AED', 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              fontSize: '12px', 
              fontWeight: 700,
              display: 'block',
              marginBottom: '16px'
            }}>
              FAQ
            </span>
            <h2 style={{ 
              fontFamily: "'Roxborough CF', serif", 
              fontSize: '48px', 
              marginBottom: '24px', 
              color: '#0F172A',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="row justify-content-center" style={{ marginTop: '60px' }}>
            <div className="col-lg-10">
              <div className={`faq-accordion-item ${openAccordion === 0 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(0)}>
                  <h3 style={{ 
                    fontFamily: "'Roxborough CF', serif", 
                    fontSize: '19px', 
                    margin: 0, 
                    color: '#0F172A',
                    fontWeight: 600,
                    flex: 1,
                    paddingRight: '20px'
                  }}>
                    How long does it take to build a legal website?
                  </h3>
                  <div className="faq-icon">
                    {openAccordion === 0 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 0 && (
                  <div className="faq-accordion-body">
                    <p style={{ 
                      fontFamily: "'Libre Baskerville', serif", 
                      lineHeight: '1.75', 
                      color: '#64748B', 
                      margin: 0, 
                      fontSize: '15px' 
                    }}>
                      Most legal websites take 6-10 weeks from start to launch, depending on complexity and content requirements. We work efficiently while never sacrificing quality, and we'll give you a detailed timeline during our discovery call.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 1 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(1)}>
                  <h3 style={{ 
                    fontFamily: "'Roxborough CF', serif", 
                    fontSize: '19px', 
                    margin: 0, 
                    color: '#0F172A',
                    fontWeight: 600,
                    flex: 1,
                    paddingRight: '20px'
                  }}>
                    What's included in your website packages?
                  </h3>
                  <div className="faq-icon">
                    {openAccordion === 1 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 1 && (
                  <div className="faq-accordion-body">
                    <p style={{ 
                      fontFamily: "'Libre Baskerville', serif", 
                      lineHeight: '1.75', 
                      color: '#64748B', 
                      margin: 0, 
                      fontSize: '15px' 
                    }}>
                      All packages include custom design, mobile optimization, SEO setup, content creation, contact forms, live chat integration, Google Analytics setup, SSL certificate, ADA compliance, and 30 days of post-launch support. Ongoing maintenance and SEO can be added as monthly retainers.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 2 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(2)}>
                  <h3 style={{ 
                    fontFamily: "'Roxborough CF', serif", 
                    fontSize: '19px', 
                    margin: 0, 
                    color: '#0F172A',
                    fontWeight: 600,
                    flex: 1,
                    paddingRight: '20px'
                  }}>
                    Do you write the content for the website?
                  </h3>
                  <div className="faq-icon">
                    {openAccordion === 2 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 2 && (
                  <div className="faq-accordion-body">
                    <p style={{ 
                      fontFamily: "'Libre Baskerville', serif", 
                      lineHeight: '1.75', 
                      color: '#64748B', 
                      margin: 0, 
                      fontSize: '15px' 
                    }}>
                      Yes! We have experienced legal content writers who create all website copy optimized for both users and search engines. We'll work with you to understand your firm's voice and messaging, then craft compelling content that converts visitors into clients.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 3 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(3)}>
                  <h3 style={{ 
                    fontFamily: "'Roxborough CF', serif", 
                    fontSize: '19px', 
                    margin: 0, 
                    color: '#0F172A',
                    fontWeight: 600,
                    flex: 1,
                    paddingRight: '20px'
                  }}>
                    Will my website be optimized for search engines?
                  </h3>
                  <div className="faq-icon">
                    {openAccordion === 3 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 3 && (
                  <div className="faq-accordion-body">
                    <p style={{ 
                      fontFamily: "'Libre Baskerville', serif", 
                      lineHeight: '1.75', 
                      color: '#64748B', 
                      margin: 0, 
                      fontSize: '15px' 
                    }}>
                      Absolutely. All our websites are built with SEO best practices from the ground up—technical SEO, on-page optimization, schema markup, mobile-first design, and local SEO. We also offer ongoing SEO services to continuously improve your rankings and drive more qualified traffic.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 4 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(4)}>
                  <h3 style={{ 
                    fontFamily: "'Roxborough CF', serif", 
                    fontSize: '19px', 
                    margin: 0, 
                    color: '#0F172A',
                    fontWeight: 600,
                    flex: 1,
                    paddingRight: '20px'
                  }}>
                    What if I need changes after the website launches?
                  </h3>
                  <div className="faq-icon">
                    {openAccordion === 4 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 4 && (
                  <div className="faq-accordion-body">
                    <p style={{ 
                      fontFamily: "'Libre Baskerville', serif", 
                      lineHeight: '1.75', 
                      color: '#64748B', 
                      margin: 0, 
                      fontSize: '15px' 
                    }}>
                      We include 30 days of post-launch support to handle any changes or fixes. After that, we offer flexible monthly maintenance packages or hourly support—whatever works best for your firm. You'll never be stuck with a website you can't update.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 5 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(5)}>
                  <h3 style={{ 
                    fontFamily: "'Roxborough CF', serif", 
                    fontSize: '19px', 
                    margin: 0, 
                    color: '#0F172A',
                    fontWeight: 600,
                    flex: 1,
                    paddingRight: '20px'
                  }}>
                    How much does a legal website cost?
                  </h3>
                  <div className="faq-icon">
                    {openAccordion === 5 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 5 && (
                  <div className="faq-accordion-body">
                    <p style={{ 
                      fontFamily: "'Libre Baskerville', serif", 
                      lineHeight: '1.75', 
                      color: '#64748B', 
                      margin: 0, 
                      fontSize: '15px' 
                    }}>
                      Legal website projects typically range from $7,500 to $25,000 depending on complexity, number of pages, custom features, and content requirements. We'll provide a detailed proposal after our discovery call so you know exactly what to expect—no surprise costs.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
