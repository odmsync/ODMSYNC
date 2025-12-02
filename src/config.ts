/**
 * Configuration module
 * Centralized app configuration with environment variable handling
 */

/**
 * Get base URL dynamically based on environment
 * @returns Base URL string
 */
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Fallback for SSR (shouldn't happen in this SPA)
  return import.meta.env.VITE_SITE_URL || 'https://odm-lb.com';
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
