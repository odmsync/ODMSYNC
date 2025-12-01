import React from 'react';
import { getPlans } from '../constants';
import { Check, Wifi, ArrowRight, ArrowLeft } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';
import { containerClasses, sectionPadding, transitions, shadows, borderRadius } from '../utils/layout';
import { config } from '../config';

const Plans: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const plans = getPlans(language);
  const dir = getDirectionHelpers(language);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handlePlanClick = (planName: string) => {
    analytics.track('plan_selected', { 
      plan: planName, 
      source: 'pricing_table',
      language 
    });
  };

  return (
    <section 
      id="plans" 
      className={`${sectionPadding.large} bg-white`}
      dir={dir.direction}
      aria-labelledby="plans-title"
    >
      <div className={containerClasses}>
        <div className="text-center">
          <h2 
            id="plans-title"
            className="text-4xl font-extrabold text-gray-900"
          >
            {t.plans.title}
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            {t.plans.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <article 
              key={plan.id}
              className={`relative flex flex-col ${borderRadius.xl} border ${transitions.default} ${
                plan.highlight 
                  ? 'border-blue-500 shadow-2xl scale-105 z-10 ring-4 ring-blue-50' 
                  : 'border-gray-200 shadow-lg hover:shadow-xl'
              } bg-white p-8`}
              aria-label={`${plan.name} plan - ${plan.priceUSD} per month`}
            >
              {plan.highlight && (
                <div 
                  className="absolute -top-5 left-1/2 transform -translate-x-1/2"
                  aria-hidden="true"
                >
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-600 text-white uppercase tracking-wider shadow-lg whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-6 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.priceUSD}</span>
                  <span className={`${dir.ml2} text-lg font-medium text-gray-500`}>
                    {t.plans.per_mo}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500 font-medium">{plan.priceLBP}</p>

                <ul className="mt-8 space-y-4" role="list">
                  <li className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full" aria-hidden="true">
                      <Wifi className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <span className={`${dir.ml3} text-gray-700 font-bold text-lg`}>
                      {plan.speed} {t.plans.speed}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check 
                      className="flex-shrink-0 h-5 w-5 text-blue-500" 
                      aria-hidden="true"
                    />
                    <span className={`${dir.ml3} text-gray-600`}>
                      {plan.data} {t.plans.data}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check 
                      className="flex-shrink-0 h-5 w-5 text-blue-500" 
                      aria-hidden="true"
                    />
                    <span className={`${dir.ml3} text-gray-600`}>
                      {plan.installation} {t.plans.installation}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check 
                      className="flex-shrink-0 h-5 w-5 text-blue-500" 
                      aria-hidden="true"
                    />
                    <span className={`${dir.ml3} text-gray-600`}>
                      {plan.support}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <a
                  href={`${config.contact.whatsappUrl}?text=Hello!%20I%20am%20interested%20in%20the%20${encodeURIComponent(plan.name)}%20plan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePlanClick(plan.name)}
                  className={`flex items-center justify-center w-full text-center px-6 py-4 border border-transparent text-base font-bold ${borderRadius.xl} ${transitions.fast} ${
                    plan.highlight 
                      ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30' 
                      : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                  }`}
                  aria-label={`Choose ${plan.name} plan`}
                >
                  {t.plans.choose} {plan.name.split(' ')[0]} 
                  <ArrowIcon className={`${dir.ml2} w-5 h-5`} aria-hidden="true" />
                </a>
                <p className="mt-4 text-xs text-center text-gray-400 font-medium uppercase tracking-wide">
                  {t.plans.ideal_for}: {plan.idealFor}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const MemoizedPlans = React.memo(Plans);
MemoizedPlans.displayName = 'Plans';
export default MemoizedPlans;
