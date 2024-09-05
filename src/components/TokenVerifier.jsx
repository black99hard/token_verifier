import { useState } from 'react';
import { AlertCircle, Search, RefreshCcw } from "lucide-react";

type Network = 'tron' | 'solana' | 'ton';

type TokenData = {
  name: string;
  symbol: string;
  address: string;
  decimals: string;
  image_url: string | null;
  total_supply: string;
  price_usd: string;
  fdv_usd: string;
  total_reserve_in_usd: string;
  volume_24h: string;
  market_cap_usd: string;
  top_pools: string[];
};

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

const TokenVerifier = () => {
  const [network, setNetwork] = useState<Network>('tron');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async () => {
    setIsLoading(true);
    setError(null);
    setTokenData(null);

    try {
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${contractAddress}`);

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));

        if (data.data && data.data.attributes) {
          setTokenData({
            name: data.data.attributes.name || 'N/A',
            symbol: data.data.attributes.symbol || 'N/A',
            address: data.data.attributes.address || contractAddress,
            decimals: data.data.attributes.decimals || 'N/A',
            image_url: data.data.attributes.image_url || null,
            total_supply: data.data.attributes.total_supply || 'N/A',
            price_usd: data.data.attributes.price_usd || 'N/A',
            fdv_usd: data.data.attributes.fdv_usd || 'N/A',
            total_reserve_in_usd: data.data.attributes.total_reserve_in_usd || 'N/A',
            volume_24h: data.data.attributes.volume_usd?.h24 || 'N/A',
            market_cap_usd: data.data.attributes.market_cap_usd || 'N/A',
            top_pools: data.data.relationships?.top_pools?.data?.map((pool) => pool.id) || []
          });
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Received non-JSON response from the server');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
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
          <button
            onClick={verifyToken}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
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
                <InfoItem label="Address" value={tokenData.address} />
                <InfoItem label="Price" value={`$${parseFloat(tokenData.price_usd).toFixed(6)}`} />
                <InfoItem label="Market Cap" value={`$${parseFloat(tokenData.market_cap_usd).toLocaleString()}`} />
                <InfoItem label="Fully Diluted Valuation" value={`$${parseFloat(tokenData.fdv_usd).toLocaleString()}`} />
                <InfoItem label="24h Volume" value={`$${parseFloat(tokenData.volume_24h).toLocaleString()}`} />
                <InfoItem label="Total Supply" value={parseFloat(tokenData.total_supply).toLocaleString()} />
                <InfoItem label="Total Reserve in USD" value={`$${parseFloat(tokenData.total_reserve_in_usd).toLocaleString()}`} />
                <InfoItem label="Decimals" value={tokenData.decimals} />
              </div>
              {tokenData.top_pools.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-black mb-2">Top Pools:</h4>
                  <ul className="list-disc list-inside text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tokenData.top_pools.map((pool, index) => (
                      <li key={index}>{pool}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="bg-white p-3 rounded-md shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-black">{value}</p>
  </div>
);

export default TokenVerifier;