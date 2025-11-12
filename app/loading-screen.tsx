'use client';

import { useEffect } from 'react';
import Hyperspeed from '@/components/Hyperspeed';

export default function LoadingScreenFixed() {
  useEffect(() => {
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Hide loading screen immediately on mobile
      const loader = document.getElementById('app-loading-screen');
      if (loader) {
        loader.style.display = 'none';
      }
    } else {
      // Desktop: hide after 2.5 seconds
      setTimeout(() => {
        const loader = document.getElementById('app-loading-screen');
        if (loader) {
          loader.style.opacity = '0';
          loader.style.transition = 'opacity 0.5s ease-out';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 500);
        }
      }, 2500);
    }
  }, []);

  return (
    <div
      id="app-loading-screen"
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
        opacity: 1,
      }}
    >
      {/* Hyperspeed Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center',
      }}>
        <img
          src="/assets/img/logo-arb.svg"
          alt="ARB"
          style={{
            width: '150px',
            height: 'auto',
          }}
        />
        <div
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#000',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontFamily: "'Roxborough CF', serif",
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
            marginTop: '20px',
          }}
        >
          LOADING
        </div>
      </div>
    </div>
  );
}

