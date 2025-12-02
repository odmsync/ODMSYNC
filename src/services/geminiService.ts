import { SYSTEM_INSTRUCTION, LIMITS } from "@/constants";
import { ChatMessage, SpeedTestRecommendation } from "@/types";
import { logger } from "@/utils/logger";

/**
 * Get Netlify Functions base URL
 * Uses serverless function for secure API key handling
 */
const getFunctionsBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    // Local development with Netlify CLI
    return 'http://localhost:8888/.netlify/functions';
  }
  // Production: Netlify Functions are at /.netlify/functions/
  return '/.netlify/functions';
};

/**
 * Demo mode message - shown when API key is not configured
 */
const DEMO_MODE_MESSAGE = "I'm currently in demo mode — your chat is private and not connected to any server. " +
  "For real help, please contact us on WhatsApp using the 'Talk to Human' button. " +
  "Your data stays on your device and is never sent to any server.";

/**
 * Sends a message to Gemini AI via Netlify Function and returns the response
 * API key is handled server-side for security
 * @param message - User's message text
 * @param history - Array of previous chat messages
 * @returns Promise resolving to AI response text
 */
export const sendMessageToGemini = async (
  message: string, 
  history: ChatMessage[]
): Promise<string> => {
  // Validate input
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    logger.warn("Empty or invalid message received");
    return "Please send a message so I can help you!";
  }

  // Limit history to prevent token overflow
  const recentHistory = history.slice(-LIMITS.CHAT_HISTORY_LIMIT);

  // Convert chat history to Gemini format
  const conversationHistory = recentHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: msg.text }],
  }));

  // Build full prompt with system instruction
  const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nCustomer: ${message}\nSupport Agent:`;

  try {
    const functionsUrl = getFunctionsBaseUrl();
    const response = await fetch(`${functionsUrl}/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        conversationHistory: conversationHistory.length > 0 ? conversationHistory : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));

      logger.error("Gemini function error", { status: response.status, error: errorData });

      if (response.status === 500 && errorData.error?.includes('not configured')) {
        return DEMO_MODE_MESSAGE;
      }

      if (response.status === 429) {
        return "I'm getting too many requests right now. Please try again in a moment, or contact us on WhatsApp for faster help!";
      }

      return "Sorry, I encountered an issue. Please try again or contact us on WhatsApp for immediate assistance!";
    }

    const result = await response.json();

    if (!result.success) {
      logger.error("Gemini function returned error", result);
      return result.error || "Sorry, I encountered an issue. Please try again.";
    }

    const responseText = result.data?.text?.trim();
    
    if (!responseText) {
      logger.warn("Empty response from Gemini function");
      return "Sorry, I had a small glitch. Can you say that again?";
    }

    return responseText;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Gemini function network error", error);
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
      return "Ops! My connection flickered (unlike ODM internet). Please check your internet and try again.";
    }
    
    return "Sorry, I encountered an issue. Please try again or contact us on WhatsApp for immediate assistance!";
  }
};

/**
 * Get AI-powered speed test recommendation with structured JSON response
 * @param download - Download speed in Mbps
 * @param upload - Upload speed in Mbps
 * @param ping - Ping time in ms
 * @param jitter - Jitter in ms
 * @param availablePlans - Array of available plans with their details
 * @returns Promise resolving to structured recommendation object
 */
export const getSpeedTestRecommendation = async (
  download: number,
  upload: number,
  ping: number,
  jitter: number,
  availablePlans: Array<{ id: string; name: string; speed: string; priceUSD: string }>
): Promise<SpeedTestRecommendation> => {
  // Fallback function for when API is unavailable
  const getFallbackRecommendation = (): SpeedTestRecommendation => {
    if (download < 20) {
      return {
        recommendedPlanId: 'starter',
        reason: {
          en: "Your current speed is below 20 Mbps. The Starter plan will provide stable 30 Mbps for basic needs.",
          ar: "سرعتك الحالية أقل من 20 ميجا. باقة Starter ستوفر 30 ميجا مستقرة للاستخدام الأساسي."
        },
        urgency: 'high'
      };
    }
    if (download < 50) {
      return {
        recommendedPlanId: 'pro',
        reason: {
          en: "Your speed is moderate. The Pro plan offers 100 Mbps for better streaming and work from home.",
          ar: "سرعتك متوسطة. باقة Pro توفر 100 ميجا للستريمنج والعمل من البيت بشكل أفضل."
        },
        urgency: 'medium'
      };
    }
    return {
      recommendedPlanId: 'business',
      reason: {
        en: "You need high-speed internet. The Business plan provides 500 Mbps for heavy usage.",
        ar: "تحتاج إنترنت عالي السرعة. باقة Business توفر 500 ميجا للاستخدام الثقيل."
      },
      urgency: 'low'
    };
  };

  try {
    const plansInfo = availablePlans.map(p => 
      `- ${p.name} (ID: ${p.id}): ${p.speed} at ${p.priceUSD}/month`
    ).join('\n');

    const prompt = `You are ODMSYNC, the AI support assistant for ODM internet service.

Analyze the following speed test results and recommend the best plan:

**Speed Test Results:**
- Download: ${download.toFixed(1)} Mbps
- Upload: ${upload.toFixed(1)} Mbps
- Ping: ${ping.toFixed(0)} ms
- Jitter: ${jitter.toFixed(0)} ms

**Available Plans:**
${plansInfo}

**Instructions:**
1. Analyze the speed test results (download, upload, ping, jitter)
2. Consider: High jitter suggests instability, low speeds indicate need for upgrade
3. Recommend the best plan ID from the available plans
4. Provide a reason in BOTH English and Arabic
5. Determine urgency: "high" (immediate upgrade needed), "medium" (recommended), "low" (optional)

**Response Format (JSON only, no other text):**
{
  "recommendedPlanId": "starter|pro|business",
  "reason": {
    "en": "English explanation here",
    "ar": "شرح بالعربية هنا"
  },
  "urgency": "high|medium|low"
}

Respond with ONLY valid JSON, no markdown, no code blocks.`;

    const functionsUrl = getFunctionsBaseUrl();
    const response = await fetch(`${functionsUrl}/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      logger.warn("Gemini function unavailable - using fallback recommendation");
      return getFallbackRecommendation();
    }

    const result = await response.json();

    if (!result.success || !result.data?.text) {
      logger.warn("Gemini function returned error - using fallback recommendation", result);
      return getFallbackRecommendation();
    }

    const responseText = result.data.text.trim();

    // Parse JSON response
    let parsed: SpeedTestRecommendation;
    try {
      // Remove markdown code blocks if present
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      logger.error("Failed to parse Gemini JSON response", { responseText, parseError });
      return getFallbackRecommendation();
    }

    // Validate response structure
    if (!parsed.recommendedPlanId || !parsed.reason || !parsed.urgency) {
      logger.warn("Invalid response structure from Gemini - using fallback");
      return getFallbackRecommendation();
    }

    // Validate urgency value
    if (!['low', 'medium', 'high'].includes(parsed.urgency)) {
      parsed.urgency = 'medium';
    }

    return parsed;
  } catch (error: unknown) {
    logger.error("Speed test recommendation error", error);
    return getFallbackRecommendation();
  }
};
