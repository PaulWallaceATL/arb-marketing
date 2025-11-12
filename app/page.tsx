'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Hyperspeed from '@/components/Hyperspeed';
import BounceCard from '@/components/BounceCard';
import FadeIn from '@/components/FadeIn';
import SlideIn from '@/components/SlideIn';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [particleCount, setParticleCount] = useState(80);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [shouldAnimateCards, setShouldAnimateCards] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Show content after loading completes
    setTimeout(() => {
      setShowContent(true);
    }, 100);
    // Trigger bounce animations after loading
    setTimeout(() => {
      setShouldAnimateCards(true);
    }, 800);
  };

  useEffect(() => {
    setIsClient(true);
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    setParticleCount(mobile ? 40 : 80);
    
    if (mobile) {
      // Mobile: Show everything immediately
      setShowContent(true);
      setTimeout(() => setShouldAnimateCards(true), 1000);
    }
    // Desktop: loading screen will show, content hidden
  }, []);

  // Removed GSAP animations - causing mobile visibility issues

  return (
    <>
      {/* All CSS Overrides - Single Style Tag */}
      <style jsx global>{`
        /* Always hide header/footer during loading */
        #site-content {
          opacity: ${(isMobile || showContent) ? '1' : '0'} !important;
          visibility: ${(isMobile || showContent) ? 'visible' : 'hidden'} !important;
          ${(!isMobile && !showContent) ? 'pointer-events: none !important;' : ''}
          transition: opacity 0.6s ease-out;
        }

        @media (max-width: 768px) {
          /* Hero Section Visibility Fix */
          .aximo-hero-section2 {
            min-height: auto !important;
            height: auto !important;
            display: block !important;
            background-color: #fff !important;
            overflow: visible !important;
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }

          .aximo-hero-section2 .container {
            z-index: 100 !important;
            position: relative !important;
            width: 100% !important;
            padding: 0 20px !important;
            margin-top: 0 !important;
          }

          /* Force ALL hero elements visible on mobile */
          .container,
          .aximo-all-section,
          .aximo-hero-section2,
          .aximo-hero-content2,
          .aximo-hero-content2 h1,
          .aximo-hero-content2 p,
          .aximo-hero-btn-wrap,
          .aximo-hero-btn-wrap a,
          .aximo-hero-btn-wrap .aximo-label-up,
          .aximo-hero-thumb-wrap,
          .aximo-hero-thumb-item,
          .aximo-hero-thumb-wrap img {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            position: relative !important;
            z-index: 10000 !important;
          }

          /* Fix container on mobile */
          .aximo-hero-section2 .container {
            opacity: 1 !important;
          }
          
          .aximo-hero-btn-wrap {
            display: flex !important;
          }
          
          .aximo-hero-btn-wrap a {
            display: flex !important;
          }

          .aximo-hero-content2 h1 {
            color: #000000 !important;
            font-weight: 900 !important;
            opacity: 1 !important;
            text-shadow: 0 0 1px rgba(0,0,0,0.2) !important;
          }

          .aximo-hero-content2 p {
            opacity: 1 !important;
            color: #000000 !important;
            font-weight: 500 !important;
            text-shadow: 0 0 1px rgba(0,0,0,0.1) !important;
          }

          .aximo-hero-btn-wrap a {
            opacity: 1 !important;
          }

          .aximo-hero-btn-wrap .aximo-label-up {
            opacity: 1 !important;
          }

          .particles-bg {
            z-index: 1 !important;
          }

          /* Iconbox Spacing */
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

      {/* Loading Screen - only on desktop */}
      {isClient && !isMobile && !showContent && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      {/* Main Content */}
      <div className="aximo-all-section" style={{ opacity: (isMobile || showContent) ? 1 : 0, visibility: (isMobile || showContent) ? 'visible' : 'hidden', transition: 'opacity 0.6s ease-out' }}>
        {/* Hero Section */}
        <div className="aximo-hero-section2" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
        <Hyperspeed
          className="particles-bg"
          lineCount={particleCount}
          speed={5}
          color="#9333EA"
        />
        <div className="container position-relative" style={{ zIndex: 10000, width: '100%', paddingTop: '40px', paddingBottom: '40px', position: 'relative' }}>
          <div className="aximo-hero-content2" style={{ opacity: 1, visibility: 'visible', zIndex: 10000, position: 'relative' }}>
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
        <div className="aximo-hero-thumb-wrap" style={{ opacity: 1, visibility: 'visible', position: 'relative', zIndex: 10000 }}>
          <BounceCard delay={0.2} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src="/assets/img/images/th-2/hero-img-1.jpg" alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
          <BounceCard delay={0.35} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src="/assets/img/images/th-2/hero-img-2.jpg" alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
          <BounceCard delay={0.5} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src="/assets/img/images/th-2/hero-img-3.jpg" alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
          <BounceCard delay={0.65} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src="/assets/img/images/th-2/hero-img-4.jpg" alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
          <BounceCard delay={0.8} className="aximo-hero-thumb-item" shouldAnimate={shouldAnimateCards}>
            <img src="/assets/img/images/th-2/hero-img-5.jpg" alt="" style={{ opacity: 1, visibility: 'visible', display: 'block', position: 'relative', zIndex: 10000 }} />
          </BounceCard>
        </div>
      </div>

      {/* CTA Section - Referrals */}
      <FadeIn delay={0.2} direction="up">
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
      </FadeIn>

      {/* What Sets Us Apart Section */}
      <div className="section aximo-section-padding3 position-relative">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <FadeIn delay={0.1} direction="up">
                <div className="aximo-section-title clash-grotesk">
                  <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>What Sets Us Apart</h2>
                </div>
              </FadeIn>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <FadeIn delay={0.2} direction="up">
                <div className="aximo-iconbox-wrap2" style={{ height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                  <div className="aximo-iconbox-icon2" style={{ flexShrink: 0 }}>
                    <img src="/assets/img/icons/th-1-service-icon-1.svg" alt="" style={{ width: '100%', height: 'auto', maxWidth: '280px' }} />
                  </div>
                  <div className="aximo-iconbox-data2" style={{ flexGrow: 1 }}>
                    <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Qualified Leads Only</h3>
                    <p style={{ fontFamily: "'Libre Baskerville', serif" }}>We don't just generate clicks—we deliver pre-screened personal injury leads that convert into winning cases for your firm.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="col-xl-4 col-md-6">
              <FadeIn delay={0.3} direction="up">
                <div className="aximo-iconbox-wrap2" style={{ height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                  <div className="aximo-iconbox-icon2" style={{ flexShrink: 0, order: 2 }}>
                    <img src="/assets/img/icons/th-1-service-icon-4.svg" alt="" style={{ width: '100%', height: 'auto', maxWidth: '280px' }} />
                  </div>
                  <div className="aximo-iconbox-data2" style={{ flexGrow: 1, order: 1 }}>
                    <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Strategic Marketing</h3>
                    <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Professional content creation and social media management designed specifically for personal injury attorneys who want to stand out and build trust.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="col-xl-4 col-md-6">
              <FadeIn delay={0.4} direction="up">
                <div className="aximo-iconbox-wrap2" style={{ height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                  <div className="aximo-iconbox-icon2" style={{ flexShrink: 0 }}>
                    <img src="/assets/img/icons/th-1-service-icon-5.svg" alt="" style={{ width: '100%', height: 'auto', maxWidth: '280px' }} />
                  </div>
                  <div className="aximo-iconbox-data2" style={{ flexGrow: 1 }}>
                    <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>ROI-Focused Results</h3>
                    <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Every referral and every piece of content is designed with one goal: helping your injury firm win bigger cases and scale sustainably.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>


      {/* Pricing Section */}
      <div className="section aximo-section-padding3 position-relative">
        <div className="container">
          <FadeIn delay={0.1} direction="up">
            <div className="aximo-section-title center clash-grotesk">
              <h2 style={{ fontFamily: "'Roxborough CF', serif", maxWidth: '100%', margin: '0 auto 40px' }}>Strategic Growth for Personal&nbsp;Injury Firms</h2>
              <p style={{ maxWidth: '900px', margin: '0 auto' }}>Choose the package that matches your ambition. Every solution is designed to deliver measurable ROI and sustainable&nbsp;growth.</p>
            </div>
          </FadeIn>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <SlideIn delay={0}>
                <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.1s">
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-4-service-icon-1.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Starter Package</h3>
                </div>
                <div className="aximo-pricing-price">
                  <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>$2,500<span style={{ fontSize: '18px', fontWeight: 400, fontFamily: "'Roxborough CF', serif" }}>/month</span></h2>
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
              </SlideIn>
            </div>
            <div className="col-lg-4 col-md-6">
              <SlideIn delay={0.1}>
                <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.2s">
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-4-service-icon-2.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Growth Package</h3>
                </div>
                <div className="aximo-pricing-price">
                  <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>$5,000<span style={{ fontSize: '18px', fontWeight: 400, fontFamily: "'Roxborough CF', serif" }}>/month</span></h2>
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
              </SlideIn>
            </div>
            <div className="col-lg-4 col-md-6">
              <SlideIn delay={0.2}>
                <div className="aximo-pricing-wrap wow fadeInUpX" data-wow-delay="0.3s">
                <div className="aximo-pricing-header">
                  <img src="/assets/img/icons/th-1-service-icon-3.svg" alt="" style={{ width: '80px', height: '80px' }} />
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Custom Campaign</h3>
                </div>
                <div className="aximo-pricing-price">
                  <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>By Consultation</h2>
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
              </SlideIn>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Stack Section */}
      <div className="section aximo-section-padding position-relative">
        <div className="container">
          <FadeIn delay={0.1} direction="up">
            <div className="aximo-section-title center clash-grotesk">
              <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Solutions Designed to Move Cases Forward</h2>
            </div>
          </FadeIn>
        </div>
        <div className="aximo-service-increase-wrap">
          <div className="aximo-service-increase-row">
            <div className="aximo-service-increase-item">
              <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Premium Referral Solutions" />
              <div className="aximo-service-increase-title">
                <h3>Premium Referral Solutions:</h3>
              </div>
              <div className="aximo-service-increase-body">
                <p>We deliver qualified personal injury leads that convert into winning cases. Pre-screened clients with higher case acceptance rates for elite injury firms.</p>
              </div>
              <a href="/services" className="aximo-service-increase-icon">
                <i className="icon-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="aximo-service-increase-row">
            <div className="aximo-service-increase-item">
              <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Content Marketing Services" />
              <div className="aximo-service-increase-title">
                <h3>Content Marketing:</h3>
              </div>
              <div className="aximo-service-increase-body">
                <p>Professional content production and strategic social media management designed to build your brand and convert views into clients for personal injury firms.</p>
              </div>
              <a href="/services" className="aximo-service-increase-icon">
                <i className="icon-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="aximo-service-increase-row">
            <div className="aximo-service-increase-item">
              <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Strategic Marketing Consulting" />
              <div className="aximo-service-increase-title">
                <h3>Strategic Consulting:</h3>
              </div>
              <div className="aximo-service-increase-body">
                <p>ROI-focused marketing consulting and campaign optimization strategies tailored specifically for personal injury law firms looking to scale sustainably.</p>
              </div>
              <a href="/services" className="aximo-service-increase-icon">
                <i className="icon-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="aximo-service-increase-row">
            <div className="aximo-service-increase-item">
              <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Custom Campaign Development" />
              <div className="aximo-service-increase-title">
                <h3>Custom Campaigns:</h3>
              </div>
              <div className="aximo-service-increase-body">
                <p>Comprehensive multi-channel marketing campaigns including video production, TV/streaming commercials, and radio advertisements designed to grow your practice.</p>
              </div>
              <a href="/services" className="aximo-service-increase-icon">
                <i className="icon-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="aximo-service-increase-row">
            <div className="aximo-service-increase-item">
              <img className="swipeimage" src="/assets/img/images/th-2/content-img-1.jpg" alt="Attorney Network Building" />
              <div className="aximo-service-increase-title">
                <h3>Partnership Marketing:</h3>
              </div>
              <div className="aximo-service-increase-body">
                <p>Building strategic attorney-to-attorney networks and partnerships that create case-winning referral opportunities for personal injury powerhouses.</p>
              </div>
              <a href="/services" className="aximo-service-increase-icon">
                <i className="icon-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <FadeIn delay={0.2} direction="up">
        <div className="aximo-video-section extra-side-margin wow fadeInUpX" data-wow-delay="0s">
          <img src="/assets/img/images/th-2/video-img.jpg" alt="" />
          <a className="aximo-video-popup play-btn-size video-init" href="https://www.youtube.com/watch?v=7e90gBu4pas">
            <img src="/assets/img/icons/icon-play-button.svg" alt="" />
            <div className="waves wave-1"></div>
            <div className="waves wave-2"></div>
            <div className="waves wave-3"></div>
          </a>
        </div>
      </FadeIn>

      {/* About Section */}
      <FadeIn delay={0.2} direction="up">
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
      </FadeIn>

      {/* Final CTA Section */}
      <FadeIn delay={0.2} direction="up">
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
      </FadeIn>
      </div>
    </>
  );
}
