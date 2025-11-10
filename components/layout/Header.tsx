'use client';

import Link from 'next/link';

export default function Header() {
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
            <nav className="menu-block" id="append-menu-header">
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
        </nav>
      </div>
    </header>
  );
}

