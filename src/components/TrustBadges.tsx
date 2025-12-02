import React from 'react';
import { Clock, Activity, Zap, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

const TrustBadges: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);

  const badges = [
    {
      id: 'support',
      icon: <Clock className="w-8 h-8" />,
      title: t.trustBadges.support,
      description: t.trustBadges.supportDesc,
    },
    {
      id: 'uptime',
      icon: <Activity className="w-8 h-8" />,
      title: t.trustBadges.uptime,
      description: t.trustBadges.uptimeDesc,
    },
    {
      id: 'power',
      icon: <Zap className="w-8 h-8" />,
      title: t.trustBadges.power,
      description: t.trustBadges.powerDesc,
    },
    {
      id: 'installation',
      icon: <Wrench className="w-8 h-8" />,
      title: t.trustBadges.installation,
      description: t.trustBadges.installationDesc,
    },
  ];

  return (
    <section 
      className="py-12 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200"
      dir={dir.direction}
      aria-label={t.trustBadges.title}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-4 text-blue-600">
                {badge.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MemoizedTrustBadges = React.memo(TrustBadges);
MemoizedTrustBadges.displayName = 'TrustBadges';
export default MemoizedTrustBadges;

