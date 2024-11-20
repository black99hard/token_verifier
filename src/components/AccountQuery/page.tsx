import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

interface TokenInfo {
  tokenName: string;
  tokenAbbr: string;
  balance: string;
  tokenDecimal: number;
  tokenLogo: string;
  amount: number | string;
  tokenId: string;
}

interface Transaction {
  hash: string;
  timestamp: number;
  amount: number;
  from: string;
  to: string;
}

interface AccountQueryProps {
  data: {
    address: string;
    balance: number;
    transactions: number;
    transactions_in: number;
    transactions_out: number;
    totalFrozenV2: number;
    bandwidth: {
      freeNetLimit: number;
      freeNetRemaining: number;
      netLimit: number;
      netRemaining: number;
    };
    withPriceTokens: TokenInfo[];
    date_created: number;
    // Mocked transaction data (replace with actual data when available)
    incomingTransactions: Transaction[];
    outgoingTransactions: Transaction[];
  };
}

const AccountQuery: React.FC<AccountQueryProps> = ({ data }) => {


  const formatBalance = (balance: number, decimal: number = 6) => {
    return (balance / Math.pow(10, decimal)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    toast.success('Copied to clipboard!');

  };
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return (
    <div className=" ">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
          Account Information
        </h1>
        
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard 
              title="Address" 
              value={truncateAddress(data.address)} 
              copyable
              onCopy={() => copyToClipboard(data.address)}
            />
            <InfoCard title="Balance" value={`${formatBalance(data.balance)} TRX`} />
            <InfoCard 
              title="Incoming Transactions" 
              value={data.transactions_in.toString()} 
              clickable
              
            />
            <InfoCard 
              title="Outgoing Transactions" 
              value={data.transactions_out.toString()} 
              clickable
              
            />
            <InfoCard title="Total Frozen" value={`${formatBalance(data.totalFrozenV2)} TRX`} />
            <InfoCard title="Account Created" value={formatDate(data.date_created)} />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Bandwidth</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard 
                title="Free Bandwidth" 
                value={`${data.bandwidth.freeNetRemaining} / ${data.bandwidth.freeNetLimit}`} 
              />
              <InfoCard 
                title="Paid Bandwidth" 
                value={`${data.bandwidth.netRemaining} / ${data.bandwidth.netLimit}`} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Token Holdings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.withPriceTokens.map((token, index) => (
                <TokenCard key={index} token={token} onCopy={() => copyToClipboard(token.tokenId)} />
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

const InfoCard: React.FC<{ 
  title: string; 
  value: string; 
  copyable?: boolean; 
  clickable?: boolean;
  onCopy?: () => void;
  onClick?: () => void;
}> = ({ title, value, copyable, clickable, onCopy, onClick }) => (
  <div className={`bg-white bg-opacity-10 p-4 rounded-lg ${clickable ? 'cursor-pointer' : ''}`} onClick={onClick}>
    <h3 className="text-lg font-semibold text-blue-300">{title}</h3>
    <div className="flex items-center justify-between mt-1">
      <p className="text-xl">{value}</p>
      {copyable && (
        <button onClick={(e) => { e.stopPropagation(); onCopy?.(); }} className="text-blue-300 hover:text-blue-100">
          <Copy size={18} />
        </button>
      )}
      {clickable && <ExternalLink size={18} className="text-blue-300" />}
    </div>
  </div>
);

const TokenCard: React.FC<{ token: TokenInfo; onCopy: () => void }> = ({ token, onCopy }) => (
  <div className="bg-white bg-opacity-10 p-4 rounded-lg flex items-center space-x-4">
    <img src={token.tokenLogo} alt={token.tokenName} className="w-12 h-12 rounded-full" />
    <div className="flex-grow">
      <h3 className="text-lg font-semibold">{token.tokenName}</h3>
      <p className="text-sm text-blue-300">{token.tokenAbbr}</p>
      <p className="text-lg mt-1">
        {typeof token.amount === 'number' 
          ? token.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
          : token.amount}
      </p>
    </div>
    <button onClick={onCopy} className="text-blue-300 hover:text-blue-100">
      <Copy size={18} />
    </button>
  </div>
);

const TransactionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  title: string;
}> = ({ isOpen, onClose, transactions, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <p><strong>Hash:</strong> {tx.hash}</p>
              <p><strong>Date:</strong> {formatDate(tx.timestamp)}</p>
              <p><strong>Amount:</strong> {formatBalance(tx.amount)} TRX</p>
              <p><strong>From:</strong> {tx.from}</p>
              <p><strong>To:</strong> {tx.to}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

export default AccountQuery;