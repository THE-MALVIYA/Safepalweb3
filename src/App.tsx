import React from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import { MarketsView } from './components/MarketsView';
import { SwapView } from './components/SwapView';
import { StakingView } from './components/StakingView';
import { NftGalleryView } from './components/NftGalleryView';
import { ExploreView } from './components/ExploreView';
import { CameraQrScannerModal } from './components/CameraQrScannerModal';
import { BiometricLockModal } from './components/BiometricLockModal';
import { SettingsView } from './components/SettingsView';
import { TransactionsView } from './components/TransactionsView';
import { AdminDashboard } from './components/AdminDashboard';
import { OverviewDashboard } from './components/OverviewDashboard';
import { AuthModal } from './components/AuthModal';
import { SendReceiveModal } from './components/SendReceiveModal';
import { Web3ConnectModal } from './components/Web3ConnectModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LiveTransactionToast } from './components/LiveTransactionToast';

const MainContent: React.FC = () => {
  const {
    activeTab,
    themeMode,
    currentUser,
    isCameraScannerOpen,
    setIsCameraScannerOpen,
    isBiometricLockOpen,
    setIsBiometricLockOpen,
    isBiometricsEnabled,
  } = useWallet();

  // Prompt biometric unlock on cold start if biometrics enabled
  React.useEffect(() => {
    if (isBiometricsEnabled && !sessionStorage.getItem('safepal_unlocked_session')) {
      setIsBiometricLockOpen(true);
    }
  }, [isBiometricsEnabled]);

  const isAdminAuthorized =
    currentUser?.email.toLowerCase() === 'legendxadmin1999@gmail.com' &&
    currentUser?.role === 'admin';

  const containerBg =
    themeMode === 'oled'
      ? 'bg-black text-slate-100'
      : themeMode === 'navy'
      ? 'bg-[#0B1120] text-slate-100'
      : themeMode === 'light'
      ? 'bg-[#F8FAFC] text-slate-900'
      : 'bg-[#0A0A0D] text-slate-100';

  return (
    <div className={`min-h-screen ${containerBg} font-sans`}>
      {/* Trust Wallet Style Floating 30-Second Live Transaction Toast */}
      <LiveTransactionToast />

      <Header />

      {/* Account Frozen Alert Banner */}
      {currentUser?.isFrozen && (
        <div className="bg-rose-900/90 border-b border-rose-500/50 px-4 py-3 text-white text-xs sm:text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-lg backdrop-blur-md sticky top-16 z-30">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <span>
            <strong>Account Verification Notice:</strong> Fraudulent payment activity detected on this account. SafePal compliance teams are currently verifying your transactions. Account features are restricted until review is finalized.
          </span>
        </div>
      )}

      <main className="pb-28 md:pb-12">
        {activeTab === 'overview' && <OverviewDashboard />}
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'portfolio' && <UserDashboard />}
        {activeTab === 'markets' && <MarketsView />}
        {activeTab === 'swap' && <SwapView />}
        {activeTab === 'staking' && <StakingView />}
        {activeTab === 'history' && <TransactionsView />}
        {activeTab === 'nft' && <NftGalleryView />}
        {activeTab === 'defi' && <ExploreView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'admin' && (isAdminAuthorized ? <AdminDashboard /> : <OverviewDashboard />)}
      </main>

      <AuthModal />
      <SendReceiveModal />
      <Web3ConnectModal />
      <NotificationDrawer />
      <MobileBottomNav />

      {/* Mobile APK Camera QR Scanner Modal */}
      <CameraQrScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
      />

      {/* Mobile APK Fingerprint Biometric & 6-Digit PIN Lock */}
      <BiometricLockModal
        isOpen={isBiometricLockOpen}
        onUnlockSuccess={() => {
          sessionStorage.setItem('safepal_unlocked_session', 'true');
          setIsBiometricLockOpen(false);
        }}
        onCancel={() => setIsBiometricLockOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <MainContent />
    </WalletProvider>
  );
}
