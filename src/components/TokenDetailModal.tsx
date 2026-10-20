import React, { useState } from 'react';
import { useWallet, getUserReceiveAddress } from '../context/WalletContext';
import { CryptoAsset } from '../types';
import { CryptoIcon } from './CryptoIcon';
import {
  ChevronLeft,
  Copy,
  Check,
  Fuel,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Box,
  FileSearch,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Repeat,
  ExternalLink,
  CandlestickChart,
  MoreVertical,
  X,
  Smartphone,
} from 'lucide-react';

interface TokenDetailModalProps {
  asset: CryptoAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TokenDetailModal: React.FC<TokenDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    depositAddresses,
    setIsSendModalOpen,
    setIsReceiveModalOpen,
    setSelectedAssetForModal,
    setActiveTab,
    transactions,
  } = useWallet();

  const [activeTabName, setActiveTabName] = useState<'Transactions' | 'News'>('Transactions');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Receive' | 'Send' | 'Unconfirmed'>('All');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [detectionModalOpen, setDetectionModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  if (!isOpen || !asset) return null;

  const userBalance = currentUser?.balances?.[asset.symbol] || 0;
  const usdValue = userBalance * asset.priceUsd;

  // Real deposit address for current asset
  const rawAddress =
    asset.symbol === 'GAS_TRX' || asset.symbol === 'TRX' || asset.symbol === 'USDT'
      ? (currentUser ? getUserReceiveAddress(currentUser, 'USDT', 'TRC-20') : 'TUXcgkv3j4gSS67Wv5xHvFiBGyJzEtXrLp')
      : (currentUser?.customCoinAddresses?.[asset.symbol] ||
         depositAddresses[asset.symbol] ||
         depositAddresses.DEFAULT ||
         '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');

  const truncatedAddress =
    rawAddress.length > 12
      ? `${rawAddress.slice(0, 4)}...${rawAddress.slice(-4)}`
      : rawAddress;

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(rawAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleOpenSend = () => {
    setSelectedAssetForModal(asset);
    setIsSendModalOpen(true);
  };

  const handleOpenReceive = () => {
    setSelectedAssetForModal(asset);
    setIsReceiveModalOpen(true);
  };

  // Filter token transactions
  const tokenTransactions = transactions.filter((tx) => {
    const symMatch =
      tx.symbol?.toUpperCase() === asset.symbol.toUpperCase() ||
      (asset.symbol === 'USDT' && (tx.symbol?.includes('USDT') || tx.recipient?.startsWith('T')));
    if (!symMatch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Receive') return tx.type === 'receive' || tx.type === 'deposit';
    if (activeFilter === 'Send') return tx.type === 'send' || tx.type === 'withdraw';
    if (activeFilter === 'Unconfirmed') return tx.status === 'pending';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 select-none font-sans">
      <div className="w-full h-full sm:h-[92vh] sm:max-w-md bg-[#0C0E14] sm:rounded-3xl border border-white/[0.08] flex flex-col overflow-hidden text-white shadow-2xl relative">
        
        {/* ================= 1. HEADER (Exact SafePal Screenshot 2) ================= */}
        {/* [ < ]  [ USDT ]  [ 🎚️ ⋮ ] */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
          {/* Back button */}
          <button
            onClick={onClose}
            className="p-1 text-white hover:text-slate-300 transition-colors cursor-pointer"
            title="Back"
            id="safepal-token-detail-back"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>

          {/* Center Token Symbol */}
          <h2 className="text-[17px] font-bold text-white tracking-tight">
            {asset.symbol}
          </h2>

          {/* Right: Candlestick chart + 3 dots */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                setActiveTab('markets');
              }}
              className="text-white hover:text-slate-300 transition-colors p-1"
              title="Market Chart"
            >
              <CandlestickChart className="h-5 w-5 stroke-[1.8]" />
            </button>
            <button
              onClick={() => {}}
              className="text-white hover:text-slate-300 transition-colors p-1"
              title="More"
            >
              <MoreVertical className="h-5 w-5 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-4">
          
          {/* ================= 2. WALLET BADGE PILL ================= */}
          {/* 📱 Wallet01-H1W  TUXc...XrLp ❐ */}
          <div className="flex items-center justify-start">
            <div
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181B24] border border-white/[0.04] text-[12px] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-white">{currentUser?.name || 'Wallet01-H1W'}</span>
              </div>
              <span className="text-[#8E92A4] font-mono">{truncatedAddress}</span>
              {copiedAddress ? (
                <Check className="h-3.5 w-3.5 text-[#00D084]" />
              ) : (
                <svg
                  className="h-3.5 w-3.5 text-[#8E92A4]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </div>
          </div>

          {/* ================= 3. TOKEN BALANCE BANNER ================= */}
          {/* Cyan Tether diamond logo with red TRON badge + Large 0 + $0 | $0.9992 0.0% */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-14 w-14 shrink-0 flex items-center justify-center relative">
              <CryptoIcon
                symbol={asset.symbol}
                name={asset.name}
                network={asset.network}
                size="xl"
                showBadge={true}
              />
            </div>
            <div>
              <div className="text-[34px] font-bold text-white leading-none font-mono tracking-tight">
                {userBalance === 0 ? '0' : userBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[#8E92A4] mt-1.5 font-mono">
                <span>${usdValue.toFixed(2)}</span>
                <span>|</span>
                <span>${asset.priceUsd >= 1 ? asset.priceUsd.toFixed(4) : asset.priceUsd.toFixed(4)}</span>
                <span
                  className={asset.change24h >= 0 ? 'text-[#00D084]' : 'text-[#FF5252]'}
                >
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* ================= 4. EIGHT QUICK ACTION BUTTONS (2 Rows of 4) ================= */}
          {/* Row 1: [ ↗ Swap ] [ ⛽ Buy Gas ] [ 💳 Buy ] [ 👤 Approval ] */}
          {/* Row 2: [ 🛡️ Detection ] [ 🧊 Explorer ] [ 🦎 CoinGecko ] [ ◈ SoSoValue ] */}
          <div className="space-y-4 py-2">
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Swap */}
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('swap');
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  Swap
                </span>
              </button>

              {/* Buy Gas */}
              <button
                onClick={() => {
                  handleOpenReceive();
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <Fuel className="h-5 w-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  Buy Gas
                </span>
              </button>

              {/* Buy */}
              <button
                onClick={() => {
                  handleOpenReceive();
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <CreditCard className="h-5 w-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  Buy
                </span>
              </button>

              {/* Approval */}
              <button
                onClick={() => setApprovalModalOpen(true)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <svg
                    className="h-5 w-5 stroke-[1.8]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  Approval
                </span>
              </button>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Detection */}
              <button
                onClick={() => setDetectionModalOpen(true)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <ShieldCheck className="h-5 w-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  Detection
                </span>
              </button>

              {/* Explorer */}
              <a
                href={
                  asset.symbol === 'USDT' || asset.network?.includes('TRC')
                    ? 'https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
                    : 'https://etherscan.io'
                }
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <Box className="h-5 w-5 stroke-[1.8]" />
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  Explorer
                </span>
              </a>

              {/* CoinGecko */}
              <a
                href="https://www.coingecko.com/en/coins/tether"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <div className="h-5 w-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                    🦎
                  </div>
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  CoinGecko
                </span>
              </a>

              {/* SoSoValue */}
              <a
                href="https://sosovalue.xyz"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1F2B] hover:bg-[#282C3D] text-white flex items-center justify-center transition-transform active:scale-95">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
                  SoSoValue
                </span>
              </a>
            </div>
          </div>

          {/* ================= 5. TABS: Transactions | News ================= */}
          <div className="flex items-center gap-6 pt-3 border-b border-white/[0.06]">
            <button
              onClick={() => setActiveTabName('Transactions')}
              className={`pb-2.5 transition-all cursor-pointer relative text-[16px] font-semibold ${
                activeTabName === 'Transactions'
                  ? 'text-white'
                  : 'text-[#7C7D86] hover:text-white'
              }`}
            >
              <span>Transactions</span>
              {activeTabName === 'Transactions' && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5B67F6] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTabName('News')}
              className={`pb-2.5 transition-all cursor-pointer relative text-[16px] font-semibold ${
                activeTabName === 'News'
                  ? 'text-white'
                  : 'text-[#7C7D86] hover:text-white'
              }`}
            >
              <span>News</span>
              {activeTabName === 'News' && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5B67F6] rounded-full" />
              )}
            </button>
          </div>

          {/* ================= 6. FILTER PILLS ================= */}
          {/* [ All ] [ Receive ] [ Send ] [ Unconfirmed ]  [ ☷ ] */}
          {activeTabName === 'Transactions' && (
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['All', 'Receive', 'Send', 'Unconfirmed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                      activeFilter === filter
                        ? 'bg-[#5B67F6] text-white font-semibold'
                        : 'bg-[#181B24] text-[#8E92A4] hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Filter sliders icon button */}
              <button className="h-8 w-8 rounded-full bg-[#181B24] text-[#8E92A4] hover:text-white flex items-center justify-center shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ================= 7. TRANSACTIONS LIST OR NO DATA YET ================= */}
          {activeTabName === 'Transactions' && (
            <div className="pt-4">
              {tokenTransactions.length > 0 ? (
                <div className="space-y-2">
                  {tokenTransactions.map((tx, idx) => {
                    const isReceive = tx.type === 'receive' || tx.type === 'deposit';
                    return (
                      <div
                        key={tx.id || idx}
                        className="bg-[#181B24] rounded-2xl p-3.5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center ${
                              isReceive
                                ? 'bg-[#00D084]/15 text-[#00D084]'
                                : 'bg-[#FF5252]/15 text-[#FF5252]'
                            }`}
                          >
                            {isReceive ? (
                              <ArrowDown className="h-4 w-4 stroke-[2.2]" />
                            ) : (
                              <ArrowUp className="h-4 w-4 stroke-[2.2]" />
                            )}
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-white capitalize">
                              {isReceive ? 'Received' : 'Sent'}
                            </div>
                            <div className="text-[11px] text-[#8E92A4] font-mono">
                              {tx.timestamp}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-[14px] font-bold font-mono ${
                              isReceive ? 'text-[#00D084]' : 'text-white'
                            }`}
                          >
                            {isReceive ? '+' : '-'}
                            {typeof tx.amount === 'number'
                              ? tx.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })
                              : tx.amount}{' '}
                            {asset.symbol}
                          </div>
                          <div className="text-[11px] text-[#00D084] font-medium">
                            Completed
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Exact SafePal Screenshot Empty State: Document with magnifying glass + "No data yet." */
                <div className="py-14 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-3">
                    <svg
                      className="w-16 h-16 text-[#2A2E3D]"
                      viewBox="0 0 64 64"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M16 12C16 9.79086 17.7909 8 20 8H38L48 18V52C48 54.2091 46.2091 56 44 56H20C17.7909 56 16 54.2091 16 52V12Z"
                        fill="#1C1F2B"
                        stroke="#2A2E3D"
                      />
                      <path d="M38 8V18H48" stroke="#3A3F52" />
                      <line x1="24" y1="26" x2="36" y2="26" stroke="#3A3F52" strokeLinecap="round" />
                      <line x1="24" y1="34" x2="40" y2="34" stroke="#3A3F52" strokeLinecap="round" />
                      <line x1="24" y1="42" x2="34" y2="42" stroke="#3A3F52" strokeLinecap="round" />
                    </svg>
                    {/* Magnifying Glass Overlay */}
                    <div className="absolute -bottom-1 -right-1 bg-[#1C1F2B] p-1.5 rounded-full border border-[#2A2E3D]">
                      <svg
                        className="w-5 h-5 text-[#8E92A4]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[14px] font-normal text-[#8E92A4]">
                    No data yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* News tab */}
          {activeTabName === 'News' && (
            <div className="space-y-3 pt-2">
              <div className="bg-[#181B24] rounded-2xl p-4 space-y-1.5">
                <span className="text-[11px] font-semibold text-[#5B67F6] uppercase tracking-wider">Market Flash</span>
                <h4 className="text-[14px] font-bold text-white">Tether (USDT) on TRON surpasses $62 Billion in circulation</h4>
                <p className="text-[12px] text-[#8E92A4] leading-relaxed">
                  USDT supply on the TRON network continues to expand, registering record low gas settlement times and highest global stablecoin volume.
                </p>
                <span className="text-[10px] text-slate-500 font-mono">15m ago • SafePal Research</span>
              </div>
            </div>
          )}

        </div>

        {/* ================= 8. FIXED BOTTOM ACTIONS: [ Receive ] [ Send ] ================= */}
        {/* Exact SafePal Screenshot 2 footer layout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0C0E14]/95 backdrop-blur-md border-t border-white/[0.04] grid grid-cols-2 gap-3 z-20">
          {/* Left: Receive (dark button with subtle outline) */}
          <button
            onClick={handleOpenReceive}
            className="w-full py-3.5 rounded-2xl bg-[#181B24] hover:bg-[#202432] text-white font-semibold text-[15px] border border-white/[0.06] transition-all active:scale-[0.98] cursor-pointer"
            id="safepal-token-receive-btn"
          >
            Receive
          </button>

          {/* Right: Send (vibrant periwinkle purple #5B67F6 button) */}
          <button
            onClick={handleOpenSend}
            className="w-full py-3.5 rounded-2xl bg-[#5B67F6] hover:bg-[#4E59E8] text-white font-semibold text-[15px] shadow-lg shadow-[#5B67F6]/25 transition-all active:scale-[0.98] cursor-pointer"
            id="safepal-token-send-btn"
          >
            Send
          </button>
        </div>

        {/* Contract Detection Modal */}
        {detectionModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm bg-[#161922] rounded-3xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#00D084]" />
                  <h3 className="font-bold text-white text-[15px]">Security Detection</h3>
                </div>
                <button
                  onClick={() => setDetectionModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-[#8E92A4]">Contract Verified</span>
                  <span className="text-[#00D084] font-bold">Yes (Official TR7NH...jLj6t)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-[#8E92A4]">Honeypot Risk</span>
                  <span className="text-[#00D084] font-bold">0% (Safe)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-[#8E92A4]">Buy / Sell Tax</span>
                  <span className="text-white font-bold">0% / 0%</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8E92A4]">SafePal Security Score</span>
                  <span className="text-[#00D084] font-bold">100 / 100</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {approvalModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm bg-[#161922] rounded-3xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-[#5B67F6]" />
                  <h3 className="font-bold text-white text-[15px]">Token Approvals</h3>
                </div>
                <button
                  onClick={() => setApprovalModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-[#8E92A4]">
                Manage smart contracts that have permission to spend your {asset.symbol}.
              </p>
              <div className="py-6 text-center text-xs text-[#8E92A4]">
                No risky or active third-party token approvals detected on this wallet.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
