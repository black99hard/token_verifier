import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { truncateAddress } from '../utils/format';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  label: string;
  value: string;
  isAddress?: boolean;
  isLink?: boolean;
  icon?: LucideIcon;
}

export const InfoItem: React.FC<InfoItemProps> = ({ 
  label, 
  value, 
  isAddress, 
  isLink, 
  icon: Icon 
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard!', {
      position: 'bottom-right',
      theme: 'dark'
    });
  };

  return (
    <div className="glass-card p-4 rounded-lg space-y-2">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="text-slate-400" size={16} />}
        <p className="info-label">{label}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="info-value truncate">
          {isLink ? (
            <a href={value} target="_blank" rel="noopener noreferrer" 
               className="text-red-400 hover:text-red-300 flex items-center">
              {value} <ExternalLink size={16} className="ml-1" />
            </a>
          ) : (
            isAddress ? truncateAddress(value) : value
          )}
        </p>
        {(isAddress || isLink) && (
          <button onClick={handleCopy} 
                  className="text-slate-400 hover:text-slate-300 transition-colors">
            <Copy size={16} />
          </button>
        )}
      </div>
    </div>
  );
};