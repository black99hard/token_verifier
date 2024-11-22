import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountQuery from '../../components/AccountQuery/page';
import TokenQuery from '../../components/TokenQuery/page';
import { LoaderPinwheel, HelpCircle } from 'lucide-react';
import { Tooltip } from '../../components/Tooltip';

const API_CONFIGS = {
  tron: {
    name: 'Tron',
    fetchAddressData: async (address: string, queryType: string) => {
      let url;
      if (queryType === 'account') {
        url = `https://apilist.tronscanapi.com/api/accountv2?address=${address}`;
      } else if (queryType === 'tokens') {
        url = `https://apilist.tronscanapi.com/api/account/tokens?address=${address}&start=0&limit=20&hidden=0&show=0&sortType=0&sortBy=0&token=`;
      } else {
        throw new Error('Invalid query type. Please select "Account" or "Tokens".');
      }

      try {
        const response = await axios.get(url);
        if (response.data) {
          return response.data;
        }
        throw new Error('Invalid address or no data available.');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data?.message || 'Error occurred while fetching data.');
        }
        throw new Error('Network error occurred while fetching data.');
      }
    },
  },
};

const AddressVerifier: React.FC = () => {
  const [address, setAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof API_CONFIGS>('tron');
  const [queryType, setQueryType] = useState('');
  const [accountData, setAccountData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = (): boolean => {
    if (!address.trim()) {
      toast.error('Address cannot be empty. Please enter a valid blockchain address.');
      return false;
    }
    if (selectedNetwork === 'tron' && !queryType) {
      toast.error('Please select a query type for the Tron network.');
      return false;
    }
    return true;
  };

  const handleFetchAddressData = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setAccountData(null);
    setTokenData(null);
    setError(null);

    try {
      const { fetchAddressData } = API_CONFIGS[selectedNetwork];
      const data = await fetchAddressData(address, queryType);
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No data found for the entered address.');
      }
      setAccountData(data);

      if (queryType === 'tokens') {
        setTokenData(data);
      }
      toast.success(`Data fetched successfully for ${API_CONFIGS[selectedNetwork].name}!`);
    } catch (err) {
      console.error('Error fetching address data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <Header />

        {/* Network Selection */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedNetwork('tron')}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 `}
          >
            <span className="sr-only">{selectedNetwork}</span>
            <div className="relative w-6 h-6">
              <img
                src={'/trx.png'}
                alt={`${selectedNetwork} logo`}
                width="100%"
                height="100%"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </button>
          <Tooltip
            content="Currently, we only support Tron network for whale address tracking. More networks will be added soon."
            direction="bottom"
          >
            <button className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
              <HelpCircle size={20} />
            </button>
          </Tooltip>
        </div>


        {/* Input and Action Section */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter blockchain address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {selectedNetwork === 'tron' && (
            <div className="relative">
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="input-field mb-4"
              >
                <option value="">Select Query Type</option>
                <option value="account">Account</option>
                <option value="tokens">Tokens</option>
              </select>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleFetchAddressData}
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoaderPinwheel />
                  Verifying...
                </>
              ) : (
                'Verify Address'
              )}
            </button>
          </div>
        </div>

        {/* Display Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Display Account Data */}
        {queryType === 'account' && accountData && <AccountQuery data={accountData} />}
        {queryType === 'tokens' && tokenData && <TokenQuery data={tokenData} />}
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

// Header Component
const Header: React.FC = () => (
  <div className="text-center space-y-4">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
      Address Verifier
    </h1>
    <p className="text-slate-400 max-w-2xl mx-auto">
      Verify and analyze blockchain addresses across multiple networks with real-time data.
    </p>
  </div>
);

export default AddressVerifier;
