import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'react-toastify';

interface TokenData {
  tokenId: string;
  tokenName: string;
  tokenAbbr: string;
  balance: string;
  tokenDecimal: number;
  tokenLogo: string;
  tokenPriceInTrx?: number;
  tokenPriceInUsd?: number;
  amount?: number;
  amountInUsd?: number;
  nrOfTokenHolders?: number;
  transferCount?: number;
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
  if (!data || !data.data) {
    return <div className="text-red-500">No token data available.</div>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
        Token Holdings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.data.map((token, index) => (
          <TokenCard
            key={index}
            token={token}
            onCopy={() => copyToClipboard(token.tokenId)}
            formatBalance={formatBalance}
          />
        ))}
      </div>
    </div>
  );
};

const TokenCard: React.FC<{
  token: TokenData;
  onCopy: () => void;
  formatBalance: (balance: string, decimal: number) => string;
}> = ({ token, onCopy, formatBalance }) => (
  <div className="token-card space-y-4">
    <div className="flex items-center space-x-4">
      <img
        src={token.tokenLogo}
        alt={token.tokenName}
        className="w-16 h-16 rounded-full shadow-md"
      />
      <div className="flex-grow">
        <h3 className="text-xl font-semibold">{token.tokenName}</h3>
        <p className="text-sm text-slate-400">{token.tokenAbbr}</p>
      </div>
      <button onClick={onCopy} className="text-slate-300 hover:text-slate-100">
        <Copy size={20} />
      </button>
    </div>
    <div className="section-content">
      <InfoRow
        label="Balance"
        value={formatBalance(token.balance, token.tokenDecimal)}
      />
      {token.amount && <InfoRow label="Amount" value={token.amount.toString()} />}
      {token.amountInUsd && (
        <InfoRow
          label="USD Value"
          value={`$${token.amountInUsd.toFixed(2)}`}
        />
      )}
      {token.tokenPriceInTrx && (
        <InfoRow
          label="Price (TRX)"
          value={`${token.tokenPriceInTrx.toFixed(6)} TRX`}
        />
      )}
      {token.tokenPriceInUsd && (
        <InfoRow
          label="Price (USD)"
          value={`$${token.tokenPriceInUsd.toFixed(6)}`}
        />
      )}
      {token.nrOfTokenHolders && (
        <InfoRow
          label="Holders"
          value={token.nrOfTokenHolders.toLocaleString()}
        />
      )}
      {token.transferCount && (
        <InfoRow
          label="Transfers"
          value={token.transferCount.toLocaleString()}
        />
      )}
    </div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="info-label">{label}:</span>
    <span className="info-value">{value}</span>
  </div>
);

export default TokenQuery;
