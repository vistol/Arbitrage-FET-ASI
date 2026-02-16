import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, icon: Icon, trend, color = "text-emerald-400" }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center space-x-4 shadow-lg hover:border-slate-700 transition-colors">
      <div className={`p-3 rounded-lg bg-slate-800/50 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</p>
        <h3 className="text-2xl font-bold text-white font-display">{value}</h3>
        {subValue && (
          <p className={`text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-500'}`}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;