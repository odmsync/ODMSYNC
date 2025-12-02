import React from 'react';
import { Zap, Shield, Headphones, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

const WhyOdmsync: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);

  const benefits = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: language === 'ar' ? 'سرعة حقيقية' : 'Real Speed',
      description: language === 'ar' 
        ? 'سرعات فايبر حقيقية مش مشتركة. 100+ ميقا ثابتة حتى وقت الذروة.'
        : 'Real fiber speeds, not shared. Consistent 100+ Mbps even during peak hours.',
      color: 'blue'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: language === 'ar' ? 'شغال وقت القطعة' : 'Works During Power Cuts',
      description: language === 'ar'
        ? 'نظام طاقة احتياطي (UPS + شمسي). النت بضل شغال حتى لو الكهربا مقطوعة.'
        : 'Backup power system (UPS + solar). Internet stays on even when electricity is cut.',
      color: 'green'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: language === 'ar' ? 'دعم 24/7' : '24/7 Support',
      description: language === 'ar'
        ? 'دعم فني عبر واتساب خلال 5 دقايق. فريق محلي بيفهم مشاكلك.'
        : 'Technical support via WhatsApp in 5 minutes. Local team that understands your issues.',
      color: 'purple'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: language === 'ar' ? 'أسعار شفافة' : 'Transparent Pricing',
      description: language === 'ar'
        ? 'بدون رسوم مخفية، بدون عقود ملزمة. ادفع بالليرة أو الدولار.'
        : 'No hidden fees, no binding contracts. Pay in LBP or USD.',
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <section 
      id="why-odmsync" 
      className="py-16 bg-gradient-to-b from-gray-50 to-white"
      dir={dir.direction}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.why.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'ليش آلاف اللبنانيين اختاروا ODMSYNC'
              : 'Why thousands of Lebanese chose ODMSYNC'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[benefit.color as keyof typeof colorClasses]}`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MemoizedWhyOdmsync = React.memo(WhyOdmsync);
MemoizedWhyOdmsync.displayName = 'WhyOdmsync';
export default MemoizedWhyOdmsync;
