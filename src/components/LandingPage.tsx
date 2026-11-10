import React, { useState, useEffect } from 'react';
import { useWallet, generateSeedPhrase } from '../context/WalletContext';
import {
  ChevronLeft,
  Fingerprint,
  Plus,
  ArrowRight,
  Link2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
  Key,
  QrCode,
  Sparkles,
  Smartphone,
  Delete,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setActiveTab,
    setCurrentUser,
    registerUser,
    restoreWalletWithSeed,
  } = useWallet();

  // Wizard state:
  // 'welcome' -> Image 10 (Own and Manage Your Assets)
  // 'pin_create' -> Image 9 (Create 6-digit password)
  // 'pin_confirm' -> Image 7 (Confirm 6 digit password)
  // 'touch_id' -> Image 6 (Enable Touch ID For Wallet Security)
  // 'creating' -> Image 5 (Creating your wallet...)
  // 'ready' -> Image 4 (Your Wallet is Ready!)
  // 'backup_words' -> View 12 Mnemonic words
  // 'import_choice' -> Image 3 (Add Existing Wallet options)
  // 'import_mnemonic' -> Input 12 seed words
  // 'hardware' -> Connect Hardware Wallet
  const [screen, setScreen] = useState<
    | 'welcome'
    | 'pin_create'
    | 'pin_confirm'
    | 'touch_id'
    | 'creating'
    | 'ready'
    | 'backup_words'
    | 'import_choice'
    | 'import_mnemonic'
    | 'hardware'
  >('welcome');

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [useLongPassword, setUseLongPassword] = useState(false);
  const [longPassword, setLongPassword] = useState('');
  const [showLongPassword, setShowLongPassword] = useState(false);

  // Mnemonic backup state
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const [mnemonicCopied, setMnemonicCopied] = useState(false);

  // Import state
  const [importMnemonicInput, setImportMnemonicInput] = useState('');
  const [importWalletName, setImportWalletName] = useState('Wallet01-H1W');
  const [importError, setImportError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Keypad click handler for 6-digit PIN
  const handleKeypadPress = (val: string) => {
    if (screen === 'pin_create') {
      if (pin.length < 6) {
        const next = pin + val;
        setPin(next);
        setPinError('');
        if (next.length === 6) {
          setTimeout(() => setScreen('pin_confirm'), 200);
        }
      }
    } else if (screen === 'pin_confirm') {
      if (confirmPin.length < 6) {
        const next = confirmPin + val;
        setConfirmPin(next);
        setPinError('');
        if (next.length === 6) {
          if (next === pin) {
            setTimeout(() => setScreen('touch_id'), 200);
          } else {
            setPinError('Passwords do not match. Please try again.');
            setTimeout(() => {
              setConfirmPin('');
            }, 600);
          }
        }
      }
    }
  };

  const handleKeypadBackspace = () => {
    if (screen === 'pin_create') {
      setPin((prev) => prev.slice(0, -1));
      setPinError('');
    } else if (screen === 'pin_confirm') {
      setConfirmPin((prev) => prev.slice(0, -1));
      setPinError('');
    }
  };

  // Complete wallet creation
  const handleFinalizeWalletCreation = async () => {
    setScreen('creating');
    const seed = generateSeedPhrase();
    setGeneratedMnemonic(seed);

    // Create user account with 6-digit PIN and seed phrase
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const walletName = `Wallet01-${randomSuffix}`;
    const generatedEmail = `safepal_${Date.now()}@safepal.io`;

    try {
      const res = await registerUser(walletName, generatedEmail, pin || '123456', '', seed);
      if (res.user) {
        setCurrentUser(res.user);
      }
    } catch (e) {
      console.warn('Wallet creation notice:', e);
    }

    // Transition from 'creating' to 'ready' after 1.6s animation (Image 5 -> Image 4)
    setTimeout(() => {
      setScreen('ready');
    }, 1600);
  };

  const handleEnableTouchId = async () => {
    // Attempt standard WebAuthn biometric prompt if supported
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      try {
        localStorage.setItem('safepal_biometrics_enabled', 'true');
      } catch (_) {}
    }
    handleFinalizeWalletCreation();
  };

  const handleSkipTouchId = () => {
    handleFinalizeWalletCreation();
  };

  const handleCopyMnemonic = () => {
    if (navigator?.clipboard && generatedMnemonic) {
      navigator.clipboard.writeText(generatedMnemonic);
      setMnemonicCopied(true);
      setTimeout(() => setMnemonicCopied(false), 2000);
    }
  };

  const handleFinishOnboarding = () => {
    setActiveTab('overview');
  };

  // Import existing wallet execution
  const handleExecuteMnemonicImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importMnemonicInput.trim()) {
      setImportError('Please enter a valid 12 or 24-word recovery phrase');
      return;
    }
    setIsImporting(true);
    setImportError('');
    try {
      const res = await restoreWalletWithSeed(importMnemonicInput.trim(), importWalletName.trim() || 'Imported Wallet');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setActiveTab('overview');
      } else {
        setImportError(res.message || 'Invalid mnemonic phrase. Please check spelling.');
      }
    } catch (err: any) {
      setImportError(err.message || 'Failed to import wallet.');
    } finally {
      setIsImporting(false);
    }
  };

  // SafePal Official Geometric S Logo
  const SafePalEmblem = ({ className = 'h-12 w-12' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 32L50 12L80 32L65 42L50 32L35 42L20 32Z"
        fill="currentColor"
      />
      <path
        d="M80 68L50 88L20 68L35 58L50 68L65 58L80 68Z"
        fill="currentColor"
      />
      <path
        d="M20 32L35 42V58L20 68V32Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path
        d="M80 32L65 42V58L80 68V32Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
    </svg>
  );

  // ==============================================================
  // 1. SCREEN: WELCOME / LANDING (Exact match to Image 10)
  // ==============================================================
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden font-sans select-none">
        {/* Deep Purple Radial Space Glow at Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-gradient-to-b from-[#4A32DB]/40 via-[#261775]/20 to-transparent blur-[120px] pointer-events-none" />

        {/* Top Header: SafePal Brand with Stars */}
        <div className="relative z-10 pt-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <SafePalEmblem className="h-6 w-6 text-white" />
            <span className="text-[19px] font-bold tracking-tight text-white">SafePal</span>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-white/40 ml-1" />
        </div>

        {/* Hero Title & Floating Coins Area */}
        <div className="relative z-10 my-auto text-left pt-6">
          <h1 className="text-[34px] sm:text-[38px] font-bold text-white tracking-tight leading-[1.15]">
            Own and Manage Your Assets
          </h1>
          <p className="text-[15px] text-[#8E92A4] mt-2 font-normal">
            100+ blockchains supported
          </p>

          {/* Floating Coin Orbit Visual matching Image 10 */}
          <div className="relative w-full h-64 mt-8 flex items-center justify-center">
            {/* Ambient Star Sparkles */}
            <div className="absolute top-4 left-10 text-white/30 text-xs">✦</div>
            <div className="absolute top-8 right-16 text-white/40 text-sm">✦</div>
            <div className="absolute bottom-6 left-12 text-white/30 text-xs">✦</div>
            <div className="absolute bottom-10 right-10 text-white/30 text-xs">✦</div>

            {/* Center SafePal App Icon (Rounded Purple Square) */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#6754F8] to-[#4A32DB] flex items-center justify-center shadow-2xl shadow-[#5433FF]/40 border border-white/20 z-10">
              <SafePalEmblem className="h-14 w-14 text-white" />
            </div>

            {/* Orbiting Coin 1: Ethereum (Top Left) */}
            <div className="absolute -top-1 left-8 w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-lg border border-black/10">
              <svg viewBox="0 0 784 1277" className="h-7 w-7">
                <polygon points="392.07 0 383.5 29.11 383.5 873.74 392.07 882.29 784.13 650.54" fill="#343434" />
                <polygon points="392.07 0 0 650.54 392.07 882.29 392.07 472.33" fill="#8C8C8C" />
                <polygon points="392.07 956.52 387.24 962.41 387.24 1263.28 392.07 1277.38 784.37 724.89" fill="#343434" />
                <polygon points="392.07 1277.38 392.07 956.52 0 724.89" fill="#8C8C8C" />
              </svg>
            </div>

            {/* Orbiting Coin 2: BNB (Top Right) */}
            <div className="absolute top-0 right-12 w-12 h-12 rounded-full bg-[#F3BA2F] flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 120 120" className="h-6 w-6 fill-white">
                <path d="M60 15L78 33L60 51L42 33L60 15ZM60 69L78 87L60 105L42 87L60 69ZM24 51L42 69L24 87L6 69L24 51ZM96 51L114 69L96 87L78 69L96 51ZM60 42L72 54L60 66L48 54L60 42Z" />
              </svg>
            </div>

            {/* Orbiting Coin 3: Tether USDT (Middle Left) */}
            <div className="absolute top-24 left-16 w-11 h-11 flex items-center justify-center drop-shadow-lg">
              <img src="/assets/usdt-trc20.png" alt="USDT" className="h-full w-full object-contain pointer-events-none select-none" />
            </div>

            {/* Orbiting Coin 4: Bitcoin (Middle Right) */}
            <div className="absolute top-20 right-6 w-14 h-14 rounded-full bg-[#F7931A] flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-black">₿</span>
            </div>

            {/* Orbiting Coin 5: TRON (Bottom Left) */}
            <div className="absolute bottom-4 left-10 w-11 h-11 rounded-full bg-[#FF060A] flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 201 193" className="h-6 w-6 fill-white">
                <path d="M157.045 79.1207C151.528 74.2165 143.865 66.7452 137.658 61.4579L137.275 61.228C136.662 60.7682 135.972 60.3851 135.244 60.1169C120.225 57.4349 50.3402 44.9061 48.9992 45.0594C48.6161 45.0977 48.2329 45.251 47.9264 45.4425L47.5816 45.7107C47.1602 46.1322 46.8153 46.6303 46.6238 47.205L46.5471 47.4349V48.6992V48.8908C54.4015 69.887 85.4743 138.623 91.6046 154.791C91.9877 155.902 92.6774 157.971 93.9801 158.086H94.2866C94.9762 158.086 97.9648 154.293 97.9648 154.293C97.9648 154.293 151.336 92.3008 156.739 85.7107C157.428 84.9061 158.041 84.0249 158.578 83.1054C158.731 82.3774 158.654 81.6494 158.386 80.9598C158.118 80.2701 157.62 79.6188 157.045 79.1207ZM111.605 86.3621L134.363 68.2778L147.735 80.0786L111.605 86.3621ZM102.754 85.1743L63.5586 54.3697L127.007 65.5958L102.754 85.1743ZM106.279 93.2203L146.394 87.0134L100.532 140.002L106.279 93.2203ZM58.233 57.4732L99.4973 90.9981L93.5203 140.04L58.233 57.4732Z" />
              </svg>
            </div>

            {/* Orbiting Coin 6: Solana (Bottom Right) */}
            <div className="absolute bottom-4 right-14 w-10 h-10 rounded-full bg-[#121418] border border-[#00FFA3]/40 flex items-center justify-center shadow-lg p-1.5">
              <svg viewBox="0 0 397 311" className="h-full w-full">
                <defs>
                  <linearGradient id="solWelcomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00FFA3" />
                    <stop offset="100%" stopColor="#DC1FFF" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#solWelcomeGrad)"
                  d="M64.6 237.9h317.4l-62.7 62.7H6.5l62.7-62.7zM64.6 3.8h317.4L319.3 66.5H6.5L64.6 3.8zm266.3 115.1H4.3l62.7 62.7h317.4l-62.7-62.7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 3 Bottom Action Buttons matching Image 10 */}
        <div className="relative z-10 space-y-3 pt-6 pb-2">
          {/* 1. Create New Wallet (Primary Purple Button) */}
          <button
            onClick={() => {
              setPin('');
              setConfirmPin('');
              setPinError('');
              setScreen('pin_create');
            }}
            className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] text-white font-semibold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            <span>Create New Wallet</span>
          </button>

          {/* 2. Add Existing Wallet (Dark Card Button) */}
          <button
            onClick={() => setScreen('import_choice')}
            className="w-full py-4 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-white font-semibold text-[15px] flex items-center justify-center gap-2 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            <span>Add Existing Wallet</span>
          </button>

          {/* 3. Connect Hardware Wallet (Dark Card Button) */}
          <button
            onClick={() => setScreen('hardware')}
            className="w-full py-4 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-white font-semibold text-[15px] flex items-center justify-center gap-2 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <Link2 className="h-4 w-4 stroke-[2.5]" />
            <span>Connect Hardware Wallet</span>
          </button>

          {/* Terms Footer */}
          <p className="text-center text-[12px] text-[#7C7D86] pt-3">
            By continuing, you agree to our{' '}
            <span className="text-white hover:underline cursor-pointer">Term of Use</span>
          </p>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 2. SCREEN: CREATE 6-DIGIT PASSWORD (Exact match to Image 9)
  // ==============================================================
  if (screen === 'pin_create') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
        {/* Top Header with Back button */}
        <div className="pt-2">
          <button
            onClick={() => setScreen('welcome')}
            className="p-1 text-white hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Title & 6 Rounded Pill Indicators */}
        <div className="text-left my-auto pt-4">
          <h2 className="text-[28px] sm:text-[30px] font-bold text-white tracking-tight leading-tight">
            Create 6-digit password
          </h2>

          {/* 6 Capsule Indicator Boxes matching Image 9 */}
          <div className="flex items-center justify-between gap-2.5 my-8">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`h-13 flex-1 rounded-xl transition-all flex items-center justify-center ${
                    isFilled
                      ? 'bg-[#2B2E3D] border border-[#5B4DF6]'
                      : 'bg-[#1C1E26] border border-white/5'
                  }`}
                >
                  {isFilled && <div className="h-3 w-3 rounded-full bg-white shadow-sm" />}
                </div>
              );
            })}
          </div>

          {/* Optional Long Password Toggle */}
          <div className="text-center mt-2">
            <button
              onClick={() => setUseLongPassword(!useLongPassword)}
              className="text-[#8E92A4] hover:text-white text-[14px] underline transition-colors"
            >
              Use Long Password
            </button>
          </div>
        </div>

        {/* Custom Numeric Keypad matching Image 9 */}
        <div className="grid grid-cols-3 gap-3 pt-6 pb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeypadPress(digit)}
              className="h-16 rounded-xl bg-[#1C1E26] hover:bg-[#282B38] active:bg-[#34384A] text-white text-[24px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeypadPress('0')}
            className="h-16 rounded-xl bg-[#1C1E26] hover:bg-[#282B38] active:bg-[#34384A] text-white text-[24px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleKeypadBackspace}
            className="h-16 rounded-xl bg-[#1C1E26] hover:bg-[#282B38] active:bg-[#34384A] text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Delete className="h-6 w-6 stroke-[1.8]" />
          </button>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 3. SCREEN: CONFIRM 6 DIGIT PASSWORD (Exact match to Image 7)
  // ==============================================================
  if (screen === 'pin_confirm') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
        {/* Top Header with Back button */}
        <div className="pt-2">
          <button
            onClick={() => {
              setConfirmPin('');
              setScreen('pin_create');
            }}
            className="p-1 text-white hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Title & 6 Rounded Pill Indicators */}
        <div className="text-left my-auto pt-4">
          <h2 className="text-[28px] sm:text-[30px] font-bold text-white tracking-tight leading-tight">
            Confirm 6 digit password
          </h2>

          {pinError && (
            <p className="text-[#FF5252] text-sm mt-2">{pinError}</p>
          )}

          {/* 6 Capsule Indicator Boxes matching Image 7 */}
          <div className="flex items-center justify-between gap-2.5 my-8">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx < confirmPin.length;
              return (
                <div
                  key={idx}
                  className={`h-13 flex-1 rounded-xl transition-all flex items-center justify-center ${
                    isFilled
                      ? 'bg-[#2B2E3D] border border-[#5B4DF6]'
                      : 'bg-[#1C1E26] border border-white/5'
                  }`}
                >
                  {isFilled && <div className="h-3 w-3 rounded-full bg-white shadow-sm" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Numeric Keypad matching Image 7 */}
        <div className="grid grid-cols-3 gap-3 pt-6 pb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeypadPress(digit)}
              className="h-16 rounded-xl bg-[#1C1E26] hover:bg-[#282B38] active:bg-[#34384A] text-white text-[24px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeypadPress('0')}
            className="h-16 rounded-xl bg-[#1C1E26] hover:bg-[#282B38] active:bg-[#34384A] text-white text-[24px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleKeypadBackspace}
            className="h-16 rounded-xl bg-[#1C1E26] hover:bg-[#282B38] active:bg-[#34384A] text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Delete className="h-6 w-6 stroke-[1.8]" />
          </button>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 4. SCREEN: ENABLE TOUCH ID / FINGERPRINT (Exact match to Image 6)
  // ==============================================================
  if (screen === 'touch_id') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
        {/* Top Header */}
        <div className="pt-2">
          <button
            onClick={() => setScreen('pin_confirm')}
            className="p-1 text-white hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Biometric Center Area */}
        <div className="text-center my-auto flex flex-col items-center justify-center">
          {/* Purple Fingerprint Icon with Concentric Rings */}
          <div className="w-28 h-28 rounded-full bg-[#5B4DF6]/15 flex items-center justify-center mb-6 ring-8 ring-[#5B4DF6]/10">
            <Fingerprint className="h-16 w-16 text-[#5B4DF6] stroke-[1.5]" />
          </div>

          <h2 className="text-[30px] font-bold text-white tracking-tight">
            Enable Touch ID
          </h2>
          <p className="text-[17px] text-[#8E92A4] mt-1 font-normal">
            For Wallet Security
          </p>
        </div>

        {/* Buttons at bottom */}
        <div className="space-y-3 pt-6 pb-2">
          <button
            onClick={handleEnableTouchId}
            className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] text-white font-semibold text-[16px] shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer"
          >
            Enable
          </button>
          <button
            onClick={handleSkipTouchId}
            className="w-full py-3 text-center text-[#8E92A4] hover:text-white text-[15px] font-medium transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 5. SCREEN: CREATING YOUR WALLET ANIMATION (Exact match to Image 5)
  // ==============================================================
  if (screen === 'creating') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col items-center justify-center p-6 max-w-md mx-auto select-none font-sans">
        {/* Pulsing SafePal Emblem */}
        <div className="w-24 h-24 rounded-3xl bg-[#5B4DF6]/20 border border-[#5B4DF6]/40 flex items-center justify-center mb-8 animate-pulse shadow-2xl shadow-[#5B4DF6]/30">
          <SafePalEmblem className="h-14 w-14 text-[#5B4DF6]" />
        </div>

        <h2 className="text-[28px] font-bold text-white tracking-tight">
          Creating your wallet•••
        </h2>
        <p className="text-[15px] text-[#8E92A4] mt-2 font-normal text-center">
          Your crypto companion will be ready soon.
        </p>
      </div>
    );
  }

  // ==============================================================
  // 6. SCREEN: YOUR WALLET IS READY! (Exact match to Image 4)
  // ==============================================================
  if (screen === 'ready') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
        <div />

        {/* Center Emblem & Message */}
        <div className="text-center my-auto flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-[#5B4DF6]/20 border border-[#5B4DF6]/40 flex items-center justify-center mb-8 shadow-2xl shadow-[#5B4DF6]/30">
            <SafePalEmblem className="h-14 w-14 text-[#5B4DF6]" />
          </div>

          <h2 className="text-[32px] font-bold text-white tracking-tight">
            Your Wallet is Ready!
          </h2>
          <p className="text-[15px] text-[#8E92A4] mt-3 font-normal leading-relaxed text-center px-2">
            Secure your wallet by saving your mnemonic phrase. This unique set of words is your only key to access your funds. SafePal cannot store or recover it for you.
          </p>
        </div>

        {/* Action Buttons matching Image 4 */}
        <div className="space-y-3 pt-6 pb-2">
          <button
            onClick={() => setScreen('backup_words')}
            className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] text-white font-semibold text-[16px] shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer"
          >
            Back Up Now
          </button>
          <button
            onClick={handleFinishOnboarding}
            className="w-full py-4 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-white font-semibold text-[15px] border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            Skip Backup
          </button>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 7. SCREEN: VIEW 12 MNEMONIC BACKUP WORDS
  // ==============================================================
  if (screen === 'backup_words') {
    const words = generatedMnemonic.split(' ');
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
        {/* Top Header */}
        <div className="pt-2">
          <button
            onClick={() => setScreen('ready')}
            className="p-1 text-white hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>
        </div>

        <div className="my-auto pt-2">
          <h2 className="text-[26px] font-bold text-white tracking-tight">
            Back Up Mnemonic Phrase
          </h2>
          <p className="text-[14px] text-[#8E92A4] mt-1 font-normal leading-relaxed">
            Write down these 12 words in order and store them in a secure place offline.
          </p>

          {/* 12 Words Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-6">
            {words.map((w, idx) => (
              <div
                key={idx}
                className="bg-[#1C1E26] border border-white/5 rounded-xl py-3 px-2 flex items-center justify-start gap-1.5"
              >
                <span className="text-[#8E92A4] text-xs font-mono w-4 text-right">
                  {idx + 1}.
                </span>
                <span className="text-white text-sm font-semibold truncate font-mono">
                  {w}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCopyMnemonic}
            className="w-full py-3 rounded-xl bg-[#222432] hover:bg-[#2D3042] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {mnemonicCopied ? (
              <>
                <Check className="h-4 w-4 text-[#00D084]" />
                <span className="text-[#00D084]">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy 12-Word Phrase</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-6 pb-2">
          <button
            onClick={handleFinishOnboarding}
            className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] text-white font-semibold text-[16px] shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer"
          >
            I Have Saved It Securely
          </button>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 8. SCREEN: ADD WALLET OPTIONS (Exact match to Image 3)
  // ==============================================================
  if (screen === 'import_choice') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
        {/* Top Header matching Image 3 */}
        <div className="pt-2">
          <button
            onClick={() => setScreen('welcome')}
            className="p-1 text-white hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>
          <h2 className="text-[28px] font-bold text-white tracking-tight mt-4">
            Add Wallet
          </h2>
        </div>

        {/* 4 Cards matching Image 3 */}
        <div className="space-y-3.5 my-auto">
          {/* Card 1: Create New Wallet */}
          <button
            onClick={() => {
              setPin('');
              setConfirmPin('');
              setPinError('');
              setScreen('pin_create');
            }}
            className="w-full p-5 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5B4DF6]/20 text-[#5B4DF6] flex items-center justify-center shrink-0">
              <Plus className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[17px] font-semibold text-white">
              Create New Wallet
            </span>
          </button>

          {/* Card 2: Add Existing Wallet */}
          <button
            onClick={() => setScreen('import_mnemonic')}
            className="w-full p-5 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[17px] font-semibold text-white">
              Add Existing Wallet
            </span>
          </button>

          {/* Card 3: Connect Hardware Wallet */}
          <button
            onClick={() => setScreen('hardware')}
            className="w-full p-5 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Link2 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[17px] font-semibold text-white">
              Connect Hardware Wallet
            </span>
          </button>

          {/* Card 4: Observation Wallet */}
          <button
            onClick={() => setScreen('import_mnemonic')}
            className="w-full p-5 rounded-2xl bg-[#1C1E26] hover:bg-[#252834] text-left flex items-center gap-3.5 border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Eye className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-[17px] font-semibold text-white">
              Observation Wallet
            </span>
          </button>
        </div>

        <div className="pb-2" />
      </div>
    );
  }

  // ==============================================================
  // 9. SCREEN: IMPORT EXISTING MNEMONIC WALLET
  // ==============================================================
  if (screen === 'import_mnemonic') {
    return (
      <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
        <div className="pt-2">
          <button
            onClick={() => setScreen('import_choice')}
            className="p-1 text-white hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
          </button>
          <h2 className="text-[28px] font-bold text-white tracking-tight mt-4">
            Import Existing Wallet
          </h2>
          <p className="text-[14px] text-[#8E92A4] mt-1 font-normal">
            Enter your 12 or 24-word recovery phrase or private key.
          </p>
        </div>

        <form onSubmit={handleExecuteMnemonicImport} className="my-auto space-y-4 pt-4">
          <div>
            <label className="text-xs font-semibold text-[#8E92A4] uppercase tracking-wider block mb-2">
              Recovery Phrase
            </label>
            <textarea
              rows={4}
              value={importMnemonicInput}
              onChange={(e) => setImportMnemonicInput(e.target.value)}
              placeholder="word1 word2 word3 ... word12"
              className="w-full rounded-2xl bg-[#1C1E26] border border-white/10 p-4 text-white text-[15px] font-mono placeholder-[#60616C] focus:outline-none focus:border-[#5B4DF6] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8E92A4] uppercase tracking-wider block mb-2">
              Wallet Name
            </label>
            <input
              type="text"
              value={importWalletName}
              onChange={(e) => setImportWalletName(e.target.value)}
              placeholder="Wallet01-H1W"
              className="w-full rounded-2xl bg-[#1C1E26] border border-white/10 px-4 py-3.5 text-white text-[15px] placeholder-[#60616C] focus:outline-none focus:border-[#5B4DF6]"
            />
          </div>

          {importError && (
            <p className="text-[#FF5252] text-xs font-medium">{importError}</p>
          )}

          <button
            type="submit"
            disabled={isImporting}
            className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] disabled:opacity-50 text-white font-semibold text-[16px] shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer mt-4"
          >
            {isImporting ? 'Importing Wallet...' : 'Confirm & Import'}
          </button>
        </form>

        <div className="pb-2" />
      </div>
    );
  }

  // ==============================================================
  // 10. SCREEN: CONNECT HARDWARE WALLET (SafePal S1 / X1)
  // ==============================================================
  return (
    <div className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between p-6 max-w-md mx-auto select-none font-sans">
      <div className="pt-2">
        <button
          onClick={() => setScreen('welcome')}
          className="p-1 text-white hover:text-slate-300 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
        </button>
        <h2 className="text-[28px] font-bold text-white tracking-tight mt-4">
          Connect Hardware Wallet
        </h2>
        <p className="text-[14px] text-[#8E92A4] mt-1 font-normal">
          Air-gapped 100% offline cold storage with SafePal S1 & X1.
        </p>
      </div>

      <div className="my-auto text-center p-6 rounded-3xl bg-[#1C1E26] border border-white/5 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#5B4DF6]/20 text-[#5B4DF6] flex items-center justify-center mx-auto">
          <QrCode className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Scan QR to Pair</h3>
        <p className="text-xs text-[#8E92A4] leading-relaxed">
          Power on your SafePal S1 hardware wallet, navigate to Settings &gt; Scan, and scan the pairing code.
        </p>
      </div>

      <div className="pt-6 pb-2">
        <button
          onClick={() => {
            // Pair simulated hardware wallet
            handleFinalizeWalletCreation();
          }}
          className="w-full py-4 rounded-2xl bg-[#5B4DF6] hover:bg-[#4E3FE7] text-white font-semibold text-[16px] shadow-lg shadow-[#5B4DF6]/25 active:scale-[0.99] transition-transform cursor-pointer"
        >
          Pair SafePal S1
        </button>
      </div>
    </div>
  );
};
