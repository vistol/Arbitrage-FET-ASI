import React from 'react';
import { GeminiAnalysisStatus } from '../types';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';

interface AIAnalystProps {
  analysis: string;
  status: GeminiAnalysisStatus;
  onRequestAnalysis: () => void;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ analysis, status, onRequestAnalysis }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-950/30 to-slate-900/50 backdrop-blur-md border border-indigo-500/20 rounded-xl p-5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 p-20 bg-indigo-500/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
          <BrainCircuit className="text-indigo-400" size={20} />
          ASI Tactical Core
        </h3>
        <button 
          onClick={onRequestAnalysis}
          disabled={status === GeminiAnalysisStatus.LOADING}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {status === GeminiAnalysisStatus.LOADING ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Sparkles size={12} />
          )}
          {status === GeminiAnalysisStatus.LOADING ? 'Analyzing...' : 'Generate Insight'}
        </button>
      </div>

      <div className="relative z-10 min-h-[60px] flex items-center">
         {status === GeminiAnalysisStatus.IDLE && !analysis ? (
             <p className="text-slate-500 text-sm italic">Core systems online. Awaiting data for strategic inference.</p>
         ) : (
             <div className="prose prose-invert max-w-none">
                 <p className="text-indigo-100 text-sm leading-relaxed border-l-2 border-indigo-500 pl-3">
                   {analysis}
                 </p>
             </div>
         )}
      </div>
    </div>
  );
};

export default AIAnalyst;