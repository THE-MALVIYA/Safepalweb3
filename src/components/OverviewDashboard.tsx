import React, { useState, useRef } from 'react';
import { useWallet } from '../context/WalletContext';
import { CryptoAsset } from '../types';
import { CryptoIcon } from './CryptoIcon';
import { TokenDetailModal } from './TokenDetailModal';
import { TokenSearchModal } from './TokenSearchModal';
import { WalletManageModal } from './WalletManageModal';
import { BuyCryptoModal } from './BuyCryptoModal';
import { GasStationModal } from './GasStationModal';
import { SafePalMoreActionSheet } from './SafePalMoreActionSheet';
import {
  Bell,
  Scan,
  Copy,
  Check,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Fuel,
  MoreVertical,
  Search,
  Eye,
  EyeOff,
  History,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  X,
  Settings,
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    currentUser,
    assets,
    watchlist,
    formatFiat,
    setActiveTab,
    setIsSendModalOpen,
    setIsReceiveModalOpen,
    setSelectedAssetForModal,
    setIsWeb3ModalOpen,
    setIsAuthModalOpen,
    setIsNotificationDrawerOpen,
    setIsCameraScannerOpen,
    isMoreMenuOpen,
    setIsMoreMenuOpen,
    refreshPrices,
    syncWithServer,
    isPriceLoading,
  } = useWallet();

  const [selectedCoinForDetail, setSelectedCoinForDetail] = useState<CryptoAsset | null>(null);
  const [isTokenSearchOpen, setIsTokenSearchOpen] = useState(false);
  const [isWalletManageOpen, setIsWalletManageOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isGasStationOpen, setIsGasStationOpen] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState<'Coin' | 'Earn' | 'NFT'>('Coin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Pull-to-refresh state matching user uploaded screenshot
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartYRef = useRef<number | null>(null);
  const isPullingRef = useRef(false);

  const isUpdating = isPullRefreshing;

  const triggerFullRefresh = async () => {
    if (isPullRefreshing) return;
    setIsPullRefreshing(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }
    const minDelay = new Promise((resolve) => setTimeout(resolve, 800));
    try {
      await Promise.all([refreshPrices(true), syncWithServer(), minDelay]);
    } catch (err) {
      console.warn('Refresh notice:', err);
    } finally {
      setIsPullRefreshing(false);
      setPullDistance(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.scrollY <= 10) {
      touchStartYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || touchStartYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartYRef.current;
    if (diff > 0 && typeof window !== 'undefined' && window.scrollY <= 10) {
      const resistance = Math.min(diff * 0.4, 65);
      setPullDistance(resistance);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 32 && !isUpdating) {
      triggerFullRefresh();
    } else {
      setPullDistance(0);
    }
    touchStartYRef.current = null;
    isPullingRef.current = false;
  };

  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(() => {
    return localStorage.getItem('safepal_hide_balance') === 'true';
  });

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => {
      const next = !prev;
      localStorage.setItem('safepal_hide_balance', String(next));
      return next;
    });
  };

  const handleCopyWalletAddress = () => {
    const addr = currentUser?.customCoinAddresses?.['DEFAULT'] || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // SafePal Display Names matching screenshot (e.g., BNB (BEP20), BTC (Bitcoin), ETH (ERC20), ETH (Arbitrum), ETH (Base))
  const getSafePalTokenMeta = (asset: CryptoAsset) => {
    let displayName = asset.name;
    let networkTag = asset.network;

    if (asset.symbol === 'BNB') {
      displayName = 'BNB (BEP20)';
      networkTag = 'BEP20';
    } else if (asset.symbol === 'BTC') {
      displayName = 'BTC (Bitcoin)';
      networkTag = 'BTC';
    } else if (asset.symbol === 'ETH') {
      displayName = 'ETH (ERC20)';
      networkTag = 'ERC20';
    } else if (asset.symbol === 'USDT') {
      displayName = 'USDT (TRC20)';
      networkTag = 'TRC20';
    } else if (asset.symbol === 'TRX') {
      displayName = 'TRX';
      networkTag = 'TRON';
    } else if (asset.symbol === 'GAS_TRX') {
      displayName = 'GAS (Gas fee TRX)';
      networkTag = 'TRON';
    } else if (asset.symbol === 'SOL') {
      displayName = 'SOL (Solana)';
      networkTag = 'SOL';
    } else if (asset.symbol === 'NEAR') {
      displayName = 'NEAR (NEAR)';
      networkTag = 'NEAR';
    } else if (asset.symbol === 'POL' || asset.symbol === 'MATIC') {
      displayName = 'POL (Polygon)';
      networkTag = 'POL';
    } else if (asset.symbol === 'DOGE') {
      displayName = 'DOGE (Dogecoin)';
      networkTag = 'DOGE';
    } else if (asset.symbol === 'ADA') {
      displayName = 'ADA (Cardano)';
      networkTag = 'ADA';
    } else if (asset.symbol === 'AVAX') {
      displayName = 'AVAX (Avalanche)';
      networkTag = 'AVAX';
    } else if (asset.symbol === 'XRP') {
      displayName = 'XRP (Ripple)';
      networkTag = 'XRP';
    }

    return { displayName, networkTag };
  };

  // Computed total USD balance
  let computedTotalUsd = 0;
  assets.forEach((asset) => {
    const userAmount = currentUser?.balances?.[asset.symbol] || 0;
    computedTotalUsd += userAmount * asset.priceUsd;
  });

  // Calculate equivalent in BTC
  const btcAsset = assets.find((a) => a.symbol === 'BTC');
  const btcPrice = btcAsset?.priceUsd || 82978;
  const computedBtcEquivalent = computedTotalUsd > 0 ? computedTotalUsd / btcPrice : 0;

  // Custom priority order matching SafePal screenshot:
  // 1. BNB (BEP20)
  // 2. BTC (Bitcoin)
  // 3. ETH (ERC20)
  // 4. ETH (Arbitrum)
  // 5. ETH (Base)
  // 6. USDT (TRC20)
  // 7. TRX (TRON)
  // 8. GAS (Gas fee TRX)
  // 9. SOL (Solana)
  // 10. NEAR (NEAR)
  // 11. DOGE, ADA, AVAX, POL, XRP
  // Custom priority order matching SafePal screenshot (photo_2026-11-11_03-03-32_2514e884.jpg):
  // 1. USDT (TRC20)
  // 2. TRX
  // 3. BNB (BEP20)
  // 4. BTC (Bitcoin)
  // 5. ETH (ERC20)
  const prioritySymbols = [
    'USDT',
    'TRX',
    'BNB',
    'BTC',
    'ETH',
    'GAS_TRX',
    'SOL',
    'NEAR',
    'POL',
    'DOGE',
    'ADA',
    'AVAX',
    'XRP',
  ];

  // Filter by query and network, removing Arbitrum & Base as requested by user
  const filteredTokens = assets
    .filter((asset) => {
      // Exclude Arbitrum and Base tokens as per user request
      const lowerId = asset.id.toLowerCase();
      const lowerName = asset.name.toLowerCase();
      if (
        lowerId.includes('arbitrum') ||
        lowerId.includes('base') ||
        lowerName.includes('arbitrum') ||
        lowerName.includes('(base)')
      ) {
        return false;
      }

      const { displayName, networkTag } = getSafePalTokenMeta(asset);
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        displayName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesNetwork =
        selectedNetworkFilter === 'All'
          ? true
          : (networkTag || '').toLowerCase().includes(selectedNetworkFilter.toLowerCase()) ||
            (asset.network || '').toLowerCase().includes(selectedNetworkFilter.toLowerCase());

      // Respect watchlist toggle switch - if disabled/unselected, remove coin from main wallet screen
      const symUpper = (asset.symbol || '').toUpperCase().trim();
      const isTokenEnabled =
        watchlist.includes(symUpper) ||
        watchlist.includes(asset.symbol) ||
        watchlist.includes(asset.id);

      if (!isTokenEnabled) {
        return false;
      }

      return matchesSearch && matchesNetwork;
    })
    .sort((a, b) => {
      const aBalUsd = (currentUser?.balances?.[a.symbol] || 0) * a.priceUsd;
      const bBalUsd = (currentUser?.balances?.[b.symbol] || 0) * b.priceUsd;

      // 1. Both have positive balance -> coin with higher balance is at top
      if (aBalUsd > 0 && bBalUsd > 0) {
        return bBalUsd - aBalUsd;
      }
      // 2. Positive balance tokens always show before 0-balance tokens
      if (aBalUsd > 0 && bBalUsd <= 0) return -1;
      if (bBalUsd > 0 && aBalUsd <= 0) return 1;

      const aIdx = prioritySymbols.indexOf(a.symbol);
      const bIdx = prioritySymbols.indexOf(b.symbol);

      if (aIdx !== -1 && bIdx !== -1) {
        return aIdx - bIdx;
      }
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });

  const handleAction = (action: 'send' | 'receive' | 'buy' | 'gas' | 'more') => {
    if (!currentUser && action !== 'receive' && action !== 'gas' && action !== 'more') {
      setIsAuthModalOpen(true);
      return;
    }
    if (action === 'send') {
      setIsSendModalOpen(true);
    } else if (action === 'receive') {
      setIsReceiveModalOpen(true);
    } else if (action === 'buy') {
      setIsBuyModalOpen(true);
    } else if (action === 'gas') {
      setIsGasStationOpen(true);
    } else if (action === 'more') {
      setIsMoreMenuOpen(true);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0A0A0D] text-white pb-24 pt-2 select-none font-sans"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto max-w-md px-4 sm:px-5">
        {/* ================= 1. SAFE PAL TOP APP BAR ================= */}
        {/* Left: [ Hexagon Settings ⚙ ] [ Bell 🔔 ], Center: [ Wallet01-H1W ▾ ❐ ], Right: [ Scan ⛶ ] */}
        <div className="flex items-center justify-between py-2">
          {/* Left: Hexagon Settings & Notification Bell */}
          <div className="flex items-center gap-3">
            {/* Settings / Hardware Hexagon Icon (Exact SafePal Screenshot 1) */}
            <button
              onClick={() => setActiveTab('settings')}
              className="text-white hover:text-slate-300 transition-colors p-1"
              title="Settings"
              id="safepal-settings-btn"
            >
              <svg
                className="h-6 w-6 stroke-[1.9]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2.5 21 7.5 21 16.5 12 21.5 3 16.5 3 7.5" />
                <circle cx="12" cy="12" r="3.2" />
              </svg>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="text-white hover:text-slate-300 transition-colors p-1 relative"
              title="Notifications"
              id="safepal-bell-btn"
            >
              <Bell className="h-6 w-6 stroke-[1.8]" />
            </button>
          </div>

          {/* Center: Wallet Name Dropdown + Copy Icon */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsWalletManageOpen(true);
              }}
              className="flex items-center gap-1.5 text-white hover:text-slate-200 transition-colors"
              id="safepal-wallet-selector"
            >
              <span className="text-[17px] font-bold tracking-tight">
                {currentUser?.name || 'Wallet01-H1W'}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400 stroke-[2.5]" />
            </button>

            {/* Copy Address Button */}
            <button
              onClick={handleCopyWalletAddress}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
              title="Copy Wallet Address"
              id="safepal-copy-address-btn"
            >
              {copiedAddress ? (
                <Check className="h-4 w-4 text-[#00D084]" />
              ) : (
                <svg
                  className="h-4 w-4"
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
            </button>
          </div>

          {/* Right: Scan / QR Code Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsCameraScannerOpen(true)}
              className="text-white hover:text-slate-300 transition-colors p-1"
              title="Scan QR Code via Camera"
              id="safepal-scan-btn"
            >
              <svg
                className="h-6 w-6 stroke-[2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              </svg>
            </button>
          </div>
        </div>

        {/* ================= 2. THREE TABS: Coin | Earn | NFT ================= */}
        <div className="flex items-center justify-around mt-3 border-b border-white/[0.06]">
          <button
            onClick={() => {
              if (activeTopTab === 'Coin') {
                triggerFullRefresh();
              } else {
                setActiveTopTab('Coin');
              }
            }}
            className={`flex-1 text-center pb-2.5 transition-all cursor-pointer relative ${
              activeTopTab === 'Coin'
                ? 'text-white font-bold text-[17px]'
                : 'text-[#7C7D86] font-medium text-[17px] hover:text-white'
            }`}
          >
            <span>Coin</span>
            {activeTopTab === 'Coin' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4353FA] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTopTab('Earn');
              setActiveTab('staking');
            }}
            className={`flex-1 text-center pb-2.5 transition-all cursor-pointer relative ${
              activeTopTab === 'Earn'
                ? 'text-white font-bold text-[17px]'
                : 'text-[#7C7D86] font-medium text-[17px] hover:text-white'
            }`}
          >
            <span>Earn</span>
            {activeTopTab === 'Earn' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4353FA] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTopTab('NFT');
              setActiveTab('nft');
            }}
            className={`flex-1 text-center pb-2.5 transition-all cursor-pointer relative ${
              activeTopTab === 'NFT'
                ? 'text-white font-bold text-[17px]'
                : 'text-[#7C7D86] font-medium text-[17px] hover:text-white'
            }`}
          >
            <span>NFT</span>
            {activeTopTab === 'NFT' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4353FA] rounded-full" />
            )}
          </button>
        </div>

        {/* ================= REFRESH / UPDATING INDICATOR ================= */}
        {/* Exact match to user uploaded screenshot: photo_2026-11-11_03-03-32_2514e884.jpg */}
        {/* Placed right below tabs and right above Balance */}
        <div
          onClick={triggerFullRefresh}
          className={`w-full flex items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer select-none ${
            isUpdating || pullDistance > 0
              ? 'py-3 opacity-100 max-h-16'
              : 'max-h-0 py-0 opacity-0 pointer-events-none'
          }`}
          title="Click to refresh balances and prices"
        >
          <div className="flex items-center justify-center gap-2.5 text-[#8E92A4]">
            {/* Spinning Arc / Ring Spinner matching screenshot */}
            <svg
              className={`h-5 w-5 text-[#8E92A4] ${isUpdating ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: !isUpdating && pullDistance > 0 ? `rotate(${pullDistance * 6}deg)` : undefined,
              }}
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-[14px] font-normal tracking-wide text-[#8E92A4]">Updating...</span>
          </div>
        </div>

        {/* ================= 3. BALANCE SECTION ================= */}
        {/* Exact match to user uploaded screenshot: photo_2026-11-11_03-03-32_2514e884.jpg */}
        <div className="text-center py-4 flex flex-col items-center justify-center">
          {/* Top: "Balance" label with Eye Toggle */}
          <div
            onClick={toggleBalanceVisibility}
            className="flex items-center justify-center gap-1.5 cursor-pointer text-[#8E92A4] hover:text-white transition-colors"
          >
            <span className="text-[15px] font-normal tracking-normal text-[#8E92A4]">Balance</span>
            {isBalanceHidden ? (
              <EyeOff className="h-4 w-4 stroke-[1.8] text-[#5B67F6]" />
            ) : (
              <Eye className="h-4 w-4 stroke-[1.8] text-[#8E92A4]" />
            )}
          </div>

          {/* Middle: Clean "$0" or converted fiat - Natural sleek normal weight matching SafePal screenshot */}
          <div
            onClick={toggleBalanceVisibility}
            className="text-[32px] sm:text-[34px] font-normal text-white tracking-tight leading-tight my-1 cursor-pointer select-none font-sans"
          >
            {isBalanceHidden
              ? '••••'
              : computedTotalUsd === 0
              ? formatFiat(0)
              : formatFiat(computedTotalUsd)}
          </div>

          {/* Bottom: "0 BTC" */}
          <div className="text-[13px] font-normal text-[#8E92A4] mt-0.5 font-mono">
            {isBalanceHidden
              ? '•••• BTC'
              : computedTotalUsd <= 0
              ? '0 BTC'
              : `${computedBtcEquivalent.toFixed(7)} BTC`}
          </div>

          {/* Today Gain/Loss: Only show when user has actual balance (Clean fresh wallet on 0 balance) */}
          {computedTotalUsd > 0 && !isBalanceHidden && (
            <div className="flex items-center justify-center gap-1.5 text-[12.5px] font-medium mt-1 select-none">
              <span className="text-[#8E92A4]">Today</span>
              <span className="text-[#00D084] font-medium font-mono">+$0</span>
              <span className="text-[#00D084] font-medium font-mono flex items-center gap-0.5">
                <span>▲</span>11.9%
              </span>
            </div>
          )}
        </div>

        {/* ================= 4. FIVE CIRCULAR ACTION BUTTONS ================= */}
        {/* [ ↑ Send ] [ ↓ Receive ] [ 💳 Buy ] [ ⛽ Gas Station ] [ ⫶ More ] */}
        <div className="flex items-center justify-between px-1 my-3">
          {/* 1. Send */}
          <button
            onClick={() => handleAction('send')}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
            id="safepal-btn-send"
          >
            <div className="w-12 h-12 rounded-full bg-[#181A22] hover:bg-[#222530] border border-white/[0.07] text-white flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm">
              <ArrowUp className="h-5 w-5 stroke-[2]" />
            </div>
            <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
              Send
            </span>
          </button>

          {/* 2. Receive */}
          <button
            onClick={() => handleAction('receive')}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
            id="safepal-btn-receive"
          >
            <div className="w-12 h-12 rounded-full bg-[#181A22] hover:bg-[#222530] border border-white/[0.07] text-white flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm">
              <ArrowDown className="h-5 w-5 stroke-[2]" />
            </div>
            <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
              Receive
            </span>
          </button>

          {/* 3. Buy */}
          <button
            onClick={() => handleAction('buy')}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
            id="safepal-btn-buy"
          >
            <div className="w-12 h-12 rounded-full bg-[#181A22] hover:bg-[#222530] border border-white/[0.07] text-white flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm">
              <CreditCard className="h-5 w-5 stroke-[1.8]" />
            </div>
            <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
              Buy
            </span>
          </button>

          {/* 4. Gas Station */}
          <button
            onClick={() => handleAction('gas')}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
            id="safepal-btn-gas"
          >
            <div className="w-12 h-12 rounded-full bg-[#181A22] hover:bg-[#222530] border border-white/[0.07] text-white flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm">
              <Fuel className="h-5 w-5 stroke-[1.8]" />
            </div>
            <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
              Gas Station
            </span>
          </button>

          {/* 5. More */}
          <button
            onClick={() => handleAction('more')}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
            id="safepal-btn-more"
          >
            <div className="w-12 h-12 rounded-full bg-[#181A22] hover:bg-[#222530] border border-white/[0.07] text-white flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm">
              <MoreVertical className="h-5 w-5 stroke-[1.8]" />
            </div>
            <span className="text-[12px] font-normal text-[#8E92A4] group-hover:text-white mt-1.5 transition-colors">
              More
            </span>
          </button>
        </div>

        {/* ================= 5. SEARCH & FILTER ROW ================= */}
        {/* [ 🔍 Search ]  [ All ▾ ]  [ ⫶ ] */}
        <div className="flex items-center gap-2 my-4 relative">
          {/* Search Input Box */}
          <div className="flex-1 bg-[#14151B] border border-white/[0.06] rounded-xl px-3.5 py-2.5 flex items-center gap-2 shadow-inner">
            <Search className="h-4 w-4 text-[#60616C] shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[14px] text-white placeholder-[#60616C] focus:outline-none w-full font-normal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#60616C] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Network Filter Pill: All ▾ */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
              className="bg-[#14151B] border border-white/[0.06] hover:bg-[#1C1E26] text-white text-[13px] font-medium px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>{selectedNetworkFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-12 z-30 w-36 rounded-xl bg-[#1C1D24] border border-white/10 p-1.5 shadow-2xl">
                {['All', 'BEP20', 'BTC', 'ERC20', 'Arbitrum', 'Base', 'TRON', 'SOL'].map((net) => (
                  <button
                    key={net}
                    onClick={() => {
                      setSelectedNetworkFilter(net);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                      selectedNetworkFilter === net
                        ? 'bg-[#4353FA] text-white font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {net === 'All' ? 'All Networks' : net}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3 Dots Menu Button for Token Management */}
          <button
            onClick={() => setIsTokenSearchOpen(true)}
            className="bg-[#14151B] border border-white/[0.06] hover:bg-[#1C1E26] text-[#8F909A] hover:text-white h-10 w-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            title="Manage Tokens"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* ================= 6. COIN CARDS LIST (Exact SafePal Layout) ================= */}
        <div className="space-y-2 mt-2">
          {filteredTokens.map((asset) => {
            const { displayName } = getSafePalTokenMeta(asset);
            const userBal = currentUser?.balances?.[asset.symbol] || 0;
            const usdVal = userBal * asset.priceUsd;
            const isNegative = asset.change24h < 0;

            // Formatted price using selected fiat
            const formattedPrice = formatFiat(asset.priceUsd);

            // Percentage change in red or green
            const changeStr = `${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toFixed(2)}%`;

            return (
              <div
                key={asset.id}
                onClick={() => setSelectedCoinForDetail(asset)}
                className="bg-[#14151B] hover:bg-[#1A1C23] rounded-2xl p-4 flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-[0.99] border border-white/[0.04] hover:border-white/[0.08] shadow-sm"
                id={`safepal-coin-${asset.id}`}
              >
                {/* Left: Coin Icon + Coin Name & Price */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-11 w-11 shrink-0 flex items-center justify-center relative">
                    <CryptoIcon
                      symbol={asset.symbol}
                      name={asset.name}
                      network={asset.network}
                      size="md"
                      showBadge={true}
                    />
                  </div>

                  <div className="min-w-0">
                    {/* Coin Name with Network: e.g. BNB (BEP20), BTC (Bitcoin), ETH (ERC20) - Normal font matching SafePal */}
                    <div className="text-[15px] font-normal text-white truncate">
                      {displayName}
                    </div>

                    {/* Unit Price and 24h Change % */}
                    <div className="flex items-center gap-1.5 text-[13px] mt-0.5">
                      <span className="text-[#8E92A4] font-normal">{formattedPrice}</span>
                      {asset.symbol !== 'USDT' && Math.abs(asset.change24h) >= 0.01 && (
                        <span
                          className={`font-mono font-normal ${
                            isNegative ? 'text-[#FF5252]' : 'text-[#00D084]'
                          }`}
                        >
                          {changeStr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Holding Balance Quantity (Top) & USD Value (Bottom) - Normal font matching SafePal */}
                <div className="text-right shrink-0">
                  {/* Balance Quantity: Normal sleek font */}
                  <div className="text-[16px] font-normal text-white font-mono tracking-tight">
                    {isBalanceHidden
                      ? '••••'
                      : userBal === 0
                      ? '0'
                      : userBal < 0.001
                      ? userBal.toFixed(6)
                      : userBal.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </div>

                  {/* USD / Fiat Value */}
                  <div className="text-[13px] text-[#7C7D86] font-normal mt-0.5">
                    {isBalanceHidden
                      ? '••••'
                      : usdVal === 0
                      ? formatFiat(0)
                      : formatFiat(usdVal)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add / Manage Crypto Link at Bottom */}
        <div className="pt-6 pb-6 text-center">
          <button
            onClick={() => setIsTokenSearchOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181C] hover:bg-[#202026] text-xs font-semibold text-[#8F909A] hover:text-white transition-all cursor-pointer"
          >
            <span>+ Add / Manage Tokens</span>
          </button>
        </div>
      </div>

      {/* ================= EXACT SAFEPAL MORE BOTTOM SHEET (PHOTO 2) ================= */}
      <SafePalMoreActionSheet
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
      />

      {/* ================= MODALS & BOTTOM SHEETS ================= */}
      <TokenDetailModal
        asset={selectedCoinForDetail}
        isOpen={!!selectedCoinForDetail}
        onClose={() => setSelectedCoinForDetail(null)}
      />

      <TokenSearchModal
        isOpen={isTokenSearchOpen}
        onClose={() => setIsTokenSearchOpen(false)}
        onSelectToken={(t) => setSelectedCoinForDetail(t)}
      />

      <WalletManageModal
        isOpen={isWalletManageOpen}
        onClose={() => setIsWalletManageOpen(false)}
      />

      <BuyCryptoModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

      <GasStationModal
        isOpen={isGasStationOpen}
        onClose={() => setIsGasStationOpen(false)}
      />
    </div>
  );
};
