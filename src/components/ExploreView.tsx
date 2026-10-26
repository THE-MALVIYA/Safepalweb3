import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  Search,
  Gift,
  Trash2,
  ChevronRight,
  List,
  Globe,
  Fuel,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  X,
  ExternalLink,
  Shield,
  Compass,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

interface DAppItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  url: string;
  iconBg: string;
  icon: React.ReactNode;
}

export const ExploreView: React.FC = () => {
  const { currentUser, setActiveTab, setIsWeb3ModalOpen } = useWallet();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [launchedDApp, setLaunchedDApp] = useState<{ name: string; url: string } | null>(null);

  // Recently Visited DApps list
  const [recentDApps, setRecentDApps] = useState([
    {
      id: 'rec_1',
      name: 'SafePal Store',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md">
          <ShoppingBag className="h-6 w-6" />
        </div>
      ),
      url: 'https://safepal.com/store',
    },
    {
      id: 'rec_2',
      name: 'Hyperliquid',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-[#1C202A] border border-white/10 flex items-center justify-center text-slate-300 shadow-md">
          <Globe className="h-6 w-6 text-[#38B6FF]" />
        </div>
      ),
      url: 'https://app.hyperliquid.xyz',
    },
    {
      id: 'rec_3',
      name: 'Gas Station',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-[#E83B3B] flex items-center justify-center text-white shadow-md">
          <Fuel className="h-6 w-6" />
        </div>
      ),
      url: 'safepal://gas-station',
    },
    {
      id: 'rec_4',
      name: 'Uniswap V3',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-[#1C202A] border border-white/10 flex items-center justify-center text-slate-300 shadow-md">
          <Globe className="h-6 w-6 text-pink-400" />
        </div>
      ),
      url: 'https://app.uniswap.org',
    },
    {
      id: 'rec_5',
      name: 'Bitcoin Vault',
      icon: (
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
          <span className="font-bold text-lg font-mono">₿</span>
        </div>
      ),
      url: 'https://bitcoin.org',
    },
  ]);

  // Featured DApps
  const featuredDApps = [
    {
      id: 'feat_1',
      name: 'QuestHub',
      label: 'QuestHub',
      icon: (
        <div className="h-13 w-13 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
          <span className="font-black text-sm">⚡</span>
        </div>
      ),
      url: 'https://questhub.safepal.com',
    },
    {
      id: 'feat_2',
      name: 'Travel',
      label: 'Travel',
      icon: (
        <div className="h-13 w-13 rounded-2xl bg-[#4442B0] flex items-center justify-center text-white shadow-lg">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 4v16" />
            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
            <path d="M2 17h20" />
            <path d="M6 8v9" />
          </svg>
        </div>
      ),
      url: 'https://travala.com',
    },
    {
      id: 'feat_3',
      name: 'SafePal Store',
      label: 'SafePal S...',
      icon: (
        <div className="h-13 w-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <ShoppingBag className="h-6 w-6" />
        </div>
      ),
      url: 'https://safepal.com/store',
    },
    {
      id: 'feat_4',
      name: 'SoSo SSI',
      label: 'SoSo SSI ...',
      icon: (
        <div className="h-13 w-13 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-white shadow-lg">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
      ),
      url: 'https://sosovalue.com',
    },
    {
      id: 'feat_5',
      name: 'Approval Manager',
      label: 'Approval ...',
      icon: (
        <div className="h-13 w-13 rounded-2xl bg-white flex items-center justify-center text-black shadow-lg">
          <div className="h-7 w-7 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
            ✓
          </div>
        </div>
      ),
      url: 'safepal://approval-manager',
    },
  ];

  // Perps & Spot List
  const perpsSpotList = [
    {
      id: 'perp_1',
      name: 'SoDEX',
      desc: 'SoDEX — The Next-Gen Onchain Exch...',
      icon: (
        <div className="h-11 w-11 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white shrink-0">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
      ),
      url: 'https://sodex.com',
    },
    {
      id: 'perp_2',
      name: 'Aster',
      desc: 'Top On-Chain Derivatives DEX with up ...',
      icon: (
        <div className="h-11 w-11 rounded-full bg-[#E5B581] flex items-center justify-center text-black shrink-0">
          <div className="w-5 h-5 rounded-full border-2 border-black" />
        </div>
      ),
      url: 'https://asterdex.com',
    },
    {
      id: 'perp_3',
      name: 'PancakeSwap',
      desc: 'AMM DEX',
      icon: (
        <div className="h-11 w-11 rounded-2xl bg-[#71D3D8] flex items-center justify-center text-black shrink-0">
          <span className="text-xl">🐰</span>
        </div>
      ),
      url: 'https://pancakeswap.finance',
    },
    {
      id: 'perp_4',
      name: 'Hyperliquid DEX',
      desc: 'Decentralized perpetuals with low slippage',
      icon: (
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-black font-black shrink-0">
          HL
        </div>
      ),
      url: 'https://app.hyperliquid.xyz',
    },
  ];

  const handleClearRecents = () => {
    setRecentDApps([]);
  };

  const handleLaunchDApp = (name: string, url: string) => {
    setLaunchedDApp({ name, url });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    let url = searchQuery.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    handleLaunchDApp(searchQuery.trim(), url);
  };

  const activeWalletName = currentUser?.name || 'USDT-H1W';

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-white pb-28 pt-2 select-none font-sans">
      <div className="mx-auto max-w-md px-4 sm:px-5 space-y-4">
        
        {/* ================= 1. TOP HEADER (Exact Screenshot photo_2026-10-26_02-56-03_c24e82cb.jpg) ================= */}
        {/* [ ☰ ]  [ USDT-H1W ▾ ]  [ 🎁 ] */}
        <div className="flex items-center justify-between py-2">
          {/* Left: 3 Lines Menu */}
          <button
            onClick={() => setActiveTab('overview')}
            className="p-1 text-white hover:text-slate-300 transition-colors"
            title="Menu"
          >
            <List className="h-6 w-6 stroke-[2.2]" />
          </button>

          {/* Center: Active Wallet Selector */}
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-[17px] font-bold text-white tracking-tight">
              {activeWalletName}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400 stroke-[2.5]" />
          </div>

          {/* Right: Gift Box */}
          <button
            onClick={() => handleLaunchDApp('SafePal Rewards & Airdrops', 'https://airdrop.safepal.com')}
            className="p-1 text-white hover:text-slate-300 transition-colors"
            title="Gift / Rewards"
          >
            <Gift className="h-6 w-6 stroke-[2]" />
          </button>
        </div>

        {/* ================= 2. SEARCH BAR ================= */}
        {/* Q Search DApp or enter a link */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="bg-[#18181C] rounded-2xl px-4 py-3.5 flex items-center gap-2.5 border border-white/[0.04] focus-within:border-[#00D084]/40 transition-colors">
            <Search className="h-4 w-4 text-[#7C7D86] shrink-0" />
            <input
              type="text"
              placeholder="Search DApp or enter a link"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[14px] text-white placeholder-[#7C7D86] focus:outline-none w-full font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* ================= 3. HERO BANNER CAROUSEL ================= */}
        {/* SafePal x Hyperliquid: CEX Grade Perpetuals for Crypto & RWAs */}
        <div
          onClick={() => handleLaunchDApp('Hyperliquid Perpetuals', 'https://app.hyperliquid.xyz')}
          className="relative rounded-3xl overflow-hidden cursor-pointer p-5 bg-gradient-to-r from-[#0C1236] via-[#091F2C] to-[#042828] border border-cyan-500/20 shadow-xl group active:scale-[0.99] transition-transform min-h-[150px] flex flex-col justify-between"
        >
          {/* Subtle teal wave glow */}
          <div className="absolute right-0 top-0 bottom-0 w-44 bg-gradient-to-l from-[#00E599]/30 to-transparent blur-xl pointer-events-none" />
          
          {/* Wave Graphic SVG */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-105 transition-transform pointer-events-none">
            <svg className="w-28 h-20 text-[#00E599]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10 30 C 30 10, 40 50, 60 30 C 80 10, 90 40, 100 30 C 90 20, 80 50, 60 30 C 40 10, 30 50, 10 30 Z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
              <span className="font-bold">SafePal</span>
              <span className="text-cyan-400">❖</span>
              <span>Hyperliquid</span>
            </div>
            <h3 className="text-[20px] font-black text-white leading-tight max-w-[210px] tracking-tight">
              <span className="text-[#00E599]">CEX Grade</span> Perpetuals for Crypto & RWAs
            </h3>
            <p className="text-[11px] font-semibold text-[#00E599] pt-0.5">
              Decentralized Order Book
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 mt-3 relative z-10">
            <span className="h-1.5 w-6 rounded-full bg-[#5B67F6]" />
            <span className="h-1.5 w-3 rounded-full bg-white/30" />
            <span className="h-1.5 w-3 rounded-full bg-white/30" />
          </div>
        </div>

        {/* ================= 4. RECENTLY VISITED ================= */}
        {recentDApps.length > 0 && (
          <div className="bg-[#14161C] rounded-3xl p-4 border border-white/[0.04] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-white tracking-tight">
                Recently Visited
              </span>
              <button
                onClick={handleClearRecents}
                className="text-[#7C7D86] hover:text-white transition-colors p-1"
                title="Clear Recent History"
              >
                <Trash2 className="h-4 w-4 stroke-[1.8]" />
              </button>
            </div>

            {/* 5 Icons Row */}
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-3 pt-1">
              {recentDApps.map((dapp) => (
                <button
                  key={dapp.id}
                  onClick={() => handleLaunchDApp(dapp.name, dapp.url)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none shrink-0"
                >
                  <div className="transition-transform group-hover:scale-105 active:scale-95">
                    {dapp.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. FEATURED ================= */}
        <div className="bg-[#14161C] rounded-3xl p-4 border border-white/[0.04] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-white tracking-tight">
              Featured
            </span>
            <button
              onClick={() => handleLaunchDApp('SafePal DApp Directory', 'https://dapps.safepal.com')}
              className="text-[13px] font-medium text-[#4B73FE] hover:text-blue-400 transition-colors"
            >
              Show More
            </button>
          </div>

          {/* 5 Featured App Icons */}
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2.5 pt-1">
            {featuredDApps.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLaunchDApp(item.name, item.url)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none shrink-0 w-16"
              >
                <div className="transition-transform group-hover:scale-105 active:scale-95 mb-1.5">
                  {item.icon}
                </div>
                <span className="text-[11px] font-medium text-slate-300 truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= 6. PERPS & SPOT ================= */}
        <div className="bg-[#14161C] rounded-3xl p-4 border border-white/[0.04] space-y-3">
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold text-white tracking-tight">
                Perps & Spot
              </span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </div>

          {/* List of Perp DEXes */}
          <div className="divide-y divide-white/[0.04] pt-1">
            {perpsSpotList.map((dex) => (
              <div
                key={dex.id}
                onClick={() => handleLaunchDApp(dex.name, dex.url)}
                className="flex items-center justify-between py-3 hover:bg-white/[0.02] rounded-2xl px-2 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {dex.icon}
                  <div>
                    <h4 className="text-[15px] font-bold text-white group-hover:text-[#00D084] transition-colors">
                      {dex.name}
                    </h4>
                    <p className="text-[12px] text-[#7C7D86] line-clamp-1">
                      {dex.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#7C7D86] group-hover:text-white transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= IN-APP DAPP BROWSER SIMULATOR MODAL ================= */}
      {launchedDApp && (
        <div className="fixed inset-0 z-60 flex flex-col bg-[#0A0A0D] text-white">
          {/* Top DApp Browser Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#121418] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
              <div className="h-3 w-3 rounded-full bg-[#00D084]" />
              <div className="flex-1 bg-[#1A1C22] rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/10 min-w-0">
                <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-mono text-slate-200 truncate">{launchedDApp.url}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsWeb3ModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#3862FB] text-white text-xs font-bold hover:bg-[#2F54DB] transition-colors"
              >
                Connect
              </button>
              <button
                onClick={() => setLaunchedDApp(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* DApp View Container */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-20 w-20 rounded-3xl bg-[#161922] border border-white/10 flex items-center justify-center text-[#00D084] shadow-2xl">
              <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">{launchedDApp.name}</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">{launchedDApp.url}</p>
            </div>

            <div className="max-w-sm rounded-2xl bg-[#161922] border border-white/10 p-4 text-xs text-slate-300 space-y-2 text-left">
              <div className="flex items-center gap-2 text-[#00D084] font-bold">
                <Shield className="h-4 w-4" />
                <span>SafePal Web3 Security Sandbox</span>
              </div>
              <p className="text-slate-400">
                Connected to SafePal EIP-1193 Provider. DApp interaction, smart contract signatures, and token swaps are guarded by anti-phishing filters.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href={launchedDApp.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3862FB] text-white font-bold text-xs hover:bg-[#2F54DB] transition-colors"
              >
                <span>Open in External Browser</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <button
                onClick={() => setLaunchedDApp(null)}
                className="px-5 py-2.5 rounded-xl bg-[#1E2028] text-white font-bold text-xs hover:bg-[#262A34] transition-colors"
              >
                Return to Explore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
