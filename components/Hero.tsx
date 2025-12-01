import React from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';
import { config } from '../config';

interface HeroProps {
  schemaOverrides?: Record<string, any>;
}

const Hero: React.FC<HeroProps> = ({ schemaOverrides }) => {
  const { t, language } = useLanguage();

  // Schema data for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ODM-LB",
    "description": "Reliable Lebanese internet provider",
    "url": config.baseUrl,
    "telephone": config.contact.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Beirut",
      "addressCountry": "LB"
    },
    ...schemaOverrides
  };

  return (
    <section 
      id="home"
      className="relative w-full bg-[#0A0F1F] text-white overflow-hidden"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      aria-labelledby="hero-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-7xl mx-auto px-6 py-28 sm:py-32 flex flex-col items-start justify-center">
        <h1 
          id="hero-heading"
          className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6"
        >
          {t.hero?.title1 || "Reliable Internet."}
          <span className="text-blue-400 block">
            {t.hero?.title2 || "Built for Lebanon."}
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10">
          {t.hero?.subtitle || "High-performance connectivity, modern infrastructure, and premium support — tailored for homes and businesses across Lebanon."}
        </p>

        <a
          href="#plans"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl text-lg font-semibold shadow-lg"
        >
          {t.hero?.cta_plans || "View Plans"}
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/40 via-black to-black" />
    </section>
  );
};

export default React.memo(Hero);
