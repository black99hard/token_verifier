import React from 'react';
import { Search, RefreshCcw, TrendingUpDown } from 'lucide-react';
import { Network } from '../types';

interface SearchFormProps {
  network: Network;
  contractAddress: string;
  setContractAddress: (address: string) => void;
  verifyToken: () => void;
  fetchTrendingTokens: () => void;
  isLoading: boolean;
  isLoadingRecent: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  network,
  contractAddress,
  setContractAddress,
  verifyToken,
  fetchTrendingTokens,
  isLoading,
  isLoadingRecent
}) => {
  return (
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
          onClick={verifyToken}
          disabled={isLoading}
          className="btn-primary flex-1 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <RefreshCcw className="animate-spin mr-2" size={20} />
              Verifying...
            </>
          ) : (
            'Verify '
          )}
        </button>
        <button
          onClick={fetchTrendingTokens}
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
              <TrendingUpDown className="mr-2" size={20} />
              Trending
            </>
          )}
        </button>
      </div>
    </>
  );
};

