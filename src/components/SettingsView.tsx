import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
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
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateUserAccount,
    addNotification,
    logoutUser,
    setActiveTab,
    setIsAuthModalOpen,
  } = useWallet();

  // Modals for settings items
  const [activeModal, setActiveModal] = useState<
    'security' | 'addressBook' | 'nodeSettings' | 'customNetwork' | 'appearance' | 'cost' | 'fiat' | 'language' | 'kline' | 'help' | 'support' | 'community' | 'kyc' | null
  >(null);

  // Security options state
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [passkeyRegistered, setPasskeyRegistered] = useState(currentUser?.passkeyEnabled ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.twoFactorEnabled ?? false);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Settings values
  const [fiatCurrency, setFiatCurrency] = useState('USD');
  const [txCost, setTxCost] = useState<'Low' | 'Middle' | 'High'>('Middle');
  const [language, setLanguage] = useState('English');
  const [klineColor, setKlineColor] = useState<'GreenUp' | 'RedUp'>('GreenUp');

  const isAdminAuthorized =
    currentUser?.email?.toLowerCase() === 'legendxadmin1999@gmail.com' &&
    currentUser?.role === 'admin';

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const seedWords = currentUser?.seedPhrase
    ? currentUser.seedPhrase.split(' ')
    : 'abandon ability able about above absent absorb abstract absurd abuse access accident'.split(' ');

  return (
    <div className="min-h-screen bg-[#0A0A0D] text-white pb-28 pt-2 select-none font-sans">
      <div className="mx-auto max-w-md px-4 sm:px-5 space-y-4">
        
        {/* ================= 1. HEADER (Exact SafePal Screenshot 5) ================= */}
        {/* [ < ]  [ Settings ] */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
          <button
            onClick={() => setActiveTab('overview')}
            className="p-1 text-white hover:text-slate-300 transition-colors cursor-pointer"
            title="Back to Wallet"
            id="safepal-settings-back-btn"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>

          <h2 className="text-[18px] font-bold text-white tracking-tight">
            Settings
          </h2>

          <div className="w-8" />
        </div>

        {/* ================= SECTION 1: SECURITY ================= */}
        <div className="bg-[#161922] rounded-2xl overflow-hidden border border-white/[0.04]">
          <button
            onClick={() => setActiveModal('security')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
            id="safepal-settings-security"
          >
            <span className="text-[15px] font-medium text-white">Security</span>
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
            <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
          </button>

          {/* Node Settings */}
          <button
            onClick={() => setActiveModal('nodeSettings')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Node Settings</span>
            <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
          </button>

          {/* Custom Network */}
          <button
            onClick={() => setActiveModal('customNetwork')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Custom Network</span>
            <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
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
          <div className="px-4 py-4 flex items-center justify-between">
            <span className="text-[15px] font-medium text-white">Appearance</span>
            <div className="flex items-center gap-1 text-[14px] text-[#8E92A4]">
              <span>Dark Mode</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </div>

          {/* Transaction Cost: Middle > */}
          <button
            onClick={() => setTxCost(txCost === 'Low' ? 'Middle' : txCost === 'Middle' ? 'High' : 'Low')}
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
            onClick={() => setFiatCurrency(fiatCurrency === 'USD' ? 'EUR' : fiatCurrency === 'EUR' ? 'INR' : 'USD')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-medium text-white">Fiat Currency</span>
            <div className="flex items-center gap-1 text-[14px] text-[#8E92A4]">
              <span>${fiatCurrency}</span>
              <ChevronRight className="h-4 w-4 text-[#7C7D86]" />
            </div>
          </button>

          {/* Language: English > */}
          <button
            onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}
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
            onClick={() => setKlineColor(klineColor === 'GreenUp' ? 'RedUp' : 'GreenUp')}
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

        {/* ================= SECTION 5: ACCOUNT & ADMIN ================= */}
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

          {/* Admin Dashboard if authorized */}
          {isAdminAuthorized && (
            <button
              onClick={() => setActiveTab('admin')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <span className="text-[15px] font-semibold text-[#5B67F6]">Admin Management Portal</span>
              <ChevronRight className="h-4 w-4 text-[#5B67F6]" />
            </button>
          )}

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

        {/* Version info footer */}
        <div className="text-center pt-2 pb-6 text-xs text-[#5A5D6B] font-mono">
          SafePal Wallet App v4.8.2 • Multi-Chain Security Keyring
        </div>

      </div>

      {/* ================= SECURITY SUB-MODAL ================= */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#161922] rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#00D084]" />
                <span>Security Settings</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Seed Phrase Backup */}
              <div className="bg-[#181B24] rounded-2xl p-4 space-y-2 border border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-[#5B67F6]" />
                    <span className="text-sm font-semibold text-white">Mnemonic Seed Phrase</span>
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

              {/* Biometrics */}
              <div className="bg-[#181B24] rounded-2xl p-4 flex items-center justify-between border border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-[#00D084]" />
                  <div>
                    <div className="text-sm font-semibold text-white">Biometric Passkey</div>
                    <div className="text-[11px] text-[#8E92A4]">Touch ID / Fingerprint unlock</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={passkeyRegistered}
                  onChange={(e) => {
                    setPasskeyRegistered(e.target.checked);
                    updateUserAccount({ passkeyEnabled: e.target.checked });
                  }}
                  className="h-5 w-5 accent-[#00D084] cursor-pointer"
                />
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

      {/* Support / Community Sheet */}
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
