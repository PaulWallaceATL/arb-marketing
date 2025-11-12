'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function SlideIn({ children, delay = 0, className = '' }: SlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

