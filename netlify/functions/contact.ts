/**
 * Netlify Serverless Function: Contact Form Handler
 * 
 * Handles contact form submissions and sends notifications
 * 
 * Usage: POST /api/contact
 * Body: { name, email, phone, message, type }
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'support' | 'sales' | 'billing';
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed. Use POST.',
      }),
    };
  }

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Parse request body
    const body: ContactFormData = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: name, email, message',
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
      };
    }

    // TODO: Here you would:
    // 1. Send email notification (using SendGrid, Mailgun, etc.)
    // 2. Save to database (using FaunaDB, MongoDB, etc.)
    // 3. Send to WhatsApp API (using Twilio, etc.)
    // 4. Log to analytics service

    // For now, log the submission (Netlify Functions logs are visible in dashboard)
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      type: body.type,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          id: `contact-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        message: 'Contact form submitted successfully',
      }),
    };
  } catch (error) {
    console.error('Contact form error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    };
  }
};

