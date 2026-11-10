import React from 'react';
import { useWallet, ViewTab } from '../context/WalletContext';

// Exact SafePal Bottom Nav Icons from Photo (photo_2026-11-11_03-54-45_6ff6f69c.jpg)
const SafePalWalletIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    className={`h-6 w-6 transition-colors ${isActive ? 'text-[#00D084]' : 'text-[#8E92A4]'}`}
    viewBox="0 0 28 28"
    fill="none"
  >
    {isActive ? (
      <g fill="currentColor">
        {/* Main Solid Green Wallet Body */}
        <path d="M4 6.5C4 4.8 5.4 3.5 7 3.5H21C22.6 3.5 24 4.8 24 6.5V20.5C24 22.2 22.6 23.5 21 23.5H7C5.4 23.5 4 22.2 4 20.5V6.5Z" />
        {/* Top Fold Cut */}
        <path
          d="M4 8.5C4 7 5.2 5.8 6.7 5.8H21.3C22.8 5.8 24 7 24 8.5"
          stroke="#0B0C0E"
          strokeWidth="1.3"
          fill="none"
        />
        {/* Clasp / Buckle with Center Dot Hole */}
        <path
          d="M17 11H23C24.1 11 25 11.9 25 13V16C25 17.1 24.1 18 23 18H17C15.9 18 15 17.1 15 16V13C15 11.9 15.9 11 17 11Z"
          fill="currentColor"
          stroke="#0B0C0E"
          strokeWidth="1.3"
        />
        <circle cx="18.5" cy="14.5" r="1.3" fill="#0B0C0E" />
      </g>
    ) : (
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="4" y="5" width="20" height="18" rx="3.5" />
        <path d="M4 9h20" />
        <rect x="15" y="11.5" width="9" height="6" rx="2" fill="#0B0C0E" />
        <circle cx="18.5" cy="14.5" r="1" fill="currentColor" />
      </g>
    )}
  </svg>
);

const SafePalMarketIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    className={`h-6 w-6 transition-colors ${isActive ? 'text-[#00D084]' : 'text-[#8E92A4]'}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 3 Outline Bars with Slanted Roofs matching screenshot */}
    {/* Left Bar (Short) */}
    <path d="M5 14L8.5 11.5V23H5V14Z" />
    {/* Center Bar (Tallest) */}
    <path d="M12 7L15.5 4.5V23H12V7Z" />
    {/* Right Bar (Medium) */}
    <path d="M19 10.5L22.5 8V23H19V10.5Z" />
  </svg>
);

const SafePalExploreIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    className={`h-6 w-6 transition-colors ${isActive ? 'text-[#00D084]' : 'text-[#8E92A4]'}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Top-Left Rounded Square */}
    <rect x="5" y="5" width="6.5" height="6.5" rx="1.6" />
    {/* Top-Right Rotated Diamond (SafePal Signature) */}
    <rect
      x="16.5"
      y="5"
      width="6.5"
      height="6.5"
      rx="1.6"
      transform="rotate(45 19.75 8.25)"
    />
    {/* Bottom-Left Rounded Square */}
    <rect x="5" y="16.5" width="6.5" height="6.5" rx="1.6" />
    {/* Bottom-Right Rounded Square */}
    <rect x="16.5" y="16.5" width="6.5" height="6.5" rx="1.6" />
  </svg>
);

const SafePalSwapIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    className={`h-6 w-6 transition-colors ${isActive ? 'text-[#00D084]' : 'text-[#8E92A4]'}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Up-Right Diagonal Block Arrow matching screenshot */}
    <path d="M15 4H23V12L20.2 9.2L12 17.4L9.8 15.2L18 7L15 4Z" />
    {/* Down-Left Diagonal Block Arrow matching screenshot */}
    <path d="M13 24H5V16L7.8 18.8L16 10.6L18.2 12.8L10 21L13 24Z" />
  </svg>
);

const SafePalTradeIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    className={`h-6 w-6 transition-colors ${isActive ? 'text-[#00D084]' : 'text-[#8E92A4]'}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Circle Outline */}
    <circle cx="14" cy="14" r="10" />
    {/* Top Horizontal Arrow pointing Right */}
    <path d="M8.5 11H19.5" />
    <path d="M16.5 8L19.5 11L16.5 14" />
    {/* Bottom Horizontal Arrow pointing Left */}
    <path d="M19.5 17H8.5" />
    <path d="M11.5 14L8.5 17L11.5 20" />
  </svg>
);

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useWallet();

  if (activeTab === 'landing') {
    return null;
  }

  const navItems = [
    {
      id: 'overview' as ViewTab,
      label: 'Wallet',
      icon: (active: boolean) => <SafePalWalletIcon isActive={active} />,
    },
    {
      id: 'markets' as ViewTab,
      label: 'Market',
      icon: (active: boolean) => <SafePalMarketIcon isActive={active} />,
    },
    {
      id: 'defi' as ViewTab,
      label: 'Explore',
      icon: (active: boolean) => <SafePalExploreIcon isActive={active} />,
    },
    {
      id: 'swap' as ViewTab,
      label: 'Swap',
      icon: (active: boolean) => <SafePalSwapIcon isActive={active} />,
    },
    {
      id: 'portfolio' as ViewTab,
      label: 'Trade',
      icon: (active: boolean) => <SafePalTradeIcon isActive={active} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0C0E] border-t border-white/[0.06] px-1 py-1.5 max-w-md mx-auto select-none font-sans">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            activeTab === item.id ||
            (item.id === 'overview' && (activeTab === 'landing' || activeTab === 'overview'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 focus:outline-none transition-transform active:scale-95 cursor-pointer"
              id={`safepal-nav-${item.id}`}
            >
              <div className="flex items-center justify-center h-6 w-6">
                {item.icon(isActive)}
              </div>
              <span
                className={`text-[11.5px] font-normal mt-1 tracking-normal transition-colors ${
                  isActive ? 'text-[#00D084]' : 'text-[#8E92A4]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
