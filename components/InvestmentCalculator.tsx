import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const InvestmentCalculator: React.FC = () => {
  const [investment, setInvestment] = useState(1000);
  const [spread, setSpread] = useState(0.5); // %
  const [tradesPerDay, setTradesPerDay] = useState(10);

  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [apy, setApy] = useState(0);

  useEffect(() => {
    // Formula: Investment * (Spread/100) * TradesPerDay
    // Subtracting a simplified fee factor of 0.1% per trade for realism
    const effectiveSpread = Math.max(0, spread - 0.1); 
    const daily = investment * (effectiveSpread / 100) * tradesPerDay;
    const monthly = daily * 30;
    const yearly = daily * 365;
    const calculatedApy = (yearly / investment) * 100;

    setDailyProfit(daily);
    setMonthlyProfit(monthly);
    setApy(calculatedApy);
  }, [investment, spread, tradesPerDay]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="text-amber-400" size={20} />
        <h3 className="text-lg font-bold font-display text-white">ROI Simulator</h3>
      </div>

      <div className="space-y-6 flex-1">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Capital Allocation (USDT/FET)</span>
              <span className="text-white font-mono">${investment.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="50000" 
              step="100" 
              value={investment} 
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Target Spread Capture</span>
              <span className="text-white font-mono">{spread.toFixed(2)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="5.0" 
              step="0.1" 
              value={spread} 
              onChange={(e) => setSpread(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Frequency (Trades/Day)</span>
              <span className="text-white font-mono">{tradesPerDay}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              step="1" 
              value={tradesPerDay} 
              onChange={(e) => setTradesPerDay(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/50">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
             <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                <Calendar size={12} /> Daily
             </div>
             <div className="text-lg font-bold text-emerald-400 font-mono">
                ${dailyProfit.toFixed(2)}
             </div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
             <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                <Calendar size={12} /> Monthly
             </div>
             <div className="text-lg font-bold text-emerald-400 font-mono">
                ${monthlyProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
             </div>
          </div>
          <div className="col-span-2 bg-gradient-to-r from-emerald-950/40 to-slate-900/40 rounded-lg p-3 border border-emerald-900/30 flex justify-between items-center">
             <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                <TrendingUp size={14} /> Projected APY
             </div>
             <div className="text-xl font-bold text-white font-display">
                {apy.toLocaleString(undefined, {maximumFractionDigits: 0})}%
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;