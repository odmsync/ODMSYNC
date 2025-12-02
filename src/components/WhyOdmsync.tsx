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
      title: t.why.benefits.speed.title,
      description: t.why.benefits.speed.desc,
      color: 'blue'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.why.benefits.power.title,
      description: t.why.benefits.power.desc,
      color: 'green'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: t.why.benefits.support.title,
      description: t.why.benefits.support.desc,
      color: 'purple'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t.why.benefits.fair.title,
      description: t.why.benefits.fair.desc,
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
            {t.why.subtitle}
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
