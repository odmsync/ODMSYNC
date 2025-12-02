/**
 * Netlify Serverless Function: Gemini AI Chat
 * 
 * Handles chat requests using Google Gemini API
 * API key is stored server-side for security
 * 
 * Usage: POST /.netlify/functions/gemini
 * Body: { prompt: string, conversationHistory?: Array }
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

interface GeminiRequest {
  prompt: string;
  conversationHistory?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
}

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed. Use POST.',
      }),
    };
  }

  try {
    const body: GeminiRequest = JSON.parse(event.body || '{}');
    const { prompt, conversationHistory } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify({
          success: false,
          error: 'Missing or invalid prompt',
        }),
      };
    }

    // Get API key from environment (server-side only)
    // Only use GEMINI_API_KEY - VITE_ prefixed vars are for client-side only
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify({
          success: false,
          error: 'Gemini API key not configured. Please contact support.',
        }),
      };
    }

    // Build request payload
    const requestPayload: {
      contents: Array<{
        role?: 'user' | 'model';
        parts: Array<{ text: string }>;
      }>;
    } = {
      contents: [],
    };

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      requestPayload.contents = conversationHistory.map((msg) => ({
        role: msg.role,
        parts: msg.parts,
      }));
    }

    // Add current prompt
    requestPayload.contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));

      console.error('Gemini API error:', {
        status: response.status,
        error: errorData,
      });

      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify({
          success: false,
          error: errorData.error?.message || errorData.error || 'Gemini API request failed',
        }),
      };
    }

    const result = await response.json();

    // Extract text from Gemini response
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      console.error('Gemini API returned empty response:', result);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify({
          success: false,
          error: 'Empty response from Gemini API',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        success: true,
        data: {
          text,
          fullResponse: result, // Include full response for debugging if needed
        },
      }),
    };
  } catch (error) {
    console.error('Gemini function error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    };
  }
};

