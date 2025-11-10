'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="aximo-all-section">
      {/* Hero Section */}
      <div className="aximo-hero-section2">
        <div className="container position-relative">
          <div className="aximo-hero-content2">
            <h1 style={{ fontFamily: "'Roxborough CF', serif", maxWidth: '1100px', margin: '0 auto', fontSize: 'clamp(3rem, 6vw, 4.5rem)', lineHeight: 1.2 }}>
              Elite Leads. Winning Cases.<br />Your Practice Elevated.
            </h1>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '850px', margin: '0 auto', fontSize: '18px', lineHeight: 1.6 }}>
              Trusted referral solutions and strategic marketing for personal injury law&nbsp;firms that are ready to grow bigger, win more, and scale with&nbsp;purpose. We deliver qualified injury leads and premium content that move cases&nbsp;forward.
            </p>
            <div className="aximo-hero-btn-wrap center">
              <Link href="/contact" className="aximo-default-btn">
                <span className="aximo-label-up">Schedule Free Consultation</span>
                <span className="aximo-label-up">Schedule Free Consultation</span>
              </Link>
              <Link href="/services" className="aximo-default-btn aximo-default-btn-outline">
                <span className="aximo-label-up">View Our Services</span>
                <span className="aximo-label-up">View Our Services</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="aximo-hero-thumb-wrap">
          <div className="aximo-hero-thumb-item">
            <img src="/assets/img/images/th-2/hero-img-1.jpg" alt="" />
          </div>
          <div className="aximo-hero-thumb-item">
            <img src="/assets/img/images/th-2/hero-img-2.jpg" alt="" />
          </div>
          <div className="aximo-hero-thumb-item">
            <img src="/assets/img/images/th-2/hero-img-3.jpg" alt="" />
          </div>
          <div className="aximo-hero-thumb-item">
            <img src="/assets/img/images/th-2/hero-img-4.jpg" alt="" />
          </div>
          <div className="aximo-hero-thumb-item">
            <img src="/assets/img/images/th-2/hero-img-5.jpg" alt="" />
          </div>
        </div>
      </div>

      {/* CTA Section - Referrals */}
      <div className="aximo-cta-section aximo-cta-referrals extra-side-margin" style={{ padding: '60px 0', backgroundColor: '#C8B6E2', borderRadius: '20px !important' }}>
        <div className="container">
          <div className="aximo-cta-wrap text-center">
            <div className="aximo-cta-content">
              <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '36px', marginBottom: '15px', fontWeight: 600, maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', color: '#000' }}>
                Referrals That Move Cases&nbsp;Forward
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '30px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto', color: '#000' }}>
                Empowering law firms with qualified injury leads and strategic marketing that drives results. Let's build your practice&nbsp;together.
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

      {/* What Sets Us Apart Section */}
      <div className="section aximo-section-padding3 position-relative">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="aximo-section-title clash-grotesk">
                <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>What Sets Us Apart</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <div className="aximo-iconbox-wrap2" style={{ height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                <div className="aximo-iconbox-icon2" style={{ flexShrink: 0 }}>
                  <img src="/assets/img/icons/th-1-service-icon-1.svg" alt="" style={{ width: '100%', height: 'auto', maxWidth: '280px' }} />
                </div>
                <div className="aximo-iconbox-data2" style={{ flexGrow: 1 }}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Qualified Leads Only</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>We don't just generate clicks—we deliver pre-screened personal injury leads that convert into winning cases for your firm.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="aximo-iconbox-wrap2" style={{ height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                <div className="aximo-iconbox-icon2" style={{ flexShrink: 0, order: 2 }}>
                  <img src="/assets/img/icons/th-1-service-icon-4.svg" alt="" style={{ width: '100%', height: 'auto', maxWidth: '280px' }} />
                </div>
                <div className="aximo-iconbox-data2" style={{ flexGrow: 1, order: 1 }}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Strategic Marketing</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Professional content creation and social media management designed specifically for personal injury attorneys who want to stand out and build trust.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="aximo-iconbox-wrap2" style={{ height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                <div className="aximo-iconbox-icon2" style={{ flexShrink: 0 }}>
                  <img src="/assets/img/icons/th-1-service-icon-5.svg" alt="" style={{ width: '100%', height: 'auto', maxWidth: '280px' }} />
                </div>
                <div className="aximo-iconbox-data2" style={{ flexGrow: 1 }}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>ROI-Focused Results</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Every referral and every piece of content is designed with one goal: helping your injury firm win bigger cases and scale sustainably.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing between sections */}
      <style jsx>{`
        @media (max-width: 768px) {
          .aximo-iconbox-wrap2 {
            margin-bottom: 40px !important;
            padding: 30px 20px !important;
          }
          .aximo-iconbox-data2 {
            padding: 0 10px !important;
          }
          .aximo-iconbox-data2 h3 {
            font-size: 24px !important;
          }
          .aximo-iconbox-data2 p {
            font-size: 16px !important;
            line-height: 1.6 !important;
          }
          .section.aximo-section-padding3 .container {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>

      {/* About Section */}
      <div className="aximo-about-section bg-dark extra-side-margin" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div id="aximo-counter"></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="aximo-thumb wow fadeInUpX" data-wow-delay="0s" id="rotatetwo" style={{ marginTop: '-90px' }}>
                <img src="/assets/img/images/th-2/content-img-1.jpg" alt="Happy attorneys team" />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="aximo-default-content clash-grotesk">
                <h2 style={{ fontFamily: "'Roxborough CF', serif", fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', lineHeight: 1.2 }}>
                  Empowering Your Injury Firm<br />to Win&nbsp;Bigger
                </h2>
                <p>We specialize in connecting personal injury law firms with qualified leads and delivering strategic marketing that drives real&nbsp;results. Our mission is to help ambitious attorneys build powerful practices that win cases and grow&nbsp;sustainably.</p>
              </div>
              <div className="aximo-counter-wrap2">
                <div className="aximo-counter-data2">
                  <h2 className="clash-grotesk">
                    <span data-percentage="500" className="aximo-counter">500</span>
                    +
                  </h2>
                  <p>Qualified leads delivered</p>
                </div>
                <div className="aximo-counter-data2">
                  <h2 className="clash-grotesk">
                    <span data-percentage="35" className="aximo-counter">35</span>
                    +
                  </h2>
                  <p>Law firms partnered</p>
                </div>
                <div className="aximo-counter-data2">
                  <h2 className="clash-grotesk">
                    <span data-percentage="99" className="aximo-counter">99</span>
                    %
                  </h2>
                  <p>Client satisfaction rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="aximo-cta-section aximo-section-padding extra-side-margin position-relative" style={{ background: 'linear-gradient(135deg, #DDD6FE 0%, #ffffff 50%, #C4B5FD 100%)', overflow: 'hidden', minHeight: '500px', borderRadius: '20px 20px 0 0', marginTop: '80px' }}>
        <div className="container position-relative">
          <div className="aximo-cta-wrap">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", color: '#1F2937' }}>Ready to Build Your Practice?</h2>
            <Link href="/contact" className="aximo-default-btn aximo-header-btn" style={{ background: '#B39FD5 !important', borderColor: '#B39FD5 !important', color: '#fff !important' }}>
              <span className="aximo-label-up">Contact Us</span>
              <span className="aximo-label-up">Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
