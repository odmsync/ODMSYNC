import React, { useState } from 'react';
import { MapPin, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';
import { containerClasses, sectionPadding } from '../utils/layout';
import { getCoverageData } from '../constants';

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
    // Simulate API call
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
    analytics.track('coverage_check', { address: addressLower, result: isCovered ? 'covered' : isComing ? 'coming' : 'none' });
  };

  return (
    <section 
      id="coverage" 
      className={`${sectionPadding.default} bg-gray-50`}
      dir={dir.direction}
      aria-labelledby="coverage-title"
    >
      <div className={containerClasses}>
        <div className="text-center mb-12">
          <h2 
            id="coverage-title"
            className="text-3xl md:text-4xl font-extrabold text-gray-900"
          >
            {t.coverage.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t.coverage.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-96 bg-gray-300 rounded-xl overflow-hidden shadow-inner flex items-center justify-center group">
            {/* Placeholder for map */}
            <img 
              src="https://picsum.photos/seed/map/800/600" 
              alt="Map of Lebanon" 
              className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="bg-white/80 px-4 py-2 rounded-full font-bold text-gray-700 shadow-lg backdrop-blur-sm">
                 <MapPin className="inline w-5 h-5 text-red-500 mb-1" /> {t.coverage.map_loaded}
               </span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t.coverage.search_title}</h3>
            <form onSubmit={checkCoverage} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t.coverage.address_label}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className={`focus:ring-blue-500 focus:border-blue-500 block w-full ${language === 'ar' ? 'pr-10' : 'pl-10'} sm:text-sm border-gray-300 rounded-md p-3 border`}
                    placeholder={t.coverage.placeholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    dir={dir.direction}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'ar' ? 'جاري التحقق...' : 'Checking...'}
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

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-4">
                {language === 'ar' ? 'المناطق المغطاة حالياً:' : 'Currently Covered Areas:'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {coverageData.covered.map((city, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MemoizedCoverage = React.memo(Coverage);
MemoizedCoverage.displayName = 'Coverage';
export default MemoizedCoverage;

