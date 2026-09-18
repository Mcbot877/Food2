import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, input, select, textarea, [role="button"]');
      setIsPointer(!!clickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient Large Cursor Glow */}
      <div
        className="fixed pointer-events-none z-50 transition-transform duration-300 ease-out hidden md:block"
        style={{
          transform: `translate(${position.x - 150}px, ${position.y - 150}px)`,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0) 70%)',
        }}
      />

      {/* Precise Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
        animate={{
          x: position.x - (isPointer ? 12 : 6),
          y: position.y - (isPointer ? 12 : 6),
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 450, mass: 0.1 }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isPointer
              ? 'w-6 h-6 bg-amber-400/20 border border-amber-400'
              : 'w-3 h-3 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
          }`}
        />
      </motion.div>
    </>
  );
};
