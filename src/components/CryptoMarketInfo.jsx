import React, { useState } from 'react';
import { AlertCircle, Search, RefreshCcw, Clock, Copy, ExternalLink } from "lucide-react";

// Utility functions
const truncateAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
};

const NetworkButton = ({ network, currentNetwork, onClick }) => (
  <button
    onClick={() => onClick(network)}
    className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-md transition-colors duration-200 ${
      currentNetwork === network
        ? 'bg-red-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {network.toUpperCase()}
  </button>
);

const InfoItem = ({ label, value, isAddress, isLink }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    alert('Copied to clipboard');
  };

  return (
    <div className="bg-white p-3 rounded-md shadow flex items-center justify-between">
      <div className="flex-grow">
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-black truncate">
          {isLink ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
              {value} <ExternalLink size={16} className="ml-1" />
            </a>
          ) : (
            isAddress ? truncateAddress(value) : value
          )}
        </p>
      </div>
      {(isAddress || isLink) && (
        <button onClick={handleCopy} className="text-gray-500 hover:text-gray-700 ml-2">
          <Copy size={16} />
        </button>
      )}
    </div>
  );
};

const TokenVerifier = () => {
  const [network, setNetwork] = useState('tron');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [recentTokens, setRecentTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [error, setError] = useState(null);

  const verifyToken = async () => {
    setIsLoading(true);
    setError(null);
    setTokenData(null);

    try {
      const [response1, response2] = await Promise.all([
        fetch(`https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${contractAddress}`),
        fetch(`https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${contractAddress}/info`)
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
        address: attributes1.address || attributes2.address || contractAddress,
        decimals: attributes1.decimals || attributes2.decimals || 'N/A',
        image_url: attributes1.image_url || attributes2.image_url || null,
        websites: attributes1.websites || attributes2.websites || [],
        description: attributes1.description || attributes2.description || 'N/A',
        discord_url: attributes1.discord_url || attributes2.discord_url || '',
        telegram_handle: attributes1.telegram_handle || attributes2.telegram_handle || '',
        twitter_handle: attributes1.twitter_handle || attributes2.twitter_handle || '',
        coingecko_coin_id: attributes1.coingecko_coin_id || attributes2.coingecko_coin_id || '',
        gt_score: attributes1.gt_score || attributes2.gt_score || 'N/A',
        metadata_updated_at: attributes1.metadata_updated_at || attributes2.metadata_updated_at || 'N/A',
        total_supply: attributes1.total_supply || attributes2.total_supply || 'N/A',
        price_usd: attributes1.price_usd || attributes2.price_usd || 'N/A',
        fdv_usd: attributes1.fdv_usd || attributes2.fdv_usd || 'N/A',
        total_reserve_in_usd: attributes1.total_reserve_in_usd || attributes2.total_reserve_in_usd || 'N/A',
        volume_24h: attributes1.volume_usd?.h24 || attributes2.volume_usd?.h24 || 'N/A',
        market_cap_usd: attributes1.market_cap_usd || attributes2.market_cap_usd || 'N/A',
        top_pools: (data1?.data?.relationships?.top_pools?.data || []).map((pool) => pool.id) || []
      });
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentTokens = async () => {
    setIsLoadingRecent(true);
    setError(null);
    setRecentTokens([]);

    try {
      const response = await fetch('https://api.geckoterminal.com/api/v2/tokens/info_recently_updated');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        setRecentTokens(data.data.map(token => ({
          id: token.id,
          name: token.attributes.name,
          symbol: token.attributes.symbol,
          network: token.relationships.network.data.id,
          price_usd: token.attributes.price_usd || 'N/A',
          volume_24h: token.attributes.volume_usd?.h24 || 'N/A',
        })));
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (err) {
      console.error('Error fetching recent tokens:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoadingRecent(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-4 sm:py-8 px-2 sm:px-4">
      <div className="bg-white border rounded-lg shadow-lg w-full max-w-2xl mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 text-center">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file-zF8H3zujKZRAxky75TVXni55pvRyuN.png" alt="YAKS HUSTLES Logo" className="h-8 sm:h-12 mx-auto mb-2 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-black">Token Verifier</h2>
          <p className="text-sm sm:text-base text-gray-600">Verify token authenticity across multiple networks</p>
        </div>
        <div className="mb-4 sm:mb-6 flex justify-center space-x-2 sm:space-x-4">
          <NetworkButton network="tron" currentNetwork={network} onClick={setNetwork} />
          <NetworkButton network="solana" currentNetwork={network} onClick={setNetwork} />
          <NetworkButton network="ton" currentNetwork={network} onClick={setNetwork} />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Enter ${network.toUpperCase()} contract address`}
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-8 sm:pl-10 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="absolute left-2 sm:left-3 top-2 sm:top-3 text-gray-400" size={16} />
          </div>
          <div className="flex space-x-2 sm:space-x-4">
            <button
              onClick={verifyToken}
              disabled={isLoading}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-white font-medium text-sm sm:text-base flex items-center justify-center transition-colors duration-200 ${
                isLoading
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCcw className="animate-spin mr-1 sm:mr-2" size={16} />
                  Verifying...
                </>
              ) : (
                'Verify Token'
              )}
            </button>
            <button
              onClick={fetchRecentTokens}
              disabled={isLoadingRecent}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-white font-medium text-sm sm:text-base flex items-center justify-center transition-colors duration-200 ${
                isLoadingRecent
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              }`}
            >
              {isLoadingRecent ? (
                <>
                  <RefreshCcw className="animate-spin mr-1 sm:mr-2" size={16} />
                  Loading...
                </>
              ) : (
                <>
                  <Clock className="mr-1 sm:mr-2" size={16} />
                  Recent Tokens
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
                <h3 className="text-red-800 font-medium text-sm sm:text-base">Error</h3>
              </div>
              <p className="text-red-700 mt-1 sm:mt-2 text-xs sm:text-sm">{error}</p>
            </div>
          )}
          {tokenData && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {tokenData.image_url && (
                  <img src={tokenData.image_url} alt={`${tokenData.name} logo`} className="h-12 w-12 sm:h-16 sm:w-16 rounded-full" />
                )}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black">{tokenData.name} ({tokenData.symbol})</h3>
                  <p className="text-sm sm:text-base text-gray-600">Network: {network.toUpperCase()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InfoItem label="Address" value={tokenData.address} isAddress />
                <InfoItem label="Price" value={`$${formatNumber(parseFloat(tokenData.price_usd))}`} />
                <InfoItem label="Market Cap" value={`$${formatNumber(parseFloat(tokenData.market_cap_usd))}`} />
                <InfoItem label="Fully Diluted Valuation" value={`$${formatNumber(parseFloat(tokenData.fdv_usd))}`} />
                <InfoItem label="24h Volume" value={`$${formatNumber(parseFloat(tokenData.volume_24h))}`} />
                <InfoItem label="Total Supply" value={formatNumber(parseFloat(tokenData.total_supply))} />
                <InfoItem label="Total Reserve in USD" value={`$${formatNumber(parseFloat(tokenData.total_reserve_in_usd))}`} />
                <InfoItem label="Decimals" value={tokenData.decimals} />
              </div>
              <div className="space-y-3 sm:space-y-4">
                {tokenData.websites.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-black mb-1 sm:mb-2">Websites:</h4>
                    <ul className="list-disc list-inside text-sm sm:text-base text-gray-700">
                      {tokenData.websites.map((website, index) => (
                        <small key={index}>
                          <InfoItem label={`Website ${index + 1}`} value={website} isLink />
                        </small>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-black mb-1 sm:mb-2">Social Accounts:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {tokenData.discord_url && (
                      <InfoItem label="Discord" value={tokenData.discord_url} isLink />
                    )}
                    {tokenData.telegram_handle && (
                      <InfoItem label="Telegram" value={`https://t.me/${tokenData.telegram_handle}`} isLink />
                    )}
                    {tokenData.twitter_handle && (
                      <InfoItem label="Twitter" value={`https://twitter.com/${tokenData.twitter_handle}`} isLink />
                    )}
                  </div>
                </div>
              </div>
              {tokenData.top_pools.length > 0 && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-black mb-1 sm:mb-2">Top Pools:</h4>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                    {tokenData.top_pools.map((pool, index) => (
                      <small key={index}>
                        <InfoItem label={`Pool ${index + 1}`} value={pool} isAddress />
                      </small>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {recentTokens.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-4">Recently Updated Tokens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {recentTokens.map((token) => (
                  <div key={token.id} className="bg-white p-3 sm:p-4 rounded-md shadow">
                    <h4 className="font-bold text-base sm:text-lg mb-1">{token.name} ({token.symbol})</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Network: {token.network}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Price: ${parseFloat(token.price_usd).toFixed(6)}</p>
                    <p className="text-xs sm:text-sm text-gray-600">24h Volume: ${formatNumber(parseFloat(token.volume_24h))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenVerifier;