import React from 'react';
import { Network } from '../types';


interface NetworkButtonProps {
  network: Network;
  currentNetwork: Network;
  onClick: (network: Network) => void;
}

const networkConfig: Record<Network, { logo: string; name: string }> = {
  tron: { logo: '/trx.png', name: 'Tron' },
  solana: { logo: '/sol.png', name: 'Solana' },
  ton: { logo: '/ton.png', name: 'TON' },
};

export const NetworkButton: React.FC<NetworkButtonProps> = ({ network, currentNetwork, onClick }) => {
  const isActive = network === currentNetwork;
  const { logo, name } = networkConfig[network];

  return (
    <button
      onClick={() => onClick(network)}
      className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-red-500 to-purple-600'
          : 'bg-slate-800 hover:bg-slate-700'
      }`}
    >
      <span className="sr-only">{name}</span>
      <div className="relative w-6 h-6">
        <img
          src={logo}
          alt={`${name} logo`}
          width="100%"
          height="100%"
          style={{ objectFit: 'contain' }}
          className={isActive ? 'filter brightness-0 invert' : ''}
        />
      </div>
    </button>
  );
};

