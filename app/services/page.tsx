'use client';

import Link from 'next/link';

export default function ServicesPage() {
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
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Custom Campaigns</h3>
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
              <div className="aximo-iconbox-wrap wow fadeInUpX service-card-hover" data-wow-delay="0.5s">
                <div className="aximo-iconbox-icon" style={{ color: '#B39FD5' }}>
                  <i className="icon-web"></i>
                </div>
                <div className="aximo-iconbox-data">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Website Design and SEO</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Professional website design and search engine optimization for personal injury law firms to increase online visibility, attract qualified leads, and convert visitors into clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="aximo-cta-section aximo-cta-referrals extra-side-margin" style={{ padding: '60px 0', backgroundColor: '#C8B6E2', borderRadius: '20px', marginTop: '80px', marginBottom: '80px' }}>
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
    </>
  );
}

