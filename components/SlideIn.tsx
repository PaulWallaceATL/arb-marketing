'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function SlideIn({ children, delay = 0, className = '' }: SlideInProps) {
  // Just return children without animation to prevent issues
  return <div className={className}>{children}</div>;
}

