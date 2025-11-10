import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Services | ARB Marketing',
  description: 'Discover our premium referral solutions and strategic marketing services for personal injury law firms.',
};

export default function ServicesPage() {
  return (
    <div className="aximo-all-section">
      {/* Breadcrumb */}
      <div className="aximo-breadcrumb">
        <div className="container">
          <h1 style={{ fontFamily: "'Roxborough CF', serif" }}>Our Services</h1>
          <nav>
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="active">Services</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Services Content */}
      <div className="section aximo-section-padding">
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Solutions That Drive Results</h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Comprehensive marketing and referral services designed exclusively for personal injury law firms.</p>
          </div>

          <div className="row">
            {/* Service 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="aximo-iconbox-wrap2">
                <div className="aximo-iconbox-icon2">
                  <img src="/assets/img/icons/th-1-service-icon-1.svg" alt="Premium Referral Solutions" />
                </div>
                <div className="aximo-iconbox-data2">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Premium Referral Solutions</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    We deliver qualified personal injury leads that convert into winning cases. Pre-screened clients with higher case acceptance rates for elite injury firms.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="aximo-iconbox-wrap2">
                <div className="aximo-iconbox-icon2">
                  <img src="/assets/img/icons/th-1-service-icon-4.svg" alt="Content Marketing" />
                </div>
                <div className="aximo-iconbox-data2">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Content Marketing</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Professional content production and strategic social media management designed to build your brand and convert views into clients for personal injury firms.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="aximo-iconbox-wrap2">
                <div className="aximo-iconbox-icon2">
                  <img src="/assets/img/icons/th-1-service-icon-5.svg" alt="Strategic Consulting" />
                </div>
                <div className="aximo-iconbox-data2">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Strategic Consulting</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    ROI-focused marketing consulting and campaign optimization strategies tailored specifically for personal injury law firms looking to scale sustainably.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="col-lg-4 col-md-6">
              <div className="aximo-iconbox-wrap2">
                <div className="aximo-iconbox-icon2">
                  <img src="/assets/img/icons/th-1-service-icon-2.svg" alt="Custom Campaigns" />
                </div>
                <div className="aximo-iconbox-data2">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Custom Campaigns</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Comprehensive multi-channel marketing campaigns including video production, TV/streaming commercials, and radio advertisements designed to grow your practice.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div className="col-lg-4 col-md-6">
              <div className="aximo-iconbox-wrap2">
                <div className="aximo-iconbox-icon2">
                  <img src="/assets/img/icons/th-1-service-icon-3.svg" alt="Partnership Marketing" />
                </div>
                <div className="aximo-iconbox-data2">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Partnership Marketing</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Building strategic attorney-to-attorney networks and partnerships that create case-winning referral opportunities for personal injury powerhouses.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 6 */}
            <div className="col-lg-4 col-md-6">
              <div className="aximo-iconbox-wrap2">
                <div className="aximo-iconbox-icon2">
                  <img src="/assets/img/icons/th-1-service-icon-6.svg" alt="Brand Development" />
                </div>
                <div className="aximo-iconbox-data2">
                  <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Brand Development</h3>
                  <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    Complete brand strategy and identity development to position your personal injury firm as the trusted authority in your market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="aximo-cta-section aximo-section-padding bg-light">
        <div className="container">
          <div className="aximo-cta-wrap text-center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Ready to Get Started?</h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Schedule a free consultation to discuss how we can help grow your practice.</p>
            <Link href="/contact" className="aximo-default-btn">
              <span className="aximo-label-up">Schedule Free Consultation</span>
              <span className="aximo-label-up">Schedule Free Consultation</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

