'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setHeaderVisible(false);
      } else {
        // Scrolling up
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const mobileMenu = mobileOpen ? (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2147483647, pointerEvents: 'auto' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          zIndex: 2147483646
        }}
        onClick={() => setMobileOpen(false)}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '85vw',
          maxWidth: '350px',
          height: '100vh',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
          zIndex: 2147483647,
          padding: '0',
          overflowY: 'auto',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.3)'
        }}
      >
        {/* Menu Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff'
        }}>
          <img
            src="/assets/img/logo-arb.svg"
            alt="ARB Marketing"
            style={{ maxHeight: '35px' }}
          />
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: '#f3f4f6',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            ×
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '32px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Roxborough CF', serif",
                fontSize: '22px',
                fontWeight: 500,
                color: '#1f2937',
                textDecoration: 'none',
                padding: '16px 20px',
                borderRadius: '12px',
                background: '#fff',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'block'
              }}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Roxborough CF', serif",
                fontSize: '22px',
                fontWeight: 500,
                color: '#1f2937',
                textDecoration: 'none',
                padding: '16px 20px',
                borderRadius: '12px',
                background: '#fff',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'block'
              }}
            >
              About
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Roxborough CF', serif",
                fontSize: '22px',
                fontWeight: 500,
                color: '#1f2937',
                textDecoration: 'none',
                padding: '16px 20px',
                borderRadius: '12px',
                background: '#fff',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'block'
              }}
            >
              Services
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Roxborough CF', serif",
                fontSize: '22px',
                fontWeight: 500,
                color: '#1f2937',
                textDecoration: 'none',
                padding: '16px 20px',
                borderRadius: '12px',
                background: '#fff',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'block'
              }}
            >
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: '18px',
              fontWeight: 600,
              color: '#fff',
              textDecoration: 'none',
              padding: '16px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
              marginTop: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
              display: 'block'
            }}
          >
            Hire Us!
          </Link>
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header
        className="site-header site-header--menu-center aximo-header-section aximo-header2"
        id="sticky-menu"
        style={{
          transform: (headerVisible && !mobileOpen) ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
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

            <div className="header-btn header-btn-l1 ms-auto d-none d-xs-inline-flex" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <ThemeToggle />
              <Link
                href="/contact"
                className="aximo-default-btn aximo-header-btn outline-btn hire-us-header-btn"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
              >
                <span className="aximo-label-up hire-us-text" style={{ color: '#000000' }}>Grow With Us</span>
                <span className="aximo-label-up hire-us-text" style={{ color: '#000000' }}>Grow With Us</span>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mobile-controls">
              <ThemeToggle />
              <button className="mobile-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu - Portal to body */}
      {mounted && mobileMenu && createPortal(mobileMenu, document.body)}
    </>
  );
}

