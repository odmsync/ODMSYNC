/**
 * Netlify Serverless Function: Get Coverage Areas
 * 
 * Returns list of all coverage areas
 * 
 * Usage: GET /api/coverage/areas
 */

import type { Handler, HandlerEvent } from '@netlify/functions';

interface CoverageArea {
  name: string;
  nameAr: string;
  coordinates: number[][];
  status: 'covered' | 'coming-soon';
}

const COVERAGE_AREAS: CoverageArea[] = [
  {
    name: 'Tripoli',
    nameAr: 'طرابلس',
    coordinates: [[35.8497, 34.4347]], // Approximate center
    status: 'covered',
  },
  {
    name: 'Mina',
    nameAr: 'المينا',
    coordinates: [[35.8500, 34.4400]],
    status: 'covered',
  },
  {
    name: 'Dam w Farz',
    nameAr: 'دام و فرز',
    coordinates: [[35.8600, 34.4500]],
    status: 'covered',
  },
  {
    name: 'Qalamoun',
    nameAr: 'قلمون',
    coordinates: [[35.8700, 34.4600]],
    status: 'covered',
  },
  {
    name: 'Al-Qobbeh',
    nameAr: 'القبة',
    coordinates: [[35.8800, 34.4700]],
    status: 'covered',
  },
  {
    name: 'Beddawi',
    nameAr: 'بداوي',
    coordinates: [[35.8900, 34.4800]],
    status: 'coming-soon',
  },
];

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed. Use GET.',
      }),
    };
  }

  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        success: true,
        data: COVERAGE_AREAS,
      }),
    };
  } catch (error) {
    console.error('Coverage areas error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    };
  }
};

