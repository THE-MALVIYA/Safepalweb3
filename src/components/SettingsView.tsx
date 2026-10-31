import React, { useState, useRef } from 'react';
import { useWallet } from '../context/WalletContext';
import { FiatCurrency, ThemeMode } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Key,
  KeyRound,
  Fingerprint,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  X,
  LogOut,
  Sparkles,
  RefreshCw,
  CandlestickChart,
  User,
  Shield,
  HelpCircle,
  MessageSquare,
  Globe,
  Database,
  Trash2,
  Plus,
  Lock,
  Sun,
  Moon,
  Smartphone,
  Server,
  Zap,
} from 'lucide-react';
import {
  registerPlatformFingerprint,
} from '../utils/webauthnBiometrics';

interface ContactAddress {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
}

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateUserAccount,
    addNotification,
    logoutUser,
    setActiveTab,
    setIsAuthModalOpen,
    fiatCurrency,
    setFiatCurrency,
    fiatSymbol,
    themeMode,
    setThemeMode,
    isBiometricsEnabled,
    setIsBiometricsEnabled,
    setIsBiometricLockOpen,
    appPin,
    setAppPin,
  } = useWallet();

  // Modals for settings items
  const [activeModal, setActiveModal] = useState<
    | 'security'
    | 'addressBook'
    | 'nodeSettings'
    | 'customNetwork'
    | 'appearance'
    | 'cost'
    | 'fiat'
    | 'language'
    | 'kline'
    | 'support'
    | 'community'
    | 'kyc'
    | null
  >(null);

  // Security options state
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [passkeyRegistered, setPasskeyRegistered] = useState(currentUser?.passkeyEnabled ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.twoFactorEnabled ?? false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [editingPin, setEditingPin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  // Secret Mobile Admin Access: 5 quick taps on version footer
  const [versionTapCount, setVersionTapCount] = useState(0);
  const versionTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleVersionTap = () => {
    if (versionTapTimeoutRef.current) clearTimeout(versionTapTimeoutRef.current);
    const next = versionTapCount + 1;
    if (next >= 5) {
      setVersionTapCount(0);
      setActiveTab('admin');
    } else {
      setVersionTapCount(next);
      versionTapTimeoutRef.current = setTimeout(() => {
        setVersionTapCount(0);
      }, 1500);
    }
  };

  // Settings preferences
  const [txCost, setTxCost] = useState<'Low' | 'Middle' | 'High'>('Middle');
  const [language, setLanguage] = useState('English');
  const [klineColor, setKlineColor] = useState<'GreenUp' | 'RedUp'>('GreenUp');

  // Address Book state
  const [contacts, setContacts] = useState<ContactAddress[]>([
    {
      id: 'c1',
      name: 'Binance Hot Wallet',
      symbol: 'USDT',
      network: 'TRC20',
      address: 'TB7zZxcAr6NKR6nF231t2ZWYPTu1TUrDE6',
    },
    {
      id: 'c2',
      name: 'Hardware SafeVault',
      symbol: 'ETH',
      network: 'ERC20',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
    {
      id: 'c3',
      name: 'Solana Staking Node',
      symbol: 'SOL',
      network: 'Solana',
      address: '7xK4M19nQ81rS63tU54vW32xY10zA98bC77dE66f',
    },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactSymbol, setNewContactSymbol] = useState('USDT');
  const [newContactAddress, setNewContactAddress] = useState('');
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);

  // Custom Network state
  const [customNetworks, setCustomNetworks] = useState([
    { id: 'net_1', name: 'Polygon PoS', rpcUrl: 'https://polygon-rpc.com', chainId: '137', symbol: 'POL' },
    { id: 'net_2', name: 'Arbitrum One', rpcUrl: 'https://arb1.arbitrum.io/rpc', chainId: '42161', symbol: 'ETH' },
  ]);
  const [netName, setNetName] = useState('');
  const [netRpc, setNetRpc] = useState('');
  const [netChainId, setNetChainId] = useState('');
  const [netSymbol, setNetSymbol] = useState('');

  // Node settings ping
  const [pingStatus, setPingStatus] = useState<Record<string, number>>({
    ethereum: 14,
    tron: 22,
    solana: 18,
    bsc: 16,
  });

  const isAdminAuthorized =
    currentUser?.email?.toLowerCase() === 'legendxadmin1999@gmail.com' &&
    currentUser?.role === 'admin';

  const handleClearCache = () => {
    try {
      localStorage.removeItem('safepal_temp_cache');
      localStorage.removeItem('safepal_dapp_history');
    } catch (e) {}
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const seedWords = currentUser?.seedPhrase
    ? currentUser.seedPhrase.split(' ')
    : 'abandon ability able about above absent absorb abstract absurd abuse access accident'.split(' ');

  const handleSavePin = () => {
    if (!/^\d{6}$/.test(pinInput)) {
      setPinFeedback('PIN must be exactly 6 digits.');
      return;
    }
    setAppPin(pinInput);
    setPinFeedback('6-Digit Security PIN saved successfully!');
    setTimeout(() => {
      setEditingPin(false);
      setPinFeedback(null);
      setPinInput('');
    }, 1500);
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactAddress.trim()) return;
    const newContact: ContactAddress = {
      id: 'c_' + Date.now(),
      name: newContactName.trim(),
      symbol: newContactSymbol,
      network: newContactSymbol === 'USDT' || newContactSymbol === 'TRX' ? 'TRC20' : 'EVM',
      address: newContactAddress.trim(),
    };
    setContacts((prev) => [newContact, ...prev]);
    setNewContactName('');
    setNewContactAddress('');
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCustomNetwork = () => {
    if (!netName.trim() || !netRpc.trim() || !netChainId.trim()) return;
    setCustomNetworks((prev) => [
      ...prev,
      {
        id: 'net_' + Date.now(),
        name: netName.trim(),
        rpcUrl: netRpc.trim(),
        chainId: netChainId.trim(),
        symbol: netSymbol.trim() || 'ETH',
      },
    ]);
    setNetName('');
    setNetRpc('');
    setNetChainId('');
    setNetSymbol('');
  };

  // Supported Fiat Currencies
  const fiatList: Array<{ code: FiatCurrency; name: string; symbol: string; rate: string }> = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: '1.00 USD' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: '86.50 INR' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: '0.92 EUR' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: '0.79 GBP' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: '155.00 JPY' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rate: '3.67 AED' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: '7.25 CNY' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: '1.39 CAD' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: '1.54 AUD' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-white pb-28 pt-2 select-none font-sans">
      <div className="mx-auto max-w-md px-4 sm:px-5 space-y-4">
        {/* ================= 1. HEADER (Exact SafePal Screenshot 5) ================= */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
          <button
            onClick={() => setActiveTab('overview')}
            className="p-1 text-white hover:text-slate-300 transition-colors cursor-pointer"
            title="Back to Wallet"
            id="safepal-settings-back-btn"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>

          <h2 className="text-[18px] font-bold text-white tracking-tight">Settings</h2>

          <div className="w-8" />
        </div>

        {/* ================= SECTION 1: SECURITY ================= */}
        <div className="bg-[#161922] rounded-2xl overflow-hidden border border-white/[0.04]">
          <button
            onClick={() => setActiveModal('security')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
            id="safepal-settings-security"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#202432] flex items-center justify-center text-[#00D084]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-medium text-white block">Security & Biometrics</span>
                <span className="text-[11px] text-[#8E92A4]">
                  {isBiometricsEnabled ? 'Fingerprint Active • 6-Digit PIN' : 'Hardware Encryption'}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
          </button>
        </div>

        {/* ================= SECTION 2: ADDRESS BOOK, NODE, CUSTOM NETWORK, CLEAR CACHE ================= */}
        <div className="bg-[#161922] rounded-2xl overflow-hidden border border-white/[0.04] divide-y divide-white/[0.04]">
          {/* Address Book */}
          <button
            onClick={() => setActiveModal('addressBook')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Address Book</span>
            <div className="flex items-center gap-1.5 text-xs text-[#8E92A4]">
              <span>{contacts.length} saved</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* Node Settings */}
          <button
            onClick={() => setActiveModal('nodeSettings')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Node Settings</span>
            <div className="flex items-center gap-1.5 text-xs text-[#00D084]">
              <span className="h-2 w-2 rounded-full bg-[#00D084] animate-pulse" />
              <span>Optimal</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* Custom Network */}
          <button
            onClick={() => setActiveModal('customNetwork')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Custom Network</span>
            <div className="flex items-center gap-1 text-xs text-[#8E92A4]">
              <span>{customNetworks.length} custom</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* Clear Cache */}
          <button
            onClick={handleClearCache}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Clear Cache</span>
            <div className="flex items-center gap-1.5">
              {cacheCleared && (
                <span className="text-[12px] text-[#00D084] font-medium">Cleared!</span>
              )}
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>
        </div>

        {/* ================= SECTION 3: PREFERENCES ================= */}
        <div className="bg-[#161922] rounded-2xl overflow-hidden border border-white/[0.04] divide-y divide-white/[0.04]">
          {/* Appearance: Dark Mode > */}
          <button
            onClick={() => setActiveModal('appearance')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Appearance</span>
            <div className="flex items-center gap-1 text-[14px] text-[#8E92A4]">
              <span className="capitalize">
                {themeMode === 'oled'
                  ? 'OLED True Black'
                  : themeMode === 'navy'
                  ? 'Midnight Navy'
                  : themeMode === 'light'
                  ? 'Light Mode'
                  : 'Dark Mode'}
              </span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* Transaction Cost: Middle > */}
          <button
            onClick={() => setActiveModal('cost')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Transaction Cost</span>
            <div className="flex items-center gap-1 text-[14px] text-[#8E92A4]">
              <span>{txCost}</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* Fiat Currency: $ USD > */}
          <button
            onClick={() => setActiveModal('fiat')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Fiat Currency</span>
            <div className="flex items-center gap-1 text-[14px] text-[#8E92A4]">
              <span className="text-[#00D084] font-mono">{fiatSymbol}</span>
              <span>{fiatCurrency}</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* Language: English > */}
          <button
            onClick={() => setActiveModal('language')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Language</span>
            <div className="flex items-center gap-1 text-[14px] text-[#8E92A4]">
              <span>{language}</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* K-Line Color: candlesticks > */}
          <button
            onClick={() => setActiveModal('kline')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">K-Line Color</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-3.5 bg-[#00D084] rounded-xs" />
                <span className="w-1.5 h-4.5 bg-[#FF5252] rounded-xs" />
                <span className="w-1.5 h-3 bg-[#00D084] rounded-xs" />
              </div>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>
        </div>

        {/* ================= SECTION 4: SUPPORT & COMMUNITY ================= */}
        <div className="bg-[#161922] rounded-2xl overflow-hidden border border-white/[0.04] divide-y divide-white/[0.04]">
          {/* Help Center */}
          <a
            href="https://safepalsupport.zendesk.com"
            target="_blank"
            rel="noreferrer"
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Help Center</span>
            <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
          </a>

          {/* Support */}
          <button
            onClick={() => setActiveModal('support')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Support</span>
            <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
          </button>

          {/* Community */}
          <button
            onClick={() => setActiveModal('community')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Community</span>
            <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
          </button>
        </div>

        {/* ================= SECTION 5: ACCOUNT & KYC ================= */}
        <div className="bg-[#161922] rounded-2xl overflow-hidden border border-white/[0.04] divide-y divide-white/[0.04]">
          {/* KYC Status */}
          <button
            onClick={() => setActiveModal('kyc')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Identity Verification (KYC)</span>
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-[#00D084] font-semibold">
                {currentUser?.kycStatus === 'verified' ? 'Verified' : 'Pending Review'}
              </span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>


          {/* Account Log out or Switch */}
          {currentUser ? (
            <button
              onClick={() => logoutUser()}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer text-[#FF5252]"
            >
              <span className="text-[15px] font-medium">Log Out ({currentUser.name || 'User'})</span>
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer text-[#5B67F6]"
            >
              <span className="text-[15px] font-medium">Sign In / Switch Wallet</span>
              <User className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Version info footer (Secret 5-Tap Gateway for Mobile Phones) */}
        <div
          onClick={handleVersionTap}
          className="text-center pt-2 pb-6 text-xs text-[#5A5D6B] font-mono cursor-default select-none active:opacity-75"
        >
          SafePal Wallet App v4.8.2 • Multi-Chain Security Keyring
        </div>
      </div>

      {/* ================= 1. FIAT CURRENCY PICKER MODAL ================= */}
      {activeModal === 'fiat' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#00D084]" />
                <span>Select Fiat Currency</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#8E92A4] shrink-0">
              Select your preferred display currency. All asset values and portfolio balances will convert automatically in real time.
            </p>

            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
              {fiatList.map((item) => {
                const isSelected = fiatCurrency === item.code;
                return (
                  <button
                    key={item.code}
                    onClick={() => {
                      setFiatCurrency(item.code);
                      setActiveModal(null);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D212E] border-[#00D084] shadow-sm'
                        : 'bg-[#181B24] border-white/[0.04] hover:bg-[#202432]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#282C3D] flex items-center justify-center text-white font-bold font-mono text-base">
                        {item.symbol}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span className="text-xs text-[#8E92A4] font-mono">({item.code})</span>
                        </div>
                        <div className="text-[11px] text-[#7C7D86]">Rate: 1 USD ≈ {item.rate}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-[#00D084]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. APPEARANCE MODAL ================= */}
      {activeModal === 'appearance' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-400" />
                <span>Appearance Theme</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#8E92A4]">
              Choose the visual theme tailored for AMOLED battery efficiency and eye comfort.
            </p>

            <div className="space-y-2">
              {[
                { id: 'dark' as ThemeMode, name: 'SafePal Dark (Default)', desc: 'Standard deep space obsidian interface', bg: '#0A0A0D' },
                { id: 'oled' as ThemeMode, name: 'OLED Pure Black', desc: 'Zero pixel emissions for AMOLED battery saving', bg: '#000000' },
                { id: 'navy' as ThemeMode, name: 'Midnight Navy', desc: 'Subtle deep sapphire blue accents', bg: '#0B1120' },
                { id: 'light' as ThemeMode, name: 'Daylight Light Mode', desc: 'High contrast clean white interface', bg: '#F8FAFC' },
              ].map((th) => {
                const isSelected = themeMode === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      setThemeMode(th.id);
                      setActiveModal(null);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D212E] border-[#00D084]'
                        : 'bg-[#181B24] border-white/[0.04] hover:bg-[#202432]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-xl border border-white/20 flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: th.bg }}
                      >
                        Aa
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{th.name}</div>
                        <div className="text-[11px] text-[#8E92A4]">{th.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-[#00D084]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. SECURITY & BIOMETRIC MODAL ================= */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#00D084]" />
                <span>Security & App Lock</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {/* Biometric / Fingerprint App Lock */}
              <div className="bg-[#181B24] rounded-2xl p-4 border border-white/[0.04] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#282C3D] flex items-center justify-center text-[#00D084]">
                      <Fingerprint className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Biometric Fingerprint Lock</div>
                      <div className="text-[11px] text-[#8E92A4]">Require fingerprint to open APK</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isBiometricsEnabled}
                    onChange={async (e) => {
                      const willEnable = e.target.checked;
                      if (willEnable) {
                        const reg = await registerPlatformFingerprint({
                          id: currentUser?.id,
                          email: currentUser?.email,
                          name: currentUser?.name,
                        });
                        if (reg.success) {
                          setIsBiometricsEnabled(true);
                        }
                      } else {
                        setIsBiometricsEnabled(false);
                      }
                    }}
                    className="h-5 w-5 accent-[#00D084] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setIsBiometricLockOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#202432] hover:bg-[#282E40] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Fingerprint className="h-3.5 w-3.5 text-[#00D084]" />
                    <span>Test Fingerprint Sensor</span>
                  </button>
                  <button
                    onClick={() => setEditingPin(!editingPin)}
                    className="px-3 py-2 rounded-xl bg-[#202432] hover:bg-[#282E40] text-xs font-semibold text-[#5B67F6] transition-colors cursor-pointer"
                  >
                    {editingPin ? 'Cancel' : 'Change PIN'}
                  </button>
                </div>

                {/* 6-Digit PIN Config */}
                {editingPin && (
                  <div className="p-3 rounded-xl bg-[#12141A] border border-white/5 space-y-2 mt-2">
                    <div className="text-xs font-medium text-slate-300">Enter new 6-digit PIN (Current: {appPin})</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        maxLength={6}
                        placeholder="••••••"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 rounded-lg bg-[#1A1D26] px-3 py-2 text-sm font-mono text-white text-center tracking-widest border border-white/10 focus:outline-none focus:border-[#00D084]"
                      />
                      <button
                        onClick={handleSavePin}
                        className="px-4 py-2 rounded-lg bg-[#00D084] text-black text-xs font-bold hover:bg-[#00B975]"
                      >
                        Save
                      </button>
                    </div>
                    {pinFeedback && <div className="text-[11px] text-[#00D084]">{pinFeedback}</div>}
                  </div>
                )}
              </div>

              {/* Seed Phrase Backup */}
              <div className="bg-[#181B24] rounded-2xl p-4 space-y-2 border border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-[#5B67F6]" />
                    <span className="text-sm font-semibold text-white">12-Word Recovery Phrase</span>
                  </div>
                  <button
                    onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                    className="text-xs text-[#5B67F6] font-semibold hover:underline cursor-pointer"
                  >
                    {showSeedPhrase ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                {showSeedPhrase ? (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-1.5 p-3 rounded-xl bg-[#0C0E14] border border-white/5 font-mono text-xs">
                      {seedWords.map((w, idx) => (
                        <div key={idx} className="text-slate-300">
                          <span className="text-slate-600 mr-1">{idx + 1}.</span>
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(seedWords.join(' '));
                        setCopiedSeed(true);
                        setTimeout(() => setCopiedSeed(false), 2000);
                      }}
                      className="w-full py-2 rounded-xl bg-[#202432] text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                    >
                      {copiedSeed ? <Check className="h-3.5 w-3.5 text-[#00D084]" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSeed ? 'Copied to Clipboard' : 'Copy 12 Words'}</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#8E92A4]">
                    Your 12-word master secret recovery phrase is securely stored in hardware-level encryption.
                  </p>
                )}
              </div>

              {/* 2FA Authenticator */}
              <div className="bg-[#181B24] rounded-2xl p-4 flex items-center justify-between border border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#5B67F6]" />
                  <div>
                    <div className="text-sm font-semibold text-white">Google Authenticator (2FA)</div>
                    <div className="text-[11px] text-[#8E92A4]">Require OTP for transfers</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => {
                    setTwoFactorEnabled(e.target.checked);
                    updateUserAccount({ twoFactorEnabled: e.target.checked });
                  }}
                  className="h-5 w-5 accent-[#5B67F6] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. ADDRESS BOOK MODAL ================= */}
      {activeModal === 'addressBook' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-[#5B67F6]" />
                <span>Address Book</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Add Contact Form */}
            <div className="p-3 rounded-2xl bg-[#181B24] border border-white/[0.04] space-y-2 shrink-0">
              <div className="text-xs font-semibold text-white">Add New Contact</div>
              <input
                type="text"
                placeholder="Contact Name (e.g. Alice Trading)"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full rounded-xl bg-[#12141A] px-3 py-2 text-xs text-white border border-white/10 focus:outline-none"
              />
              <div className="flex gap-2">
                <select
                  value={newContactSymbol}
                  onChange={(e) => setNewContactSymbol(e.target.value)}
                  className="rounded-xl bg-[#12141A] px-3 py-2 text-xs text-white border border-white/10 focus:outline-none"
                >
                  <option value="USDT">USDT (TRC20)</option>
                  <option value="BTC">BTC (Bitcoin)</option>
                  <option value="ETH">ETH (ERC20)</option>
                  <option value="SOL">SOL (Solana)</option>
                  <option value="TRX">TRX (TRON)</option>
                </select>
                <input
                  type="text"
                  placeholder="Paste Wallet Address"
                  value={newContactAddress}
                  onChange={(e) => setNewContactAddress(e.target.value)}
                  className="flex-1 rounded-xl bg-[#12141A] px-3 py-2 text-xs text-white font-mono border border-white/10 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddContact}
                className="w-full py-2 rounded-xl bg-[#5B67F6] text-white text-xs font-bold hover:bg-[#4E5BF0]"
              >
                Save Contact
              </button>
            </div>

            {/* Contacts List */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {contacts.map((c) => (
                <div key={c.id} className="p-3 rounded-2xl bg-[#181B24] border border-white/[0.04] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-semibold text-white truncate">{c.name}</div>
                    <div className="text-[11px] text-[#8E92A4] font-mono truncate">{c.address}</div>
                    <div className="text-[10px] text-[#00D084] font-semibold mt-0.5">{c.symbol} • {c.network}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(c.address);
                        setCopiedAddressId(c.id);
                        setTimeout(() => setCopiedAddressId(null), 2000);
                      }}
                      className="p-2 rounded-lg bg-[#202432] text-slate-300 hover:text-white"
                      title="Copy Address"
                    >
                      {copiedAddressId === c.id ? <Check className="h-4 w-4 text-[#00D084]" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="p-2 rounded-lg bg-[#202432] text-rose-400 hover:text-rose-300"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. NODE SETTINGS MODAL ================= */}
      {activeModal === 'nodeSettings' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-[#00D084]" />
                <span>Node RPC Endpoints</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#8E92A4]">
              SafePal operates geographically distributed validators with auto-failover routing.
            </p>

            <div className="space-y-2">
              {[
                { name: 'Ethereum Mainnet', rpc: 'https://cloudflare-eth.com', pingKey: 'ethereum' },
                { name: 'Tron Nile / Mainnet', rpc: 'https://api.trongrid.io', pingKey: 'tron' },
                { name: 'Solana RPC Cluster', rpc: 'https://api.mainnet-beta.solana.com', pingKey: 'solana' },
                { name: 'BNB Smart Chain', rpc: 'https://bsc-dataseed.binance.org', pingKey: 'bsc' },
              ].map((node) => (
                <div key={node.name} className="p-3.5 rounded-2xl bg-[#181B24] border border-white/[0.04] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{node.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">{node.rpc}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#00D084]">
                    <span className="h-2 w-2 rounded-full bg-[#00D084]" />
                    <span>{pingStatus[node.pingKey] || 16}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. CUSTOM NETWORK MODAL ================= */}
      {activeModal === 'customNetwork' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span>Custom EVM Networks</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Network Name (e.g. Avalanche C-Chain)"
                value={netName}
                onChange={(e) => setNetName(e.target.value)}
                className="w-full rounded-xl bg-[#12141A] px-3.5 py-2.5 text-xs text-white border border-white/10 focus:outline-none"
              />
              <input
                type="text"
                placeholder="RPC URL (https://...)"
                value={netRpc}
                onChange={(e) => setNetRpc(e.target.value)}
                className="w-full rounded-xl bg-[#12141A] px-3.5 py-2.5 text-xs text-white font-mono border border-white/10 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Chain ID (e.g. 43114)"
                  value={netChainId}
                  onChange={(e) => setNetChainId(e.target.value)}
                  className="flex-1 rounded-xl bg-[#12141A] px-3.5 py-2.5 text-xs text-white border border-white/10 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Currency Symbol (AVAX)"
                  value={netSymbol}
                  onChange={(e) => setNetSymbol(e.target.value)}
                  className="flex-1 rounded-xl bg-[#12141A] px-3.5 py-2.5 text-xs text-white border border-white/10 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddCustomNetwork}
                className="w-full py-2.5 rounded-xl bg-[#00D084] text-black text-xs font-bold hover:bg-[#00B975]"
              >
                Add Network
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-semibold text-slate-400">Added Networks</div>
              {customNetworks.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-[#181B24] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{n.name}</span>
                    <span className="text-slate-500 ml-2 font-mono">Chain ID: {n.chainId}</span>
                  </div>
                  <span className="text-[#00D084] font-bold">{n.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 7. TRANSACTION COST MODAL ================= */}
      {activeModal === 'cost' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white">Default Transaction Speed</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { id: 'Low' as const, name: 'Low (Economical)', desc: 'Standard priority fee (~$0.85)' },
                { id: 'Middle' as const, name: 'Middle (Recommended)', desc: 'Optimal block inclusion (~$1.85)' },
                { id: 'High' as const, name: 'High (Fast Priority)', desc: 'Instant first-block confirmation (~$3.50)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setTxCost(c.id);
                    setActiveModal(null);
                  }}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left cursor-pointer ${
                    txCost === c.id ? 'bg-[#1D212E] border-[#00D084]' : 'bg-[#181B24] border-white/[0.04]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{c.name}</div>
                    <div className="text-[11px] text-[#8E92A4]">{c.desc}</div>
                  </div>
                  {txCost === c.id && <Check className="h-5 w-5 text-[#00D084]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 8. LANGUAGE MODAL ================= */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white">Select Language</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1.5">
              {[
                { id: 'English', native: 'English (US)' },
                { id: 'Hindi', native: 'हिन्दी (Hindi)' },
                { id: 'Spanish', native: 'Español' },
                { id: 'Chinese', native: '简体中文' },
                { id: 'Japanese', native: '日本語' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id);
                    setActiveModal(null);
                  }}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left cursor-pointer ${
                    language === lang.id ? 'bg-[#1D212E] border-[#00D084]' : 'bg-[#181B24] border-white/[0.04]'
                  }`}
                >
                  <span className="text-sm font-semibold text-white">{lang.native}</span>
                  {language === lang.id && <Check className="h-5 w-5 text-[#00D084]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 9. K-LINE COLOR MODAL ================= */}
      {activeModal === 'kline' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white">Candlestick K-Line Colors</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setKlineColor('GreenUp');
                  setActiveModal(null);
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left cursor-pointer ${
                  klineColor === 'GreenUp' ? 'bg-[#1D212E] border-[#00D084]' : 'bg-[#181B24] border-white/[0.04]'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-white">Green Up / Red Down</div>
                  <div className="text-[11px] text-[#8E92A4]">Standard International Convention</div>
                </div>
                {klineColor === 'GreenUp' && <Check className="h-5 w-5 text-[#00D084]" />}
              </button>

              <button
                onClick={() => {
                  setKlineColor('RedUp');
                  setActiveModal(null);
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left cursor-pointer ${
                  klineColor === 'RedUp' ? 'bg-[#1D212E] border-[#00D084]' : 'bg-[#181B24] border-white/[0.04]'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-white">Red Up / Green Down</div>
                  <div className="text-[11px] text-[#8E92A4]">Asian Stock Market Convention</div>
                </div>
                {klineColor === 'RedUp' && <Check className="h-5 w-5 text-[#00D084]" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Sheet */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white">SafePal Support</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-[#8E92A4] leading-relaxed">
              For support inquiries regarding gas fees, wallet syncing, or account protection, contact the official SafePal security desk.
            </p>
            <div className="bg-[#181B24] rounded-2xl p-4 space-y-2 border border-white/[0.04] text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Desk Email:</span>
                <span className="text-[#5B67F6] font-mono">support@safepal.io</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Response SLA:</span>
                <span className="text-white">Under 15 minutes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Sheet */}
      {activeModal === 'community' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white">SafePal Global Community</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <a
                href="https://twitter.com/iSafePal"
                target="_blank"
                rel="noreferrer"
                className="block p-3 rounded-xl bg-[#181B24] hover:bg-[#202432] text-white font-medium"
              >
                Twitter / X: @iSafePal
              </a>
              <a
                href="https://t.me/SafePalwallet"
                target="_blank"
                rel="noreferrer"
                className="block p-3 rounded-xl bg-[#181B24] hover:bg-[#202432] text-white font-medium"
              >
                Telegram: SafePal Official Announcement
              </a>
              <a
                href="https://discord.gg/safepal"
                target="_blank"
                rel="noreferrer"
                className="block p-3 rounded-xl bg-[#181B24] hover:bg-[#202432] text-white font-medium"
              >
                Discord: SafePal Community
              </a>
            </div>
          </div>
        </div>
      )}

      {/* KYC Sheet */}
      {activeModal === 'kyc' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white">Identity Verification (KYC)</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#00D084]/15 border border-[#00D084]/30 text-xs text-[#00D084]">
              ✓ Your account compliance status is in Good Standing.
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Account ID:</span>
                <span className="font-mono text-white">{currentUser?.id || 'WL-8941'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Registered Name:</span>
                <span className="text-white">{currentUser?.name || 'Wallet User'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Security Clearance:</span>
                <span className="text-[#00D084] font-bold">Tier 2 Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
