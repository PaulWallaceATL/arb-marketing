'use client';

import { useEffect } from 'react';
import Hyperspeed from './Hyperspeed';

interface SimpleLoadingScreenProps {
  onComplete: () => void;
}

export default function SimpleLoadingScreen({ onComplete }: SimpleLoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          className="loading-hyperspeed"
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
      }}>
        <img
          src="/assets/img/logo-arb.svg"
          alt="ARB Marketing"
          style={{
            width: '150px',
            height: 'auto',
            marginBottom: '10px',
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
          Marketing
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
          Loading...
        </div>
      </div>
    </div>
  );
}

