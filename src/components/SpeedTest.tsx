import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';
import { Button } from '@/components/shared/Button';
import { ArrowDown, Zap, Wifi, Activity } from 'lucide-react';

const SpeedTest: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);
  const [isVisible, setIsVisible] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const testRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Scroll to test section
  const scrollToTest = () => {
    testRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      setTestStarted(true);
      setIsVisible(true);
    }, 500);
  };

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (testRef.current) {
      observer.observe(testRef.current);
    }

    return () => {
      if (testRef.current) {
        observer.unobserve(testRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="speedtest" 
      className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
      dir={dir.direction}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-blue-500/10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              {t.speedtest.title}
            </h2>
          </div>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            {t.speedtest.subtitle}
          </p>

          {/* Start Test Button */}
          {!testStarted && (
            <div className="flex justify-center animate-fade-in">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToTest}
                className="shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                icon={<ArrowDown className="w-5 h-5" />}
                iconPosition="right"
              >
                {t.speedtest.start}
              </Button>
            </div>
          )}
        </div>

        {/* Speed Test Container */}
        <div 
          ref={testRef}
          className={`bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 border-2 border-gray-700/50 shadow-2xl transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Info Banner */}
          <div className="mb-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-start gap-3">
            <Activity className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-100 leading-relaxed">
              {t.speedtest.note}
            </p>
          </div>

          {/* Speed Test Iframe */}
          <div className="relative w-full bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700/50 shadow-inner">
            <div className="relative w-full" style={{ paddingBottom: 'min(600px, 75%)', minHeight: '500px' }}>
              <iframe
                ref={iframeRef}
                src="https://openspeedtest.com/speedtest"
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                loading={testStarted ? 'eager' : 'lazy'}
                title={t.speedtest.iframe_title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ minHeight: '500px' }}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-gray-300">{t.speedtest.download}</span>
              </div>
              <p className="text-xs text-gray-400">
                {language === 'ar' 
                  ? 'يقيس سرعة تنزيل البيانات من الإنترنت'
                  : 'Measures data download speed from internet'}
              </p>
            </div>
            <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-gray-300">{t.speedtest.upload}</span>
              </div>
              <p className="text-xs text-gray-400">
                {language === 'ar' 
                  ? 'يقيس سرعة رفع البيانات إلى الإنترنت'
                  : 'Measures data upload speed to internet'}
              </p>
            </div>
            <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-300">{t.speedtest.ping}</span>
              </div>
              <p className="text-xs text-gray-400">
                {language === 'ar' 
                  ? 'يقيس زمن الاستجابة (التأخير)'
                  : 'Measures response time (latency)'}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-5 bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-500/20 rounded-xl">
            <h3 className="text-sm font-bold text-blue-300 mb-3 uppercase tracking-wide">
              {language === 'ar' ? 'نصائح للحصول على نتائج دقيقة:' : 'Tips for Accurate Results:'}
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ar' 
                    ? 'أغلق التطبيقات والتنزيلات الأخرى أثناء الاختبار'
                    : 'Close other apps and downloads during the test'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ar' 
                    ? 'استخدم اتصال سلكي (Ethernet) للحصول على أفضل النتائج'
                    : 'Use a wired (Ethernet) connection for best results'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>
                  {language === 'ar' 
                    ? 'تجنب استخدام الإنترنت من أجهزة أخرى في نفس الوقت'
                    : 'Avoid using internet from other devices simultaneously'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

SpeedTest.displayName = 'SpeedTest';
export default SpeedTest;
