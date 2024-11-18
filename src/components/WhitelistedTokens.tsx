import React from 'react';
import { WhitelistedToken } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Star, Trash2 } from 'lucide-react';

interface WhitelistedTokensProps {
  tokens: WhitelistedToken[];
  onSelect: (token: WhitelistedToken) => void;
  onRemove: (token: WhitelistedToken) => void;
}

export const WhitelistedTokens: React.FC<WhitelistedTokensProps> = ({
  tokens,
  onSelect,
  onRemove
}) => {
  if (tokens.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <Star className="mx-auto mb-2 text-slate-400" size={24} />
        <p className="text-slate-400">No whitelisted tokens yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <div
          key={`${token.network}-${token.address}`}
          className="glass-card p-4 flex items-center justify-between group hover:border-red-500/30 transition-all duration-300"
        >
          <button
            className="flex-1 text-left"
            onClick={() => onSelect(token)}
          >
            <h4 className="font-medium">{token.name} ({token.symbol})</h4>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>{token.network.toUpperCase()}</span>
              <span>•</span>
              <span>Added {formatDistanceToNow(new Date(token.addedAt))} ago</span>
            </div>
          </button>
          <button
            onClick={() => onRemove(token)}
            className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
            title="Remove from whitelist"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};