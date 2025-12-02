/**
 * Netlify Serverless Function: Coverage Check
 * 
 * Checks if an address is in ODM coverage area
 * 
 * Usage: POST /api/coverage/check
 * Body: { address, latitude?, longitude? }
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

interface CoverageRequest {
  address: string;
  latitude?: number;
  longitude?: number;
}

// Coverage areas (North Lebanon)
const COVERAGE_AREAS = [
  'tripoli', 'طرابلس',
  'mina', 'المينا', 'al-mina',
  'dam w farz', 'dam w farz', 'دام و فرز',
  'qalamoun', 'قلمون',
  'al-qobbeh', 'القبة',
  'zgharta', 'زغرتا',
  'koura', 'الكورة',
];

const COMING_SOON_AREAS = [
  'beddawi', 'بداوي',
  'beb el-tebbaneh', 'باب التبانة',
  'abu samra', 'أبو سمرة',
];

export const handler: Handler = async (event: HandlerEvent) => {
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

  try {
    const body: CoverageRequest = JSON.parse(event.body || '{}');

    if (!body.address || typeof body.address !== 'string') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Address is required',
        }),
      };
    }

    const addressLower = body.address.toLowerCase().trim();

    // Check if covered
    const isCovered = COVERAGE_AREAS.some(area => 
      addressLower.includes(area.toLowerCase())
    );

    // Check if coming soon
    const isComingSoon = COMING_SOON_AREAS.some(area =>
      addressLower.includes(area.toLowerCase())
    );

    // Estimate speed based on area (mock data)
    let estimatedSpeed: number | undefined;
    if (isCovered) {
      // Tripoli/Mina areas might have better speeds
      if (addressLower.includes('tripoli') || addressLower.includes('mina')) {
        estimatedSpeed = 50; // Mbps
      } else {
        estimatedSpeed = 25; // Mbps
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          available: isCovered,
          comingSoon: isComingSoon,
          estimatedSpeed,
        },
      }),
    };
  } catch (error) {
    console.error('Coverage check error:', error);

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

