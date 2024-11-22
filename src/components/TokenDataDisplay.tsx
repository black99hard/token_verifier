import React from 'react';
import { InfoItem } from './InfoItem';
import { WhitelistButton } from './WhitelistButton';
import { TokenData, Network } from '../types';
import { formatNumber, shortenNumber } from '../utils/format';
import { ExternalLink, Disc, MessageCircle, Twitter } from 'lucide-react';

interface TokenDataDisplayProps {
  tokenData: TokenData;
  network: Network;
  isTokenWhitelisted: (address: string, network: Network) => boolean;
  toggleWhitelist: (token: TokenData, network: Network) => void;
}

export const TokenDataDisplay: React.FC<TokenDataDisplayProps> = ({
  tokenData,
  network,
  isTokenWhitelisted,
  toggleWhitelist
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {tokenData.image_url ? (
            <img 
              src={tokenData.image_url} 
              alt={`${tokenData.name} logo`} 
              className="w-16 h-16 rounded-full ring-2 ring-red-500/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {tokenData.symbol.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
              {tokenData.name}
            </h2>
            <p className="text-slate-400">{tokenData.symbol} • {network.toUpperCase()}</p>
          </div>
        </div>
        <WhitelistButton
          isWhitelisted={isTokenWhitelisted(tokenData.address, network)}
          onClick={() => toggleWhitelist(tokenData, network)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <InfoItem 
          label="Price" 
          value={`$${parseFloat(tokenData.price_usd).toFixed(6)}`}
          className="col-span-2 sm:col-span-1"
        />
        <InfoItem 
          label="Market Cap" 
          value={`$${shortenNumber(parseFloat(tokenData.market_cap_usd))}`} 
        />
        <InfoItem 
          label="FDV" 
          value={`$${shortenNumber(parseFloat(tokenData.fdv_usd))}`} 
        />
        <InfoItem 
          label="24h Volume" 
          value={`$${shortenNumber(parseFloat(tokenData.volume_24h))}`} 
        />
        <InfoItem 
          label="Total Supply" 
          value={shortenNumber(parseFloat(tokenData.total_supply))} 
        />
        <InfoItem 
          label="Total Reserve" 
          value={`$${shortenNumber(parseFloat(tokenData.total_reserve_in_usd))}`} 
        />
        <InfoItem 
          label="Decimals" 
          value={tokenData.decimals} 
        />
        <InfoItem 
          label="GT Score" 
          value={tokenData.gt_score} 
        />
      </div>

      <div className="glass-card p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Contract Address</h3>
        <InfoItem 
          value={tokenData.address} 
          isAddress 
          className="break-all"
        />
      </div>

      {tokenData.description && tokenData.description !== 'N/A' && (
        <div className="glass-card p-4 rounded-lg space-y-2">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{tokenData.description}</p>
        </div>
      )}

      {tokenData.websites.length > 0 && (
        <div className="glass-card p-4 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Websites</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tokenData.websites.map((website, index) => (
              <InfoItem
                key={index}
                value={website}
                isLink
                icon={<ExternalLink size={16} className="text-slate-400" />}
              />
            ))}
          </div>
        </div>
      )}

      {(tokenData.discord_url || tokenData.telegram_handle || tokenData.twitter_handle) && (
        <div className="glass-card p-4 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Social Accounts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tokenData.discord_url && (
              <InfoItem
                value={tokenData.discord_url}
                isLink
                icon={<Disc size={16} className="text-slate-400" />}
              />
            )}
            {tokenData.telegram_handle && (
              <InfoItem
                value={`https://t.me/${tokenData.telegram_handle}`}
                isLink
                icon={<MessageCircle size={16} className="text-slate-400" />}
              />
            )}
            {tokenData.twitter_handle && (
              <InfoItem
                value={`https://twitter.com/${tokenData.twitter_handle}`}
                isLink
                icon={<Twitter size={16} className="text-slate-400" />}
              />
            )}
          </div>
        </div>
      )}

      {tokenData.top_pools.length > 0 && (
        <div className="glass-card p-4 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Top Pools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tokenData.top_pools.map((pool, index) => (
              <InfoItem
                key={pool}
                label={`Pool ${index + 1}`}
                value={pool}
                isAddress
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
