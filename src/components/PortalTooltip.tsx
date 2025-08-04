import React, { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalTooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export const PortalTooltip: React.FC<PortalTooltipProps> = ({
  content,
  children,
  className = ''
}) => {
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0
  });

  // Hide tooltip when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      setTooltipState(prev => ({ ...prev, visible: false }));
    };

    if (tooltipState.visible) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [tooltipState.visible]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipState({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setTooltipState(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      <span
        className={`cursor-help ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>

      {/* Portal tooltip - renders directly under document.body, escaping all stacking contexts */}
      {tooltipState.visible && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed pointer-events-none transition-opacity duration-200"
          style={{
            left: tooltipState.x,
            top: tooltipState.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 2147483647
          }}
        >
          <div className="bg-black/95 text-white text-xs px-4 py-3 rounded-lg shadow-2xl whitespace-nowrap max-w-sm border border-white/20">
            {content}
          </div>
          {/* Arrow pointing down to the element */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/95"
          />
        </div>,
        document.body
      )}
    </>
  );
};