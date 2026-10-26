import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { CryptoIcon } from './CryptoIcon';
import {
  CheckCircle2,
  Clock,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const LiveTransactionToast: React.FC = () => {
  const { activeLiveToast, dismissLiveToast, formatFiat, assets } = useWallet();
  const [copied, setCopied] = useState(false);
  const [remainingSec, setRemainingSec] = useState(30);

  useEffect(() => {
    if (!activeLiveToast) return;

    // Reset remaining seconds to 30 whenever a new toast starts
    const updateRemaining = () => {
      const elapsed = Math.floor((Date.now() - activeLiveToast.startedAt) / 1000);
      const left = Math.max(0, 30 - elapsed);
      setRemainingSec(left);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 500);
    return () => clearInterval(interval);
  }, [activeLiveToast?.id, activeLiveToast?.startedAt]);

  // Subtle web audio chime for Trust Wallet experience
  useEffect(() => {
    if (!activeLiveToast) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (activeLiveToast.stage === 'pending') {
          osc.frequency.setValueAtTime(520, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } else if (activeLiveToast.stage === 'success') {
          osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, [activeLiveToast?.stage]);

  if (!activeLiveToast) return null;

  const {
    type,
    stage,
    amount,
    symbol,
    network = 'TRC20',
    txHash = '0x' + 'f'.repeat(64),
    confirmations = 0,
    maxConfirmations = 12,
    title,
    subtitle,
    toAddress,
    fromAddress,
  } = activeLiveToast;

  const asset = assets.find((a) => a.symbol === symbol);
  const amountUsd = amount * (asset?.priceUsd || 1);
  const isDeposit = type === 'deposit';
  const isSend = type === 'send' || type === 'withdraw';

  const handleCopyHash = () => {
    if (!txHash) return;
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.max(0, Math.min(100, (remainingSec / 30) * 100));

  return (
    <div className="fixed top-3 left-0 right-0 z-[9999] flex justify-center px-3 sm:px-4 pointer-events-none select-none font-sans animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="pointer-events-auto w-full max-w-md bg-[#121622]/98 backdrop-blur-2xl rounded-3xl border border-white/12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] p-4 sm:p-5 text-white relative overflow-hidden transition-all duration-300">
        
        {/* Top 30-Second Animated Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={`h-full transition-all duration-500 ease-linear ${
              stage === 'success'
                ? 'bg-gradient-to-r from-[#00D084] to-[#38B6FF]'
                : stage === 'processing'
                ? 'bg-gradient-to-r from-[#38B6FF] to-[#8C62FF]'
                : 'bg-gradient-to-r from-[#FFB800] to-[#FF8A00]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header Row: Status Badge + Live Timer + Close */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            {stage === 'pending' && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>Pending Block</span>
              </span>
            )}
            {stage === 'processing' && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-semibold">
                <Loader2 className="h-3 w-3 animate-spin text-sky-400" />
                <span>Confirming ({confirmations}/{maxConfirmations})</span>
              </span>
            )}
            {stage === 'success' && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00D084]" />
                <span>Success (12/12 Confirmed)</span>
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
              Trust Wallet Push
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 30s Countdown Pill */}
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono"
              title="Stays on screen for 30 seconds"
            >
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{remainingSec}s</span>
            </div>

            {/* Close Button */}
            <button
              onClick={dismissLiveToast}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss popup"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Amount & Coin Card */}
        <div className="flex items-center justify-between gap-3 bg-[#181D2B] rounded-2xl p-3 sm:p-3.5 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CryptoIcon
                symbol={symbol}
                name={asset?.name || symbol}
                network={network}
                size="md"
                showBadge={true}
              />
              <span
                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] border border-[#181D2B] ${
                  isDeposit
                    ? 'bg-[#00D084] text-black font-bold'
                    : 'bg-[#5B67F6] text-white'
                }`}
              >
                {isDeposit ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-white tracking-tight">
                  {isDeposit ? 'Deposit' : isSend ? 'Transfer' : 'Swap'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono uppercase">
                  {network}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {subtitle}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`text-[16px] sm:text-[18px] font-black font-mono tracking-tight ${
                isDeposit ? 'text-[#00D084]' : 'text-white'
              }`}
            >
              {isDeposit ? '+' : '-'}{amount.toLocaleString()} {symbol}
            </div>
            <div className="text-[11px] text-slate-400 font-mono font-medium">
              ≈ {formatFiat(amountUsd)}
            </div>
          </div>
        </div>

        {/* 3-Step Live Progress Indicator (Pending -> Confirming -> Success) */}
        <div className="mt-3.5 px-1">
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Step 1: Pending */}
            <div
              className={`p-2 rounded-xl border text-[11px] flex flex-col items-center gap-1 transition-all ${
                stage === 'pending'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>1. Pending</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Mempool</span>
            </div>

            {/* Step 2: Processing */}
            <div
              className={`p-2 rounded-xl border text-[11px] flex flex-col items-center gap-1 transition-all ${
                stage === 'processing'
                  ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 font-bold shadow-[0_0_15px_rgba(56,182,255,0.2)]'
                  : stage === 'success'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-medium'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1 font-semibold">
                {stage === 'processing' ? (
                  <Loader2 className="h-3 w-3 animate-spin text-sky-400" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                )}
                <span>2. Confirming</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {stage === 'pending' ? '0/12' : stage === 'processing' ? `${confirmations}/12` : '12/12'} Blocks
              </span>
            </div>

            {/* Step 3: Success */}
            <div
              className={`p-2 rounded-xl border text-[11px] flex flex-col items-center gap-1 transition-all ${
                stage === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-[#00D084] font-bold shadow-[0_0_20px_rgba(0,208,132,0.3)] animate-pulse'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3 text-[#00D084]" />
                <span>3. Completed</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Finalized</span>
            </div>
          </div>
        </div>

        {/* Transaction Details & TxHash Link */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 font-mono">
            <span>Tx:</span>
            <span className="text-slate-300 font-mono">
              {txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-6)}` : '0x7a3f...91bc'}
            </span>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Copy Tx Hash"
            >
              {copied ? <Check className="h-3 w-3 text-[#00D084]" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">
              SafePal Cloud Node
            </span>
            <button
              onClick={dismissLiveToast}
              className="text-[11px] text-[#5B67F6] hover:text-[#7A85FF] font-semibold cursor-pointer underline"
            >
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
