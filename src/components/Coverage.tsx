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

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Coverage Check Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t.coverage.search_title}
            </h3>
            <form onSubmit={checkCoverage} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.coverage.address_label}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir.isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    className={`w-full ${dir.isRTL ? 'pr-10' : 'pl-10'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* Covered Areas */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'المناطق المغطاة' : 'Covered Areas'}
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-700">
                    {language === 'ar' ? 'مغطاة حالياً' : 'Currently Covered'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {areas.covered.map((area, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-gray-700">
                    {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {areas.coming.map((area, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
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
