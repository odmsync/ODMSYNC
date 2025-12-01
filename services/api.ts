/**
 * API Service Layer
 * Handles all backend API calls with proper error handling and timeouts
 */

import { config } from '../config';
import { TIMEOUTS } from '../constants';
import { logger } from '../utils/logger';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'support' | 'sales' | 'billing';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Base API URL - can be configured via environment variable
 */
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || 'https://api.odm-lb.com';
  }
  return process.env.VITE_API_BASE_URL || 'https://api.odm-lb.com';
};

/**
 * Generic API fetch wrapper with timeout and improved error handling
 * @param endpoint - API endpoint path
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise resolving to API response with success/error status
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.API_REQUEST);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Check content-type before parsing JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJson
        ? await response.json().catch(() => ({
            error: `HTTP ${response.status}: ${response.statusText}`,
          }))
        : { error: `HTTP ${response.status}: ${response.statusText}` };
      
      logger.warn('API request failed', { 
        url, 
        status: response.status, 
        error: errorData.error || errorData.message 
      });
      
      return {
        success: false,
        error: errorData.error || errorData.message || 'An error occurred',
      };
    }

    if (!isJson) {
      logger.warn('API returned non-JSON response', { url, contentType });
      return {
        success: false,
        error: `Unexpected response type: ${contentType}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle specific error types
    if (error instanceof DOMException && error.name === 'AbortError') {
      logger.error('API request timeout', { url, timeout: TIMEOUTS.API_REQUEST });
      return {
        success: false,
        error: 'Request timeout - please try again',
      };
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logger.error('Network error in API request', { url, error });
      return {
        success: false,
        error: 'Network error - please check your connection',
      };
    }
    
    logger.error('Unexpected error in API request', { url, error });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Submit contact form
 */
export async function submitContactForm(
  formData: ContactFormData
): Promise<ApiResponse<{ id: string; timestamp: string }>> {
  return apiRequest<{ id: string; timestamp: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

/**
 * Check coverage for an address
 */
export async function checkCoverage(
  address: string,
  latitude?: number,
  longitude?: number
): Promise<ApiResponse<{ available: boolean; estimatedSpeed?: number }>> {
  return apiRequest<{ available: boolean; estimatedSpeed?: number }>(
    '/api/coverage/check',
    {
      method: 'POST',
      body: JSON.stringify({ address, latitude, longitude }),
    }
  );
}

/**
 * Get coverage areas
 */
export async function getCoverageAreas(): Promise<
  ApiResponse<Array<{ name: string; coordinates: number[][] }>>
> {
  return apiRequest<Array<{ name: string; coordinates: number[][] }>>(
    '/api/coverage/areas'
  );
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(
  email: string
): Promise<ApiResponse<{ subscribed: boolean }>> {
  return apiRequest<{ subscribed: boolean }>('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Request installation quote
 */
export interface InstallationQuoteRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  planId?: string;
  preferredDate?: string;
}

export async function requestInstallationQuote(
  request: InstallationQuoteRequest
): Promise<ApiResponse<{ quoteId: string; estimatedDate: string }>> {
  return apiRequest<{ quoteId: string; estimatedDate: string }>(
    '/api/installation/quote',
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );
}

