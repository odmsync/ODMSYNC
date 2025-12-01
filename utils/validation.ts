/**
 * Validation utilities
 * Provides consistent validation functions for form inputs
 */

/**
 * Validates email address format
 * @param email - Email string to validate
 * @returns True if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates Lebanese mobile phone number
 * Accepts +961, 961, or 0 prefix
 * Valid prefixes: 70, 71, 76, 78, 79, 81, 86
 * Format: (+961|961|0)?(70|71|76|78|79|81|86)[0-9]{6}
 * @param phone - Phone string to validate
 * @returns True if phone is valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, '');
  const lebanesePattern = /^(\+961|961|0)?(70|71|76|78|79|81|86)[0-9]{6}$/;
  return lebanesePattern.test(cleaned);
};

/**
 * Validates minimum text length
 * @param text - Text string to validate
 * @param min - Minimum required length
 * @returns True if text meets minimum length, false otherwise
 */
export const validateLength = (text: string, min: number): boolean => {
  return text.length >= min;
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
