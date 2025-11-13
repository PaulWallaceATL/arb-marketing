'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <footer className="aximo-footer-section2" style={{ backgroundImage: "url('/assets/images/v2/footer-bg.png')" }}>
      <div className="container">
        <div className="aximo-footer-top aximo-section-padding">
          <div className="row">
            <div className="col-xl-4 col-lg-12">
              <div className="aximo-footer-textarea">
                <Link href="/">
                  <img 
                    src="/assets/img/logo-arb.svg"
                    alt="ARB Marketing" 
                    style={{ maxHeight: '60px' }} 
                  />
                </Link>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  ARB Marketing delivers premium referral solutions and strategic marketing exclusively for personal injury law firms. We connect ambitious attorneys with qualified leads and create content that wins cases.
                </p>
              </div>
            </div>
            
            <div className="col-xl-3 col-md-4">
              <div className="aximo-footer-menu extar-margin">
                <div className="aximo-footer-title">
                  <p style={{ fontFamily: "'Roxborough CF', serif" }}>Quick Links</p>
                </div>
                <ul style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>
            
            
            <div className="col-xl-3 col-md-4">
              <div className="aximo-subscription">
                <div className="aximo-footer-title">
                  <p style={{ fontFamily: "'Roxborough CF', serif" }}>Stay Connected</p>
                </div>
                <form onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ fontFamily: "'Libre Baskerville', serif" }} 
                  />
                  <button id="aximo-subscription-btn" type="submit" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    <span className="aximo-label-up">Subscribe</span>
                    <span className="aximo-label-up">Subscribe</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="aximo-footer-bottom two">
          <div className="row">
            <div className="col-lg-12 d-flex align-items-center justify-content-center">
              <div className="aximo-copywright two">
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  &copy; Copyright 2025, All Rights Reserved by ARB Marketing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

