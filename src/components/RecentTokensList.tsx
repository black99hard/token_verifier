import React, { useState } from 'react';
import { RecentToken  } from '../types';
import { shortenNumber } from '../utils/format';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Copy, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

interface RecentTokensListProps {
  recentTokens: RecentToken[];
}

type TimeFrame = 'm5' | 'h1' | 'h6' | 'h24';

const timeFrameLabels: Record<TimeFrame, string> = {
  'm5': '5m',
  'h1': '1h',
  'h6': '6h',
  'h24': '24h'
};

export const RecentTokensList: React.FC<RecentTokensListProps> = ({ recentTokens }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('h24');
  // const [boostedTokens, setBoostedTokens] = useState<BoostedToken[]>([]);



  if (recentTokens.length === 0) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            Trending Pairs
          </h3>
          <div className="relative">
            <select
              value={selectedTimeFrame}
              onChange={(e) => setSelectedTimeFrame(e.target.value as TimeFrame)}
              className="appearance-none bg-transparent border border-slate-600 text-slate-300 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-slate-500"
            >
              {Object.entries(timeFrameLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTokens.map((token) => (
            <div key={token.id} className="glass-card p-4 rounded-lg space-y-3 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{token.name}</h4>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-slate-400">{token.address.slice(0, 6)}...{token.address.slice(-4)}</p>
                    <button onClick={() => copyToClipboard(token.address)} className="text-slate-400 hover:text-slate-200">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${parseFloat(token.baseTokenPriceUsd as unknown as string).toFixed(6)}</p>
                  <p className="text-sm text-slate-400">{token.id.split('_')[0].toUpperCase()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">24h Volume</p>
                  <p className="font-medium">${shortenNumber(parseFloat(token.volume_24h))}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Market Cap</p>
                  <p className="font-medium">
                    {String(token.marketCapUsd) !== 'N/A' 
                      ? `$${shortenNumber(parseFloat(token.marketCapUsd as unknown as string))}` 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">{timeFrameLabels[selectedTimeFrame]} Change</p>
                  <PriceChange change={parseFloat(token.priceChangePercentage[selectedTimeFrame])} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {boostedTokens.length > 0 && <BoostedTokensList boostedTokens={boostedTokens} />} */}
    </div>
  );
};

const PriceChange: React.FC<{ change: number }> = ({ change }) => {
  const color = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-slate-400';
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : TrendingUp;
  
  return (
    <div className={`flex items-center ${color}`}>
      <Icon size={16} className="mr-1" />
      <span className="font-medium">{Math.abs(change).toFixed(2)}%</span>
    </div>
  );
};