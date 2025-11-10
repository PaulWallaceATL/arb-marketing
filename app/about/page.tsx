import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | ARB Marketing',
  description: 'Learn about ARB Marketing and how we help personal injury law firms grow through qualified leads and strategic marketing.',
};

export default function AboutPage() {
  return (
    <div className="aximo-all-section">
      {/* Breadcrumb */}
      <div className="aximo-breadcrumb">
        <div className="container">
          <h1 style={{ fontFamily: "'Roxborough CF', serif" }}>About Us</h1>
          <nav>
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="active">About</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* About Content */}
      <div className="section aximo-section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="aximo-default-content">
                <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Empowering Personal Injury Law Firms</h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  ARB Marketing was founded with a clear mission: to connect ambitious personal injury attorneys with the qualified leads and strategic marketing solutions they need to build winning practices.
                </p>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  We understand the unique challenges facing injury law firms in today's competitive market. That's why we've built a comprehensive suite of referral and marketing services designed specifically for attorneys who want to grow bigger, win more, and scale sustainably.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="aximo-thumb">
                <img src="/assets/img/images/th-2/content-img-1.jpg" alt="About ARB Marketing" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="section aximo-section-padding bg-light">
        <div className="container">
          <div className="aximo-section-title center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Our Values</h2>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="aximo-iconbox-wrap text-center">
                <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Quality Over Quantity</h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>We deliver pre-screened, qualified leads that convert—not just clicks.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="aximo-iconbox-wrap text-center">
                <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>Strategic Partnership</h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Your success is our success. We're invested in your long-term growth.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="aximo-iconbox-wrap text-center">
                <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>ROI-Focused</h3>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Every strategy, every lead, every campaign is designed to deliver measurable results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="aximo-cta-section aximo-section-padding">
        <div className="container">
          <div className="aximo-cta-wrap text-center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Ready to Grow Your Practice?</h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif" }}>Let's discuss how we can help you win bigger cases and scale sustainably.</p>
            <Link href="/contact" className="aximo-default-btn">
              <span className="aximo-label-up">Schedule Consultation</span>
              <span className="aximo-label-up">Schedule Consultation</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

