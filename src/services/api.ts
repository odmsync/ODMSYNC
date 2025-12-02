/**
 * API Service Layer
 * Handles all backend API calls with proper error handling and timeouts
 */

import { TIMEOUTS } from '@/constants';
import { logger } from '@/utils/logger';

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
 * Base API URL - configured via Vite environment variable
 * In production on Netlify, functions are available at /.netlify/functions/
 * For local dev, use http://localhost:8888/.netlify/functions/
 */
const getApiBaseUrl = (): string => {
  // Use Netlify Functions if available (production or local dev)
  if (import.meta.env.DEV) {
    // Local development with Netlify CLI
    return 'http://localhost:8888/.netlify/functions';
  }
  
  // Production: Netlify Functions are at /.netlify/functions/
  // Fallback to custom API if VITE_API_BASE_URL is set
  return import.meta.env.VITE_API_BASE_URL || '/.netlify/functions';
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
  // Use Netlify Function endpoint
  return apiRequest<{ available: boolean; estimatedSpeed?: number }>(
    '/coverage-check',
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
  // Use Netlify Function endpoint
  return apiRequest<Array<{ name: string; coordinates: number[][] }>>(
    '/coverage-areas'
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

/**
 * Get AI-powered plan recommendation using Gemini
 * @param prompt - User's prompt/question about plans
 * @returns Promise resolving to Gemini API response
 */
export async function getPlanRecommendation(
  prompt: string
): Promise<ApiResponse<{ text: string; fullResponse?: unknown }>> {
  // Use Netlify Function endpoint
  return apiRequest<{ text: string; fullResponse?: unknown }>(
    '/gemini',
    {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }
  );
}
