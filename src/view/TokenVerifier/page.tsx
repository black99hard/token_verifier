import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Star,  Github, MessageCircleCode } from 'lucide-react';
import { NetworkButton } from '../../components/NetworkButton';
import { WhitelistedTokens } from '../../components/WhitelistedTokens';
import { TokenDataDisplay } from '../../components/TokenDataDisplay';
import { Header } from '../../components/Header';
import { SearchForm } from '../../components/SearchForm';
import { RecentTokensList } from '../../components/RecentTokensList';
import { BoostedTokensList } from '../../components/BoostedTokensList';
import { Network, TokenData, RecentToken, WhitelistedToken, BoostedToken } from '../../types';
import { getWhitelistedTokens, saveWhitelistedTokens } from '../../utils/cookies';
import './custom.css';

const TokenVerifier: React.FC = () => {
  const [network, setNetwork] = useState<Network>('tron');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [recentTokens, setRecentTokens] = useState<RecentToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [isLoadingBoosted, setIsLoadingBoosted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whitelistedTokens, setWhitelistedTokens] = useState<WhitelistedToken[]>([]);
  const [showWhitelist, setShowWhitelist] = useState(false);
  const [boostedTokens, setBoostedTokens] = useState<BoostedToken[]>([]);

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
      setRecentTokens([]);
      setBoostedTokens([]);

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
  
  const fetchTrendingTokens = async () => {
    setIsLoadingRecent(true);
    setError(null);
  
    try {
      // Replace with the actual endpoint to fetch trending tokens
      const response = await fetch('https://api.geckoterminal.com/api/v2/networks/trending_pools?include=network&page=1'); // Update URL for trending tokens
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTokenData(null);
      setBoostedTokens([]);
      const data = await response.json();
  
      if (data.data && Array.isArray(data.data)) {
        setRecentTokens(data.data.map((token: { 
          id: any; 
          attributes: { 
            name: string; 
            address: string; 
            base_token_price_usd: string; 
            quote_token_price_usd: string; 
            market_cap_usd: string; 
            price_change_percentage: { [key: string]: string }; 
            volume_usd: { h24: string }; 
          }; 
        }) => ({
          id: token.id,
          name: token.attributes.name,
          address: token.attributes.address,
          baseTokenPriceUsd: token.attributes.base_token_price_usd || 'N/A',
          quoteTokenPriceUsd: token.attributes.quote_token_price_usd || 'N/A',
          marketCapUsd: token.attributes.market_cap_usd || 'N/A',
          priceChangePercentage: token.attributes.price_change_percentage || {},
          volume24h: token.attributes.volume_usd?.h24 || 'N/A',
        })));
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (err) {
      console.error('Error fetching trending tokens:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const fetchBoostedTokens = async () => {
    setIsLoadingBoosted(true);

    try {
      const response = await fetch('https://api.dexscreener.com/token-boosts/latest/v1');
      const data = await response.json();
      
      if (data && data.length > 0) {
        const mappedData = data.map((token: any) => ({
          url: token.url,
          chainId: token.chainId,
          tokenAddress: token.tokenAddress,
          icon: token.icon,
          name: token.name,
          symbol: token.symbol,
          price: token.price,
          change: token.change,
          description: token.description,
          links: token.links,
          totalAmount: token.totalAmount,
          amount: token.amount,
        }));
        setRecentTokens([]);
        setTokenData(null);
        setBoostedTokens(mappedData);

      }
    } catch (error) {
      console.error('Error fetching boosted tokens:', error);
    }finally {
      setIsLoadingBoosted(false);
    }
  };



  

  return (
    <div className="min-h-screen py-4 px-2 sm:py-8 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <Header />
        
        <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center justify-center w-full sm:w-auto">
              <div className="inline-flex p-1 rounded-full bg-slate-800 space-x-2">
                <NetworkButton network="tron" currentNetwork={network} onClick={setNetwork} />
                <NetworkButton network="solana" currentNetwork={network} onClick={setNetwork} />
                <NetworkButton network="ton" currentNetwork={network} onClick={setNetwork} />
              </div>
            </div>
            <button
              onClick={() => setShowWhitelist(!showWhitelist)}
              className="flex items-center space-x-2 text-slate-400 hover:text-yellow-400 transition-colors duration-300"
            >
              <Star size={20} />
              <span>{showWhitelist ? 'Close' : 'Watchlist'}</span>
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
              <SearchForm
                network={network}
                contractAddress={contractAddress}
                setContractAddress={setContractAddress}
                verifyToken={() => verifyToken()}
                fetchTrendingTokens={fetchTrendingTokens}
                fetchBoostedTokens={fetchBoostedTokens}
                isLoading={isLoading}
                isLoadingRecent={isLoadingRecent}
                isLoadingBoosted={isLoadingBoosted}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                  {error}
                </div>
              )}

              {tokenData && (
                <TokenDataDisplay
                  tokenData={tokenData}
                  network={network}
                  isTokenWhitelisted={isTokenWhitelisted}
                  toggleWhitelist={toggleWhitelist}
                />
              )}

              <RecentTokensList recentTokens={recentTokens} />

              <BoostedTokensList boostedTokens={boostedTokens} />

            </>
          )}
        </div>
      </div>
 
      <div className="flex justify-center space-x-4 mt-6 sm:mt-8">
      <a href="https://t.me/black99hard" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200">
        <MessageCircleCode size={20} className="sm:w-6 sm:h-6" />
      </a>

        <a href="https://github.com/black99hard" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200">
          <Github size={20} className="sm:w-6 sm:h-6" />
        </a>
      </div>
    </div>
  );
};

export default TokenVerifier;

