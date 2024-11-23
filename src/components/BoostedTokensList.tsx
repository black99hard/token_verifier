import { useState } from 'react';
import { Twitter, MessageCircle, Globe, Copy, Check } from 'lucide-react';

interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  description: string;
  links: Array<{ type?: string; label?: string; url: string }>;
  totalAmount: number;
  amount: number;
}

interface BoostedTokensListProps {
  boostedTokens: BoostedToken[];
}

export const BoostedTokensList: React.FC<BoostedTokensListProps> = ({ boostedTokens }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  if (!boostedTokens?.length) {
    return <p className="text-center text-slate-400">No boosted tokens available.</p>;
  }

  // Sort boostedTokens by `amount` in descending order
  const sortedTokens = [...boostedTokens].sort((a, b) => b.amount - a.amount);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const getTokenName = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

  // Get emoji based on boost amount
  const getEmoji = (amount: number) => {
    if (amount >= 1000) return "🔥"; // Very high boost
    if (amount >= 500) return "🚀"; // Moderate boost
    return "📈"; // Low boost but trending
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
        Boosted Tokens
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTokens.map(({ tokenAddress, chainId, icon, description, links, amount, totalAmount }) => {
          const tokenName = getTokenName(tokenAddress);
          const emoji = getEmoji(amount);

          return (
            <div
              key={tokenAddress}
              className="glass-card p-4 rounded-lg space-y-3 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="flex items-center space-x-3">
                {icon && (
                  <img
                    src={icon}
                    alt={`${tokenName} icon`}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="overflow-hidden flex-grow">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-lg truncate">
                      {tokenName} <span>{emoji}</span>
                    </h4>
                  </div>
                  <p className="text-sm text-slate-400">{chainId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tokenAddress}
                  readOnly
                  className="bg-slate-700 text-slate-200 text-xs p-1 rounded flex-grow overflow-hidden text-ellipsis"
                />
                <button
                  onClick={() =>
                    copyToClipboard(tokenAddress, `address-${tokenAddress}`)
                  }
                  className="p-1 bg-slate-600 rounded hover:bg-slate-500 transition-colors duration-200 flex-shrink-0"
                  aria-label="Copy token address"
                >
                  {copiedItem === `address-${tokenAddress}` ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-slate-200" />
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-300 line-clamp-2">
                {description}
              </p>
              <div className="flex justify-between items-center">
                <div className="overflow-x-auto">
                  <div className="flex space-x-2 min-w-max">
                    {(links || []).map(
                      (link, index) =>
                        link?.url && (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                          >
                            {link.type === "twitter" && <Twitter size={20} />}
                            {link.type === "telegram" && (
                              <MessageCircle size={20} />
                            )}
                            {(link.label === "Website" || !link.type) && (
                              <Globe size={20} />
                            )}
                          </a>
                        )
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Boost</p>
                  <p className="font-medium">
                    {amount} / {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


