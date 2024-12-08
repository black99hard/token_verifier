import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';

interface InfoItemProps {
  label?: string;
  value: string;
  isAddress?: boolean;
  isLink?: boolean;
  icon?: React.ReactNode;
  className?: string;
  tooltip?: React.ReactNode; // Add tooltip prop
}

export const InfoItem: React.FC<InfoItemProps> = ({ 
  label, 
  value, 
  isAddress, 
  isLink,
  icon,
  className = '',
  tooltip // Add tooltip prop
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    // You might want to add a toast notification here
  };

  const renderValue = () => {
    if (isLink) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center space-x-1"
        >
          {icon && icon}
          <span className="truncate">{value}</span>
          <ExternalLink size={14} />
        </a>
      );
    }
    if (isAddress) {
      return (
        <div className="flex items-center space-x-2">
          <span className="truncate">{`${value.slice(0, 6)}...${value.slice(-4)}`}</span>
          <button 
            onClick={copyToClipboard}
            className="text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            <Copy size={14} />
          </button>
        </div>
      );
    }
    return <span className="text-gray-100">{value}</span>;
  };

  return (
    <div className={`bg-black/40 border border-red-500/20 p-3 rounded-lg space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center space-x-1">
          <p className="text-xs text-gray-400">{label}</p>
          {tooltip && tooltip} {/* Render tooltip if provided */}
        </div>
      )}
      <div className="font-medium">{renderValue()}</div>
    </div>
  );
};