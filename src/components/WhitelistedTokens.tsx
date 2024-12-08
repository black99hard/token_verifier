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
      <div className="bg-black/60 border border-red-500/20 p-6 text-center rounded-lg">
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
          className="bg-black/40 border border-red-500/20 p-4 flex items-center justify-between group hover:border-red-500/30 transition-all duration-300 rounded-lg"
        >
          <button
            className="flex-1 flex items-center space-x-4 text-left"
            onClick={() => onSelect(token)}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={token.image_url || "/no_logo.png"}
                alt={`${token.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/no_image.png";
                }}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-100">{token.name} ({token.symbol})</h4>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span>{token.network.toUpperCase()}</span>
                <span>•</span>
                <span>Added {formatDistanceToNow(new Date(token.addedAt))} ago</span>
              </div>
            </div>
          </button>
          <button
            onClick={() => onRemove(token)}
            className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4"
            title="Remove from whitelist"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};