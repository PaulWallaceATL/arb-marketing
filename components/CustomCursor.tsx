'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('View Details');
  const [bgColor, setBgColor] = useState('#C8B6E2');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const serviceItem = target.closest('.aximo-service-increase-row');
      
      if (serviceItem) {
        setIsHovering(true);
        // Could change color based on which item
        const bgStyle = window.getComputedStyle(serviceItem).backgroundColor;
        if (bgStyle && bgStyle !== 'rgba(0, 0, 0, 0)') {
          // Has background, use contrasting color
          setBgColor('#C8B6E2');
        } else {
          setBgColor('#C8B6E2');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Add listeners to service section
    const serviceSection = document.querySelector('.aximo-service-increase-wrap');
    if (serviceSection) {
      serviceSection.addEventListener('mouseenter', handleMouseEnter as EventListener);
      serviceSection.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (serviceSection) {
        serviceSection.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        serviceSection.removeEventListener('mouseleave', handleMouseLeave);
      }
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
        fontSize: '16px',
        fontWeight: 600,
        color: '#000',
        textAlign: 'center',
        fontFamily: "'Roxborough CF', serif",
        lineHeight: 1.3,
      }}
    >
      {cursorText}
    </div>
  );
}

