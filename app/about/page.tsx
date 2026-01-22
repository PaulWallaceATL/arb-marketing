'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [founderPhoto, setFounderPhoto] = useState('/assets/images/gallery/Alexis.png');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/site-media');
        const json = await res.json();
        if (Array.isArray(json.media)) {
          const match = json.media.find((m: any) => m?.key === 'founder_photo' && m?.url);
          if (match?.url) setFounderPhoto(match.url);
        }
      } catch (e) {
        // ignore, fall back to default
      }
    };
    fetchMedia();
  }, []);

  return (
    <>
      <div className="section aximo-section-padding">
        <div id="aximo-counter"></div>
        <div className="container">
          <div className="aximo-section-title">
            <div className="row">
              <div className="col-lg-7">
                <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>
                  <span className="aximo-title-animation">
                    Empowering Personal Injury Firms
                  </span>
                  to Win Bigger Cases
                </h2>
              </div>
              <div className="col-lg-4 offset-lg-1 d-flex align-items-center">
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  We specialize in connecting ambitious personal injury attorneys with qualified leads and strategic marketing that drives real results. Our mission is helping you build a powerful practice.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="aximo-counter-wrap" style={{ background: 'white', border: '2px solid #B39FD5', borderRadius: '12px', padding: '30px' }}>
                <div className="aximo-counter-data">
                  <h2 className="aximo-counter-number" style={{ fontFamily: "'Roxborough CF', serif", color: '#B39FD5' }}>
                    <span data-percentage="500" className="aximo-counter">500</span>
                    +
                  </h2>
                  <p style={{ fontFamily: "'Libre Baskerville', serif", color: '#333' }}>Qualified leads delivered</p>
                </div>
                <div className="aximo-counter-data" style={{ borderColor: '#B39FD5' }}>
                  <h2 className="aximo-counter-number" style={{ fontFamily: "'Roxborough CF', serif", color: '#B39FD5' }}>
                    <span data-percentage="35" className="aximo-counter">35</span>
                    +
                  </h2>
                  <p style={{ fontFamily: "'Libre Baskerville', serif", color: '#333' }}>Law firms partnered</p>
                </div>
                <div className="aximo-counter-data" style={{ borderColor: '#B39FD5' }}>
                  <h2 className="aximo-counter-number" style={{ fontFamily: "'Roxborough CF', serif", color: '#B39FD5' }}>
                    <span data-percentage="99" className="aximo-counter">99</span>
                    %
                  </h2>
                  <p style={{ fontFamily: "'Libre Baskerville', serif", color: '#333' }}>Client satisfaction rate</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section aximo-section-padding6">
        <div className="container">
          <div className="aximo-section-title center title-description">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>
              <span className="aximo-title-animation">
                Our Mission: Helping Personal Injury Firms
              </span>
              Win Bigger and Grow Sustainably
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '900px', margin: '20px auto 0' }}>
              At ARB Marketing, we're exclusively focused on empowering personal injury law firms with qualified leads and strategic marketing. We understand the unique challenges of legal marketing and what it takes to convert prospects into winning cases.
            </p>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="aximo-story-thumb wow fadeInUpX" data-wow-delay="0.1s" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/assets/img/images/th-1/about-gallery-img-1.jpg" alt="Legal marketing collaboration" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="aximo-story-thumb wow fadeInUpX" data-wow-delay="0.2s" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/assets/img/images/th-1/about-gallery-img-2.jpg" alt="Strategic planning" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="aximo-story-thumb wow fadeInUpX" data-wow-delay="0.3s" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/assets/img/images/th-1/about-gallery-img-3.jpg" alt="Team collaboration" />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="aximo-story-thumb wow fadeInUpX" data-wow-delay="0.4s" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/assets/img/images/th-1/about-gallery-img-4.jpg" alt="Legal marketing success" />
              </div>
            </div>
          </div>

          <div className="aximo-story-content">
            <div className="row">
              <div className="col-lg-6">
                <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Why We Focus Exclusively on Personal Injury Law</h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Personal injury law firms face unique marketing challenges—strict ethical guidelines, competitive markets, and the need to build trust quickly with prospects who are often going through difficult times.
                </p>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Our exclusive focus on this practice area means we understand what drives case conversions, how to navigate bar association rules, and what messaging resonates with injury victims seeking representation.
                </p>
              </div>
              <div className="col-lg-6">
                <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Our Commitment to Your Growth</h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  We don't just generate traffic—we deliver qualified leads that convert into winning cases. Every referral is pre-screened, every campaign is ROI-focused, and every strategy is designed to scale sustainably.
                </p>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  From solo practitioners looking to build their practice to established firms wanting to dominate their market, we provide the strategic marketing and premium referrals that drive real results.
                </p>
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
                Let's Build Your Practice Together
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '30px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto', color: '#000' }}>
                Schedule a free consultation to discuss how our qualified leads and strategic marketing can help your injury firm win bigger cases.
              </p>
            </div>
            <div className="aximo-cta-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="aximo-default-btn aximo-header-btn aximo-cta-primary-btn" style={{ color: '#fff !important' }}>
                <span className="aximo-label-up">Hire Us!</span>
                <span className="aximo-label-up">Hire Us!</span>
              </Link>
              <Link href="/services" className="aximo-default-btn aximo-header-btn outline-btn" style={{ color: '#fff !important' }}>
                <span className="aximo-label-up">View Services</span>
                <span className="aximo-label-up">View Services</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section aximo-section-padding3">
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>
              Meet the Founder
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", maxWidth: '800px', margin: '20px auto 0' }}>
              Leading the vision behind ARB Marketing with passion for helping personal injury law firms achieve sustainable growth and winning results.
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="aximo-team-wrap wow fadeInUpX" data-wow-delay="0s" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="aximo-team-thumb" style={{ borderRadius: '12px', overflow: 'hidden', width: '400px', height: '400px', margin: '0 auto' }}>
                  <img src={founderPhoto} alt="Alexis Broadwater - Founder of ARB Marketing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="aximo-team-data" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Roxborough CF', serif", fontSize: '28px', marginTop: '20px' }}>Alexis Broadwater</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '18px', color: '#B39FD5', marginBottom: '20px' }}>Founder & CEO</p>
                  <p style={{ fontFamily: "'Libre Baskerville', serif", textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                    Alexis founded ARB Marketing with a vision to transform how personal injury law firms approach marketing and lead generation. With deep expertise in legal marketing and a passion for helping attorneys win bigger cases, she leads our team in delivering qualified referrals and strategic campaigns that drive measurable ROI. Her commitment to excellence and understanding of the personal injury space has helped dozens of law firms scale sustainably and dominate their markets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

