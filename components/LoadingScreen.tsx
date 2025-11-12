'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Hyperspeed from './Hyperspeed';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Logo animation duration
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
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
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}>
            <Hyperspeed
              className="loading-hyperspeed"
              lineCount={80}
              speed={5}
              color="#9333EA"
            />
          </div>

          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* ARB Logo */}
            <motion.img
              src="/assets/img/logo-arb.svg"
              alt="ARB Marketing"
              style={{
                width: '150px',
                height: 'auto',
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: 1,
                ease: 'easeInOut',
              }}
            />

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#9333EA',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Loading
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#9333EA',
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

