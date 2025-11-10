'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="site-header site-header--menu-center aximo-header-section aximo-header2" id="sticky-menu">
      <div className="container">
        <nav className="navbar site-navbar">
          {/* Brand Logo */}
          <div className="brand-logo">
            <Link href="/">
              <img 
                src="/assets/img/logo-arb.svg"
                alt="ARB Marketing" 
                className="light-version-logo" 
                style={{ maxHeight: '50px' }} 
              />
            </Link>
          </div>
          
          <div className="menu-block-wrapper">
            <div 
              className={`menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            <nav className={`menu-block ${isMobileMenuOpen ? 'active' : ''}`} id="append-menu-header">
              <div className="mobile-menu-head" style={{ fontFamily: "'Roxborough CF', serif" }}>
                <div className="go-back">
                  <i className="fa fa-angle-left"></i>
                </div>
                <div className="current-menu-title"></div>
                <div 
                  className="mobile-menu-close" 
                  style={{ fontFamily: "'Roxborough CF', serif" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  &times;
                </div>
              </div>
              
              <ul className="site-menu-main" style={{ fontFamily: "'Roxborough CF', serif" }}>
                <li className="nav-item">
                  <Link href="/" className="nav-link-item" style={{ fontFamily: "'Roxborough CF', serif" }}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/about" className="nav-link-item" style={{ fontFamily: "'Roxborough CF', serif" }}>
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/services" className="nav-link-item" style={{ fontFamily: "'Roxborough CF', serif" }}>
                    Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/contact" className="nav-link-item" style={{ fontFamily: "'Roxborough CF', serif" }}>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-btn header-btn-l1 ms-auto d-none d-xs-inline-flex">
            <Link 
              href="/contact" 
              className="aximo-default-btn aximo-header-btn outline-btn" 
              style={{ fontFamily: "'Libre Baskerville', serif", color: '#000 !important' }}
            >
              <span className="aximo-label-up" style={{ color: '#000 !important' }}>Hire Us!</span>
              <span className="aximo-label-up" style={{ color: '#000 !important' }}>Hire Us!</span>
            </Link>
          </div>
          
          {/* Mobile menu trigger */}
          <div 
            className="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
          </div>
        </nav>
      </div>
    </header>
  );
}

