export type Network = 'tron' | 'solana' | 'ton';

export interface TokenData {
  name: string;
  symbol: string;
  address: string;
  decimals: string;
  image_url: string | null;
  websites: string[];
  description: string;
  discord_url: string;
  telegram_handle: string;
  twitter_handle: string;
  coingecko_coin_id: string;
  gt_score: string;
  metadata_updated_at: string;
  total_supply: string;
  price_usd: string;
  fdv_usd: string;
  total_reserve_in_usd: string;
  volume_24h: string;
  market_cap_usd: string;
  top_pools: string[];
}

export interface RecentToken {
  priceChangePercentage: any;
  marketCapUsd(marketCapUsd: any): number;
  baseTokenPriceUsd(baseTokenPriceUsd: any): unknown;
  address: any;
  id: string;
  name: string;
  symbol: string;
  network: Network;
  price_usd: string;
  volume_24h: string;
}

export interface WhitelistedToken {
  address: string;
  name: string;
  symbol: string;
  network: Network;
  addedAt: string;
  image_url: string | null;
}


export interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  name: string;
  symbol: string;
  price: number;
  description: string;
  links: Array<{ type?: string; label?: string; url: string }>;
  totalAmount: number;
  amount: number;
  boostedTokens: BoostedToken[];
}


export type NoteCategory = 'wallet' | 'token' | 'contract';

export interface Note {
  id: string;
  address: string;
  note: string;
  category: NoteCategory;
  timestamp: number;
}