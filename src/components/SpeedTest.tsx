import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

const SpeedTest: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);
  const [status, setStatus] = useState<'idle' | 'testing' | 'completed'>('idle');
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<string>('');

  const simulateTest = () => {
    if (status === 'testing') return;
    
    setStatus('testing');
    setProgress(0);
    setDownload(0);
    setUpload(0);
    setPing(0);
    setSummary('');

    // Simulate ping test
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      if (currentProgress <= 30) {
        // Ping phase
        setPing(Math.floor(15 + Math.random() * 20));
      } else if (currentProgress <= 70) {
        // Download phase
        const speed = Math.min(100, (currentProgress - 30) * 2.5);
        setDownload(Math.floor(speed));
      } else if (currentProgress <= 95) {
        // Upload phase
        const speed = Math.min(50, (currentProgress - 70) * 2);
        setUpload(Math.floor(speed));
      } else {
        clearInterval(interval);
        setProgress(100);
        setStatus('completed');
        generateSummary();
      }
    }, 50);
  };

  const generateSummary = () => {
    const summaries = {
      en: [
        `Your connection shows ${download} Mbps download speed. This is ${download > 50 ? 'excellent' : download > 20 ? 'good' : 'below average'} for Lebanon.`,
        `With ${upload} Mbps upload, you can ${upload > 20 ? 'easily' : 'manage to'} stream, video call, and upload files.`,
        `Ping of ${ping}ms is ${ping < 30 ? 'excellent' : ping < 50 ? 'good' : 'acceptable'} for gaming and real-time apps.`,
        download > 50 
          ? `You're getting premium speeds! Perfect for 4K streaming, gaming, and work from home.`
          : download > 20
          ? `Your speed is decent. Consider upgrading for smoother 4K streaming and better gaming.`
          : `Your connection needs improvement. ODMSYNC can boost you to 100+ Mbps with reliable fiber.`
      ],
      ar: [
        `اتصالك يظهر ${download} ميقا تنزيل. هاد ${download > 50 ? 'ممتاز' : download > 20 ? 'كويس' : 'تحت المعدل'} بلبنان.`,
        `مع ${upload} ميقا رفع، فيك ${upload > 20 ? 'بسهولة' : 'تدبر'} تستمري و تحكي فيديو و ترفع ملفات.`,
        `Ping من ${ping}ms ${ping < 30 ? 'ممتاز' : ping < 50 ? 'كويس' : 'مقبول'} للألعاب والتطبيقات المباشرة.`,
        download > 50
          ? `عم تاخد سرعة ممتازة! مثالية للستريمنج 4K والألعاب والشغل من البيت.`
          : download > 20
          ? `سرعتك كويسة. فكر ترفع للباقة الأقوى لستريمنج 4K أفضل.`
          : `اتصالك محتاج تحسين. ODMSYNC فيها ترفعك لـ 100+ ميقا بفايبر موثوق.`
      ]
    };

    setSummary(summaries[language].join(' '));
  };

  return (
    <section 
      id="speedtest" 
      className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white"
      dir={dir.direction}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.speedtest.title}
          </h2>
          <p className="text-gray-400 text-lg">
            {t.speedtest.subtitle}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-gray-700">
          {/* Speed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-900/50 rounded-xl">
              <div className="text-gray-400 text-sm mb-2">{t.speedtest.download}</div>
              <div className="text-4xl font-bold text-blue-400 mb-1">
                {download.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">Mbps</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-xl">
              <div className="text-gray-400 text-sm mb-2">{t.speedtest.upload}</div>
              <div className="text-4xl font-bold text-green-400 mb-1">
                {upload.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">Mbps</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-xl">
              <div className="text-gray-400 text-sm mb-2">{t.speedtest.ping}</div>
              <div className="text-4xl font-bold text-yellow-400 mb-1">
                {ping}
              </div>
              <div className="text-xs text-gray-500">ms</div>
            </div>
          </div>

          {/* Progress Bar */}
          {status === 'testing' && (
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-8">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Control Button */}
          <div className="text-center mb-8">
            {status !== 'testing' ? (
              <button
                onClick={simulateTest}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                {status === 'idle' ? (
                  <>
                    <Play className="w-5 h-5" />
                    {t.speedtest.start}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    {t.speedtest.retest}
                  </>
                )}
              </button>
            ) : (
              <div className="text-gray-400">
                {language === 'ar' ? 'جاري الفحص...' : 'Testing...'}
              </div>
            )}
          </div>

          {/* AI Summary */}
          {status === 'completed' && summary && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-500/30">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {language === 'ar' ? 'تحليل ذكي' : 'Smart Analysis'}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

SpeedTest.displayName = 'SpeedTest';
export default SpeedTest;
