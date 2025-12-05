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
      <div className="section aximo-section-padding" style={{ background: '#ffffff', paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="aximo-default-content">
                <span className="aximo-subtitle" style={{ fontFamily: "'Libre Baskerville', serif", color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontWeight: 600 }}>
                  Legal Website Design & Development
                </span>
                <h1 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '52px', marginBottom: '25px', fontWeight: 700, color: '#1a1a1a', lineHeight: '1.2' }}>
                  Websites That Win Cases
                </h1>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '18px', lineHeight: '1.8', marginBottom: '35px', color: '#4a4a4a' }}>
                  Your website is your firm's most powerful marketing asset. We design, develop, and optimize legal websites that don't just look professional—they convert visitors into paying clients while dominating search rankings.
                </p>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <Link href="/contact" className="aximo-default-btn" style={{ background: '#1a1a1a', padding: '16px 32px', whiteSpace: 'nowrap' }}>
                    <span className="aximo-label-up" style={{ color: '#ffffff' }}>Get Free Consultation</span>
                    <span className="aximo-label-up" style={{ color: '#ffffff' }}>Get Free Consultation</span>
                  </Link>
                  <a href="#process" className="aximo-default-btn outline-btn" style={{ borderColor: '#1a1a1a', color: '#1a1a1a', padding: '16px 32px', whiteSpace: 'nowrap' }}>
                    <span className="aximo-label-up">See Our Process</span>
                    <span className="aximo-label-up">See Our Process</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ 
                  background: '#f8f8f8', 
                  padding: '50px 40px', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚖️</div>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '26px', marginBottom: '15px', color: '#1a1a1a' }}>
                    Built for Legal Excellence
                  </h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#666', margin: 0, lineHeight: '1.6' }}>
                    ADA compliant, mobile-optimized, and engineered to convert prospects into consultations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section" style={{ padding: '80px 0', background: '#1a1a1a' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#D4AF37', marginBottom: '10px', fontWeight: 700 }}>
                  95%
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#ffffff' }}>
                  Average Page Load Speed Score
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#D4AF37', marginBottom: '10px', fontWeight: 700 }}>
                  3.2x
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#ffffff' }}>
                  Average Increase in Qualified Leads
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#D4AF37', marginBottom: '10px', fontWeight: 700 }}>
                  100%
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#ffffff' }}>
                  ADA & Mobile Compliant
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#D4AF37', marginBottom: '10px', fontWeight: 700 }}>
                  #1
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#ffffff' }}>
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
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 35px;
          height: 100%;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .feature-card:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          transform: translateY(-5px);
          border-color: #D4AF37;
        }
        .feature-icon {
          width: 60px;
          height: 60px;
          background: #1a1a1a;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 20px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="section aximo-section-padding" style={{ background: '#f8f8f8' }}>
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '42px', marginBottom: '20px', color: '#1a1a1a' }}>
              Everything Your Law Firm Needs to Win Online
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '750px', margin: '0 auto', fontSize: '17px', color: '#4a4a4a', lineHeight: '1.7' }}>
              Our legal websites are built with one goal: converting visitors into consultations. Every design decision is backed by data and optimized for results.
            </p>
          </div>

          <div className="row" style={{ marginTop: '60px' }}>
            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Custom Design
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  No templates. Every website is custom-designed to reflect your firm's unique brand, values, and positioning in the personal injury market.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Lightning-Fast Performance
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  Built on modern technology for blazing-fast load times. Speed is a ranking factor and directly impacts conversion rates.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Mobile-First Design
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  Over 70% of legal searches happen on mobile. Your site will look perfect and convert on every device.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Advanced SEO Optimization
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  Technical SEO, on-page optimization, schema markup, and local SEO strategies that get you ranking on page one for high-value keywords.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">⚖️</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Legal Compliance
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  ADA compliant, bar association approved, and built with attorney advertising rules in mind. No compliance headaches.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">💼</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Conversion-Focused
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  Strategic CTAs, trust signals, case results displays, and intake forms designed to maximize consultation bookings.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Enterprise Security
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  SSL certificates, secure forms, data encryption, and regular security updates to protect your firm and clients.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Analytics & Tracking
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  Comprehensive tracking setup so you know exactly where leads come from and what's driving ROI.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">🛠️</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Ongoing Support
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', fontSize: '15px', margin: 0 }}>
                  Regular updates, security patches, content updates, and technical support to keep your site running flawlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="section aximo-section-padding" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" style={{ marginBottom: '40px' }}>
              <div style={{ 
                background: '#1a1a1a', 
                padding: '50px', 
                borderRadius: '8px',
                color: '#ffffff'
              }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '38px', marginBottom: '25px', color: '#ffffff' }}>
                  SEO That Actually Drives Cases
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px', lineHeight: '1.8', marginBottom: '30px', color: '#e0e0e0' }}>
                  We don't just build beautiful websites—we build websites that win. Our SEO strategies are specifically tailored for personal injury law firms competing in crowded markets.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '12px', fontSize: '20px', color: '#D4AF37' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px' }}>
                      Local SEO to dominate your geographic market
                    </span>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '12px', fontSize: '20px', color: '#D4AF37' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px' }}>
                      High-value keyword targeting for case types you want
                    </span>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '12px', fontSize: '20px', color: '#D4AF37' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px' }}>
                      Content strategy that positions you as the authority
                    </span>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '12px', fontSize: '20px', color: '#D4AF37' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px' }}>
                      Link building from authoritative legal directories
                    </span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '12px', fontSize: '20px', color: '#D4AF37' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px' }}>
                      Monthly reporting with clear ROI metrics
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ paddingLeft: '40px' }}>
                <span className="aximo-subtitle" style={{ fontFamily: "'Libre Baskerville', serif", color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontWeight: 600 }}>
                  Proven Results
                </span>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '36px', marginBottom: '25px', color: '#1a1a1a', marginTop: '10px' }}>
                  Case Study: 247% Increase in Organic Leads
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', lineHeight: '1.8', marginBottom: '25px', color: '#4a4a4a' }}>
                  A mid-sized personal injury firm came to us ranking on page 3 for their most valuable keywords. Within 6 months of launching their new website with our SEO strategy:
                </p>
                <div style={{ background: '#f8f8f8', padding: '35px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '18px', fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#1a1a1a' }}>
                      <strong style={{ color: '#D4AF37' }}>47 keywords</strong> ranking on page one
                    </li>
                    <li style={{ marginBottom: '18px', fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#1a1a1a' }}>
                      <strong style={{ color: '#D4AF37' }}>247% increase</strong> in organic consultation requests
                    </li>
                    <li style={{ marginBottom: '18px', fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#1a1a1a' }}>
                      <strong style={{ color: '#D4AF37' }}>$2.4M+</strong> in signed cases from organic traffic
                    </li>
                    <li style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '15px', color: '#1a1a1a' }}>
                      <strong style={{ color: '#D4AF37' }}>9.2x ROI</strong> within the first year
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
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 25px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .process-step:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: #D4AF37;
        }
        .step-number {
          width: 45px;
          height: 45px;
          background: #1a1a1a;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 18px;
          flex-shrink: 0;
        }
      `}</style>

      <div id="process" className="section aximo-section-padding" style={{ background: '#f8f8f8' }}>
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '42px', marginBottom: '20px', color: '#1a1a1a' }}>
              Our Website Design & Development Process
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '750px', margin: '0 auto', fontSize: '17px', color: '#4a4a4a', lineHeight: '1.7' }}>
              From discovery to launch and beyond, we handle everything. You focus on winning cases—we'll make sure you never run out of them.
            </p>
          </div>

          <div className="row" style={{ marginTop: '60px' }}>
            <div className="col-lg-6">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Discovery & Strategy
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                  We dive deep into your firm's goals, target clients, competitive landscape, and brand positioning. We research your market, analyze competitor websites, and identify opportunities to differentiate your firm online.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">2</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Design & Architecture
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                  Our design team creates custom mockups that reflect your brand while incorporating conversion-focused best practices. We map out site architecture, user flows, and content strategy.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">3</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Development & SEO
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                  We build your website on modern technology with clean code, fast performance, and SEO best practices baked in from day one. Technical SEO, schema markup, and mobile optimization are all included.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="process-step">
                <div className="step-number">4</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Content Creation
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                  We craft compelling copy that speaks directly to injury victims while establishing your authority. Every word is written to educate, build trust, and drive consultation requests.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">5</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Testing & Launch
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                  Before going live, we thoroughly test every page, form, and feature across all devices and browsers. We ensure perfect functionality, then coordinate a seamless launch with minimal downtime.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">6</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                  Optimization & Growth
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                  Launch is just the beginning. We continuously monitor performance, analyze user behavior, and optimize for better conversions. Monthly SEO updates keep you ranking and competitive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="aximo-cta-section" style={{ padding: '80px 0', background: '#1a1a1a' }}>
        <div className="container">
          <div className="aximo-cta-wrap text-center">
            <div className="aximo-cta-content">
              <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '42px', marginBottom: '20px', fontWeight: 700, color: '#ffffff' }}>
                Ready to Dominate Your Market Online?
              </h2>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '17px', marginBottom: '40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', color: '#e0e0e0', lineHeight: '1.7' }}>
                Let's build you a website that doesn't just look great—it wins cases. Schedule a free consultation to discuss your firm's goals and see how we can help you dominate your market.
              </p>
            </div>
            <div className="aximo-cta-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="aximo-default-btn" style={{ background: '#D4AF37', padding: '16px 32px', whiteSpace: 'nowrap' }}>
                <span className="aximo-label-up" style={{ color: '#1a1a1a' }}>Schedule Consultation</span>
                <span className="aximo-label-up" style={{ color: '#1a1a1a' }}>Schedule Consultation</span>
              </Link>
              <Link href="/services" className="aximo-default-btn outline-btn" style={{ borderColor: '#ffffff', color: '#ffffff', padding: '16px 32px', whiteSpace: 'nowrap' }}>
                <span className="aximo-label-up">View All Services</span>
                <span className="aximo-label-up">View All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <style jsx>{`
        .faq-accordion-item {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin-bottom: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-accordion-item:hover {
          border-color: #D4AF37;
        }
        .faq-accordion-item.open {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        .faq-accordion-header {
          padding: 25px 30px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }
        .faq-accordion-header:hover {
          background: #f8f8f8;
        }
        .faq-accordion-body {
          padding: 0 30px 25px 30px;
        }
      `}</style>

      <div className="section aximo-section-padding" style={{ background: '#f8f8f8' }}>
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '42px', marginBottom: '20px', color: '#1a1a1a' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="row justify-content-center" style={{ marginTop: '60px' }}>
            <div className="col-lg-10">
              <div className={`faq-accordion-item ${openAccordion === 0 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(0)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '19px', margin: 0, color: '#1a1a1a' }}>
                    How long does it take to build a legal website?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#D4AF37', fontWeight: 'bold' }}>
                    {openAccordion === 0 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 0 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                      Most legal websites take 6-10 weeks from start to launch, depending on complexity and content requirements. We work efficiently while never sacrificing quality, and we'll give you a detailed timeline during our discovery call.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 1 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(1)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '19px', margin: 0, color: '#1a1a1a' }}>
                    What's included in your website packages?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#D4AF37', fontWeight: 'bold' }}>
                    {openAccordion === 1 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 1 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                      All packages include custom design, mobile optimization, SEO setup, content creation, contact forms, live chat integration, Google Analytics setup, SSL certificate, ADA compliance, and 30 days of post-launch support. Ongoing maintenance and SEO can be added as monthly retainers.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 2 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(2)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '19px', margin: 0, color: '#1a1a1a' }}>
                    Do you write the content for the website?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#D4AF37', fontWeight: 'bold' }}>
                    {openAccordion === 2 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 2 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                      Yes! We have experienced legal content writers who create all website copy optimized for both users and search engines. We'll work with you to understand your firm's voice and messaging, then craft compelling content that converts visitors into clients.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 3 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(3)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '19px', margin: 0, color: '#1a1a1a' }}>
                    Will my website be optimized for search engines?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#D4AF37', fontWeight: 'bold' }}>
                    {openAccordion === 3 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 3 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                      Absolutely. All our websites are built with SEO best practices from the ground up—technical SEO, on-page optimization, schema markup, mobile-first design, and local SEO. We also offer ongoing SEO services to continuously improve your rankings and drive more qualified traffic.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 4 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(4)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '19px', margin: 0, color: '#1a1a1a' }}>
                    What if I need changes after the website launches?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#D4AF37', fontWeight: 'bold' }}>
                    {openAccordion === 4 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 4 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
                      We include 30 days of post-launch support to handle any changes or fixes. After that, we offer flexible monthly maintenance packages or hourly support—whatever works best for your firm. You'll never be stuck with a website you can't update.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 5 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(5)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '19px', margin: 0, color: '#1a1a1a' }}>
                    How much does a legal website cost?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#D4AF37', fontWeight: 'bold' }}>
                    {openAccordion === 5 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 5 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0, fontSize: '15px' }}>
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
