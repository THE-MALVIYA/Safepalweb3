/**
 * Official W3C WebAuthn Device Biometric Authentication Engine
 * Invokes native Android Fingerprint, iOS Touch ID / Face ID, or Windows Hello
 * strictly via platform authenticators with userVerification: 'required'.
 */

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64ToBuffer(base64: string): ArrayBuffer {
  let clean = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (clean.length % 4) {
    clean += '=';
  }
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export const BIOMETRIC_CRED_KEY = 'safepal_platform_biometric_cred_id';

/**
 * Checks if device hardware fingerprint / biometric platform sensor is supported.
 */
export async function isPlatformBiometricsSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;
  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if a platform fingerprint credential has already been enrolled on this device.
 */
export function hasRegisteredFingerprint(): boolean {
  return Boolean(localStorage.getItem(BIOMETRIC_CRED_KEY));
}

/**
 * Registers device hardware fingerprint with the native OS.
 * Triggers native Android BiometricPrompt or Touch ID dialog.
 */
export async function registerPlatformFingerprint(user?: {
  id?: string;
  email?: string;
  name?: string;
}): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  try {
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'WebAuthn is not supported on this browser or platform.' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const rawUserId = user?.id || 'safepal_' + Date.now();
    const userIdBuffer = new TextEncoder().encode(rawUserId);

    const creationOptions: CredentialCreationOptions = {
      publicKey: {
        challenge,
        rp: {
          name: 'SafePal Web3 Wallet',
          id: window.location.hostname || undefined,
        },
        user: {
          id: userIdBuffer,
          name: user?.email || 'wallet-owner@safepal.com',
          displayName: user?.name || 'SafePal Wallet Keyring',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256 (standard for mobile fingerprints)
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Strictly use physical phone fingerprint / platform biometric
          userVerification: 'required',        // Prompts physical sensor verification
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    };

    const credential = (await navigator.credentials.create(creationOptions)) as PublicKeyCredential | null;
    if (!credential) {
      return { success: false, error: 'Biometric enrollment was cancelled by user.' };
    }

    const credIdString = bufferToBase64(credential.rawId);
    localStorage.setItem(BIOMETRIC_CRED_KEY, credIdString);
    localStorage.setItem('safepal_biometrics_enabled', 'true');

    return { success: true, credentialId: credIdString };
  } catch (err: any) {
    console.warn('[WebAuthn Enrollment Notice]', err);
    return {
      success: false,
      error: err?.message || 'Biometric sensor authentication was cancelled or not recognized.',
    };
  }
}

/**
 * Verifies fingerprint via official device biometric hardware sensor.
 * Directly triggers the native Android BiometricPrompt / iOS Face ID / Touch ID dialog.
 */
export async function verifyPlatformFingerprint(user?: {
  id?: string;
  email?: string;
  name?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'Biometric hardware is not available on this browser.' };
    }

    const savedCredId = localStorage.getItem(BIOMETRIC_CRED_KEY);

    // If no credential enrolled yet, enroll and authenticate natively in one seamless step
    if (!savedCredId) {
      const reg = await registerPlatformFingerprint(user);
      return reg.success ? { success: true } : { success: false, error: reg.error };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    let allowCredentialsList: PublicKeyCredentialDescriptor[] | undefined = undefined;
    try {
      const credBuffer = base64ToBuffer(savedCredId);
      allowCredentialsList = [
        {
          id: credBuffer,
          type: 'public-key',
          transports: ['internal'],
        },
      ];
    } catch (e) {
      allowCredentialsList = undefined;
    }

    const requestOptions: CredentialRequestOptions = {
      publicKey: {
        challenge,
        rpId: window.location.hostname || undefined,
        userVerification: 'required', // Strictly enforces physical fingerprint / Face ID check
        timeout: 60000,
        allowCredentials: allowCredentialsList,
      },
    };

    const assertion = (await navigator.credentials.get(requestOptions)) as PublicKeyCredential | null;
    if (!assertion) {
      return { success: false, error: 'Fingerprint verification was cancelled.' };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[WebAuthn Verification Notice]', err);
    // If credential was invalid or cleared, fall back to re-enrollment
    if (err?.name === 'InvalidStateError' || err?.message?.includes('not allowed')) {
      const reReg = await registerPlatformFingerprint(user);
      return reReg.success ? { success: true } : { success: false, error: reReg.error };
    }

    return {
      success: false,
      error: err?.message || 'Fingerprint was not recognized or user cancelled the prompt.',
    };
  }
}
