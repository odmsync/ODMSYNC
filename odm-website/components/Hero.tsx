import React from 'react';
import { ShieldCheck, Clock, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { config } from '../config';

interface HeroProps {
  schemaOverrides?: Record<string, any>;
}

const Hero: React.FC<HeroProps> = ({ schemaOverrides }) => {
  const { t, language } = useLanguage();
  
  // Feature item component
  const FeatureItem = React.memo(({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <li className="flex items-center text-gray-600 text-sm">
      <span className={`flex-shrink-0 text-blue-500 ${language === 'ar' ? 'ml-2' : 'mr-2'}`}>
        {icon}
      </span>
      {text}
    </li>
  ));
  FeatureItem.displayName = 'FeatureItem';

  // Schema data with environment variables
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ODM-LB",
    "description": t.seo?.description || "Reliable Lebanese internet provider",
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
      className="relative bg-white overflow-hidden"
      aria-labelledby="hero-heading"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
          {/* Text Content */}
          <div className="order-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                {t.hero.badge}
              </div>

            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="block text-gray-900">{t.hero.title1}</span>
              <span className="block text-blue-600">{t.hero.title2}</span>
              </h1>

            <p className="mt-4 text-lg text-gray-600">
                {t.hero.subtitle}
              </p>

            <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#coverage"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    {t.hero.cta_coverage}
                  </a>
                  <a
                    href="#plans"
                className="px-6 py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.hero.cta_plans}
                  </a>
                </div>

            <ul className="mt-10 flex flex-wrap gap-6">
              <FeatureItem 
                icon={<Clock className="w-5 h-5" />} 
                text={t.hero.features.support} 
              />
              <FeatureItem 
                icon={<Zap className="w-5 h-5" />} 
                text={t.hero.features.install} 
              />
              <FeatureItem 
                icon={<ShieldCheck className="w-5 h-5" />} 
                text={t.hero.features.uptime} 
              />
            </ul>
              </div>
              
          {/* Image */}
          <div className={`relative h-80 sm:h-96 lg:h-[32rem] ${language === 'ar' ? 'lg:order-1' : ''}`}>
            <img
              src="/images/odm-truck.webp"
              alt={t.hero.imageAlt || "ODM service vehicle"}
              className="w-full h-full object-cover rounded-lg shadow-xl border border-gray-100"
              loading="eager"
            />
            </div>
        </div>
      </div>
    </section>
  );
};

const MemoizedHero = React.memo(Hero);
MemoizedHero.displayName = 'Hero';
export default MemoizedHero;
