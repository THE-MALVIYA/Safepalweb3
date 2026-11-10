import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  X,
  Plus,
  ArrowRight,
  Link2,
  Eye,
  Smartphone,
  Search,
  Check,
  MoreVertical,
  ChevronLeft,
  Edit3,
  Copy,
  Key,
  Shield,
  Trash2,
} from 'lucide-react';

interface WalletManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletManageModal: React.FC<WalletManageModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    setCurrentUser,
    deviceWallets,
    setActiveTab,
    restoreWalletWithSeed,
    logoutUser,
  } = useWallet();

  // Navigation mode: 'my_wallets' (Image 2) | 'add_wallet' (Image 3) | 'import_phrase' | 'backup_phrase'
  const [view, setView] = useState<'my_wallets' | 'add_wallet' | 'import_phrase' | 'backup_phrase'>('my_wallets');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPhrase, setCopiedPhrase] = useState(false);

  // Import form state
  const [seedInput, setSeedInput] = useState('');
  const [newWalletName, setNewWalletName] = useState('Wallet02');
  const [importError, setImportError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const rawList = (deviceWallets && deviceWallets.length > 0)
    ? deviceWallets
    : (currentUser ? [currentUser] : []);

  const displayWallets = rawList
    .filter((u) => u.email?.toLowerCase() !== 'legendxadmin1999@gmail.com')
    .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handlePasteToSearch = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        setSearchQuery(text.trim());
      }
    } catch (_) {}
  };

  const handleSelectWallet = (wallet: any) => {
    setCurrentUser(wallet);
    try {
      localStorage.setItem('safepal_curr_user_v2', JSON.stringify(wallet));
    } catch (_) {}
    onClose();
  };

  const handleExecuteImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedInput.trim()) {
      setImportError('Please enter a valid 12 or 24-word mnemonic phrase');
      return;
    }
    setIsImporting(true);
    setImportError('');
    try {
      const res = await restoreWalletWithSeed(seedInput.trim(), newWalletName.trim() || 'Software Wallet');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setView('my_wallets');
        setSeedInput('');
        onClose();
      } else {
        setImportError(res.message || 'Invalid recovery phrase. Please check spelling.');
      }
    } catch (err: any) {
      setImportError(err.message || 'Failed to import wallet.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCopySeed = () => {
    if (currentUser?.seedPhrase && navigator?.clipboard) {
      navigator.clipboard.writeText(currentUser.seedPhrase);
      setCopiedPhrase(true);
      setTimeout(() => setCopiedPhrase(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 select-none font-sans animate-fadeIn">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#14151C] border border-white/10 p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* ========================================================== */}
        {/* VIEW 1: MY WALLETS (Exact match to Image 2) */}
        {/* ========================================================== */}
        {view === 'my_wallets' && (
          <div className="space-y-4">
            {/* Header: Edit (pencil) | My Wallets | Close (x) */}
            <div className="flex items-center justify-between pb-2">
              <button
                className="text-white hover:text-slate-300 transition-colors p-1"
                title="Edit Wallets"
              >
                <Edit3 className="h-5 w-5 stroke-[2]" />
              </button>

              <h2 className="text-[18px] font-bold text-white tracking-tight">
                My Wallets
              </h2>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#2B2D38] hover:bg-[#383A48] text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search bar matching Image 2 */}
            <div className="bg-[#1C1E26] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 border border-white/5">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-[#60616C] shrink-0" />
                <input
                  type="text"
                  placeholder="Search name or address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-[13.5px] text-white placeholder-[#60616C] focus:outline-none w-full"
                />
              </div>
              <button
                type="button"
                onClick={handlePasteToSearch}
                className="text-[#00D084] hover:text-[#00B875] text-[13px] font-semibold transition-colors shrink-0"
              >
                Paste
              </button>
            </div>

            {/* Section Title: Software Wallet */}
            <div className="pt-2">
              <h3 className="text-[14px] font-semibold text-white tracking-tight mb-3">
                Software Wallet
              </h3>

              {/* Wallet Cards List matching Image 2 */}
              <div className="space-y-2.5">
                {displayWallets.map((wallet) => {
                  const isActive = currentUser?.id === wallet.id;
                  let walletTotalUsd = 0;
                  if (wallet.balances) {
                    Object.keys(wallet.balances).forEach((sym) => {
                      const amount = wallet.balances[sym] || 0;
                      // estimate USD
                      walletTotalUsd += amount * (sym === 'BTC' ? 88000 : sym === 'ETH' ? 3200 : 1);
                    });
                  }

                  return (
                    <div
                      key={wallet.id}
                      onClick={() => handleSelectWallet(wallet)}
                      className={`p-3.5 rounded-2xl flex items-center justify-between border cursor-pointer transition-all active:scale-[0.99] ${
                        isActive
                          ? 'bg-[#1C1E26] border-white/10'
                          : 'bg-[#181920] border-transparent hover:border-white/5'
                      }`}
                    >
                      {/* Left: Phone inside circle + Wallet Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#2B2E3D] flex items-center justify-center shrink-0 text-[#8E92A4]">
                          <Smartphone className="h-5 w-5 stroke-[1.8]" />
                        </div>

                        <div className="min-w-0">
                          <div className="text-[15px] font-bold text-white truncate">
                            {wallet.name || 'Wallet01-FCH'}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#8E92A4] bg-[#2B2E3D] px-1.5 py-0.5 rounded border border-white/5 font-mono">
                              Mnemonic
                            </span>
                            <span className="text-[12px] text-[#8E92A4] font-mono">
                              ≈ ${walletTotalUsd > 0 ? walletTotalUsd.toFixed(2) : '0'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Active Checkmark + 3 Dots with red badge */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        {isActive && (
                          <div className="w-6 h-6 rounded-full bg-[#00D084] flex items-center justify-center text-[#07070B] shadow-sm">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (wallet.seedPhrase) {
                                setView('backup_phrase');
                              }
                            }}
                            className="p-1 text-[#8E92A4] hover:text-white transition-colors"
                            title="Wallet Options"
                          >
                            <MoreVertical className="h-5 w-5 stroke-[1.8]" />
                          </button>
                          {/* Red notification dot matching Image 2 */}
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF3B30]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button: + Add Wallet (Purple matching Image 2) */}
            <div className="pt-4">
              <button
                onClick={() => setView('add_wallet')}
                className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] text-white font-semibold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <Plus className="h-5 w-5 stroke-[2.5]" />
                <span>Add Wallet</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2: ADD WALLET OPTIONS (Exact match to Image 3) */}
        {/* ========================================================== */}
        {view === 'add_wallet' && (
          <div className="space-y-4">
            {/* Header: < Add Wallet */}
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={() => setView('my_wallets')}
                className="text-white hover:text-slate-300 transition-colors p-1"
              >
                <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
              </button>
              <h2 className="text-[20px] font-bold text-white tracking-tight">
                Add Wallet
              </h2>
            </div>

            {/* 4 Cards matching Image 3 */}
            <div className="space-y-3 pt-2">
              {/* Card 1: Create New Wallet */}
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('landing');
                }}
                className="w-full p-4 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5B4DF6]/20 text-[#5B4DF6] flex items-center justify-center shrink-0">
                  <Plus className="h-5 w-5 stroke-[2.5]" />
                </div>
                <span className="text-[16px] font-semibold text-white">
                  Create New Wallet
                </span>
              </button>

              {/* Card 2: Add Existing Wallet */}
              <button
                onClick={() => setView('import_phrase')}
                className="w-full p-4 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </div>
                <span className="text-[16px] font-semibold text-white">
                  Add Existing Wallet
                </span>
              </button>

              {/* Card 3: Connect Hardware Wallet */}
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('landing');
                }}
                className="w-full p-4 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Link2 className="h-5 w-5 stroke-[2.5]" />
                </div>
                <span className="text-[16px] font-semibold text-white">
                  Connect Hardware Wallet
                </span>
              </button>

              {/* Card 4: Observation Wallet */}
              <button
                onClick={() => setView('import_phrase')}
                className="w-full p-4 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Eye className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[16px] font-semibold text-white">
                  Observation Wallet
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 3: IMPORT SEED PHRASE */}
        {/* ========================================================== */}
        {view === 'import_phrase' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={() => setView('add_wallet')}
                className="text-white hover:text-slate-300 transition-colors p-1"
              >
                <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
              </button>
              <h2 className="text-[20px] font-bold text-white tracking-tight">
                Import Existing Wallet
              </h2>
            </div>

            <form onSubmit={handleExecuteImport} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#8E92A4] uppercase tracking-wider block mb-2">
                  Recovery Phrase (12 or 24 words)
                </label>
                <textarea
                  rows={4}
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  placeholder="Enter mnemonic words separated by space..."
                  className="w-full rounded-2xl bg-[#1C1E26] border border-white/10 p-3.5 text-white text-[14px] font-mono placeholder-[#60616C] focus:outline-none focus:border-[#5B4DF6] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E92A4] uppercase tracking-wider block mb-2">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Wallet Name"
                  className="w-full rounded-2xl bg-[#1C1E26] border border-white/10 px-4 py-3 text-white text-[14px] placeholder-[#60616C] focus:outline-none focus:border-[#5B4DF6]"
                />
              </div>

              {importError && (
                <p className="text-[#FF5252] text-xs font-medium">{importError}</p>
              )}

              <button
                type="submit"
                disabled={isImporting}
                className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] disabled:opacity-50 text-white font-semibold text-[15px] shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer mt-2"
              >
                {isImporting ? 'Importing Wallet...' : 'Confirm & Import'}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 4: BACKUP RECOVERY PHRASE */}
        {/* ========================================================== */}
        {view === 'backup_phrase' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={() => setView('my_wallets')}
                className="text-white hover:text-slate-300 transition-colors p-1"
              >
                <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
              </button>
              <h2 className="text-[20px] font-bold text-white tracking-tight">
                Mnemonic Backup
              </h2>
            </div>

            <p className="text-xs text-[#8E92A4] leading-relaxed">
              Below is the secret recovery phrase for <strong className="text-white">{currentUser?.name}</strong>. Never disclose it to anyone.
            </p>

            <div className="p-4 rounded-2xl bg-[#1C1E26] border border-white/10">
              <p className="text-sm font-mono text-white leading-relaxed select-all">
                {currentUser?.seedPhrase || 'No recovery phrase saved for this session.'}
              </p>
            </div>

            <button
              onClick={handleCopySeed}
              className="w-full py-3.5 rounded-xl bg-[#222432] hover:bg-[#2D3042] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedPhrase ? (
                <>
                  <Check className="h-4 w-4 text-[#00D084]" />
                  <span className="text-[#00D084]">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Recovery Phrase</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
