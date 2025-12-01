import React from 'react';
import { XCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';
import { containerClasses, sectionPadding, transitions, borderRadius } from '../utils/layout';

const ProblemSolution: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const dir = getDirectionHelpers(language);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section 
      className={`${sectionPadding.default} bg-gray-50`}
      dir={dir.direction}
      aria-labelledby="problem-solution-title"
    >
      <div className={containerClasses}>
        <div className="text-center mb-12">
          <h2 
            id="problem-solution-title"
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            {t.problem.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t.problem.subtitle}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Problem */}
          <article 
            className={`bg-white p-8 ${borderRadius.xl} shadow-md w-full md:w-1/3 ${dir.borderStart} border-red-500`}
            aria-labelledby="problem-title"
          >
            <h3 
              id="problem-title"
              className={`text-xl font-bold text-red-600 mb-6 flex items-center ${dir.flexRow}`}
            >
              <XCircle className={`w-6 h-6 ${dir.mr2}`} aria-hidden="true" />
              {t.problem.struggle_title}
            </h3>
            <ul className="space-y-4" role="list">
              {t.problem.struggle_points.map((point, idx) => (
                <li key={`struggle-${idx}`} className={`flex items-start ${dir.flexRow}`}>
                  <XCircle 
                    className={`w-5 h-5 text-red-400 ${dir.mr2} mt-1 flex-shrink-0`} 
                    aria-hidden="true"
                  />
                  <span className="text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
          </article>

          <div 
            className="hidden md:flex text-blue-600"
            aria-hidden="true"
          >
            <ArrowIcon className="w-12 h-12" aria-hidden="true" />
          </div>

          {/* Solution */}
          <article 
            className={`bg-blue-50 p-8 ${borderRadius.xl} shadow-lg w-full md:w-1/3 ${dir.borderStart} border-blue-500 transform md:scale-105 ${transitions.transform}`}
            aria-labelledby="solution-title"
          >
            <h3 
              id="solution-title"
              className={`text-xl font-bold text-blue-800 mb-6 flex items-center ${dir.flexRow}`}
            >
              <CheckCircle className={`w-6 h-6 ${dir.mr2}`} aria-hidden="true" />
              {t.problem.fix_title}
            </h3>
            <ul className="space-y-4" role="list">
              {t.problem.fix_points.map((point, idx) => (
                <li key={`fix-${idx}`} className={`flex items-start ${dir.flexRow}`}>
                  <CheckCircle 
                    className={`w-5 h-5 text-blue-600 ${dir.mr2} mt-1 flex-shrink-0`} 
                    aria-hidden="true"
                  />
                  <span className="text-blue-900">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

const MemoizedProblemSolution = React.memo(ProblemSolution);
MemoizedProblemSolution.displayName = 'ProblemSolution';
export default MemoizedProblemSolution;
