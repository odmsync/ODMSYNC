export interface Plan {
  id: string;
  name: string;
  badge?: string;
  speed: string;
  data: string;
  router: string;
  installation: string;
  support: string;
  priceLBP: string;
  priceUSD: string;
  idealFor: string;
  highlight: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  location: string;
  role: string;
  text: string;
  stars: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

export interface SpeedTestRecommendation {
  recommendedPlanId: string;
  reason: {
    en: string;
    ar: string;
  };
  urgency: 'low' | 'medium' | 'high';
}