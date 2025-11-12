'use client';

import { useEffect, useRef } from 'react';

interface HyperspeedProps {
  className?: string;
  lineCount?: number;
  speed?: number;
  color?: string;
}

interface Line {
  x: number;
  y: number;
  z: number;
  prevZ: number;
}

export default function Hyperspeed({
  className = '',
  lineCount = 80,
  speed = 15,
  color = '#9333EA',
}: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Line[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();

    const centerX = canvas.width / (2 * dpr);
    const centerY = canvas.height / (2 * dpr);

    // Initialize lines
    const initLine = (): Line => {
      return {
        x: Math.random() * canvas.width / dpr - centerX,
        y: Math.random() * canvas.height / dpr - centerY,
        z: Math.random() * canvas.width / dpr,
        prevZ: Math.random() * canvas.width / dpr,
      };
    };

    linesRef.current = Array.from({ length: lineCount }, initLine);

    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 147, g: 51, b: 234 }; // Default purple
    };

    const rgb = hexToRgb(color);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      linesRef.current.forEach((line) => {
        line.prevZ = line.z;
        line.z -= speed;

        if (line.z < 1) {
          line.x = Math.random() * canvas.width / dpr - centerX;
          line.y = Math.random() * canvas.height / dpr - centerY;
          line.z = canvas.width / dpr;
          line.prevZ = line.z;
        }

        const sx = ((line.x / line.z) * canvas.width / dpr) + centerX;
        const sy = ((line.y / line.z) * canvas.height / dpr) + centerY;
        const prevSx = ((line.x / line.prevZ) * canvas.width / dpr) + centerX;
        const prevSy = ((line.y / line.prevZ) * canvas.height / dpr) + centerY;

        const maxDist = canvas.width / dpr;
        const dist = Math.sqrt(line.x * line.x + line.y * line.y);
        const alpha = Math.max(0, Math.min(1, 1 - dist / maxDist));
        const lineWidth = Math.max(1, (canvas.width / dpr - line.z) / canvas.width * dpr * 3);

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.moveTo(prevSx, prevSy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lineCount, speed, color]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

