import React from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';
import { containerClasses, sectionPadding } from '../utils/layout';

const WhyOdmsync: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);

  const features = [
    { name: t.why.features.speed, odm: true, comp: false },
    { name: t.why.features.power, odm: true, comp: false },
    { name: t.why.features.support, odm: true, comp: false },
    { name: t.why.features.fees, odm: true, comp: false },
    { name: t.why.features.contracts, odm: true, comp: false },
  ];

  return (
    <section 
      id="why-odmsync" 
      className={`${sectionPadding.default} bg-white`}
      dir={dir.direction}
      aria-labelledby="why-odmsync-title"
    >
      <div className={containerClasses}>
        <div className="text-center mb-10">
          <h2 
            id="why-odmsync-title"
            className="text-3xl font-extrabold text-gray-900"
          >
            {t.why.title}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div 
            className="bg-white shadow overflow-hidden rounded-lg border border-gray-200"
            role="table"
            aria-label={t.why.title}
          >
            <div 
              className="grid grid-cols-3 bg-gray-50 p-4 border-b border-gray-200 font-bold text-sm sm:text-base"
              role="row"
            >
              <div 
                className={`${dir.textStart} text-gray-500`}
                role="columnheader"
              >
                {t.why.feature}
              </div>
              <div 
                className="text-center text-blue-600"
                role="columnheader"
              >
                ODMSYNC
              </div>
              <div 
                className="text-center text-gray-400"
                role="columnheader"
              >
                {t.why.others}
              </div>
            </div>

            <div role="rowgroup">
              {features.map((feature, idx) => (
                <div 
                  key={`feature-${idx}`}
                  className={`grid grid-cols-3 p-4 items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  role="row"
                >
                  <div 
                    className={`font-medium text-gray-900 text-sm sm:text-base ${dir.textStart}`}
                    role="cell"
                  >
                    {feature.name}
                  </div>

                  <div className="flex justify-center" role="cell">
                    {feature.odm ? (
                      <div className="bg-blue-100 p-1 rounded-full" aria-hidden="true">
                        <Check className="w-5 h-5 text-blue-600" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-1 rounded-full" aria-hidden="true">
                        <X className="w-5 h-5 text-gray-300" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center" role="cell">
                    {feature.comp ? (
                      <div className="bg-blue-100 p-1 rounded-full" aria-hidden="true">
                        <Check className="w-5 h-5 text-blue-600" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-1 rounded-full" aria-hidden="true">
                        <X className="w-5 h-5 text-gray-300" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MemoizedWhyOdmsync = React.memo(WhyOdmsync);
MemoizedWhyOdmsync.displayName = 'WhyOdmsync';
export default MemoizedWhyOdmsync;

