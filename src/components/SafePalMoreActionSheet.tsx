import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  TrendingUp,
  Shield,
  Layers,
  UserCheck,
  ShoppingBag,
  Edit3,
  History,
  ChevronRight,
  X,
  ExternalLink,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface SafePalMoreActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafePalMoreActionSheet: React.FC<SafePalMoreActionSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { setActiveTab, currentUser, assets } = useWallet();
  const [activeSubModal, setActiveSubModal] = useState<
    'index' | 'sfplus' | 'approval' | 'store' | 'sign' | null
  >(null);

  // Sign Message state
  const [signMessageText, setSignMessageText] = useState('Hello SafePal Web3!');
  const [generatedSignature, setGeneratedSignature] = useState<string | null>(null);

  // Approval Manager state
  const [revokedContracts, setRevokedContracts] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleItemClick = (id: string) => {
    if (id === 'index') {
      setActiveSubModal('index');
    } else if (id === 'sfplus') {
      setActiveSubModal('sfplus');
    } else if (id === 'defi') {
      onClose();
      setActiveTab('defi');
    } else if (id === 'approval') {
      setActiveSubModal('approval');
    } else if (id === 'store') {
      setActiveSubModal('store');
    } else if (id === 'sign') {
      setActiveSubModal('sign');
    } else if (id === 'history') {
      onClose();
      setActiveTab('history');
    }
  };

  const handleSignMessage = () => {
    const raw = `${currentUser?.id || 'usr'}_${signMessageText}_${Date.now()}`;
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += Math.floor(Math.random() * 16).toString(16);
    }
    setGeneratedSignature(hash + '1b');
  };

  const handleRevokeApproval = (contractId: string) => {
    setRevokedContracts((prev) => [...prev, contractId]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm select-none">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up SafePal Bottom Sheet */}
      <div className="relative z-10 w-full max-w-md bg-[#161922] rounded-t-[32px] border-t border-white/[0.08] shadow-2xl overflow-hidden pb-8 animate-slideUp">
        {/* Top Drag Handle Indicator */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-2" />

        {/* Action Items List (Exact match to screenshot photo_2026-10-26_02-55-55_b0429092.jpg) */}
        <div className="divide-y divide-white/[0.04] px-2 py-1">
          {/* 1. Index */}
          <button
            onClick={() => handleItemClick('index')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors rounded-2xl group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-[#20232E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[16px] font-medium text-white">Index</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors" />
          </button>

          {/* 2. SFPlus */}
          <button
            onClick={() => handleItemClick('sfplus')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors rounded-2xl group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-[#20232E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <div className="relative flex items-center justify-center">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
              </div>
              <span className="text-[16px] font-medium text-white">SFPlus</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors" />
          </button>

          {/* 3. DeFi */}
          <button
            onClick={() => handleItemClick('defi')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors rounded-2xl group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-[#20232E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-[16px] font-medium text-white">DeFi</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors" />
          </button>

          {/* 4. Approval Manager */}
          <button
            onClick={() => handleItemClick('approval')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors rounded-2xl group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-[#20232E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <UserCheck className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[16px] font-medium text-white">Approval Manager</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors" />
          </button>

          {/* 5. SafePal Store */}
          <button
            onClick={() => handleItemClick('store')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors rounded-2xl group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-[#20232E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[16px] font-medium text-white">SafePal Store</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors" />
          </button>

          {/* 6. Sign Message */}
          <button
            onClick={() => handleItemClick('sign')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors rounded-2xl group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-[#20232E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Edit3 className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[16px] font-medium text-white">Sign Message</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors" />
          </button>

          {/* 7. Payment History */}
          <button
            onClick={() => handleItemClick('history')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors rounded-2xl group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full bg-[#20232E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <History className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[16px] font-medium text-white">Payment History</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* ================= SUB-MODAL: INDEX ================= */}
      {activeSubModal === 'index' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#161922] rounded-3xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#00D084]" />
                <h3 className="text-base font-bold text-white">Market Indices</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'SafePal Top 10 Index', symbol: 'SP10', change: '+3.42%', val: '$2,841.10' },
                { name: 'DeFi Blue Chip Index', symbol: 'DEFI', change: '+5.18%', val: '$1,120.40' },
                { name: 'Layer 1 Ecosystem Index', symbol: 'L1', change: '-0.85%', val: '$945.20' },
                { name: 'Real World Assets (RWA)', symbol: 'RWA', change: '+7.60%', val: '$480.90' },
              ].map((idx) => (
                <div key={idx.symbol} className="flex items-center justify-between p-3 rounded-2xl bg-[#1C1F2B] border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">{idx.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{idx.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{idx.val}</p>
                    <p className={`text-xs font-semibold ${idx.change.startsWith('+') ? 'text-[#00D084]' : 'text-rose-400'}`}>
                      {idx.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: SFPLUS ================= */}
      {activeSubModal === 'sfplus' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#161922] rounded-3xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#38B6FF]" />
                <h3 className="text-base font-bold text-white">SFPlus VIP Club</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#3862FB]/20 to-[#00D084]/20 border border-[#3862FB]/30">
                <span className="text-xs font-bold text-[#00D084] uppercase tracking-wider">Active Status</span>
                <h4 className="text-lg font-black text-white mt-1">Tier 1: SafePal Pioneer</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Enjoy zero swap gateway fees, high-yield staking pools, and priority cross-chain bridge routes.
                </p>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00D084]" />
                  <span>50% Discount on DEX Gas Aggregation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00D084]" />
                  <span>Exclusive Early Access to Verified Token Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00D084]" />
                  <span>Hardware Vault Anti-Tamper Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: APPROVAL MANAGER ================= */}
      {activeSubModal === 'approval' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#161922] rounded-3xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#00D084]" />
                <h3 className="text-base font-bold text-white">Approval Manager</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Scan and revoke unlimited smart contract allowances to protect your funds from exploits.
            </p>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {[
                { id: 'app_1', name: 'Uniswap V3 Router', token: 'USDT (TRC20)', allowance: 'Unlimited' },
                { id: 'app_2', name: 'PancakeSwap Router', token: 'BNB (BEP20)', allowance: 'Unlimited' },
                { id: 'app_3', name: 'SunPump DEX', token: 'TRX (TRON)', allowance: '50,000 TRX' },
              ].map((item) => {
                const isRevoked = revokedContracts.includes(item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#1C1F2B] border border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="text-[11px] text-slate-400">{item.token} • <span className="text-slate-300 font-mono">{item.allowance}</span></p>
                    </div>
                    <button
                      onClick={() => handleRevokeApproval(item.id)}
                      disabled={isRevoked}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isRevoked
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                      }`}
                    >
                      {isRevoked ? 'Revoked' : 'Revoke'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: SAFEPAL STORE ================= */}
      {activeSubModal === 'store' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#161922] rounded-3xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#38B6FF]" />
                <h3 className="text-base font-bold text-white">SafePal Official Store</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'SafePal S1 Pro Hardware Wallet', price: '$89.99', desc: 'Aluminum body, 100% air-gapped QR communication, CC EAL5+ chip' },
                { name: 'SafePal Cypher Seed Board', price: '$44.99', desc: 'Indestructible 304 Stainless Steel, fireproof, waterproof, 12/24 seed words' },
                { name: 'SafePal X1 Open-Source Bluetooth', price: '$69.99', desc: 'Ultra-slim, Bluetooth 5.0, EAL5+ military security grade' },
              ].map((prod) => (
                <div key={prod.name} className="p-3 rounded-2xl bg-[#1C1F2B] border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{prod.name}</span>
                    <span className="text-xs font-black text-[#00D084]">{prod.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{prod.desc}</p>
                </div>
              ))}
              <a
                href="https://www.safepal.com/store"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#3862FB] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#2F54DB] transition-colors"
              >
                <span>Visit Store Web</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: SIGN MESSAGE ================= */}
      {activeSubModal === 'sign' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#161922] rounded-3xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-[#00D084]" />
                <h3 className="text-base font-bold text-white">Sign Message</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Message to Sign:</label>
                <textarea
                  value={signMessageText}
                  onChange={(e) => setSignMessageText(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-[#1C1F28] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#00D084]"
                />
              </div>

              <button
                onClick={handleSignMessage}
                className="w-full py-2.5 rounded-xl bg-[#00D084] text-black font-bold text-xs hover:bg-[#00B875] transition-colors"
              >
                Sign with SafePal Key
              </button>

              {generatedSignature && (
                <div className="p-3 rounded-xl bg-[#1C1F28] border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Signature Hash (EIP-191):</span>
                  <p className="text-[11px] font-mono text-[#00D084] break-all">{generatedSignature}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
