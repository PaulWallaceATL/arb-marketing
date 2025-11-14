'use client';

import { useEffect, useState } from 'react';
import Hyperspeed from './Hyperspeed';

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    // Show for less time on mobile
    const duration = isMobile ? 1500 : 2500;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* Hyperspeed Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}>
        <Hyperspeed
          lineCount={80}
          speed={5}
          color="#9333EA"
        />
      </div>

      {/* Logo and Text */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
      }}>
        <img
          src="/assets/img/logo-arb.svg"
          alt="ARB"
          style={{
            width: '150px',
            height: 'auto',
            display: 'block',
            margin: '0 auto 15px',
          }}
        />
        <div
          className="loading-marketing-text"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontFamily: "'Roxborough CF', serif",
            marginBottom: '30px',
          }}
        >
          MARKETING
        </div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#9333EA',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          LOADING
        </div>
      </div>
    </div>
  );
}

