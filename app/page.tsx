'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Hyperspeed from '@/components/Hyperspeed';
import BounceCard from '@/components/BounceCard';
import FadeIn from '@/components/FadeIn';
import SlideIn from '@/components/SlideIn';
import PageLoader from '@/components/PageLoader';
import CustomCursor from '@/components/CustomCursor';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [particleCount, setParticleCount] = useState(80);
  const [shouldAnimateCards, setShouldAnimateCards] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Start as true to prevent loader flash on mobile
  const [heroImages, setHeroImages] = useState<string[]>([
    '/assets/img/images/th-2/hero-img-1.jpg',
    '/assets/img/images/th-2/hero-img-2.jpg',
    '/assets/img/images/th-2/hero-img-3.jpg',
    '/assets/img/images/th-2/hero-img-4.jpg',
  ]);

  useEffect(() => {
    // Set particle count based on screen size
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    setParticleCount(mobile ? 60 : 80);
    
    // Trigger card animations after a delay (longer for desktop with loader)
    if (mobile) {
      setTimeout(() => {
        console.log('Setting shouldAnimateCards to true on mobile');
        setShouldAnimateCards(true);
      }, 1500);
    } else {
      setTimeout(() => {
        console.log('Setting shouldAnimateCards to true on desktop');
        setShouldAnimateCards(true);
      }, 3500); // After loading screen
    }
  }, []);

  useEffect(() => {
    // Fetch dynamic hero media
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/site-media');
        const json = await res.json();
        if (Array.isArray(json.media)) {
          const map: Record<string, string> = {};
          json.media.forEach((m: any) => {
            if (m?.key && m?.url) map[m.key] = m.url;
          });
          const updated = heroImages.map((src, idx) => map[`hero_${idx + 1}`] || src);
          setHeroImages(updated);
        }
      } catch (e) {
        // ignore, fall back to defaults
      }
    };
    fetchMedia();
  }, []);

  // Removed GSAP animations - causing mobile visibility issues

  return (
    <>
      {/* Custom Cursor for Solutions Section */}
      <CustomCursor />

      {/* Page Loading Animation - All Devices */}
      <PageLoader />

      {/* Mobile Hero Visibility Fix */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .aximo-hero-content2 h1,
          .aximo-hero-content2 p {
            color: #000000 !important;
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 10000 !important;
          }

          .aximo-hero-content2 h1 {
            font-weight: 900 !important;
          }

          .aximo-hero-content2 p {
            font-weight: 500 !important;
          }

          /* Buttons on mobile */
          .aximo-hero-btn-wrap,
          .aximo-hero-btn-wrap a {
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 10000 !important;
          }

          /* Black button - white text */
          .aximo-hero-btn-wrap .aximo-default-btn:not(.aximo-default-btn-outline) .aximo-label-up {
            color: #ffffff !important;
            opacity: 1 !important;
          }

          /* Outline button - white text on mobile */
          .aximo-hero-btn-wrap .aximo-default-btn-outline .aximo-label-up {
            color: #ffffff !important;
            opacity: 1 !important;
          }
        }

        /* Ensure hero clears the header height */
        .aximo-hero-section2 {
          padding-top: 120px;
        }

        @media (max-width: 768px) {
          .aximo-hero-section2 {
            padding-top: 95px;
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="aximo-all-section">
        {/* Hero Section */}
        <div className="aximo-hero-section2" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
        <Hyperspeed
          className="particles-bg"
          lineCount={particleCount}
          speed={5}
          color="#9333EA"
        />
        <div className="container position-relative" style={{ zIndex: 10000, width: '100%', paddingTop: '40px', paddingBottom: '40px', position: 'relative' }}>
          <div className="aximo-hero-content2" style={{ opacity: 1, visibility: 'visible', zIndex: 10000, position: 'relative' }}>
            {/* ARB Marketing Logo */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ 
                fontFamily: "'Roxborough CF', serif", 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                fontWeight: 900, 
                color: '#000000',
                letterSpacing: '4px',
                lineHeight: 1.1
              }}>
                ARB<br />MARKETING
              </div>
            </div>
            <h1 
              style={{ fontFamily: "'Roxborough CF', serif", maxWidth: '1100px', margin: '0 auto', fontSize: 'clamp(3rem, 6vw, 4.5rem)', lineHeight: 1.2, color: '#000000', fontWeight: 900, position: 'relative', opacity: 1, visibility: 'visible', zIndex: 10000 }}
            >
              Elite Leads. Winning Cases. Elevating Your Practice.
            </h1>
            <p 
              style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '850px', margin: '0 auto', fontSize: '18px', lineHeight: 1.6, color: '#000000', fontWeight: 500, position: 'relative', opacity: 1, visibility: 'visible', zIndex: 10000 }}
            >
              Trusted referral solutions and strategic marketing for personal injury law&nbsp;firms that are ready to grow bigger, win more, and scale with&nbsp;purpose. We deliver qualified injury leads and premium content that move cases&nbsp;forward.
            </p>
            <div className="aximo-hero-btn-wrap center" style={{ opacity: 1, visibility: 'visible', position: 'relative', zIndex: 10000 }}>
              <Link href="/contact" className="aximo-default-btn" style={{ backgroundColor: '#000000', color: '#ffffff', opacity: 1, visibility: 'visible', zIndex: 10000 }}>
                <span className="aximo-label-up" style={{ color: '#ffffff', opacity: 1 }}>Schedule Free Consultation</span>
                <span className="aximo-label-up" style={{ color: '#ffffff', opacity: 1 }}>Schedule Free Consultation</span>
              </Link>
              <Link href="/services" className="aximo-default-btn aximo-default-btn-outline" style={{ borderColor: '#9333EA', borderWidth: '2px', color: '#9333EA', opacity: 1, visibility: 'visible', zIndex: 10000, backgroundColor: '#ffffff' }}>
                <span className="aximo-label-up" style={{ color: '#9333EA', opacity: 1 }}>View Our Services</span>
                <span className="aximo-label-up" style={{ color: '#9333EA', opacity: 1 }}>View Our Services</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="aximo-hero-thumb-wrap"
          style={{
            opacity: 1,
            visibility: 'visible',
            position: 'relative',
            zIndex: 10000,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 20px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <BounceCard delay={0.2} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src={heroImages[0]} alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
          <BounceCard delay={0.35} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src={heroImages[1]} alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
          <BounceCard delay={0.5} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src={heroImages[2]} alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
          <BounceCard delay={0.65} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src={heroImages[3]} alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
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

      {/* Pricing Section */}
      <div className="section aximo-section-padding3 position-relative" style={{ opacity: 1, visibility: 'visible', display: 'block' }}>
        <div className="container">
          <div className="aximo-section-title center clash-grotesk">
            <h2 style={{ fontFamily: "'Roxborough CF', serif", maxWidth: '100%', margin: '0 auto 40px' }}>Strategic Growth for Personal&nbsp;Injury Firms</h2>
            <p style={{ maxWidth: '900px', margin: '0 auto' }}>Choose the package that matches your ambition. Every solution is designed to deliver measurable ROI and sustainable&nbsp;growth.</p>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.1s" style={{ opacity: 1, visibility: 'visible' }}>
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-4-service-icon-1.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Starter Package</h3>
                </div>
                <div className="aximo-pricing-body">
                  <ul>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Monthly content calendars
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />5 reel/content deliverables
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Strategic content planning
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Social media optimization
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Performance tracking
                    </li>
                  </ul>
                </div>
                <Link href="/contact" className="aximo-default-btn aximo-pricing-btn">Get Started</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.2s" style={{ opacity: 1, visibility: 'visible' }}>
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-4-service-icon-2.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Growth Package</h3>
                </div>
                <div className="aximo-pricing-body">
                  <ul>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Full social media management
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />7-10 reels/content delivered
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Professional editing & planning
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Strategic marketing consulting
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />ROI optimization strategies
                    </li>
                  </ul>
                </div>
                <Link href="/contact" className="aximo-default-btn aximo-pricing-btn">Get Started</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.3s" style={{ opacity: 1, visibility: 'visible' }}>
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-1-service-icon-3.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Expansion Package</h3>
                </div>
                <div className="aximo-pricing-body">
                  <ul>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Free initial consultation
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Content series production
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Photo/video shoots
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />TV & streaming commercials
                    </li>
                    <li>
                      <img src="/assets/img/icons/icon-black-thumb-up.svg" alt="" style={{ width: '20px', height: '20px' }} />Radio & multi-channel ads
                    </li>
                  </ul>
                </div>
                <Link href="/contact" className="aximo-default-btn aximo-pricing-btn">Schedule Consultation</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Stack Section */}
      <div className="section aximo-section-padding position-relative">
        <div className="container">
          <div className="aximo-section-title center clash-grotesk">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Solutions Designed to Move Cases Forward</h2>
          </div>
        </div>
        <div className="aximo-service-increase-wrap">
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="aximo-service-increase-row">
              <div className="aximo-service-increase-item">
                <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Premium Referral Solutions" />
                <div className="aximo-service-increase-title">
                  <h3>Premium Referral Solutions:</h3>
                </div>
                <div className="aximo-service-increase-body">
                  <p>We deliver qualified personal injury leads that convert into winning cases. Pre-screened clients with higher case acceptance rates for elite injury firms.</p>
                </div>
                <div className="aximo-service-increase-icon">
                  <i className="icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="aximo-service-increase-row">
              <div className="aximo-service-increase-item">
                <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Content Marketing Services" />
                <div className="aximo-service-increase-title">
                  <h3>Content Marketing:</h3>
                </div>
                <div className="aximo-service-increase-body">
                  <p>Professional content production and strategic social media management designed to build your brand and convert views into clients for personal injury firms.</p>
                </div>
                <div className="aximo-service-increase-icon">
                  <i className="icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="aximo-service-increase-row">
              <div className="aximo-service-increase-item">
                <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Strategic Marketing Consulting" />
                <div className="aximo-service-increase-title">
                  <h3>Strategic Consulting:</h3>
                </div>
                <div className="aximo-service-increase-body">
                  <p>ROI-focused marketing consulting and campaign optimization strategies tailored specifically for personal injury law firms looking to scale sustainably.</p>
                </div>
                <div className="aximo-service-increase-icon">
                  <i className="icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="aximo-service-increase-row">
              <div className="aximo-service-increase-item">
                <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Custom Campaign Development" />
                <div className="aximo-service-increase-title">
                  <h3>Custom Campaigns:</h3>
                </div>
                <div className="aximo-service-increase-body">
                  <p>Comprehensive multi-channel marketing campaigns including video production, TV/streaming commercials, and radio advertisements designed to grow your practice.</p>
                </div>
                <div className="aximo-service-increase-icon">
                  <i className="icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="aximo-service-increase-row">
              <div className="aximo-service-increase-item">
                <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Attorney Network Building" />
                <div className="aximo-service-increase-title">
                  <h3>Partnership Marketing:</h3>
                </div>
                <div className="aximo-service-increase-body">
                  <p>Building strategic attorney-to-attorney networks and partnerships that create case-winning referral opportunities for personal injury powerhouses.</p>
                </div>
                <div className="aximo-service-increase-icon">
                  <i className="icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>


      {/* About Section */}
      <div className="aximo-about-section bg-dark extra-side-margin" style={{ paddingTop: '80px', paddingBottom: '80px', opacity: 1, visibility: 'visible', display: 'block' }}>
        <div id="aximo-counter"></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="aximo-thumb wow fadeInUpX" data-wow-delay="0s" id="rotatetwo" style={{ marginTop: '-90px', opacity: 1, visibility: 'visible' }}>
                <img src="/assets/img/images/th-2/content-img-1.jpg" alt="Happy attorneys team" style={{ opacity: 1, visibility: 'visible', display: 'block', width: '100%', height: 'auto' }} />
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
      <div className="aximo-cta-section aximo-section-padding extra-side-margin position-relative" style={{ background: 'linear-gradient(135deg, #DDD6FE 0%, #ffffff 50%, #C4B5FD 100%)', overflow: 'hidden', minHeight: '500px', borderRadius: '20px !important', marginTop: '80px' }}>
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
    </>
  );
}
