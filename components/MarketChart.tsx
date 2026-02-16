import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MarketChartProps {
  data: { time: string; osmosis: number; binance: number }[];
}

const MarketChart: React.FC<MarketChartProps> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorOsmosis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBinance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="time" 
            stroke="#475569" 
            tick={{fontSize: 10}} 
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#475569" 
            tick={{fontSize: 10}} 
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="osmosis" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorOsmosis)" 
            name="Osmosis ($)"
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="binance" 
            stroke="#f59e0b" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorBinance)" 
            name="Binance ($)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;