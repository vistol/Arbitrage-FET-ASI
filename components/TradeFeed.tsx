import React from 'react';
import { Trade } from '../types';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface TradeFeedProps {
  trades: Trade[];
}

const TradeFeed: React.FC<TradeFeedProps> = ({ trades }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-5 h-full flex flex-col">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
          <RefreshCw className="text-violet-400" size={20} />
          Execution Log
        </h3>
        <span className="text-xs text-slate-500">Live Feed</span>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2 pr-2">
        {trades.length === 0 ? (
          <div className="text-center text-slate-600 text-sm py-8 italic">
            Waiting for arbitrage opportunities...
          </div>
        ) : (
          trades.slice().reverse().map((trade) => (
            <div key={trade.id} className="bg-slate-800/40 border border-slate-700/50 rounded p-2.5 text-xs flex items-center justify-between group hover:border-violet-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="font-mono text-slate-500">
                  {new Date(trade.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div>
                   <div className="flex items-center gap-1.5 font-bold text-slate-300">
                      <span className="text-purple-400">{trade.exchangeBuy}</span>
                      <ArrowRight size={10} className="text-slate-600" />
                      <span className="text-amber-400">{trade.exchangeSell}</span>
                   </div>
                   <div className="text-slate-500 mt-0.5">
                      Buy: <span className="text-slate-300">${trade.priceBuy.toFixed(4)}</span> | Sell: <span className="text-slate-300">${trade.priceSell.toFixed(4)}</span>
                   </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold font-mono">
                  +${trade.profit.toFixed(3)}
                </div>
                <div className="text-[10px] text-slate-600 uppercase">
                  {trade.agentId}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TradeFeed;