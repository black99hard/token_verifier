import React from 'react';
import { Star } from 'lucide-react';
import { Network } from '../types';

interface WhitelistButtonProps {
  isWhitelisted: boolean;
  onClick: () => void;
  className?: string;
}

export const WhitelistButton: React.FC<WhitelistButtonProps> = ({
  isWhitelisted,
  onClick,
  className = ''
}) => (
  <button
    onClick={onClick}
    className={`transition-all duration-300 ${className}`}
    title={isWhitelisted ? 'Remove from whitelist' : 'Add to whitelist'}
  >
    <Star
      className={`${
        isWhitelisted 
          ? 'fill-red-400 text-red-400' 
          : 'text-slate-400 hover:text-red-400'
      } transition-colors duration-300`}
      size={20}
    />
  </button>
);