'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [bgColor, setBgColor] = useState('#C8B6E2');

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth <= 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Set up hover detection on service section
    const setupHoverListeners = () => {
      const serviceSection = document.querySelector('.aximo-service-increase-wrap');
      
      console.log('Service section found:', !!serviceSection);
      
      if (serviceSection) {
        serviceSection.addEventListener('mouseenter', () => {
          console.log('Mouse entered service section');
          setIsHovering(true);
        });
        
        serviceSection.addEventListener('mouseleave', () => {
          console.log('Mouse left service section');
          setIsHovering(false);
        });

        // Also hide default cursor
        (serviceSection as HTMLElement).style.cursor = 'none';
      }
    };

    // Wait for DOM to be ready
    if (document.readyState === 'complete') {
      setupHoverListeners();
    } else {
      window.addEventListener('load', setupHoverListeners);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1 : 0})`,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    />
  
  );
}

