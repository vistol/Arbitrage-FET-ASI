import { Agent } from './types';

export const INITIAL_AGENTS: Agent[] = [
  { id: 'AG-01', name: 'Alpha Prime', status: 'SCANNING', totalProfit: 0, tradesCount: 0, efficiency: 98 },
  { id: 'AG-02', name: 'Beta Flow', status: 'SCANNING', totalProfit: 0, tradesCount: 0, efficiency: 94 },
  { id: 'AG-03', name: 'Gamma Vector', status: 'IDLE', totalProfit: 0, tradesCount: 0, efficiency: 91 },
  { id: 'AG-04', name: 'Delta Node', status: 'IDLE', totalProfit: 0, tradesCount: 0, efficiency: 96 },
];

export const MAX_HISTORY_POINTS = 30;
export const TRADE_EXECUTION_THRESHOLD = 0.02; // Minimum spread to trade
export const REFRESH_RATE_MS = 1500;

export const MOCK_MARKET_SENTIMENT = [
  "High Volatility Detected",
  "Liquidity Deepening on Osmosis",
  "Binance Order Book Thinning",
  "Arbitrage Window Opening",
  "MEV Bot Competition Low"
];
