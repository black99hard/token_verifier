import React from 'react';
import { Copy } from 'lucide-react';

interface TokenData {
  tokenId: string;
  tokenName: string;
  tokenAbbr: string;
  balance: string;
  tokenDecimal: number;
  tokenLogo: string;
  tokenPriceInTrx?: number;
  tokenPriceInUsd?: number;
  amount?: number | string;
  amountInUsd?: number;
  quantity?: number | string;
  nrOfTokenHolders?: number;
  transferCount?: number;
  level?: string;
}

interface TokenQueryProps {
  data: {
    total: number;
    data: TokenData[];
  };
}

const formatBalance = (balance: string, decimal: number) => {
  return (parseFloat(balance) / Math.pow(10, decimal)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

const TokenQuery: React.FC<TokenQueryProps> = ({ data }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Token Holdings
        </h1>

        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((token, index) => (
              <TokenCard key={index} token={token} onCopy={() => copyToClipboard(token.tokenId)} formatBalance={formatBalance} />
            ))}
          </div>
        </div>
      </div>

  );
};

const TokenCard: React.FC<{ token: TokenData; onCopy: () => void; formatBalance: (balance: string, decimal: number) => string }> = ({ token, onCopy, formatBalance }) => (
  <div className="bg-white bg-opacity-10 p-4 rounded-lg flex flex-col">
    <div className="flex items-center space-x-4 mb-4">
      <img src={token.tokenLogo} alt={token.tokenName} className="w-12 h-12 rounded-full" />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{token.tokenName}</h3>
        <p className="text-sm text-blue-300">{token.tokenAbbr}</p>
      </div>
      <button onClick={onCopy} className="text-blue-300 hover:text-blue-100">
        <Copy size={18} />
      </button>
    </div>
    <div className="space-y-2">
      <InfoRow label="Balance" value={formatBalance(token.balance, token.tokenDecimal)} />
      {token.amount && <InfoRow label="Amount" value={token.amount.toString()} />}
      {token.amountInUsd && <InfoRow label="USD Value" value={`$${token.amountInUsd.toFixed(2)}`} />}
      {token.tokenPriceInTrx && <InfoRow label="Price (TRX)" value={token.tokenPriceInTrx.toFixed(6)} />}
      {token.tokenPriceInUsd && <InfoRow label="Price (USD)" value={`$${token.tokenPriceInUsd.toFixed(6)}`} />}
      {token.nrOfTokenHolders && <InfoRow label="Holders" value={token.nrOfTokenHolders.toLocaleString()} />}
      {token.transferCount && <InfoRow label="Transfers" value={token.transferCount.toLocaleString()} />}
    </div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-400">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default TokenQuery;