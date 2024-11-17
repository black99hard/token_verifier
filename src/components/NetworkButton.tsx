import React from 'react';
import { Network } from '../types';

interface NetworkButtonProps {
  network: Network;
  currentNetwork: Network;
  onClick: (network: Network) => void;
}

export const NetworkButton: React.FC<NetworkButtonProps> = ({ 
  network, 
  currentNetwork, 
  onClick 
}) => (
  <button
    onClick={() => onClick(network)}
    className={`network-btn ${
      currentNetwork === network
        ? 'bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white'
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    }`}
  >
    {network.toUpperCase()}
  </button>
);