import React, { useState } from 'react';
import heroImage from '@/assets/odm-hero.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';
import { config } from '@/config';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/shared/Button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  schemaOverrides?: Record<string, unknown>;
}

const Hero: React.FC<HeroProps> = ({ schemaOverrides }) => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);
  const [imageError, setImageError] = useState(false);
  
  const hookText = t.hero.hook;

  // Schema.org structured data for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "InternetServiceProvider",
    "name": "ODM-LB",
    "description": language === 'ar' 
      ? "ODM-LB: مزود إنترنت موثوق في طرابلس وشمال لبنان مع دعم واتساب 24/7 وباقات مناسبة للظروف اللبنانية."
      : "ODM-LB provides stable internet in Tripoli, Mina, Dam w Farz and North Lebanon with fast installation, WhatsApp support, and plans tailored for Lebanese conditions.",
    "url": config.baseUrl,
    "telephone": config.contact.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tripoli",
      "addressRegion": "North Lebanon",
      "addressCountry": "LB"
    },
    "areaServed": [
      { "@type": "City", "name": "Tripoli" },
      { "@type": "City", "name": "Mina" },
      { "@type": "City", "name": "Qalamoun" },
      { "@type": "City", "name": "Zgharta" },
      { "@type": "City", "name": "Koura" }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": config.contact.phone,
      "contactType": "customer support",
      "areaServed": "LB",
      "availableLanguage": ["en", "ar"]
    },
    ...schemaOverrides
  };

  return (
    <Section 
      id="home" 
      background="white" 
      padding="xl"
      ariaLabelledby="hero-heading"
      dir={dir.direction}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Container size="lg">
        <div className={`flex flex-col lg:flex-row items-center ${dir.isRTL ? 'lg:flex-row-reverse' : ''} justify-between gap-8 lg:gap-12`}>
          
          {/* LEFT SIDE: TEXT */}
          <div className={`w-full lg:w-2/5 ${dir.isRTL ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left space-y-8 animate-fade-in`}>
            <Text variant="small" color="muted" className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {hookText}
            </Text>
            
            <Heading level={1} id="hero-heading" className="leading-tight text-4xl md:text-5xl lg:text-6xl font-extrabold">
              {t.hero.title1}<br />
              <span className="text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                {t.hero.title2}
              </span>
            </Heading>
            
            <Text variant="lead" color="secondary" className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl leading-relaxed">
              {t.hero.subtitle}
            </Text>

            <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-${dir.isRTL ? 'end' : 'start'} gap-4 pt-4`}>
              <a href="#plans" className="w-full sm:w-auto group">
                <Button variant="primary" size="lg" fullWidth={true} className="w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  {t.hero.cta_plans}
                  <ArrowRight className={`w-5 h-5 ${dir.isRTL ? 'mr-2 rotate-180 group-hover:translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`} />
                </Button>
              </a>
              <a href={config.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth={true} className="w-full sm:w-auto shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  {t.hero.cta_whatsapp}
                </Button>
              </a>
            </div>

            {/* 3 Mini Features */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700 mt-10`}>
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: t.hero.features.support.title,
                  desc: t.hero.features.support.desc,
                  bg: 'bg-blue-100 dark:bg-blue-900/30',
                  text: 'text-blue-600 dark:text-blue-400'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: t.hero.features.power.title,
                  desc: t.hero.features.power.desc,
                  bg: 'bg-green-100 dark:bg-green-900/30',
                  text: 'text-green-600 dark:text-green-400'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: t.hero.features.speed.title,
                  desc: t.hero.features.speed.desc,
                  bg: 'bg-purple-100 dark:bg-purple-900/30',
                  text: 'text-purple-600 dark:text-purple-400'
                }
              ].map((feature, idx) => (
                <div key={idx} className={`flex ${dir.isRTL ? 'flex-row-reverse' : ''} items-start gap-4 group hover:scale-105 transition-transform duration-300`}>
                  <div className={`p-3 ${feature.bg} ${feature.text} rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: HERO IMAGE */}
          <div className="w-full lg:w-3/5 flex justify-center animate-fade-in-delay">
            {!imageError ? (
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl group">
                {/* Blue gradient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-transparent dark:from-blue-600/30 dark:via-blue-500/15 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-blue-500/5 rounded-2xl -z-10" />
                <img 
                  src={heroImage} 
                  alt={language === 'ar' ? 'شاحنة خدمة ODM-LB بتوصل إنترنت بطرابلس بالليل' : 'ODM-LB service pickup delivering internet in Tripoli at night'} 
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-110 relative z-10"
                  loading="eager"
                  width={1200}
                  height={800}
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow-xl flex items-center justify-center">
                <div className="text-center text-blue-600 dark:text-blue-400">
                  <div className="text-4xl font-bold mb-2">ODMSYNC</div>
                  <div className="text-sm">{t.footer.fast_internet}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

const MemoizedHero = React.memo(Hero);
MemoizedHero.displayName = 'Hero';
export default MemoizedHero;
