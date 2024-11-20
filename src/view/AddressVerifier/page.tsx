import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountQuery from '../../components/AccountQuery/page';

// Updated API_CONFIGS with Tron
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
        throw new Error('Invalid query type');
      }

      const response = await axios.get(url);
      const data = response.data;
      console.log('Tron data:', data);
      if (data) {
        return {
         data: data,
        };
      } else {
        throw new Error('Invalid address or no data available');
      }
    },
  },
};

const AddressVerifier: React.FC = () => {
  const [address, setAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof API_CONFIGS>('tron'); // Default to BNB
  const [queryType, setQueryType] = useState('');
  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchAddressData = async () => {
    if (!address.trim()) {
      toast.error('Please enter a valid address.');
      return;
    }

    if (selectedNetwork === 'tron' && !queryType) {
      toast.error('Please select a query type.');
      return;
    }

    setIsLoading(true);
    setAccountData([]);


    try {
      const fetchAddressData = API_CONFIGS[selectedNetwork].fetchAddressData;
      const data = await fetchAddressData(address, queryType);
      setAccountData(data.data || []);
      toast.success(`Address data fetched successfully for ${API_CONFIGS[selectedNetwork].name}!`);
    } catch (err) {
      console.error('Error fetching address data:', err);
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred.');
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
        <div className="flex justify-center space-x-4 mb-8">
          {/* <button
            onClick={() => setSelectedNetwork('eth')}
            className={`btn ${selectedNetwork === 'eth' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Ethereum
          </button>
          <button
            onClick={() => setSelectedNetwork('bnb')}
            className={`btn ${selectedNetwork === 'bnb' ? 'btn-primary' : 'btn-secondary'}`}
          >
            BNB
          </button> */}
          <button
            onClick={() => setSelectedNetwork('tron')}
            className={`btn ${selectedNetwork === 'tron' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Tron
          </button>
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
                  <span className="animate-spin mr-2">🔄</span>
                  Verifying...
                </>
              ) : (
                'Verify Address'
              )}
            </button>
          </div>
        </div>

        {/* Display Transaction and Total Amount */}
        
        {queryType === 'account' && Object.keys(accountData).length > 0 && <AccountQuery data={accountData} />}
        
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

// Transaction List Component


export default AddressVerifier;