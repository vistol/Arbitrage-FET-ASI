import React, { useState } from 'react';
import { Wallet, LogOut, ShieldCheck, ArrowRight, Loader2, Plus, Download } from 'lucide-react';
import { WalletState, WalletProvider } from '../types';

interface WalletInterfaceProps {
  walletState: WalletState;
  onConnect: (provider: WalletProvider) => Promise<void>;
  onDisconnect: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: () => void;
}

const WalletInterface: React.FC<WalletInterfaceProps> = ({ 
  walletState, 
  onConnect, 
  onDisconnect, 
  onDeposit, 
  onWithdraw 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const handleConnect = async (provider: WalletProvider) => {
    setIsConnecting(true);
    await onConnect(provider);
    setIsConnecting(false);
    setIsModalOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount > 0 && amount <= walletState.balance) {
      onDeposit(amount);
      setDepositAmount('');
      setIsDepositModalOpen(false);
    }
  };

  if (!walletState.isConnected) {
    return (
      <>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-cyan-500/20 text-sm"
        >
          <Wallet size={16} />
          Connect Wallet
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2 font-display">Select Wallet</h3>
              <p className="text-slate-400 text-sm mb-6">Connect to the ASI Network to deploy liquidity.</p>

              <div className="space-y-3">
                {[
                  { id: 'fetch', name: 'Fetch.ai Wallet', color: 'bg-orange-500' },
                  { id: 'keplr', name: 'Keplr', color: 'bg-indigo-500' },
                  { id: 'cosmostation', name: 'Cosmostation', color: 'bg-purple-600' },
                  { id: 'metamask', name: 'Metamask (Snap)', color: 'bg-orange-600' },
                ].map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id as WalletProvider)}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${wallet.color} flex items-center justify-center text-white font-bold text-xs`}>
                        {wallet.name[0]}
                      </div>
                      <span className="font-medium text-slate-200 group-hover:text-white">{wallet.name}</span>
                    </div>
                    {isConnecting ? <Loader2 size={16} className="animate-spin text-slate-500" /> : <ArrowRight size={16} className="text-slate-500 group-hover:text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-full pl-4 pr-1 py-1">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Your Liquidity</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">${walletState.liquidity.toFixed(2)}</span>
        </div>
        
        <div className="h-6 w-px bg-slate-800 mx-1"></div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Unclaimed Yield</span>
          <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-white font-mono">${walletState.yield.toFixed(4)}</span>
             {walletState.yield > 0.01 && (
                <button onClick={onWithdraw} className="text-[10px] bg-emerald-900/50 hover:bg-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800 transition-colors">
                    CLAIM
                </button>
             )}
          </div>
        </div>

        <button 
          onClick={() => setIsDepositModalOpen(true)}
          className="ml-2 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-full transition-colors"
          title="Deposit Liquidity"
        >
          <Plus size={16} />
        </button>
        
        <button 
          onClick={onDisconnect}
          className="bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 p-2 rounded-full transition-colors ml-1"
          title="Disconnect"
        >
          <LogOut size={16} />
        </button>
      </div>

      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-900/30 rounded-xl text-cyan-400">
                    <Download size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white font-display">Deposit Liquidity</h3>
                    <p className="text-slate-400 text-xs">Authorize agents to trade your capital.</p>
                </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Wallet Balance</span>
                    <span>${walletState.balance.toLocaleString()}</span>
                </div>
                <form onSubmit={handleDepositSubmit}>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input 
                            type="number" 
                            autoFocus
                            placeholder="0.00" 
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-7 pr-3 text-white focus:outline-none focus:border-cyan-500 font-mono"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            max={walletState.balance}
                        />
                        <button 
                            type="button" 
                            onClick={() => setDepositAmount(walletState.balance.toString())}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-700 hover:border-cyan-500 uppercase font-bold"
                        >
                            Max
                        </button>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={!depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > walletState.balance}
                        className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={16} />
                        Confirm Deposit
                    </button>
                </form>
            </div>
            
            <div className="text-center">
                <p className="text-[10px] text-slate-500">
                    Funds are deployed to the uAgent Arbitrage Contract (0x...f3a2). 
                    <br />Withdrawals are subject to a 24h unbonding period.
                </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletInterface;