import React from 'react';
import { Check, Wifi, ArrowRight, ArrowLeft } from 'lucide-react';
import { analytics } from '@/utils/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';
import { config } from '@/config';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Text } from '@/components/shared/Text';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

const Plans: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const dir = getDirectionHelpers(language);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Lebanese-style internet plans
  const englishPlans = [
    {
      id: 'basic',
      name: 'ODM Basic',
      priceUSD: '$17.99',
      priceLBP: '',
      speed: 'Up to 25 Mbps',
      data: 'Browsing, social media, light streaming',
      installation: '24/7 WhatsApp support',
      support: 'Optional router upgrade',
      highlight: false,
      badge: '',
      idealFor: 'For small households and light users.'
    },
    {
      id: 'plus',
      name: 'ODM Plus',
      priceUSD: '$24.99',
      priceLBP: '',
      speed: 'Up to 50 Mbps',
      data: 'Smooth HD streaming and online meetings',
      installation: 'Good for 4–6 active devices',
      support: 'Priority troubleshooting',
      highlight: true,
      badge: 'Most Popular',
      idealFor: 'For families and shared apartments.'
    },
    {
      id: 'turbo',
      name: 'ODM Turbo',
      priceUSD: '$32.99',
      priceLBP: '',
      speed: 'Up to 80 Mbps',
      data: 'Lower latency for gaming',
      installation: 'Great for multi-device homes',
      support: 'Recommended for content creators',
      highlight: false,
      badge: '',
      idealFor: 'For gamers and heavy users.'
    },
    {
      id: 'business',
      name: 'ODM Business',
      priceUSD: '$49.99',
      priceLBP: '',
      speed: 'Up to 100 Mbps',
      data: 'More stable connectivity during peak hours',
      installation: 'Optional static IP',
      support: 'Dedicated business support',
      highlight: false,
      badge: '',
      idealFor: 'For shops and small offices.'
    }
  ];

  const arabicPlans = [
    {
      id: 'basic',
      name: 'ODM Basic',
      priceUSD: '17.99$',
      priceLBP: '',
      speed: 'سرعة لحد 25 Mbps',
      data: 'تصفح وسوشال ميديا وستريمينغ خفيف',
      installation: 'دعم واتساب 24/7',
      support: 'إمكانية ترقية الراوتر',
      highlight: false,
      badge: '',
      idealFor: 'مناسب للاستخدام اليومي الخفيف.'
    },
    {
      id: 'plus',
      name: 'ODM Plus',
      priceUSD: '24.99$',
      priceLBP: '',
      speed: 'سرعة لحد 50 Mbps',
      data: 'ستريمينغ HD سلس واجتماعات أونلاين',
      installation: 'مناسب لـ 4-6 أجهزة نشطة',
      support: 'دعم تقني ذو أولوية',
      highlight: true,
      badge: 'الأكثر شعبية',
      idealFor: 'للعائلات والشقق المشتركة.'
    },
    {
      id: 'turbo',
      name: 'ODM Turbo',
      priceUSD: '32.99$',
      priceLBP: '',
      speed: 'سرعة لحد 80 Mbps',
      data: 'تأخير أقل للألعاب',
      installation: 'ممتاز للمنازل متعددة الأجهزة',
      support: 'موصى به لمبدعي المحتوى',
      highlight: false,
      badge: '',
      idealFor: 'لللاعبين والمستخدمين الثقيلين.'
    },
    {
      id: 'business',
      name: 'ODM Business',
      priceUSD: '49.99$',
      priceLBP: '',
      speed: 'سرعة لحد 100 Mbps',
      data: 'اتصال أكثر استقراراً في ساعات الذروة',
      installation: 'IP ثابت اختياري',
      support: 'دعم أعمال مخصص',
      highlight: false,
      badge: '',
      idealFor: 'للمحلات والمكاتب الصغيرة.'
    }
  ];

  const plans = language === 'ar' ? arabicPlans : englishPlans;

  const handlePlanClick = (planName: string) => {
    analytics.track('plan_selected', { 
      plan: planName, 
      source: 'pricing_table',
      language 
    });
  };

  return (
    <Section 
      id="plans" 
      background="white"
      padding="lg"
      centered
      ariaLabelledby="plans-title"
      dir={dir.direction}
    >
      <Container size="lg">
        <div className="text-center mb-12 md:mb-16">
          <Heading level={2} id="plans-title" className="mb-4">
            {t.plans.title}
          </Heading>
          <Text variant="lead" color="muted" className="max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'ادفع بالليرة أو الدولار. بدون رسوم مخفية، بدون حدود مخفية. الأسعار النهائية بتتأكد معك على واتساب أو تلفون.'
              : 'Pay in LBP or USD. No surprise fees, no hidden limits. Final prices are confirmed with you on WhatsApp or phone.'}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, idx) => (
            <Card
              key={plan.id}
              padding="lg"
              hover={!plan.highlight}
              className={`
                relative flex flex-col h-full animate-fade-in
                transition-all duration-300
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-800
                ${plan.highlight 
                  ? 'border-2 border-blue-500 dark:border-blue-400 shadow-2xl scale-105 z-10 ring-4 ring-blue-50 dark:ring-blue-900/30 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/30 dark:to-gray-800 hover:scale-110' 
                  : 'border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100'
                }
              `}
              style={{ animationDelay: `${idx * 0.1}s` }}
              ariaLabel={`${plan.name} plan - ${plan.priceUSD} per month`}
              tabIndex={0}
            >
              {plan.highlight && (
                <div 
                  className={`absolute -top-5 ${dir.isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} z-20`}
                  aria-hidden="true"
                >
                  <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white uppercase tracking-wider shadow-xl whitespace-nowrap animate-pulse">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <div className="flex-1 pt-2">
                <Heading level={3} className="mb-8 text-2xl">{plan.name}</Heading>
                <div className="mb-8">
                  <p className={`flex items-baseline ${dir.isRTL ? 'flex-row-reverse' : ''} text-gray-900 dark:text-white mb-2`}>
                    <span className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {plan.priceUSD}
                    </span>
                    <span className={`${dir.isRTL ? 'mr-3' : 'ml-3'} text-xl font-medium text-gray-500 dark:text-gray-400`}>
                      {t.plans.per_mo}
                    </span>
                  </p>
                  {plan.priceLBP && (
                    <Text variant="small" color="muted" className="mt-2 font-medium">{plan.priceLBP}</Text>
                  )}
                  <Text variant="caption" color="muted" className="mt-2 font-semibold">USD</Text>
                </div>

                <ul className="space-y-5" role="list">
                  <li className={`flex items-center ${dir.isRTL ? 'flex-row-reverse' : ''} p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg`}>
                    <div className="bg-blue-600 dark:bg-blue-500 p-2.5 rounded-lg flex-shrink-0 shadow-md" aria-hidden="true">
                      <Wifi className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <span className={`${dir.isRTL ? 'mr-4' : 'ml-4'} text-gray-900 dark:text-white font-bold text-lg`}>
                      {plan.speed}
                    </span>
                  </li>
                  {[plan.data, plan.installation, plan.support].map((item, idx) => (
                    <li key={idx} className={`flex items-start ${dir.isRTL ? 'flex-row-reverse' : ''} gap-3`}>
                      <div className="mt-0.5 flex-shrink-0">
                        <Check 
                          className={`h-5 w-5 text-green-500 dark:text-green-400`} 
                          aria-hidden="true"
                        />
                      </div>
                      <span className={`${dir.isRTL ? 'mr-0' : 'ml-0'} text-gray-700 dark:text-gray-300 leading-relaxed`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-10 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                <a
                  href={`${config.contact.whatsappUrl}?text=Hello!%20I%20am%20interested%20in%20the%20${encodeURIComponent(plan.name)}%20plan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePlanClick(plan.name)}
                  className="block w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 rounded-lg"
                >
                  <Button
                    variant={plan.highlight ? 'primary' : 'outline'}
                    size="md"
                    fullWidth
                    icon={<ArrowIcon className={`w-5 h-5 ${dir.isRTL ? 'rotate-180' : ''}`} />}
                    iconPosition={dir.isRTL ? 'left' : 'right'}
                  >
                    {t.plans.choose} {plan.name.split(' ')[0]}
                  </Button>
                </a>
                <Text variant="caption" color="muted" className="mt-4 text-center uppercase tracking-wide">
                  {t.plans.ideal_for}: {plan.idealFor}
                </Text>
              </div>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <Text variant="small" color="muted" className="max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'التوفر والسعر النهائي يعتمد على موقعك الدقيق وإعدادات المبنى. دائماً بنؤكد التفاصيل معك قبل التفعيل.'
              : 'Availability and final price depend on your exact location and building setup. We always confirm details with you before activation.'}
          </Text>
        </div>
      </Container>
    </Section>
  );
};

const MemoizedPlans = React.memo(Plans);
MemoizedPlans.displayName = 'Plans';
export default MemoizedPlans;
