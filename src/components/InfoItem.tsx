import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';

interface InfoItemProps {
  label?: string;
  value: string;
  isAddress?: boolean;
  isLink?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({ 
  label, 
  value, 
  isAddress, 
  isLink,
  icon,
  className = ''
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
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1"
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
            className="text-slate-400 hover:text-slate-300 transition-colors duration-200"
          >
            <Copy size={14} />
          </button>
        </div>
      );
    }
    return <span className="text-slate-300">{value}</span>;
  };

  return (
    <div className={`glass-card p-3 rounded-lg space-y-1 ${className}`}>
      {label && <p className="text-xs text-slate-400">{label}</p>}
      <div className="font-medium">{renderValue()}</div>
    </div>
  );
};

