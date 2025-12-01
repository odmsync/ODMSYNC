
import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { useLanguage } from '../contexts/LanguageContext';

const CoverageMap: React.FC = () => {
  const { t } = useLanguage();
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<'idle' | 'covered' | 'coming' | 'none'>('idle');

  const checkCoverage = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = address.toLowerCase();
    let currentResult: 'covered' | 'coming' | 'none' = 'none';

    // Simple mock logic
    if (lower.includes('beirut') || lower.includes('hamra') || lower.includes('ashrafieh') || lower.includes('achrafieh') || lower.includes('بيروت') || lower.includes('حمرا')) {
      currentResult = 'covered';
    } else if (lower.includes('tripoli') || lower.includes('jounieh') || lower.includes('طرابلس') || lower.includes('جونيه')) {
      currentResult = 'coming';
    } else {
      currentResult = 'none';
    }
    
    setResult(currentResult);
    analytics.track('coverage_check', { address: lower, result: currentResult });
  };

  return (
    <section id="coverage" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t.coverage.title}
          </h2>
          <p className="mt-3 text-gray-500">
            {t.coverage.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-96 bg-gray-300 rounded-xl overflow-hidden shadow-inner flex items-center justify-center group">
            {/* Placeholder for map */}
            <img 
              src="https://picsum.photos/seed/map/800/600" 
              alt="Map of Beirut" 
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border"
                    placeholder={t.coverage.placeholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t.coverage.check_btn}
              </button>
            </form>

            {result !== 'idle' && (
              <div className={`mt-6 p-4 rounded-lg ${
                result === 'covered' ? 'bg-blue-50 border border-blue-200' : 
                result === 'coming' ? 'bg-yellow-50 border border-yellow-200' : 
                'bg-gray-50 border border-gray-200'
              }`}>
                {result === 'covered' && (
                  <div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">{t.coverage.result_covered}</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>{t.coverage.result_covered_desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {result === 'coming' && (
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">{t.coverage.result_coming}</h3>
                    <p className="mt-1 text-sm text-yellow-700">{t.coverage.result_coming_desc}</p>
                  </div>
                )}
                {result === 'none' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{t.coverage.result_none}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.coverage.result_none_desc}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

CoverageMap.displayName = 'CoverageMap';
export default CoverageMap;
