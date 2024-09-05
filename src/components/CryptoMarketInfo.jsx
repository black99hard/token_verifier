import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, Search, RefreshCcw, Clock, Copy } from "lucide-react";

// Define the types for networks and token data using PropTypes
const Network = PropTypes.oneOf(['tron', 'solana', 'ton']);

const TokenData = PropTypes.shape({
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  decimals: PropTypes.string.isRequired,
  image_url: PropTypes.string,
  total_supply: PropTypes.string.isRequired,
  price_usd: PropTypes.string.isRequired,
  fdv_usd: PropTypes.string.isRequired,
  total_reserve_in_usd: PropTypes.string.isRequired,
  volume_24h: PropTypes.string.isRequired,
  market_cap_usd: PropTypes.string.isRequired,
  top_pools: PropTypes.arrayOf(PropTypes.string).isRequired,
});

const RecentToken = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  price_usd: PropTypes.string.isRequired,
  volume_24h: PropTypes.string.isRequired,
});

// Utility function to truncate addresses
const truncateAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to format numbers
const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
};

// Component for rendering network buttons
const NetworkButton = ({ network, currentNetwork, onClick }) => (
  <button
    onClick={() => onClick(network)}
    className={`px-4 py-2 rounded-md ${
      currentNetwork === network
        ? 'bg-red-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {network.toUpperCase()}
  </button>
);

NetworkButton.propTypes = {
  network: Network.isRequired,
  currentNetwork: Network.isRequired,
  onClick: PropTypes.func.isRequired,
};

// Component for displaying information
const InfoItem = ({ label, value, isAddress }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    alert('Address copied to clipboard');
  };

  return (
    <div className="bg-white p-3 rounded-md shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-black">{isAddress ? truncateAddress(value) : value}</p>
      </div>
      {isAddress && (
        <button onClick={handleCopy} className="text-gray-500 hover:text-gray-700">
          <Copy size={20} />
        </button>
      )}
    </div>
  );
};

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isAddress: PropTypes.bool,
};

InfoItem.defaultProps = {
  isAddress: false,
};

// Component for displaying pool items
const PoolItem = ({ pool }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(pool);
    alert('Pool address copied to clipboard');
  };

  return (
    <div className="flex items-center justify-between">
      <span>{truncateAddress(pool)}</span>
      <button onClick={handleCopy} className="text-gray-500 hover:text-gray-700">
        <Copy size={20} />
      </button>
    </div>
  );
};

PoolItem.propTypes = {
  pool: PropTypes.string.isRequired,
};

// Main component for token verification
const TokenVerifier = () => {
  const [network, setNetwork] = useState('tron');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [tokenINfor, setTokenInfo] = useState(null);

  const [recentTokens, setRecentTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [error, setError] = useState(null);

// Function to verify token data by fetching from both GeckoTerminal APIs
const verifyToken = async () => {
  setIsLoading(true);
  setError(null);
  setTokenData(null);

  try {
    // Make requests to both APIs in parallel
    const [response1, response2] = await Promise.all([
      fetch(`https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${contractAddress}`),
      fetch(`https://api.geckoterminal.com/api/v2/networks/tron/tokens/${contractAddress}/info`)
    ]);

    // Check if both responses are OK
    if (!response1.ok || !response2.ok) {
      throw new Error(`Error fetching data: ${response1.statusText} / ${response2.statusText}`);
    }

    // Check for JSON response types
    const contentType1 = response1.headers.get("content-type");
    const contentType2 = response2.headers.get("content-type");

    if (contentType1.includes("application/json") && contentType2.includes("application/json")) {
      const [data1, data2] = await Promise.all([response1.json(), response2.json()]);

      console.log('API Response 1:', JSON.stringify(data1, null, 2));
      console.log('API Response 2:', JSON.stringify(data2, null, 2));

      // Combine data from both responses
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
    } else {
      throw new Error('One or both responses are not in JSON format');
    }
  } catch (err) {
    console.error('Error details:', err);
    setError(err.message || 'An unknown error occurred');
  } finally {
    setIsLoading(false);
  }
};

  

  // Function to fetch recent tokens
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
      console.log('Recent Tokens API Response:', JSON.stringify(data, null, 2));

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
        throw new Error('Invalid Network');
      }
    } catch (err) {
      console.error('Error fetching recent tokens:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoadingRecent(false);
    }
  };

  return (
    <div className="bg-black min-h-screen py-8 px-4">
      <div className="bg-white border rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6">
        <div className="mb-6 text-center">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file-zF8H3zujKZRAxky75TVXni55pvRyuN.png" alt="YAKS HUSTLES Logo" className="h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-black">Token Verifier</h2>
          <p className="text-gray-600">Verify token authenticity across multiple networks</p>
        </div>
        <div className="mb-6 flex justify-center space-x-4">
          <NetworkButton network="tron" currentNetwork={network} onClick={setNetwork} />
          <NetworkButton network="solana" currentNetwork={network} onClick={setNetwork} />
          <NetworkButton network="ton" currentNetwork={network} onClick={setNetwork} />
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Enter ${network.toUpperCase()} contract address`}
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={verifyToken}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                isLoading
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              }`}
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
              className={`flex-1 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                isLoadingRecent
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              }`}
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
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-red-800 font-medium">Error</h3>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          )}
          {tokenData && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 space-y-4">
              <div className="flex items-center space-x-4">
                {tokenData.image_url && (
                  <img src={tokenData.image_url} alt={`${tokenData.name} logo`} className="h-16 w-16 rounded-full" />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-black">{tokenData.name} ({tokenData.symbol})</h3>
                  <p className="text-gray-600">Network: {network.toUpperCase()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Address" value={tokenData.address} isAddress />
                <InfoItem label="Price" value={`$${formatNumber(parseFloat(tokenData.price_usd))}`} />
                <InfoItem label="Market Cap" value={`$${formatNumber(parseFloat(tokenData.market_cap_usd))}`} />
                <InfoItem label="Fully Diluted Valuation" value={`$${formatNumber(parseFloat(tokenData.fdv_usd))}`} />
                <InfoItem label="24h Volume" value={`$${formatNumber(parseFloat(tokenData.volume_24h))}`} />
                <InfoItem label="Total Supply" value={formatNumber(parseFloat(tokenData.total_supply))} />
                <InfoItem label="Total Reserve in USD" value={`$${formatNumber(parseFloat(tokenData.total_reserve_in_usd))}`} />
                <InfoItem label="Decimals" value={tokenData.decimals} />
              </div>
              {tokenData && (
  <div className="bg-gray-50 border border-gray-200 rounded-md p-6 space-y-4">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
     
    </div>
    <div className="space-y-4">
      {tokenData.websites.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-black mb-2">Websites:</h4>
          <ul className="list-disc list-inside text-gray-700">
            {tokenData.websites.map((website, index) => (
              <li key={index}>
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {website}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h4 className="text-lg font-semibold text-black mb-2">Social Accounts:</h4>
        {tokenData.discord_url && (
          <InfoItem label="Discord" value={tokenData.discord_url} />
        )}
        {tokenData.telegram_handle && (
          <InfoItem label="Telegram" value={`@${tokenData.telegram_handle}`} />
        )}
        {tokenData.twitter_handle && (
          <InfoItem label="Twitter" value={`@${tokenData.twitter_handle}`} />
        )}
      </div>
    </div>
   
  </div>
)}

              {tokenData.top_pools.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-black mb-2">Top Pools:</h4>
                  <ul className="list-disc list-inside text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tokenData.top_pools.map((pool, index) => (
                      <li key={index}>
                        <PoolItem pool={pool} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {recentTokens.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 space-y-4">
              <h3 className="text-2xl font-bold text-black mb-4">Recently Updated Tokens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentTokens.map((token) => (
                  <div key={token.id} className="bg-white p-4 rounded-md shadow">
                    <h4 className="font-bold text-lg">{token.name} ({token.symbol})</h4>
                    <p className="text-gray-600">Network: {token.network}</p>
                    <p className="text-gray-600">Price: ${parseFloat(token.price_usd).toFixed(6)}</p>
                    <p className="text-gray-600">24h Volume: ${parseFloat(token.volume_24h).toLocaleString()}</p>
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

TokenVerifier.propTypes = {
  network: Network,
  contractAddress: PropTypes.string,
  tokenData: TokenData,
  recentTokens: PropTypes.arrayOf(RecentToken),
  isLoading: PropTypes.bool,
  isLoadingRecent: PropTypes.bool,
  error: PropTypes.string,
};

export default TokenVerifier;