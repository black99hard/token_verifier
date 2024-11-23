import React from 'react';
import { Twitter, MessageCircle, Globe, Copy, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Tooltip } from './Tooltip';

interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  description: string;
  links: Array<{ type?: string; label?: string; url: string }>;
  totalAmount: number;
  amount: number;
  boostedTokens: BoostedToken[];
}

interface BoostedTokensListProps {
  boostedTokens: BoostedToken[];
}

export const BoostedTokensList: React.FC<BoostedTokensListProps> = ({ boostedTokens }) => {
  if (!boostedTokens || boostedTokens.length === 0) {
    return <p className="text-center text-slate-400">No boosted tokens available.</p>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Use a Set to keep track of unique token addresses
  const uniqueTokens = Array.from(new Set(boostedTokens.map(token => token.tokenAddress)))
    .map(tokenAddress => boostedTokens.find(token => token.tokenAddress === tokenAddress));

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
        Boosted Tokens List
        <Tooltip
            content="List of tokens that have been boosted.  Click on the icons to visit the token's website, Twitter, or Telegram. The 'Boost' section shows the current amount of the token and the total amount of the token. The 'Boost' section is updated in real-time."
            direction="left"
          > 
            <button className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
              <HelpCircle size={20} />
            </button>
          </Tooltip>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniqueTokens.map((token) => (
          token && (
            <div key={token.tokenAddress} className="glass-card p-4 rounded-lg space-y-3 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-3">
                {token.icon && (
                  <img src={token.icon} alt={`${token.tokenAddress} icon`} className="w-10 h-10 rounded-full" />
                )}
                <div>
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <span>{token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}</span>
                    <button onClick={() => copyToClipboard(token.tokenAddress)} className="text-slate-400 hover:text-slate-200">
                      <Copy size={16} />
                    </button>
                  </h4>
                  <p className="text-sm text-slate-400 flex items-center space-x-2">
                    <span>{token.chainId}</span>
                    <button onClick={() => copyToClipboard(token.chainId)} className="text-slate-400 hover:text-slate-200">
                      <Copy size={16} />
                    </button>
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300 line-clamp-2">{token.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2 hoververflow-x-auto">
                  {(token.links || []).map((link, index) => (
                    link?.url && (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                      >
                        {link.type === 'twitter' && <Twitter size={20} />}
                        {link.type === 'telegram' && <MessageCircle size={20} />}
                        {(link.label === 'Website' || !link.type) && <Globe size={20} />}
                      </a>
                    )
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Boost</p>
                  <p className="font-medium">{token.amount} / {token.totalAmount}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};