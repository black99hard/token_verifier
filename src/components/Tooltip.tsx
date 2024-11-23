import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  direction?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, direction = 'top', children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const getTooltipStyle = () => {
    switch (direction) {
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip ${getTooltipStyle()}`}
          style={{ width: '13rem' }}
        >
          {content}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
    </div>
  );
};

