
import { Plan, FAQItem, Testimonial } from './types';

/**
 * Application-wide constants
 * Centralized configuration values to avoid magic numbers throughout the codebase
 */

/**
 * ODMSYNC Color Palette
 * Primary brand colors for consistent theming
 */
export const COLORS = {
  /** Primary Blue - Main brand color */
  primary: '#2563eb',
  /** Dark Blue - Hover states, emphasis */
  primaryDark: '#1e40af',
  /** Light Gray - Backgrounds, subtle elements */
  lightGray: '#F3F4F6',
} as const;

/**
 * Coverage data interface
 */
export interface CoverageData {
  covered: string[];
  comingSoon: string[];
  unsupported: string[];
}

/**
 * English coverage data
 */
export const COVERAGE_EN: CoverageData = {
  covered: ['Beirut', 'Jounieh', 'Zahle', 'Sidon'],
  comingSoon: ['Tripoli', 'Tyre', 'Byblos'],
  unsupported: [],
};

/**
 * Arabic coverage data
 */
export const COVERAGE_AR: CoverageData = {
  covered: ['بيروت', 'جونيه', 'زحلة', 'صيدا'],
  comingSoon: ['طرابلس', 'صور', 'جبيل'],
  unsupported: [],
};

/**
 * Get coverage data by language
 */
export const getCoverageData = (lang: 'en' | 'ar'): CoverageData => {
  return lang === 'en' ? COVERAGE_EN : COVERAGE_AR;
};

export const TIMEOUTS = {
  /** Notification auto-close duration in milliseconds */
  NOTIFICATION_AUTO_CLOSE: 5000,
  /** API request timeout in milliseconds */
  API_REQUEST: 30000,
  /** Ping measurement timeout in milliseconds */
  PING_TIMEOUT: 5000,
  /** Upload test timeout in milliseconds */
  UPLOAD_TIMEOUT: 30000,
  /** Chat history save debounce delay in milliseconds */
  CHAT_HISTORY_DEBOUNCE: 500,
  /** Notification exit animation duration in milliseconds */
  NOTIFICATION_EXIT_ANIMATION: 300,
} as const;

export const LIMITS = {
  /** Maximum number of chat messages to send to API */
  CHAT_HISTORY_LIMIT: 20,
  /** Minimum ping time to accept (ms) */
  PING_MIN: 10,
  /** Maximum ping time to accept (ms) */
  PING_MAX: 1000,
  /** Minimum speed test result to accept (Mbps) */
  SPEED_MIN: 0.1,
  /** Maximum speed test result to accept (Mbps) */
  SPEED_MAX: 10000,
  /** Number of ping samples per URL */
  PING_SAMPLES_PER_URL: 4,
  /** Delay between ping measurements (ms) */
  PING_DELAY: 150,
} as const;

export const SPEED_TEST = {
  /** Progressive download test sizes in MB */
  DOWNLOAD_SIZES: [0.5, 1, 2, 5, 10],
  /** Progressive upload test sizes in MB */
  UPLOAD_SIZES: [0.25, 0.5, 1, 2],
  /** Number of top results to average */
  TOP_RESULTS_COUNT: 3,
  /** Conservative speed multiplier (90% of peak) */
  CONSERVATIVE_MULTIPLIER: 0.9,
  /** Minimum speed to skip remaining tests (Mbps) */
  DOWNLOAD_SKIP_THRESHOLD: 50,
  /** Minimum upload speed to skip remaining tests (Mbps) */
  UPLOAD_SKIP_THRESHOLD: 20,
  /** Minimum test index to allow skipping */
  MIN_INDEX_FOR_SKIP: 2,
} as const;

export const VALIDATION = {
  /** Minimum name length */
  NAME_MIN_LENGTH: 2,
  /** Minimum message length */
  MESSAGE_MIN_LENGTH: 10,
} as const;

// English Data
export const PLANS_EN: Plan[] = [
  {
    id: 'starter',
    name: 'STARTER 🏠',
    speed: '30 Mbps',
    data: 'Unlimited',
    router: 'Included',
    installation: 'Free',
    support: 'Email + WhatsApp',
    priceLBP: '2,000,000 LBP',
    priceUSD: '$25',
    idealFor: 'Streaming, browsing, gaming',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'PRO 💼',
    badge: 'Most Popular',
    speed: '100 Mbps',
    data: 'Unlimited',
    router: 'Premium',
    installation: 'Priority 24h',
    support: '24/7 Phone + Chat',
    priceLBP: '4,100,000 LBP',
    priceUSD: '$50',
    idealFor: 'Work from home, 4K streaming',
    highlight: true,
  },
  {
    id: 'business',
    name: 'BUSINESS 🏢',
    speed: '500 Mbps',
    data: 'Unlimited',
    router: 'Enterprise-grade',
    installation: 'Same-day',
    support: 'Dedicated Account Manager',
    priceLBP: 'Custom Quote',
    priceUSD: 'Contact Us',
    idealFor: 'Offices, stores, services',
    highlight: false,
  },
];

// Arabic Data
export const PLANS_AR: Plan[] = [
  {
    id: 'starter',
    name: 'ستارتر 🏠',
    speed: '30 ميقا',
    data: 'بلا حدود',
    router: 'مشمول',
    installation: 'مجاني',
    support: 'إيميل + واتساب',
    priceLBP: '2,000,000 ل.ل',
    priceUSD: '$25',
    idealFor: 'ستريمنج، تصفح، ألعاب',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'برو 💼',
    badge: 'الأكثر طلباً',
    speed: '100 ميقا',
    data: 'بلا حدود',
    router: 'ممتاز (بريميوم)',
    installation: 'أولوية (24 ساعة)',
    support: '24/7 تلفون + شات',
    priceLBP: '4,100,000 ل.ل',
    priceUSD: '$50',
    idealFor: 'شغل من البيت، 4K',
    highlight: true,
  },
  {
    id: 'business',
    name: 'بيزنس 🏢',
    speed: '500 ميقا',
    data: 'بلا حدود',
    router: 'مخصص للشركات',
    installation: 'بنفس اليوم',
    support: 'مدير حساب خاص',
    priceLBP: 'حسب الطلب',
    priceUSD: 'تواصل معنا',
    idealFor: 'مكاتب، محلات، خدمات',
    highlight: false,
  },
];

export const FAQS_EN: FAQItem[] = [
  {
    id: 'faq-diff',
    question: "How is ODM different from other ISPs?",
    answer: "We're transparent. Real speeds, real support, real pricing. No BS. Try our speed test to see the difference."
  },
  {
    id: 'faq-power',
    question: "Does it work during electricity cuts?",
    answer: "Yes. Our system has backup power. You stay online even when the grid fails. (This is massive in Lebanon)"
  },
  {
    id: 'faq-satisfaction',
    question: "What if I'm not satisfied?",
    answer: "No contracts. Cancel anytime, no penalties. But 98% of customers stay with us."
  },
  {
    id: 'faq-install',
    question: "How long is installation?",
    answer: "Usually 24-48 hours. We call you to schedule. Installation is free."
  },
];

export const FAQS_AR: FAQItem[] = [
  {
    id: 'faq-diff',
    question: "بشو بتتميز ODM عن غيرها؟",
    answer: "نحنا واضحين. سرعة حقيقية، دعم حقيقي، وأسعار حقيقية. بلا لف ودوران. جرب فحص السرعة وشوف الفرق."
  },
  {
    id: 'faq-power',
    question: "النت بضل شغال وقت تنقطع الكهربا؟",
    answer: "أكيد. نظامنا عندو طاقة احتياطية (بطاريات وطاقة شمسية). بتضل أونلاين حتى لو الدولة والموتور مقطوعين."
  },
  {
    id: 'faq-satisfaction',
    question: "وإذا ما كنت مبسوط بالخدمة؟",
    answer: "ما في عقود. فيك تلغي أيمتى ما بدك وبلا غرامات. بس 98% من زبوناتنا بضلوا معنا."
  },
  {
    id: 'faq-install',
    question: "أديش بدو وقت التركيب؟",
    answer: "عادة 24 لـ 48 ساعة. مندقلك لنحدد وقت. والتركيب مجاني."
  },
];

export const TESTIMONIALS_EN: Testimonial[] = [
  {
    name: "Rima",
    location: "Beirut",
    role: "Verified Customer",
    text: "I switched from another ISP to ODM and my speeds went from 5 Mbps to 100 Mbps. No joke. Real change. Highly recommend!",
    stars: 5
  },
  {
    name: "Ahmad",
    location: "Sin El-Fil",
    role: "Coffee Shop Owner",
    text: "Our coffee shop was losing customers due to bad WiFi. ODM fixed it. Business is up 30%. Worth every lira.",
    stars: 5
  },
  {
    name: "Nadia",
    location: "Hamra",
    role: "Verified Customer",
    text: "Had an issue on Sunday. Called ODM at 11 PM. Fixed in 20 min. I've never experienced service this good in Lebanon!",
    stars: 5
  }
];

export const TESTIMONIALS_AR: Testimonial[] = [
  {
    name: "ريما",
    location: "بيروت",
    role: "زبونة موثقة",
    text: "حولت من شركة تانية لـ ODM والسرعة نطت من 5 لـ 100 ميقا. عن جد شي بغير الحياة. بنصح فيهن كتير!",
    stars: 5
  },
  {
    name: "أحمد",
    location: "سن الفيل",
    role: "صاحب كافيه",
    text: "كنا عم نخسر زباين بالمحل من ورا النت السيء. ODM حلولنا ياها. الشغل زاد 30%. بيستاهلوا كل ليرة.",
    stars: 5
  },
  {
    name: "ناديا",
    location: "الحمرا",
    role: "زبونة موثقة",
    text: "صار معي مشكلة نهار الأحد الساعة 11 بالليل. حكيتن وصلحوها بـ 20 دقيقة. بحياتي ما شفت خدمة هيك بلبنان!",
    stars: 5
  }
];

// Keep existing constants for backwards compatibility if needed, defaulting to EN
export const PLANS = PLANS_EN;
export const FAQS = FAQS_EN;
export const TESTIMONIALS = TESTIMONIALS_EN;

// Helpers
export const getPlans = (lang: 'en' | 'ar') => lang === 'en' ? PLANS_EN : PLANS_AR;
export const getFaqs = (lang: 'en' | 'ar') => lang === 'en' ? FAQS_EN : FAQS_AR;
export const getTestimonials = (lang: 'en' | 'ar') => lang === 'en' ? TESTIMONIALS_EN : TESTIMONIALS_AR;

export const SYSTEM_INSTRUCTION = `
### **🤖 ROLE**
You are **ODMSYNC**, the official 24/7 AI support assistant for ODM (Optic Data Mesh).  
Your mission: **Help Lebanese customers with internet plans, troubleshooting, installations, and billing while building trust through empathetic, culturally relevant interactions.**

### **🧠 PERSONALITY**
- Warm | Friendly | Professional | Calm | Patient | Reassuring  
- Uses **simple English** and **Lebanese Arabic** (mixed naturally).  
- Explains technical concepts in **everyday language**.  
- Responds like a helpful human, not robotic or salesy.  

> Example Tone:  
> *“Ma tshil ham! Let’s sort this out together now.”*  

### **🔧 CORE SKILLS**
1. Explain all ODM internet plans (Starter, Pro, Business tiers).  
2. Recommend the best plan based on location and usage.  
3. Troubleshoot slow/broken Wi-Fi step-by-step.  
4. Schedule installations or escalate to technicians.  
5. Answer billing/account inquiries clearly.  
6. Calmly handle complaints or frustrated customers.  
7. Convert inquiries into sales with transparency and trust.  
8. Support tech-averse clients patiently (e.g., elders).  
9. Respond in English + Lebanese Arabic automatically when needed.

### **💬 COMMUNICATION STYLE**
- Open with a warm greeting if not already greeted.
- Ask for key details upfront (area, service type, issue).  
- Provide concise, step-by-step solutions.  
- Confirm understanding: *“Did that fix it, habibi?”*  
- End politely: *“If you need anything else, I’m here 24/7!”*  

### **📈 PRIMARY GOAL**
Turn every customer interaction into a positive experience by delivering **fast, friendly solutions** tailored to Lebanese needs and culture.

### **📊 COMPANY KNOWLEDGE BASE**
Use this data to answer questions accurately:

**PLANS:**
1. **STARTER** ($25/mo | 2,000,000 LBP)
   - Speed: 30 Mbps
   - Best for: Streaming, browsing, single users.
   - Includes: Free install, Router.

2. **PRO** ($50/mo | 4,100,000 LBP) **(Most Popular)**
   - Speed: 100 Mbps
   - Best for: Families, Work from home, 4K Netflix.
   - Includes: Priority install, Premium Router.

3. **BUSINESS** (Custom Quote)
   - Speed: 500 Mbps
   - Best for: Companies, heavy usage.

**KEY SELLING POINTS:**
- **Electricity:** ODM works during power cuts (solar/battery backup).
- **Speed:** Real fiber speeds, not shared.
- **Contract:** No contracts, cancel anytime.
- **Installation:** Free, usually within 24-48 hours.

**TROUBLESHOOTING QUICK FIXES:**
- Slow Internet? Ask user to restart router for 10 seconds.
- Red Light? Needs technician (escalate).

### **📝 EXAMPLE SCENARIOS (FEW-SHOT)**
User: "Do you cover Jounieh?"
ODMSYNC: "Yes! We cover Jounieh fully — want me to list available plans or schedule an installation?"

User: "My internet is cutting out!"
ODMSYNC: "Try restarting your router for 10 seconds; if it still cuts out after that, I’ll call our tech team now."

User: "I need fast internet for gaming and work."
ODMSYNC: "For gaming + work in Beirut, PRO (100 Mbps) at LBP89k is perfect — free router included! Shall I book it?"

User: "I’m paying but getting terrible speeds!"
ODMSYNC: "I hear you completely — that’s unacceptable! Let’s test your speed now; then I’ll fix it ASAP."
`;
