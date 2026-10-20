import React from 'react';
import { useWallet, ViewTab } from '../context/WalletContext';
import {
  Wallet,
  BarChart3,
  LayoutGrid,
  ArrowUpRight,
  ArrowLeftRight,
  ShieldCheck,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useWallet();

  const isAdminAuthorized =
    currentUser?.email.toLowerCase() === 'legendxadmin1999@gmail.com' &&
    currentUser?.role === 'admin';

  // Exact SafePal 5 Bottom Nav Items from Screenshot
  const navItems = [
    {
      id: 'overview' as ViewTab,
      label: 'Wallet',
      icon: (isActive: boolean) => (
        <svg
          className={`h-5 w-5 ${isActive ? 'text-[#00D084]' : 'text-[#7C7D86]'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      ),
    },
    {
      id: 'markets' as ViewTab,
      label: 'Market',
      icon: (isActive: boolean) => (
        <BarChart3
          className={`h-5 w-5 ${isActive ? 'text-[#00D084]' : 'text-[#7C7D86]'}`}
          strokeWidth={2.1}
        />
      ),
    },
    {
      id: 'defi' as ViewTab,
      label: 'Explore',
      icon: (isActive: boolean) => (
        <LayoutGrid
          className={`h-5 w-5 ${isActive ? 'text-[#00D084]' : 'text-[#7C7D86]'}`}
          strokeWidth={2.1}
        />
      ),
    },
    {
      id: 'swap' as ViewTab,
      label: 'Swap',
      icon: (isActive: boolean) => (
        <div className={`relative flex items-center justify-center ${isActive ? 'text-[#00D084]' : 'text-[#7C7D86]'}`}>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m17 7-5-5-5 5" />
            <path d="M12 2v14" />
            <path d="m7 17 5 5 5-5" />
            <path d="M12 22V8" />
          </svg>
        </div>
      ),
    },
    {
      id: 'portfolio' as ViewTab,
      label: 'Trade',
      icon: (isActive: boolean) => (
        <div className={`relative flex items-center justify-center ${isActive ? 'text-[#00D084]' : 'text-[#7C7D86]'}`}>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 10h8l-3-3" />
            <path d="M16 14H8l3 3" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0C0E] border-t border-white/[0.07] px-2 py-1 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            activeTab === item.id ||
            (item.id === 'overview' && (activeTab === 'landing' || activeTab === 'overview'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 focus:outline-none transition-colors active:scale-95 cursor-pointer"
              id={`safepal-nav-${item.id}`}
            >
              {item.icon(isActive)}
              <span
                className={`text-[11px] font-medium mt-1 tracking-tight ${
                  isActive ? 'text-[#00D084]' : 'text-[#7C7D86]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Admin Portal quick link if admin authorized */}
        {isAdminAuthorized && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1 px-2 focus:outline-none transition-colors ${
              activeTab === 'admin' ? 'text-amber-400' : 'text-[#7C7D86] hover:text-amber-300'
            }`}
            title="Admin Portal"
          >
            <ShieldCheck className="h-5 w-5 stroke-[2]" />
            <span className="text-[10px] font-medium mt-1">Admin</span>
          </button>
        )}
      </div>
    </nav>
  );
};
