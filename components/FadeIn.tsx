'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '',
  direction = 'up'
}: FadeInProps) {
  // Just return children without animation to prevent blank sections
  return <div className={className}>{children}</div>;
}

