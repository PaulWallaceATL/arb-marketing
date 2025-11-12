'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BounceCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  shouldAnimate?: boolean;
}

export default function BounceCard({ children, delay = 0, className = '', shouldAnimate = true }: BounceCardProps) {
  return (
    <motion.div
      initial={{ scale: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: shouldAnimate ? delay : 0,
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

