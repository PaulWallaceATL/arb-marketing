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
      <div className="section aximo-section-padding" style={{ background: 'linear-gradient(135deg, #F3EFFC 0%, #E8DEFF 100%)', paddingTop: '120px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="aximo-default-content">
                <span className="aximo-subtitle" style={{ fontFamily: "'Libre Baskerville', serif", color: '#9333EA' }}>
                  Legal Website Design & Development
                </span>
                <h1 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '56px', marginBottom: '25px', fontWeight: 700 }}>
                  Websites That Win Cases
                </h1>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '18px', lineHeight: '1.8', marginBottom: '30px' }}>
                  Your website is your firm's most powerful marketing asset. We design, develop, and optimize legal websites that don't just look professional—they convert visitors into paying clients while dominating search rankings.
                </p>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <Link href="/contact" className="aximo-default-btn aximo-header-btn">
                    <span className="aximo-label-up">Get a Free Consultation</span>
                    <span className="aximo-label-up">Get a Free Consultation</span>
                  </Link>
                  <Link href="#process" className="aximo-default-btn outline-btn" style={{ scrollBehavior: 'smooth' }}>
                    <span className="aximo-label-up">See Our Process</span>
                    <span className="aximo-label-up">See Our Process</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '40px', 
                  borderRadius: '20px', 
                  boxShadow: '0 20px 60px rgba(147, 51, 234, 0.15)',
                  border: '3px solid #B39FD5'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚖️</div>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '28px', marginBottom: '15px' }}>
                    Built for Legal Excellence
                  </h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px', color: '#666', margin: 0 }}>
                    ADA compliant, mobile-optimized, and engineered to convert prospects into consultations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section" style={{ padding: '60px 0', background: 'white' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#9333EA', marginBottom: '10px' }}>
                  95%
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px', color: '#666' }}>
                  Average Page Load Speed Score
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#9333EA', marginBottom: '10px' }}>
                  3.2x
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px', color: '#666' }}>
                  Average Increase in Qualified Leads
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#9333EA', marginBottom: '10px' }}>
                  100%
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px', color: '#666' }}>
                  ADA & Mobile Compliant
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', color: '#9333EA', marginBottom: '10px' }}>
                  #1
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px', color: '#666' }}>
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
          background: white;
          border: 2px solid #B39FD5;
          border-radius: 16px;
          padding: 40px;
          height: 100%;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          background: #F3EFFC;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(147, 51, 234, 0.15);
        }
        .feature-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #9333EA 0%, #7C3AED 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 25px;
        }
      `}</style>

      <div className="section aximo-section-padding" style={{ background: 'linear-gradient(180deg, #F8F9FA 0%, #E9ECEF 100%)' }}>
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', marginBottom: '20px' }}>
              Everything Your Law Firm Needs to Win Online
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '800px', margin: '0 auto', fontSize: '18px' }}>
              Our legal websites are built with one goal: converting visitors into consultations. Every design decision is backed by data and optimized for results.
            </p>
          </div>

          <div className="row" style={{ marginTop: '60px' }}>
            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  🎨
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Custom Design
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  No templates. Every website is custom-designed to reflect your firm's unique brand, values, and positioning in the personal injury market.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  🚀
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Lightning-Fast Performance
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  Built on modern technology for blazing-fast load times. Speed is a ranking factor and directly impacts conversion rates.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  📱
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Mobile-First Design
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  Over 70% of legal searches happen on mobile. Your site will look perfect and convert on every device.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  🔍
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Advanced SEO Optimization
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  Technical SEO, on-page optimization, schema markup, and local SEO strategies that get you ranking on page one for high-value keywords.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  ⚖️
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Legal Compliance
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  ADA compliant, bar association approved, and built with attorney advertising rules in mind. No compliance headaches.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  💼
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Conversion-Focused Architecture
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  Strategic CTAs, trust signals, case results displays, and intake forms designed to maximize consultation bookings.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  🔒
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Enterprise Security
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  SSL certificates, secure forms, data encryption, and regular security updates to protect your firm and clients.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  📊
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Analytics & Tracking
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  Comprehensive tracking setup so you know exactly where leads come from and what's driving ROI.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  🛠️
                </div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Ongoing Support & Maintenance
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666' }}>
                  Regular updates, security patches, content updates, and technical support to keep your site running flawlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="section aximo-section-padding" style={{ background: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div style={{ 
                background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)', 
                padding: '50px', 
                borderRadius: '20px',
                color: 'white'
              }}>
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '42px', marginBottom: '25px' }}>
                  SEO That Actually Drives Cases
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '18px', lineHeight: '1.8', marginBottom: '30px' }}>
                  We don't just build beautiful websites—we build websites that win. Our SEO strategies are specifically tailored for personal injury law firms competing in crowded markets.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '15px', fontSize: '24px' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      Local SEO to dominate your geographic market
                    </span>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '15px', fontSize: '24px' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      High-value keyword targeting for case types you want
                    </span>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '15px', fontSize: '24px' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      Content strategy that positions you as the authority
                    </span>
                  </li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '15px', fontSize: '24px' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      Link building from authoritative legal directories
                    </span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '15px', fontSize: '24px' }}>✓</span>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      Monthly reporting with clear ROI metrics
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ paddingLeft: '40px' }}>
                <span className="aximo-subtitle" style={{ fontFamily: "'Libre Baskerville', serif", color: '#9333EA' }}>
                  Proven Results
                </span>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '38px', marginBottom: '25px' }}>
                  Case Study: 247% Increase in Organic Leads
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
                  A mid-sized personal injury firm came to us ranking on page 3 for their most valuable keywords. Within 6 months of launching their new website with our SEO strategy:
                </p>
                <div style={{ background: '#F3EFFC', padding: '30px', borderRadius: '12px', border: '2px solid #B39FD5' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '15px', fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      <strong style={{ color: '#9333EA' }}>47 keywords</strong> ranking on page one
                    </li>
                    <li style={{ marginBottom: '15px', fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      <strong style={{ color: '#9333EA' }}>247% increase</strong> in organic consultation requests
                    </li>
                    <li style={{ marginBottom: '15px', fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      <strong style={{ color: '#9333EA' }}>$2.4M+</strong> in signed cases from organic traffic
                    </li>
                    <li style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '16px' }}>
                      <strong style={{ color: '#9333EA' }}>9.2x ROI</strong> within the first year
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
          background: white;
          border: 2px solid #B39FD5;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        .process-step:hover {
          background: #F3EFFC;
          transform: translateX(5px);
        }
        .step-number {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #9333EA 0%, #7C3AED 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
      `}</style>

      <div id="process" className="section aximo-section-padding" style={{ background: 'linear-gradient(180deg, #F8F9FA 0%, #E9ECEF 100%)' }}>
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', marginBottom: '20px' }}>
              Our Website Design & Development Process
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '800px', margin: '0 auto', fontSize: '18px' }}>
              From discovery to launch and beyond, we handle everything. You focus on winning cases—we'll make sure you never run out of them.
            </p>
          </div>

          <div className="row" style={{ marginTop: '60px' }}>
            <div className="col-lg-6">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Discovery & Strategy
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                  We dive deep into your firm's goals, target clients, competitive landscape, and brand positioning. We research your market, analyze competitor websites, and identify opportunities to differentiate your firm online.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">2</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Design & Architecture
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                  Our design team creates custom mockups that reflect your brand while incorporating conversion-focused best practices. We map out site architecture, user flows, and content strategy.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">3</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Development & SEO
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                  We build your website on modern technology with clean code, fast performance, and SEO best practices baked in from day one. Technical SEO, schema markup, and mobile optimization are all included.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="process-step">
                <div className="step-number">4</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Content Creation
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                  We craft compelling copy that speaks directly to injury victims while establishing your authority. Every word is written to educate, build trust, and drive consultation requests.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">5</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Testing & Launch
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                  Before going live, we thoroughly test every page, form, and feature across all devices and browsers. We ensure perfect functionality, then coordinate a seamless launch with minimal downtime.
                </p>
              </div>

              <div className="process-step">
                <div className="step-number">6</div>
                <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '24px', marginBottom: '15px' }}>
                  Optimization & Growth
                </h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                  Launch is just the beginning. We continuously monitor performance, analyze user behavior, and optimize for better conversions. Monthly SEO updates keep you ranking and competitive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="aximo-cta-section" style={{ padding: '80px 0', background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)' }}>
        <div className="container">
          <div className="aximo-cta-wrap text-center">
            <div className="aximo-cta-content">
              <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', marginBottom: '20px', fontWeight: 700, color: 'white' }}>
                Ready to Dominate Your Market Online?
              </h2>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '18px', marginBottom: '40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', color: 'rgba(255,255,255,0.95)' }}>
                Let's build you a website that doesn't just look great—it wins cases. Schedule a free consultation to discuss your firm's goals and see how we can help you dominate your market.
              </p>
            </div>
            <div className="aximo-cta-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="aximo-default-btn" style={{ background: 'white', color: '#9333EA' }}>
                <span className="aximo-label-up">Schedule Consultation</span>
                <span className="aximo-label-up">Schedule Consultation</span>
              </Link>
              <Link href="/services" className="aximo-default-btn outline-btn" style={{ borderColor: 'white', color: 'white' }}>
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
          background: white;
          border: 2px solid #B39FD5;
          border-radius: 12px;
          margin-bottom: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-accordion-item.open {
          background: #F3EFFC;
        }
        .faq-accordion-header {
          padding: 25px 30px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .faq-accordion-header:hover {
          background: #F3EFFC;
        }
        .faq-accordion-body {
          padding: 0 30px 25px 30px;
        }
      `}</style>

      <div className="section aximo-section-padding" style={{ background: 'white' }}>
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '48px', marginBottom: '20px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="row justify-content-center" style={{ marginTop: '60px' }}>
            <div className="col-lg-10">
              <div className={`faq-accordion-item ${openAccordion === 0 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(0)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '20px', margin: 0 }}>
                    How long does it take to build a legal website?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#9333EA' }}>
                    {openAccordion === 0 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 0 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                      Most legal websites take 6-10 weeks from start to launch, depending on complexity and content requirements. We work efficiently while never sacrificing quality, and we'll give you a detailed timeline during our discovery call.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 1 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(1)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '20px', margin: 0 }}>
                    What's included in your website packages?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#9333EA' }}>
                    {openAccordion === 1 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 1 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                      All packages include custom design, mobile optimization, SEO setup, content creation, contact forms, live chat integration, Google Analytics setup, SSL certificate, ADA compliance, and 30 days of post-launch support. Ongoing maintenance and SEO can be added as monthly retainers.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 2 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(2)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '20px', margin: 0 }}>
                    Do you write the content for the website?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#9333EA' }}>
                    {openAccordion === 2 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 2 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                      Yes! We have experienced legal content writers who create all website copy optimized for both users and search engines. We'll work with you to understand your firm's voice and messaging, then craft compelling content that converts visitors into clients.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 3 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(3)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '20px', margin: 0 }}>
                    Will my website be optimized for search engines?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#9333EA' }}>
                    {openAccordion === 3 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 3 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                      Absolutely. All our websites are built with SEO best practices from the ground up—technical SEO, on-page optimization, schema markup, mobile-first design, and local SEO. We also offer ongoing SEO services to continuously improve your rankings and drive more qualified traffic.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 4 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(4)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '20px', margin: 0 }}>
                    What if I need changes after the website launches?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#9333EA' }}>
                    {openAccordion === 4 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 4 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
                      We include 30 days of post-launch support to handle any changes or fixes. After that, we offer flexible monthly maintenance packages or hourly support—whatever works best for your firm. You'll never be stuck with a website you can't update.
                    </p>
                  </div>
                )}
              </div>

              <div className={`faq-accordion-item ${openAccordion === 5 ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleAccordion(5)}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '20px', margin: 0 }}>
                    How much does a legal website cost?
                  </h3>
                  <div style={{ fontSize: '24px', color: '#9333EA' }}>
                    {openAccordion === 5 ? '−' : '+'}
                  </div>
                </div>
                {openAccordion === 5 && (
                  <div className="faq-accordion-body">
                    <p style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.7', color: '#666', margin: 0 }}>
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

