/**
 * Centralized formatting utilities
 * Provides consistent number, date, and unit formatting
 */

/**
 * Format milliseconds to readable string
 */
export const formatMs = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

/**
 * Format Mbps with consistent precision
 */
export const formatMbps = (mbps: number, precision: number = 1): string => {
  return `${mbps.toFixed(precision)} Mbps`;
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number, locale: string = 'en-LB'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-LB'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date based on locale
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'en-LB',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format phone number (removes spaces, adds formatting)
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '');
  // Lebanese format: +961 1 234 5678
  if (cleaned.startsWith('961')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

