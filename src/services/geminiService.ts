
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, LIMITS } from "@/constants";
import { ChatMessage, SpeedTestRecommendation } from "@/types";
import { config } from "@/config";
import { logger } from "@/utils/logger";

// Initialize the client from config
const apiKey = config.api.geminiKey;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Demo mode message - shown when API key is not configured
 */
const DEMO_MODE_MESSAGE = "I'm currently in demo mode — your chat is private and not connected to any server. " +
  "For real help, please contact us on WhatsApp using the 'Talk to Human' button. " +
  "Your data stays on your device and is never sent to any server.";

/**
 * Sends a message to Gemini AI and returns the response
 * @param message - User's message text
 * @param history - Array of previous chat messages
 * @returns Promise resolving to AI response text
 */
export const sendMessageToGemini = async (
  message: string, 
  history: ChatMessage[]
): Promise<string> => {
  if (!apiKey || !ai) {
    logger.warn("Gemini API key not configured - demo mode");
    return DEMO_MODE_MESSAGE;
  }

  // Validate input
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    logger.warn("Empty or invalid message received");
    return "Please send a message so I can help you!";
  }

  // Limit history to prevent token overflow
  const recentHistory = history.slice(-LIMITS.CHAT_HISTORY_LIMIT);

  try {
    // Construct a prompt history string
    const conversationHistory = recentHistory
      .map(msg => `${msg.role === 'user' ? 'Customer' : 'Support Agent'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `
      ${SYSTEM_INSTRUCTION}
      
      Current Conversation:
      ${conversationHistory}
      Customer: ${message}
      Support Agent:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const responseText = response.text?.trim();
    
    if (!responseText) {
      logger.warn("Empty response from Gemini API");
      return "Sorry, I had a small glitch. Can you say that again?";
    }

    return responseText;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Gemini API Error", error);
    
    // Provide more helpful error messages based on error type
    if (errorMessage.includes('API_KEY') || errorMessage.includes('API key')) {
      return DEMO_MODE_MESSAGE;
    }
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      return "I'm getting too many requests right now. Please try again in a moment, or contact us on WhatsApp for faster help!";
    }
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
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
  if (!apiKey || !ai) {
    logger.warn("Gemini API key not configured - using fallback recommendation");
    // Fallback logic
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
  }

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text?.trim();
    
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    // Parse JSON response
    let parsed: SpeedTestRecommendation;
    try {
      // Remove markdown code blocks if present
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      logger.error("Failed to parse Gemini JSON response", { responseText, parseError });
      // Fallback to default recommendation
      return {
        recommendedPlanId: download < 20 ? 'starter' : download < 50 ? 'pro' : 'business',
        reason: {
          en: "Based on your speed test results, we recommend upgrading to a better plan.",
          ar: "بناءً على نتائج فحص السرعة، ننصح بالترقية إلى باقة أفضل."
        },
        urgency: download < 20 ? 'high' : download < 50 ? 'medium' : 'low'
      };
    }

    // Validate response structure
    if (!parsed.recommendedPlanId || !parsed.reason || !parsed.urgency) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Validate urgency value
    if (!['low', 'medium', 'high'].includes(parsed.urgency)) {
      parsed.urgency = 'medium';
    }

    return parsed;
  } catch (error: unknown) {
    logger.error("Speed test recommendation error", error);
    
    // Fallback recommendation based on download speed
    if (download < 20) {
      return {
        recommendedPlanId: 'starter',
        reason: {
          en: "Your high jitter suggests instability. The Starter plan offers stable speeds for basic needs.",
          ar: "التقطع العالي يشير إلى عدم الاستقرار. باقة Starter توفر سرعات مستقرة للاحتياجات الأساسية."
        },
        urgency: 'high'
      };
    }
    if (download < 50) {
      return {
        recommendedPlanId: 'pro',
        reason: {
          en: "Your moderate speed can be improved. The Pro plan offers better performance for streaming and work.",
          ar: "سرعتك المتوسطة يمكن تحسينها. باقة Pro توفر أداء أفضل للستريمنج والعمل."
        },
        urgency: 'medium'
      };
    }
    return {
      recommendedPlanId: 'business',
      reason: {
        en: "For optimal performance, consider the Business plan with dedicated routing.",
        ar: "للأداء الأمثل، فكر في باقة Business مع التوجيه المخصص."
      },
      urgency: 'low'
    };
  }
};
