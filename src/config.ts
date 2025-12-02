/**
 * Configuration module
 * Centralized app configuration with environment variable handling
 */

/**
 * Get API key from environment (works in both Vite and Node.js contexts)
 * @returns API key string or empty string if not found
 */
const getApiKey = (): string => {
  // In Vite client-side: use import.meta.env (VITE_ prefix required for client access)
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any).env;
    if (env) {
      return env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    }
  }
  // In Node.js/server-side: use process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  }
  return '';
};

/**
 * Get base URL dynamically based on environment
 * @returns Base URL string
 */
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Server-side: use environment variable or default
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://odm-lb.com';
  }
  return 'https://odm-lb.com';
};

/**
 * Get domain from base URL
 * @returns Domain string or default domain
 */
const getDomain = (): string => {
  const baseUrl = getBaseUrl();
  try {
    return new URL(baseUrl).hostname;
  } catch {
    return 'odm-lb.com';
  }
};

export const config = {
  appName: 'ODMSYNC - Optic Data Mesh Lebanon',
  brandName: 'ODMSYNC',
  domain: getDomain(),
  baseUrl: getBaseUrl(),
  api: {
    geminiKey: getApiKey(),
  },
  features: {
    analytics: true,
    speedTest: true,
    chat: true,
    notifications: true,
  },
  contact: {
    email: 'support@odmsync.com',
    footerEmail: 'support@odmsync.com',
    phone: '+96170977970',
    whatsapp: '96170977970', // For wa.me URLs (without +)
    whatsappUrl: 'https://wa.me/96170977970',
    address: 'Tripoli – Dam w Farz'
  },
  defaults: {
    currency: 'USD',
    locale: 'en-LB',
  }
};
