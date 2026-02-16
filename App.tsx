import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, DollarSign, Wallet, TrendingUp, Cpu } from 'lucide-react';
import { Agent, Trade, MarketState, GeminiAnalysisStatus, GeminiAnalysisStatus as GStatus, WalletState, WalletProvider } from './types';
import { INITIAL_AGENTS, MAX_HISTORY_POINTS, TRADE_EXECUTION_THRESHOLD, REFRESH_RATE_MS } from './constants';
import MarketChart from './components/MarketChart';
import TradeFeed from './components/TradeFeed';
import MetricCard from './components/MetricCard';
import AgentSwarm from './components/AgentSwarm';
import AIAnalyst from './components/AIAnalyst';
import InvestmentCalculator from './components/InvestmentCalculator';
import WalletInterface from './components/WalletInterface';
import { analyzeMarketPerformance } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketState, setMarketState] = useState<MarketState>({
    osmosisPrice: 2.00,
    binancePrice: 2.05,
    history: []
  });
  const [totalProfit, setTotalProfit] = useState(0);
  const [analysis, setAnalysis] = useState<string>("");
  const [analysisStatus, setAnalysisStatus] = useState<GeminiAnalysisStatus>(GStatus.IDLE);
  
  // Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 5000, // Mock initial balance
    liquidity: 0,
    yield: 0
  });

  // --- Refs for simulation logic ---
  const timeRef = useRef<number>(0);
  
  // --- Simulation Logic ---
  const simulateMarket = useCallback(() => {
    setMarketState(prev => {
      // Random walk for prices
      const vol = 0.02; // volatility
      const changeOsmosis = (Math.random() - 0.5) * vol;
      const changeBinance = (Math.random() - 0.5) * vol;
      
      let newOsmosis = Math.max(0.5, prev.osmosisPrice + changeOsmosis);
      let newBinance = Math.max(0.5, prev.binancePrice + changeBinance);

      // Periodically force a divergence for demo purposes
      timeRef.current += 1;
      if (timeRef.current % 10 === 0) {
        newBinance += 0.06; // Spike on Binance
      }
      if (timeRef.current % 15 === 0) {
        newOsmosis -= 0.04; // Dip on Osmosis
      }

      // Format time
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const newHistory = [...prev.history, { time: timeStr, osmosis: newOsmosis, binance: newBinance }];
      if (newHistory.length > MAX_HISTORY_POINTS) newHistory.shift();

      return {
        osmosisPrice: newOsmosis,
        binancePrice: newBinance,
        history: newHistory
      };
    });
  }, []);

  const executeArbitrage = useCallback(() => {
    const { osmosisPrice, binancePrice } = marketState;
    const spread = Math.abs(osmosisPrice - binancePrice);
    
    // Only trade if spread > threshold
    if (spread > TRADE_EXECUTION_THRESHOLD) {
      // Pick a random agent to execute
      const activeAgentIndex = Math.floor(Math.random() * agents.length);
      const agentId = agents[activeAgentIndex].id;

      // Determine direction
      const buyOsmosis = osmosisPrice < binancePrice;
      const priceBuy = buyOsmosis ? osmosisPrice : binancePrice;
      const priceSell = buyOsmosis ? binancePrice : osmosisPrice;
      const profitPerUnit = priceSell - priceBuy;
      const amount = 100; // Fixed batch size for simplicity
      const tradeProfit = (profitPerUnit * amount) - (0.01); // Deduct generic gas fee

      if (tradeProfit > 0) {
        const newTrade: Trade = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          exchangeBuy: buyOsmosis ? 'Osmosis' : 'Binance',
          exchangeSell: buyOsmosis ? 'Binance' : 'Osmosis',
          priceBuy,
          priceSell,
          profit: tradeProfit,
          amount,
          agentId
        };

        // Update Trades
        setTrades(prev => [...prev, newTrade]);
        
        // Update Profit
        setTotalProfit(prev => prev + tradeProfit);

        // Update Wallet Yield if Liquidity Provided
        if (wallet.liquidity > 0) {
           // Simulate the user owning a share of the pool or independent execution
           // Simplified: User yield is proportional to their liquidity vs a mock pool of 10k
           const userShare = wallet.liquidity / 10000;
           // Or just give them the trade profit scaled to their liquidity relative to the batch size
           // If batch is 100 units ~$200, and user deposited $2000...
           // Let's stick to a simple generic yield multiplier for the demo
           const userTradeReward = tradeProfit * (wallet.liquidity / 5000); 
           setWallet(prev => ({...prev, yield: prev.yield + userTradeReward}));
        }

        // Update Agents
        setAgents(prevAgents => prevAgents.map(a => {
          if (a.id === agentId) {
            return {
              ...a,
              status: 'EXECUTING',
              totalProfit: a.totalProfit + tradeProfit,
              tradesCount: a.tradesCount + 1
            };
          }
          return { ...a, status: 'SCANNING' };
        }));

        // Reset agent status after a short delay
        setTimeout(() => {
          setAgents(prevAgents => prevAgents.map(a => 
             a.id === agentId ? { ...a, status: 'SCANNING' } : a
          ));
        }, 800);
      }
    } else {
        // If no trade, ensure agents are just scanning or idle
        setAgents(prev => prev.map(a => ({...a, status: a.status === 'EXECUTING' ? 'SCANNING' : 'SCANNING'})));
    }
  }, [marketState, agents, wallet.liquidity]);

  // --- Effects ---
  
  // Market Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      simulateMarket();
    }, REFRESH_RATE_MS);
    return () => clearInterval(interval);
  }, [simulateMarket]);

  // Arbitrage Bot Loop (Runs slightly offset from market updates)
  useEffect(() => {
    const interval = setInterval(() => {
      executeArbitrage();
    }, REFRESH_RATE_MS);
    return () => clearInterval(interval);
  }, [executeArbitrage]);


  // --- Handlers ---
  const handleAIAnalysis = async () => {
    setAnalysisStatus(GStatus.LOADING);
    const spread = Math.abs(marketState.osmosisPrice - marketState.binancePrice);
    
    // Simulate slight network delay + AI processing
    const result = await analyzeMarketPerformance(trades.slice(-10), spread);
    
    setAnalysis(result);
    setAnalysisStatus(GStatus.SUCCESS);
  };

  // Wallet Handlers
  const handleConnectWallet = async (provider: WalletProvider) => {
    // Mock connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWallet(prev => ({
      ...prev,
      isConnected: true,
      address: `fetch1${Math.random().toString(36).substring(2, 12)}...`,
    }));
  };

  const handleDisconnect = () => {
    setWallet(prev => ({
      ...prev,
      isConnected: false,
      address: null,
      liquidity: 0,
      yield: 0
    }));
  };

  const handleDeposit = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount,
      liquidity: prev.liquidity + amount
    }));
  };

  const handleWithdraw = () => {
    // Claim yield
    const amount = wallet.yield;
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      yield: 0
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
            ASI <span className="text-cyan-400">NEXUS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Autonomous Agent Arbitrage System // FET-ASI Network</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-900 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono text-emerald-400">SYSTEM ONLINE</span>
            </div>
          </div>
          
          <WalletInterface 
            walletState={wallet}
            onConnect={handleConnectWallet}
            onDisconnect={handleDisconnect}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Metric Cards */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="Total Profit (24h)" 
            value={`$${totalProfit.toFixed(2)}`} 
            subValue="+12.5% vs yesterday"
            icon={DollarSign}
            trend="up"
          />
           <MetricCard 
            label="Active Spread" 
            value={`$${Math.abs(marketState.osmosisPrice - marketState.binancePrice).toFixed(3)}`} 
            subValue="Osmosis <> Binance"
            icon={TrendingUp}
            color="text-violet-400"
          />
           <MetricCard 
            label="Trades Executed" 
            value={trades.length.toString()} 
            subValue="High Frequency Mode"
            icon={Activity}
            color="text-blue-400"
          />
           <MetricCard 
            label="Est. Daily Yield" 
            value={`$${(totalProfit * (86400 / (trades.length > 0 ? (Date.now() - trades[0].timestamp)/1000 : 1))).toFixed(2)}`} 
            subValue={wallet.isConnected && wallet.liquidity > 0 ? "Based on Active Liquidity" : "Swarm Aggregate"}
            icon={Wallet}
            color="text-amber-400"
          />
        </div>

        {/* Main Chart Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-5 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold font-display text-white">Market Spread Analysis</h3>
              <div className="flex gap-4 text-sm font-mono">
                <span className="text-violet-400">OSMOSIS: ${marketState.osmosisPrice.toFixed(3)}</span>
                <span className="text-amber-400">BINANCE: ${marketState.binancePrice.toFixed(3)}</span>
              </div>
            </div>
            <div className="flex-1 w-full min-h-0">
               <MarketChart data={marketState.history} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* AI Analysis Component */}
             <AIAnalyst 
               analysis={analysis} 
               status={analysisStatus} 
               onRequestAnalysis={handleAIAnalysis} 
             />
             
             {/* New Investment Calculator */}
             <InvestmentCalculator />
          </div>
        </div>

        {/* Sidebar: Agents & Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-auto">
          <div className="h-[400px]">
            <AgentSwarm agents={agents} />
          </div>
          <div className="h-[400px]">
            <TradeFeed trades={trades} />
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;