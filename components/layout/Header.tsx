'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mobileMenu = mobileOpen ? (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999, pointerEvents: 'auto' }}>
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999998
        }}
        onClick={() => setMobileOpen(false)}
      />
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          maxWidth: '80vw',
          height: '100vh',
          background: '#fff',
          zIndex: 999999,
          padding: '60px 30px',
          overflowY: 'auto',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.2)'
        }}
      >
        <button 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '32px',
            cursor: 'pointer',
            color: '#333',
            zIndex: 1000000
          }}
        >
          ×
        </button>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link 
            href="/" 
            onClick={() => setMobileOpen(false)}
            style={{ 
              fontFamily: "'Roxborough CF', serif",
              fontSize: '20px',
              color: '#333',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileOpen(false)}
            style={{ 
              fontFamily: "'Roxborough CF', serif",
              fontSize: '20px',
              color: '#333',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            About
          </Link>
          <Link 
            href="/services" 
            onClick={() => setMobileOpen(false)}
            style={{ 
              fontFamily: "'Roxborough CF', serif",
              fontSize: '20px',
              color: '#333',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            Services
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileOpen(false)}
            style={{ 
              fontFamily: "'Roxborough CF', serif",
              fontSize: '20px',
              color: '#333',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
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
            
            {/* Desktop Menu */}
            <div className="menu-block-wrapper desktop-only">
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

            {/* Hamburger */}
            <button className="mobile-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu - Portal to body */}
      {mounted && mobileMenu && createPortal(mobileMenu, document.body)}
    </>
  );
}

