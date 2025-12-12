'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ServicesPage() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? -1 : index);
  };

  return (
    <>
      <style jsx>{`
        .service-card-hover {
          border: 2px solid #B39FD5;
          border-radius: 12px;
          background: white;
          transition: all 0.3s ease;
        }
        .service-card-hover:hover {
          background: #F3EFFC;
        }
      `}</style>

      <div className="section aximo-section-padding3">
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Solutions Designed to Move Cases Forward</h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '800px', margin: '20px auto 0' }}>
              Every service is designed to deliver measurable ROI and help your personal injury firm win bigger cases and scale sustainably.
            </p>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="aximo-iconbox-wrap wow fadeInUpX service-card-hover" data-wow-delay="0s">
                <div className="aximo-iconbox-icon" style={{ color: '#B39FD5' }}>
                  <i className="icon-target-1"></i>
                </div>
                <div className="aximo-iconbox-data">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Premium Referral Solutions</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    We deliver qualified personal injury leads that convert into winning cases. Pre-screened clients with higher case acceptance rates for elite injury firms.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="aximo-iconbox-wrap wow fadeInUpX service-card-hover" data-wow-delay="0.1s">
                <div className="aximo-iconbox-icon" style={{ color: '#B39FD5' }}>
                  <i className="icon-branding"></i>
                </div>
                <div className="aximo-iconbox-data">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Content Marketing</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Professional content production and strategic social media management designed to build your brand and convert views into clients for personal injury firms.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="aximo-iconbox-wrap wow fadeInUpX service-card-hover" data-wow-delay="0.2s">
                <div className="aximo-iconbox-icon" style={{ color: '#B39FD5' }}>
                  <i className="icon-design-thinking"></i>
                </div>
                <div className="aximo-iconbox-data">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Strategic Consulting</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    ROI-focused marketing consulting and campaign optimization strategies tailored specifically for personal injury law firms looking to scale sustainably.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="aximo-iconbox-wrap wow fadeInUpX service-card-hover" data-wow-delay="0.3s">
                <div className="aximo-iconbox-icon" style={{ color: '#B39FD5' }}>
                  <i className="icon-web"></i>
                </div>
                <div className="aximo-iconbox-data">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Expansion Campaigns</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Comprehensive multi-channel marketing campaigns including video production, TV/streaming commercials, and radio advertisements designed to grow your practice.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="aximo-iconbox-wrap wow fadeInUpX service-card-hover" data-wow-delay="0.4s">
                <div className="aximo-iconbox-icon" style={{ color: '#B39FD5' }}>
                  <i className="icon-rating-stars-1"></i>
                </div>
                <div className="aximo-iconbox-data">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Partnership Marketing</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Building strategic attorney-to-attorney networks and partnerships that create case-winning referral opportunities for personal injury powerhouses.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <Link href="/services/legal-websites" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="aximo-iconbox-wrap wow fadeInUpX service-card-hover" data-wow-delay="0.5s" style={{ cursor: 'pointer' }}>
                <div className="aximo-iconbox-icon" style={{ color: '#B39FD5' }}>
                  <i className="icon-web"></i>
                </div>
                <div className="aximo-iconbox-data">
                    <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Legal Website Design & SEO</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      Custom legal websites designed to convert visitors into clients. Professional design, lightning-fast performance, and advanced SEO strategies that drive results.
                  </p>
                    <div style={{ marginTop: '15px', color: '#9333EA', fontWeight: 600, fontFamily: "'Libre Baskerville', serif" }}>
                      Learn More →
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section aximo-section-padding3" style={{ paddingTop: '30px' }}>
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Packages that Fit Your Growth Stage</h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '800px', margin: '20px auto 0' }}>
              Choose the right mix of deliverables for where your firm is today—every package is value-led and tailored after a short discovery.
            </p>
          </div>

          <div className="row" style={{ marginTop: '30px' }}>
            <div className="col-lg-4 col-md-6">
              <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.1s">
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-4-service-icon-1.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Starter Package</h3>
                </div>
                <div className="aximo-pricing-body">
                  <ul>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Monthly content calendars</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />5 reel/content deliverables</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Strategic content planning</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Social media optimization</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Performance tracking</li>
                  </ul>
                </div>
                <Link href="/contact" className="aximo-default-btn aximo-pricing-btn">Talk with us</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.2s">
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-4-service-icon-2.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Growth Package</h3>
                </div>
                <div className="aximo-pricing-body">
                  <ul>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Full social media management</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />7-10 reels/content delivered</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Professional editing & planning</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Strategic marketing consulting</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />ROI optimization strategies</li>
                  </ul>
                </div>
                <Link href="/contact" className="aximo-default-btn aximo-pricing-btn">Talk with us</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.3s">
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-1-service-icon-3.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Expansion Package</h3>
                </div>
                <div className="aximo-pricing-body">
                  <ul>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Free initial consultation</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Content series production</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Photo/video shoots</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />TV & streaming commercials</li>
                    <li><img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Radio & multi-channel ads</li>
                  </ul>
                </div>
                <Link href="/contact" className="aximo-default-btn aximo-pricing-btn">Talk with us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aximo-cta-section aximo-cta-referrals extra-side-margin" style={{ padding: '60px 0', backgroundColor: '#C8B6E2', borderRadius: '20px !important', marginTop: '80px', marginBottom: '80px' }}>
        <div className="container">
          <div className="aximo-cta-wrap text-center">
            <div className="aximo-cta-content">
              <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '36px', marginBottom: '15px', fontWeight: 600, maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', color: '#000' }}>
                Ready to Scale Your Injury Firm?
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '30px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto', color: '#000' }}>
                Let's discuss how our strategic marketing and qualified leads can help you win bigger cases and grow sustainably.
              </p>
            </div>
            <div className="aximo-cta-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="aximo-default-btn aximo-header-btn aximo-cta-primary-btn" style={{ color: '#fff !important' }}>
                <span className="aximo-label-up">Get In Touch</span>
                <span className="aximo-label-up">Get In Touch</span>
              </Link>
              <Link href="/about" className="aximo-default-btn aximo-header-btn outline-btn" style={{ color: '#fff !important' }}>
                <span className="aximo-label-up">Learn More</span>
                <span className="aximo-label-up">Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <style jsx>{`
        .process-accordion-item {
          background: white;
          border: 2px solid #B39FD5;
          border-radius: 8px;
          margin-bottom: 15px;
          transition: all 0.3s ease;
        }
        .process-accordion-item:hover,
        .process-accordion-item.open {
          background: #F3EFFC;
        }
      `}</style>

      <div className="section">
        <div className="container">
          <div className="aximo-faq-wrap">
            <div className="row">
              <div className="col-lg-7 d-flex align-items-center">
                <div className="aximo-default-content">
                  <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Our Proven Process for Legal Marketing Success</h2>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    We focus on delivering results through a strategic, proven process tailored specifically for personal injury law firms. From initial consultation to ongoing campaign optimization, we ensure every step drives measurable ROI.
                  </p>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Our collaborative approach means you're involved at every stage, with transparent reporting and data-driven insights to help your firm scale sustainably.
                  </p>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="aximo-accordion-wrap wow fadeInUpX" data-wow-delay="0.1s" id="aximo-accordion">
                  <div className={`aximo-accordion-item process-accordion-item ${openAccordion === 0 ? 'open' : ''}`}>
                    <div 
                      className="aximo-accordion-header process-accordion-header" 
                      onClick={() => toggleAccordion(0)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>01/ Discovery & Strategy</h3>
                      <div className="aximo-accordion-icon">
                        <i className={openAccordion === 0 ? 'icon-minus' : 'icon-plus'}></i>
                      </div>
                    </div>
                    {openAccordion === 0 && (
                      <div className="aximo-accordion-body process-accordion-body">
                        <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                          We start with a comprehensive consultation to understand your firm's goals, target cases, and current marketing challenges.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`aximo-accordion-item process-accordion-item ${openAccordion === 1 ? 'open' : ''}`}>
                    <div 
                      className="aximo-accordion-header process-accordion-header" 
                      onClick={() => toggleAccordion(1)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>02/ Implementation</h3>
                      <div className="aximo-accordion-icon">
                        <i className={openAccordion === 1 ? 'icon-minus' : 'icon-plus'}></i>
                      </div>
                    </div>
                    {openAccordion === 1 && (
                      <div className="aximo-accordion-body process-accordion-body">
                        <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                          Our team executes your custom marketing strategy, delivering qualified leads, content, and campaigns designed to convert.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`aximo-accordion-item process-accordion-item ${openAccordion === 2 ? 'open' : ''}`}>
                    <div 
                      className="aximo-accordion-header process-accordion-header" 
                      onClick={() => toggleAccordion(2)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>03/ Optimization & Growth</h3>
                      <div className="aximo-accordion-icon">
                        <i className={openAccordion === 2 ? 'icon-minus' : 'icon-plus'}></i>
                      </div>
                    </div>
                    {openAccordion === 2 && (
                      <div className="aximo-accordion-body process-accordion-body">
                        <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                          We continuously monitor performance, optimize campaigns, and scale what works to maximize your ROI and case wins.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <style jsx>{`
        .faq-item {
          background: white;
          border: 2px solid #B39FD5;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          background: #F3EFFC;
        }
        .faq-item h3 {
          font-family: 'Roxborough CF', serif !important;
          font-size: 22px;
          margin-bottom: 12px;
        }
        .faq-item p {
          font-family: 'Libre Baskerville', serif !important;
          margin: 0;
        }
      `}</style>

      <div className="section aximo-section-padding">
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Frequently Asked Questions</h2>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="faq-item">
                <h3>What types of personal injury cases do you help market?</h3>
                <p>
                  We specialize in marketing for all types of personal injury cases, including car accidents, truck accidents, slip and falls, medical malpractice, wrongful death, and catastrophic injury claims.
                </p>
              </div>
              <div className="faq-item">
                <h3>How do you qualify leads before sending them to our firm?</h3>
                <p>
                  Our rigorous pre-screening process includes validating injury details, case timeline, liability assessment, and ensuring prospects meet your specific intake criteria. We only send leads that have genuine case potential.
                </p>
              </div>
              <div className="faq-item">
                <h3>What makes your legal marketing different from other agencies?</h3>
                <p>
                  We exclusively serve personal injury law firms, so we understand legal ethics, bar association rules, and what actually drives case conversions. Our strategies are data-driven and ROI-focused, not just traffic-focused.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="faq-item">
                <h3>How long does it take to see results from your marketing services?</h3>
                <p>
                  Lead referrals typically start within 2-3 weeks. For digital marketing campaigns, you'll see initial traction in 30-60 days, with significant ROI improvements by month 3-6 as we optimize based on performance data.
                </p>
              </div>
              <div className="faq-item">
                <h3>Do you work with firms of all sizes?</h3>
                <p>
                  Yes. We tailor our services to match your firm's size and growth goals—from solo practitioners looking to scale, to established firms wanting to dominate their market with high-value cases.
                </p>
              </div>
              <div className="faq-item">
                <h3>What's the investment for your services?</h3>
                <p>
                  We tailor investment to the scope of work after a quick discovery. Starter, Growth, and Expansion packages are customized to your goals, deliverables, and timelines—let’s align on the best fit together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

