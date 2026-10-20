import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  X,
  Fuel,
  Zap,
  TrendingDown,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Flame,
  Info,
  RefreshCw,
  Coins,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';

interface GasStationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasStationModal: React.FC<GasStationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, assets, setIsReceiveModalOpen, setSelectedAssetForModal, setIsSendModalOpen } = useWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'tron-energy' | 'chains'>('overview');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedEnergyPlan, setSelectedEnergyPlan] = useState<'single' | 'multi' | 'custom'>('single');
  const [isOrderingEnergy, setIsOrderingEnergy] = useState(false);
  const [energySuccess, setEnergySuccess] = useState(false);

  if (!isOpen) return null;

  const trxAsset = assets.find((a) => a.symbol === 'TRX' || a.symbol === 'GAS_TRX');
  const userTrxBal = currentUser?.balances?.['TRX'] || currentUser?.balances?.['GAS_TRX'] || 0;

  // Dedicated Tron Deposit Address
  const tronReceiveAddress = currentUser?.customCoinAddresses?.['TRX_TRC20'] ||
    currentUser?.customCoinAddresses?.['TRX'] ||
    'TB7zZxcAr6NKR6nF231t2ZWYPTu1TUrDE6';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleQuickTopUp = () => {
    if (trxAsset) {
      setSelectedAssetForModal(trxAsset);
    }
    onClose();
    setIsReceiveModalOpen(true);
  };

  const handleRentEnergy = () => {
    setIsOrderingEnergy(true);
    setTimeout(() => {
      setIsOrderingEnergy(false);
      setEnergySuccess(true);
      setTimeout(() => setEnergySuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-[#0F131C] border border-[#21293D] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#141A26]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Fuel className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Gas Station
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live
                </span>
              </h2>
              <p className="text-xs text-slate-400">Zero-gas transfers & multi-chain fee tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[#1C2333] hover:bg-[#252E42] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center px-4 pt-3 pb-1 gap-2 border-b border-white/5 bg-[#121622]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#3862FB] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            TRON Gas & Energy
          </button>
          <button
            onClick={() => setActiveTab('chains')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'chains'
                ? 'bg-[#3862FB] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Multi-Chain Gwei
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'overview' && (
            <>
              {/* TRON Gas Card */}
              <div className="rounded-2xl bg-[#161C2A] border border-[#232C42] p-4 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CryptoIcon symbol="TRX" name="TRON" size="md" networkBadge="TRC20" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">Gas Fee TRX Balance</span>
                        <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded">
                          TRON Network
                        </span>
                      </div>
                      <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                        {userTrxBal.toFixed(2)} TRX
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleQuickTopUp}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Top-Up TRX
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Info className="h-3.5 w-3.5" />
                    Needed for USDT TRC20 transfer:
                  </span>
                  <span className="font-mono font-bold text-amber-400">~13.4 TRX ($2.60)</span>
                </div>
              </div>

              {/* Energy Rental Feature */}
              <div className="rounded-2xl bg-gradient-to-br from-[#131929] to-[#182136] border border-[#2E3C5B] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Flame className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-white">TRON Energy Rental</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Save up to 75% Fees
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Rent TRON energy instantly to pay $0.65 instead of burning $2.60 TRX per transfer.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedEnergyPlan('single')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEnergyPlan === 'single'
                        ? 'bg-[#3862FB]/20 border-[#3862FB] text-white shadow-sm'
                        : 'bg-[#151B2A] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] text-slate-400">1 Transfer</div>
                    <div className="text-sm font-bold text-white mt-0.5">32,000 Energy</div>
                    <div className="text-[11px] text-emerald-400 font-bold mt-1">3.5 TRX (~$0.68)</div>
                  </button>

                  <button
                    onClick={() => setSelectedEnergyPlan('multi')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEnergyPlan === 'multi'
                        ? 'bg-[#3862FB]/20 border-[#3862FB] text-white shadow-sm'
                        : 'bg-[#151B2A] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] text-slate-400">5 Transfers</div>
                    <div className="text-sm font-bold text-white mt-0.5">160,000 Energy</div>
                    <div className="text-[11px] text-emerald-400 font-bold mt-1">16 TRX (~$3.10)</div>
                  </button>
                </div>

                <button
                  onClick={handleRentEnergy}
                  disabled={isOrderingEnergy}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3862FB] to-[#0570F2] hover:from-[#2D54E5] hover:to-[#0560D0] text-white text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {isOrderingEnergy ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Activating Energy Lease...</span>
                    </>
                  ) : energySuccess ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Energy Delegated Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 text-amber-300" />
                      <span>Rent Energy for this Wallet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Gas Address Top-Up */}
              <div className="rounded-2xl bg-[#141926] border border-white/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">TRON Gas Deposit Address:</span>
                  <span className="text-[11px] text-slate-400 font-mono">TRC-20</span>
                </div>
                <div className="flex items-center justify-between bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2">
                  <span className="text-xs font-mono text-slate-300 truncate mr-2">
                    {tronReceiveAddress}
                  </span>
                  <button
                    onClick={() => handleCopy(tronReceiveAddress)}
                    className="p-1.5 rounded-lg bg-[#1B2232] hover:bg-[#252E42] text-slate-300 hover:text-white transition-all active:scale-90 shrink-0"
                    title="Copy Address"
                  >
                    {copiedAddress ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'chains' && (
            <div className="space-y-2.5">
              {/* Ethereum */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#161C2A] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <CryptoIcon symbol="ETH" name="Ethereum" size="sm" />
                  <div>
                    <div className="text-sm font-bold text-white">Ethereum</div>
                    <div className="text-xs text-slate-400">Standard Gas: 12 Gwei</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400 font-mono">~$0.45</div>
                  <div className="text-[10px] text-slate-400">Normal Speed</div>
                </div>
              </div>

              {/* BNB Smart Chain */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#161C2A] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <CryptoIcon symbol="BNB" name="BNB" size="sm" />
                  <div>
                    <div className="text-sm font-bold text-white">BNB Smart Chain</div>
                    <div className="text-xs text-slate-400">Gas: 3 Gwei</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400 font-mono">~$0.04</div>
                  <div className="text-[10px] text-slate-400">Ultra Fast</div>
                </div>
              </div>

              {/* Solana */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#161C2A] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <CryptoIcon symbol="SOL" name="Solana" size="sm" />
                  <div>
                    <div className="text-sm font-bold text-white">Solana</div>
                    <div className="text-xs text-slate-400">Base: 5,000 Lamports</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400 font-mono">&lt;$0.001</div>
                  <div className="text-[10px] text-slate-400">Instant</div>
                </div>
              </div>

              {/* Polygon */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#161C2A] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <CryptoIcon symbol="POL" name="Polygon" size="sm" />
                  <div>
                    <div className="text-sm font-bold text-white">Polygon (POL)</div>
                    <div className="text-xs text-slate-400">Gas: 32 Gwei</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400 font-mono">~$0.01</div>
                  <div className="text-[10px] text-slate-400">Fast</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
