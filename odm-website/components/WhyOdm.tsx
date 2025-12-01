import React from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const WhyOdm: React.FC = () => {
  const { t, language, isRTL } = useLanguage();

  // Directional styling helpers (following unified architecture)
  const ml2Class = isRTL ? 'ml-2' : 'mr-2';
  const mr2Class = isRTL ? 'mr-2' : 'ml-2';
  const textStartClass = isRTL ? 'text-right' : 'text-left';
  const textEndClass = isRTL ? 'text-left' : 'text-right';

  const features = [
    { name: t.why.features.speed, odm: true, comp: false },
    { name: t.why.features.power, odm: true, comp: false },
    { name: t.why.features.support, odm: true, comp: false },
    { name: t.why.features.fees, odm: true, comp: false },
    { name: t.why.features.contracts, odm: true, comp: false },
  ];

  return (
    <section 
      id="why-odm" 
      className="py-16 bg-white"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-labelledby="why-odm-title"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 
            id="why-odm-title"
            className="text-3xl font-extrabold text-gray-900"
          >
            {t.why.title}
          </h2>
        </div>

        <div 
          className="bg-white shadow overflow-hidden rounded-lg border border-gray-200"
          role="table"
          aria-label={t.why.title}
        >
          {/* Table Header */}
          <div 
            className="grid grid-cols-3 bg-gray-50 p-4 border-b border-gray-200 font-bold text-sm sm:text-base"
            role="row"
          >
            <div 
              className={`${textStartClass} text-gray-500`}
              role="columnheader"
              aria-label={t.why.feature}
            >
              {t.why.feature}
            </div>
            <div 
              className="text-center text-blue-600"
              role="columnheader"
              aria-label={t.why.odm}
            >
              {t.why.odm}
            </div>
            <div 
              className="text-center text-gray-400"
              role="columnheader"
              aria-label={t.why.others}
            >
              {t.why.others}
            </div>
          </div>

          {/* Table Body */}
          <div role="rowgroup">
            {features.map((feature, idx) => (
              <div 
                key={`feature-${idx}`}
                className={`grid grid-cols-3 p-4 items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                role="row"
                aria-label={`${feature.name}: ${t.why.odm} ${feature.odm ? 'yes' : 'no'}, ${t.why.others} ${feature.comp ? 'yes' : 'no'}`}
              >
                {/* Feature Name */}
                <div 
                  className={`font-medium text-gray-900 text-sm sm:text-base ${textStartClass}`}
                  role="cell"
                >
                  {feature.name}
                </div>

                {/* ODM Column */}
                <div 
                  className="flex justify-center"
                  role="cell"
                  aria-label={feature.odm ? `${t.why.odm}: ${t.why.yes || 'Yes'}` : `${t.why.odm}: ${t.why.no || 'No'}`}
                >
                  {feature.odm ? (
                    <div 
                      className="bg-blue-100 p-1 rounded-full"
                      aria-hidden="true"
                    >
                      <Check 
                        className="w-5 h-5 text-blue-600" 
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div 
                      className="bg-gray-100 p-1 rounded-full"
                      aria-hidden="true"
                    >
                      <X 
                        className="w-5 h-5 text-gray-300" 
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>

                {/* Competitors Column */}
                <div 
                  className="flex justify-center"
                  role="cell"
                  aria-label={feature.comp ? `${t.why.others}: ${t.why.yes || 'Yes'}` : `${t.why.others}: ${t.why.no || 'No'}`}
                >
                  {feature.comp ? (
                    <div 
                      className="bg-blue-100 p-1 rounded-full"
                      aria-hidden="true"
                    >
                      <Check 
                        className="w-5 h-5 text-blue-600" 
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div 
                      className="bg-gray-100 p-1 rounded-full"
                      aria-hidden="true"
                    >
                      <X 
                        className="w-5 h-5 text-gray-300" 
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MemoizedWhyOdm = React.memo(WhyOdm);
MemoizedWhyOdm.displayName = 'WhyOdm';
export default MemoizedWhyOdm;
