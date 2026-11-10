/**
 * Universal API URL Resolver
 * Handles routing API requests accurately whether running on:
 * 1. Web Browser (relative /api/ routes)
 * 2. Mobile APK / Capacitor / Cordova / WebView (routes to live VPS backend https://safepalweb3.sbs)
 * 3. Custom configured VPS or dev server
 */

const DEFAULT_PRODUCTION_BACKEND = 'https://safepalweb3.sbs';

export function getCustomBackendUrl(): string | null {
  try {
    const saved = localStorage.getItem('safepal_custom_backend_url');
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  } catch (e) {
    // LocalStorage unavailable
  }
  return null;
}

export function setCustomBackendUrl(url: string | null): void {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem('safepal_custom_backend_url');
    } else {
      localStorage.setItem('safepal_custom_backend_url', url.trim().replace(/\/+$/, ''));
    }
  } catch (e) {}
}

export function isMobileApkEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  const protocol = window.location.protocol || '';
  const origin = window.location.origin || '';
  const hostname = window.location.hostname || '';
  const port = window.location.port || '';

  // Check for Capacitor, Cordova, file://, or bundled localhost webview
  const isCapacitor = origin.includes('capacitor://') || origin.includes('ionic://');
  const isCordova = protocol === 'file:';
  const isLocalHostApk =
    (hostname === 'localhost' || hostname === '127.0.0.1') &&
    port !== '3000' &&
    port !== '5173' &&
    port !== '4173';

  // Check Android WebView user agent
  const userAgent = navigator.userAgent || '';
  const isAndroidWebView =
    /wv|Android.*Version\/[\d.]+/i.test(userAgent) &&
    (isLocalHostApk || isCapacitor || isCordova);

  return Boolean(isCapacitor || isCordova || isLocalHostApk || isAndroidWebView);
}

export function getApiBaseUrl(): string {
  // 1. User/Admin configured custom backend
  const custom = getCustomBackendUrl();
  if (custom) return custom;

  // 2. APK / Hybrid Mobile App environment -> Point to live VPS backend
  if (isMobileApkEnvironment()) {
    return DEFAULT_PRODUCTION_BACKEND;
  }

  // 3. Standard web browser -> Use same origin relative paths
  return '';
}

export function apiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!base) return cleanEndpoint;
  return `${base}${cleanEndpoint}`;
}
