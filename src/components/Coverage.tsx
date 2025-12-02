import React, { useState } from 'react';
import { MapPin, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';
import { getCoverageData } from '@/constants';

const Coverage: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<'idle' | 'covered' | 'coming' | 'none'>('idle');
  const [loading, setLoading] = useState(false);

  const coverageData = getCoverageData(language);

  const checkCoverage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const addressLower = address.toLowerCase();
    const isCovered = coverageData.covered.some(city => 
      addressLower.includes(city.toLowerCase())
    );
    const isComing = coverageData.comingSoon.some(city => 
      addressLower.includes(city.toLowerCase())
    );
    
    if (isCovered) {
      setResult('covered');
    } else if (isComing) {
      setResult('coming');
    } else {
      setResult('none');
    }
    
    setLoading(false);
  };

  // Lebanese areas for display
  const lebaneseAreas = {
    en: {
      covered: ['Tripoli', 'Mina', 'Dam w Farz', 'Qalamoun', 'Al-Qobbeh', 'Al-Mina'],
      coming: ['Beddawi', 'Beb El-Tebbaneh', 'Abu Samra']
    },
    ar: {
      covered: ['طرابلس', 'المينا', 'دام و فرز', 'القلمون', 'القبة', 'المينا'],
      coming: ['بداوي', 'باب التبانة', 'أبو سمرة']
    }
  };

  const areas = lebaneseAreas[language];

  return (
    <section 
      id="coverage" 
      className="py-16 bg-gray-50"
      dir={dir.direction}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.coverage.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.coverage.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start animate-fade-in">
          {/* Coverage Check Form */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t.coverage.search_title}
            </h3>
            <form onSubmit={checkCoverage} className="space-y-6">
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t.coverage.address_label}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir.isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                    <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    className={`w-full ${dir.isRTL ? 'pr-12' : 'pl-12'} py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl min-h-[48px] touch-manipulation focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base transition-all duration-200`}
                    placeholder={t.coverage.placeholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    dir={dir.direction}
                    aria-label={t.coverage.address_label}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:from-blue-800 active:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[52px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.coverage.checking}
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    {t.coverage.check_btn}
                  </>
                )}
              </button>
            </form>

            {result !== 'idle' && (
              <div className={`mt-6 p-4 rounded-lg ${
                result === 'covered' ? 'bg-green-50 border border-green-200' : 
                result === 'coming' ? 'bg-yellow-50 border border-yellow-200' : 
                'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {result === 'covered' && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />}
                  {result === 'coming' && <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />}
                  {result === 'none' && <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />}
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {result === 'covered' ? t.coverage.result_covered :
                       result === 'coming' ? t.coverage.result_coming :
                       t.coverage.result_none}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {result === 'covered' ? t.coverage.result_covered_desc :
                       result === 'coming' ? t.coverage.result_coming_desc :
                       t.coverage.result_none_desc}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Covered Areas */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t.coverage.covered_areas_title}
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <span className="font-bold text-gray-900 dark:text-white text-base">
                    {t.coverage.currently_covered}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {areas.covered.map((area, idx) => (
                    <span 
                      key={idx}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-800 dark:text-green-300 text-sm font-semibold rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-100 transition-all duration-200 cursor-default border border-green-200 dark:border-green-700/50 touch-manipulation"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-bold text-gray-900 dark:text-white text-base">
                    {t.coverage.coming_soon}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {areas.coming.map((area, idx) => (
                    <span 
                      key={idx}
                      className="px-5 py-2.5 bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 text-yellow-800 dark:text-yellow-300 text-sm font-semibold rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-100 transition-all duration-200 cursor-default border border-yellow-200 dark:border-yellow-700/50 touch-manipulation"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t.coverage.whatsapp_note}
          </p>
        </div>
      </div>
    </section>
  );
};

const MemoizedCoverage = React.memo(Coverage);
MemoizedCoverage.displayName = 'Coverage';
export default MemoizedCoverage;
