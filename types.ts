export interface Trade {
  id: string;
  timestamp: number;
  exchangeBuy: string;
  exchangeSell: string;
  priceBuy: number;
  priceSell: number;
  profit: number;
  amount: number;
  agentId: string;
}

export interface MarketState {
  osmosisPrice: number;
  binancePrice: number;
  history: { time: string; osmosis: number; binance: number }[];
}

export interface Agent {
  id: string;
  name: string;
  status: 'IDLE' | 'SCANNING' | 'EXECUTING' | 'ANALYZING';
  totalProfit: number;
  tradesCount: number;
  efficiency: number; // 0-100%
}

export enum GeminiAnalysisStatus {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number; // In Wallet
  liquidity: number; // Deposited in Swarm
  yield: number; // Earned
}

export type WalletProvider = 'keplr' | 'cosmostation' | 'fetch' | 'metamask';
