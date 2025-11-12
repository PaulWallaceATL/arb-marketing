'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BounceCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function BounceCard({ children, delay = 0, className = '' }: BounceCardProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

