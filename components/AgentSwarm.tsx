import React from 'react';
import { Agent } from '../types';
import { Bot, Activity, CheckCircle, Zap } from 'lucide-react';

interface AgentSwarmProps {
  agents: Agent[];
}

const AgentSwarm: React.FC<AgentSwarmProps> = ({ agents }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
          <Bot className="text-cyan-400" size={20} />
          Active Swarm Nodes
        </h3>
        <span className="px-2 py-1 rounded bg-cyan-950/50 border border-cyan-900 text-cyan-400 text-xs font-mono">
          uAgent Protocol v2.1
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className={`
              relative overflow-hidden rounded-lg p-3 border transition-all duration-300
              ${agent.status === 'EXECUTING' ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                agent.status === 'SCANNING' ? 'bg-slate-800/30 border-cyan-500/30' : 
                'bg-slate-800/20 border-slate-700/50'}
            `}
          >
            {/* Background Animation Effect for Executing */}
            {agent.status === 'EXECUTING' && (
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
            )}

            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${agent.status === 'IDLE' ? 'bg-slate-500' : agent.status === 'EXECUTING' ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
                 <span className="font-mono text-sm font-semibold text-slate-200">{agent.name}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                agent.status === 'EXECUTING' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950' : 
                agent.status === 'SCANNING' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950' :
                'text-slate-500 border-slate-600 bg-slate-900'
              }`}>
                {agent.status}
              </span>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Efficiency</span>
                <span className="text-white">{agent.efficiency}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1">
                <div className="bg-cyan-500 h-1 rounded-full transition-all duration-500" style={{ width: `${agent.efficiency}%` }} />
              </div>
              
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5">
                 <div className="text-xs text-slate-500">Total Profit</div>
                 <div className="text-sm font-mono text-emerald-400 font-bold">${agent.totalProfit.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentSwarm;