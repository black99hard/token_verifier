import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Search, RefreshCcw, Clock, Star, Linkedin, Github,Shield} from 'lucide-react';
import { NetworkButton } from './components/NetworkButton';
import { InfoItem } from './components/InfoItem';
import { WhitelistButton } from './components/WhitelistButton';
import { WhitelistedTokens } from './components/WhitelistedTokens';
import { Network, TokenData, RecentToken, WhitelistedToken } from './types';
import { formatNumber } from './utils/format';
import { getWhitelistedTokens, saveWhitelistedTokens } from './utils/cookies';
import 'react-toastify/dist/ReactToastify.css';

const TokenVerifier: React.FC = () => {
  const [network, setNetwork] = useState<Network>('tron');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [recentTokens, setRecentTokens] = useState<RecentToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whitelistedTokens, setWhitelistedTokens] = useState<WhitelistedToken[]>([]);
  const [showWhitelist, setShowWhitelist] = useState(false);

  useEffect(() => {
    setWhitelistedTokens(getWhitelistedTokens());
  }, []);

  const isTokenWhitelisted = (address: string, network: Network) => {
    return whitelistedTokens.some(
      token => token.address.toLowerCase() === address.toLowerCase() && token.network === network
    );
  };

  const toggleWhitelist = (token: TokenData, network: Network) => {
    const isCurrentlyWhitelisted = isTokenWhitelisted(token.address, network);
    let updatedTokens: WhitelistedToken[];

    if (isCurrentlyWhitelisted) {
      updatedTokens = whitelistedTokens.filter(
        t => !(t.address.toLowerCase() === token.address.toLowerCase() && t.network === network)
      );
      toast.success('Token removed from whitelist');
    } else {
      const newToken: WhitelistedToken = {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        network,
        addedAt: new Date().toISOString(),
      };
      updatedTokens = [...whitelistedTokens, newToken];
      toast.success('Token added to whitelist');
    }

    setWhitelistedTokens(updatedTokens);
    saveWhitelistedTokens(updatedTokens);
  };

  const handleWhitelistedTokenSelect = (token: WhitelistedToken) => {
    setNetwork(token.network);
    setContractAddress(token.address);
    setShowWhitelist(false);
    verifyToken(token.address, token.network);
  };

  const verifyToken = async (address = contractAddress, selectedNetwork = network) => {
    if (!address.trim()) {
      setError('Please enter a contract address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTokenData(null);

    try {
      const [response1, response2] = await Promise.all([
        fetch(`https://api.geckoterminal.com/api/v2/networks/${selectedNetwork}/tokens/${address}`),
        fetch(`https://api.geckoterminal.com/api/v2/networks/${selectedNetwork}/tokens/${address}/info`)
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error(`Error fetching data: ${response1.statusText} / ${response2.statusText}`);
      }

      const [data1, data2] = await Promise.all([response1.json(), response2.json()]);

      const attributes1 = data1?.data?.attributes || {};
      const attributes2 = data2?.data?.attributes || {};

      setTokenData({
        name: attributes1.name || attributes2.name || 'N/A',
        symbol: attributes1.symbol || attributes2.symbol || 'N/A',
        address: attributes1.address || attributes2.address || address,
        decimals: attributes1.decimals?.toString() || 'N/A',
        image_url: attributes1.image_url || attributes2.image_url || null,
        websites: attributes1.websites || attributes2.websites || [],
        description: attributes1.description || attributes2.description || 'N/A',
        discord_url: attributes1.discord_url || attributes2.discord_url || '',
        telegram_handle: attributes1.telegram_handle || attributes2.telegram_handle || '',
        twitter_handle: attributes1.twitter_handle || attributes2.twitter_handle || '',
        coingecko_coin_id: attributes1.coingecko_coin_id || attributes2.coingecko_coin_id || '',
        gt_score: attributes1.gt_score?.toString() || 'N/A',
        metadata_updated_at: attributes1.metadata_updated_at || attributes2.metadata_updated_at || 'N/A',
        total_supply: attributes1.total_supply?.toString() || 'N/A',
        price_usd: attributes1.price_usd?.toString() || 'N/A',
        fdv_usd: attributes1.fdv_usd?.toString() || 'N/A',
        total_reserve_in_usd: attributes1.total_reserve_in_usd?.toString() || 'N/A',
        volume_24h: (attributes1.volume_usd?.h24 || attributes2.volume_usd?.h24 || 'N/A').toString(),
        market_cap_usd: attributes1.market_cap_usd?.toString() || 'N/A',
        top_pools: (data1?.data?.relationships?.top_pools?.data || []).map((pool: any) => pool.id)
      });
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentTokens = async () => {
    setIsLoadingRecent(true);
    setError(null);

    try {
      const response = await fetch('https://api.geckoterminal.com/api/v2/tokens/info_recently_updated');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        setRecentTokens(data.data.map((token: { id: any; attributes: { name: any; symbol: any; price_usd: { toString: () => any; }; volume_usd: { h24: any; }; }; relationships: { network: { data: { id: string; }; }; }; }) => ({
          id: token.id,
          name: token.attributes.name,
          symbol: token.attributes.symbol,
          network: token.relationships.network.data.id as Network,
          price_usd: token.attributes.price_usd?.toString() || 'N/A',
          volume_24h: (token.attributes.volume_usd?.h24 || 'N/A').toString(),
        })));
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (err) {
      console.error('Error fetching recent tokens:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoadingRecent(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
        <div className="inline-block p-2 glass-card rounded-full animate-glow mb-6">
          <Shield className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
         Yaks Token Verifier
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Verify and analyze tokens across multiple networks with real-time data and comprehensive insights
        </p>
        </div>
        
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <NetworkButton network="tron" currentNetwork={network} onClick={setNetwork} />
              <NetworkButton network="solana" currentNetwork={network} onClick={setNetwork} />
              <NetworkButton network="ton" currentNetwork={network} onClick={setNetwork} />
            </div>
            <button
              onClick={() => setShowWhitelist(!showWhitelist)}
              className="flex items-center space-x-2 text-slate-400 hover:text-yellow-400 transition-colors duration-300"
            >
              <Star size={20} />
              <span className="hidden sm:inline">{showWhitelist ? 'Close' : 'Watchlist'}</span>
            </button>
          </div>

          {showWhitelist ? (
            <WhitelistedTokens
              tokens={whitelistedTokens}
              onSelect={handleWhitelistedTokenSelect}
              onRemove={(token) => toggleWhitelist(
                { ...token, decimals: '', websites: [], description: '', discord_url: '', 
                  telegram_handle: '', twitter_handle: '', coingecko_coin_id: '', gt_score: '',
                  metadata_updated_at: '', total_supply: '', price_usd: '', fdv_usd: '',
                  total_reserve_in_usd: '', volume_24h: '', market_cap_usd: '', top_pools: [],
                  image_url: null },
                token.network
              )}
            />
          ) : (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter ${network.toUpperCase()} contract address`}
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="input-field pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => verifyToken()}
                  disabled={isLoading}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="animate-spin mr-2" size={20} />
                      Verifying...
                    </>
                  ) : (
                    'Verify Token'
                  )}
                </button>
                <button
                  onClick={fetchRecentTokens}
                  disabled={isLoadingRecent}
                  className="btn-secondary flex-1 flex items-center justify-center"
                >
                  {isLoadingRecent ? (
                    <>
                      <RefreshCcw className="animate-spin mr-2" size={20} />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2" size={20} />
                      Recent Tokens
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {tokenData && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {tokenData.image_url && (
                        <img 
                          src={tokenData.image_url} 
                          alt={`${tokenData.name} logo`} 
                          className="w-16 h-16 rounded-full ring-2 ring-red-500/20"
                        />
                      )}
                      <div>
                        <h2 className="text-2xl font-bold">{tokenData.name}</h2>
                        <p className="text-slate-400">{tokenData.symbol} • {network.toUpperCase()}</p>
                      </div>
                    </div>
                    <WhitelistButton
                      isWhitelisted={isTokenWhitelisted(tokenData.address, network)}
                      onClick={() => toggleWhitelist(tokenData, network)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoItem 
                      label="Contract Address" 
                      value={tokenData.address} 
                      isAddress 
                    />
                    <InfoItem 
                      label="Price" 
                      value={`$${parseFloat(tokenData.price_usd).toFixed(6)}`} 
                    />
                    <InfoItem 
                      label="Market Cap" 
                      value={`$${formatNumber(parseFloat(tokenData.market_cap_usd))}`} 
                    />
                    <InfoItem 
                      label="Fully Diluted Valuation" 
                      value={`$${formatNumber(parseFloat(tokenData.fdv_usd))}`} 
                    />
                    <InfoItem 
                      label="24h Volume" 
                      value={`$${formatNumber(parseFloat(tokenData.volume_24h))}`} 
                    />
                    <InfoItem 
                      label="Total Supply" 
                      value={formatNumber(parseFloat(tokenData.total_supply))} 
                    />
                    <InfoItem 
                      label="Total Reserve in USD" 
                      value={`$${formatNumber(parseFloat(tokenData.total_reserve_in_usd))}`} 
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

                  {tokenData.description && tokenData.description !== 'N/A' && (
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-slate-300">{tokenData.description}</p>
                    </div>
                  )}

                  {tokenData.websites.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Websites</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tokenData.websites.map((website, index) => (
                          <InfoItem
                            key={index}
                            label={`Website ${index + 1}`}
                            value={website}
                            isLink
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(tokenData.discord_url || tokenData.telegram_handle || tokenData.twitter_handle) && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Social Accounts</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tokenData.discord_url && (
                          <InfoItem
                            label="Discord"
                            value={tokenData.discord_url}
                            isLink
                          />
                        )}
                        {tokenData.telegram_handle && (
                          <InfoItem
                            label="Telegram"
                            value={`https://t.me/${tokenData.telegram_handle}`}
                            isLink
                          />
                        )}
                        {tokenData.twitter_handle && (
                          <InfoItem
                            label="Twitter"
                            value={`https://twitter.com/${tokenData.twitter_handle}`}
                            isLink
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {tokenData.top_pools.length > 0 && (
                    <div className="space-y-3">
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
              )}

              {recentTokens.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Recently Updated Tokens</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentTokens.map((token) => (
                      <div key={token.id} className="token-card">
                        <h4 className="font-bold mb-2">{token.name} ({token.symbol})</h4>
                        <p className="text-sm text-slate-400">Network: {token.network.toUpperCase()}</p>
                        <p className="text-sm text-slate-400">
                          Price: ${parseFloat(token.price_usd).toFixed(6)}
                        </p>
                        <p className="text-sm text-slate-400">
                          24h Volume: ${formatNumber(parseFloat(token.volume_24h))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="flex justify-center space-x-4 mt-8">
      <a href="https://www.linkedin.com/in/yasir-bashir-6b3a8098" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200">
        <Linkedin size={24} />
      </a>
      <a href="https://github.com/black99hard" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200">
        <Github size={24} />
      </a>
    </div>
    </div>
  );
};

export default TokenVerifier;