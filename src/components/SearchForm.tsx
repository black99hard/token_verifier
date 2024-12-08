import React from 'react';
import { Search, RefreshCcw, TrendingUpDown, Rocket } from 'lucide-react';
import { Network } from '../types';

interface SearchFormProps {
  network: Network;
  contractAddress: string;
  setContractAddress: (address: string) => void;
  verifyToken: () => void;
  fetchTrendingTokens: () => void;
  fetchBoostedTokens: () => void;
  isLoading: boolean;
  isLoadingRecent: boolean;
  isLoadingBoosted: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  network,
  contractAddress,
  setContractAddress,
  verifyToken,
  fetchTrendingTokens,
  fetchBoostedTokens,
  isLoading,
  isLoadingRecent,
  isLoadingBoosted,
}) => {
  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder={`Enter ${network.toUpperCase()} contract address`}
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 border border-red-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-100 placeholder-slate-400 pl-12"
        />
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
          size={24}
        />
      </div>

      {/* Button Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={verifyToken}
          disabled={isLoading}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition hover:shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCcw className="animate-spin" size={20} />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </button>

        <button
          onClick={fetchTrendingTokens}
          disabled={isLoadingRecent}
          className="bg-black/40 hover:bg-black/50 text-gray-100 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition hover:shadow-md disabled:opacity-50"
        >
          {isLoadingRecent ? (
            <>
              <RefreshCcw className="animate-spin" size={20} />
              Loading...
            </>
          ) : (
            <>
              <TrendingUpDown size={20} />
              Trending
            </>
          )}
        </button>

        <button
          onClick={fetchBoostedTokens}
          disabled={isLoadingBoosted}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition hover:shadow-md disabled:opacity-50"
        >
          {isLoadingBoosted ? (
            <>
              <RefreshCcw className="animate-spin" size={20} />
              Loading...
            </>
          ) : (
            <>
              <Rocket size={20} />
              Boosted
            </>
          )}
        </button>
      </div>
    </div>
  );
};