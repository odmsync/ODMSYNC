
import React, { useState, useRef, useEffect } from 'react';
import { Play, RefreshCw, CheckCircle, XCircle, ArrowRight, ArrowLeft, Server, Wifi, MonitorPlay, Gamepad2, History, X } from 'lucide-react';
import { getPlans } from '../constants';
import { analytics } from '../utils/analytics';
import { useLanguage } from '../contexts/LanguageContext';
import { config } from '../config';
import { logger } from '../utils/logger';

const LEBANON_AVG = {
  download: 18.5,
  upload: 6.2,
  ping: 45
};

const SpeedGauge = ({ value, max = 100, label, unit }: { value: number, max?: number, label: string, unit: string }) => {
  const percentage = Math.min(value / max, 1);
  const rotation = percentage * 180 - 90;

  return (
    <div 
      className="relative w-48 h-28 flex flex-col items-center justify-end overflow-hidden mx-auto mb-4"
      role="img"
      aria-label={`${label}: ${value.toFixed(1)} ${unit}`}
    >
      {/* Gauge Background */}
      <svg viewBox="0 0 200 110" className="w-full h-full absolute top-0 left-0">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#374151" strokeWidth="20" strokeLinecap="round" />
      </svg>

      {/* Colored Arc */}
      <div className="absolute top-0 left-1/2 w-[160px] h-[160px] -ml-[80px] rounded-full border-[20px] border-blue-500 border-b-transparent border-r-transparent transform rotate-45 origin-center" 
           style={{ 
             clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', 
             transform: `rotate(${rotation}deg)`,
             transition: 'transform 0.1s ease-out',
             opacity: 0.3 
           }}>
      </div>

      {/* Needle */}
      <div 
        className="absolute bottom-2 left-1/2 w-1 h-[80px] bg-red-500 origin-bottom rounded-full z-10 transition-transform duration-100 ease-out"
        style={{ transform: `rotate(${rotation}deg) translateX(-50%)` }}
      >
        <div className="w-4 h-4 bg-white rounded-full border-4 border-gray-900 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shadow-lg"></div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-0 text-center z-20 bg-gray-900/80 px-2 rounded">
         <span className="text-2xl font-mono font-bold text-white">{value.toFixed(1)}</span>
         <span className="text-xs text-gray-400 ml-1">{unit}</span>
      </div>
    </div>
  );
};

interface TestResult {
  id: number;
  date: Date;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

const SpeedTest: React.FC = () => {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'testing' | 'completed'>('idle');
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<TestResult[]>([]);
  
  const intervalRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Persist history
  useEffect(() => {
    const stored = localStorage.getItem('odm_speedtest_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validated = parsed.map((item: any) => ({
            ...item,
            date: item.date ? new Date(item.date) : new Date()
          }));
          setHistory(validated);
        }
      } catch (e) {
        // Silently fail - history will be empty, which is fine
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('odm_speedtest_history', JSON.stringify(history));
    } catch (e) {
      // Silently fail - history saving is not critical
    }
  }, [history]);

  const cancelTest = () => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setStatus('idle');
    setProgress(0);
    setDownload(0);
    setUpload(0);
    setPing(0);
    setJitter(0);
  };

  const startTest = async () => {
    if (status === 'testing') return;
    
    analytics.track('speed_test_start');

    setStatus('testing');
    setProgress(0);
    setDownload(0);
    setUpload(0);
    setPing(0);
    setJitter(0);

    try {
      // Import the real speed test utility
      const { runSpeedTest } = await import('../utils/speedTest');
      
      // Run actual speed test
      const results = await runSpeedTest((stage, value, progress) => {
        setProgress(Math.round(progress));
        
        if (stage === 'ping') {
          setPing(value);
        } else if (stage === 'download') {
          setDownload(value);
        } else if (stage === 'upload') {
          setUpload(value);
        }
      });

      // Update with final results
      setDownload(results.download);
      setUpload(results.upload);
      setPing(results.ping);
      setJitter(results.jitter);
      setProgress(100);
      setStatus('completed');
      
      const newResult: TestResult = {
        id: Date.now(),
        date: new Date(),
        download: results.download,
        upload: results.upload,
        ping: results.ping,
        jitter: results.jitter
      };
      
      setHistory(prev => [newResult, ...prev]);
      
      analytics.track('speed_test_complete', {
        download: results.download,
        upload: results.upload,
        ping: results.ping
      });
    } catch (error) {
      // Fallback to API if local test fails
      analytics.track('speed_test_error', { error: error instanceof Error ? error.message : 'Unknown error' });
      try {
        const response = await fetch('/api/speedtest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'full' })
        });
        const data = await response.json();
        if (data.success) {
          setDownload(data.results.download);
          setUpload(data.results.upload);
          setPing(data.results.ping);
          setJitter(data.results.jitter);
          setStatus('completed');
        }
      } catch (apiError) {
        logger.error('API fallback failed for speed test', apiError);
        setStatus('idle');
        alert('Speed test failed. Please check your internet connection.');
      }
    }
  };

  const getRecommendation = () => {
    const currentPlans = getPlans(language);
    if (download < 20) return currentPlans.find(p => p.id === 'starter'); 
    if (download < 50) return currentPlans.find(p => p.id === 'pro');
    return currentPlans.find(p => p.id === 'business');
  };

  const recommendedPlan = getRecommendation();

  const capabilities = [
    { label: language === 'en' ? 'Basic Browsing' : 'تصفح بسيط', min: 1, icon: Wifi },
    { label: language === 'en' ? 'HD Streaming (1080p)' : 'فيديو HD', min: 5, icon: MonitorPlay },
    { label: language === 'en' ? 'Online Gaming' : 'ألعاب أونلاين', min: 15, icon: Gamepad2 },
    { label: language === 'en' ? '4K Ultra HD' : 'فيديو 4K', min: 25, icon: MonitorPlay },
    { label: language === 'en' ? 'Large File Uploads' : 'رفع ملفات كبيرة', min: 40, icon: Server },
  ];

  return (
    <section id="speedtest" className="py-12 md:py-20 bg-gray-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {t.speedtest.title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-400">
            {t.speedtest.subtitle}
          </p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl border border-gray-700 p-5 md:p-12">
          
          {/* Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">{t.speedtest.download}</div>
              <SpeedGauge value={download} max={100} label={t.speedtest.download} unit="Mbps" />
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">{t.speedtest.upload}</div>
              <SpeedGauge value={upload} max={50} label={t.speedtest.upload} unit="Mbps" />
            </div>
            <div className="text-center flex flex-col justify-center gap-6">
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{t.speedtest.ping}</div>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-mono font-bold text-white">{ping.toFixed(0)}</span>
                  <span className="ml-1 text-sm text-gray-500">ms</span>
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{t.speedtest.jitter}</div>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-mono font-bold text-white">{jitter.toFixed(0)}</span>
                  <span className="ml-1 text-sm text-gray-500">ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {status === 'testing' && (
             <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-8" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
               <div className="bg-blue-500 h-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
             </div>
          )}

          {/* Controls */}
          <div className="flex flex-col items-center justify-center mb-8 gap-4">
            {status !== 'testing' ? (
              <button
                onClick={startTest}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95"
              >
                {status === 'idle' ? <Play className={`w-6 h-6 ${language === 'ar' ? 'ml-2' : 'mr-2'} fill-current`} /> : <RefreshCw className={`w-6 h-6 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />}
                {status === 'idle' ? t.speedtest.start : t.speedtest.retest}
                <div className="absolute -inset-3 rounded-full bg-blue-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
              </button>
            ) : (
              <button 
                onClick={cancelTest}
                className="flex items-center px-6 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-full border border-gray-700 hover:border-gray-500"
              >
                <X className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} /> {t.speedtest.cancel}
              </button>
            )}
          </div>

          {/* Detailed Analysis (Only after completion) */}
          {status === 'completed' && (
            <div className="animate-fade-in-up space-y-6 md:space-y-8 border-t border-gray-700 pt-6 md:pt-8 mt-6 md:mt-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Comparison Chart */}
                <div className="bg-gray-900/50 p-5 md:p-6 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Server className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-blue-500`} /> {t.speedtest.comparison}
                  </h3>
                  <div className="space-y-6">
                    {/* Download Comparison */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1 uppercase font-semibold">
                        <span>{t.speedtest.your_speed}</span>
                        <span>{t.speedtest.avg_lebanon} ({LEBANON_AVG.download} Mbps)</span>
                      </div>
                      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`absolute top-0 bottom-0 bg-gray-500/30 ${language === 'ar' ? 'right-0' : 'left-0'}`} style={{ width: `${(LEBANON_AVG.download / 100) * 100}%` }}></div>
                        <div 
                          className={`absolute top-0 bottom-0 transition-all duration-1000 ${download >= LEBANON_AVG.download ? 'bg-blue-500' : 'bg-yellow-500'} ${language === 'ar' ? 'right-0' : 'left-0'}`} 
                          style={{ width: `${Math.min(download, 100)}%` }}
                        ></div>
                      </div>
                      <div className={`mt-1 text-xs font-mono ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                        {download >= LEBANON_AVG.download 
                          ? <span className="text-blue-400">+{Math.round(((download - LEBANON_AVG.download) / LEBANON_AVG.download) * 100)}% {t.speedtest.faster}</span> 
                          : <span className="text-yellow-400">-{Math.round(((LEBANON_AVG.download - download) / LEBANON_AVG.download) * 100)}% {t.speedtest.slower}</span>
                        } {t.speedtest.than_avg}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capabilities List */}
                <div className="bg-gray-900/50 p-5 md:p-6 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <MonitorPlay className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-blue-500`} /> {t.speedtest.capabilities}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded hover:bg-gray-800/50 transition">
                        <div className="flex items-center text-gray-300">
                          <cap.icon className={`w-5 h-5 md:w-4 md:h-4 ${language === 'ar' ? 'ml-3' : 'mr-3'} text-gray-500`} />
                          <span className="text-sm font-medium">{cap.label}</span>
                        </div>
                        {download >= cap.min ? (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 opacity-50" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Session History */}
              {history.length > 0 && (
                <div className="bg-gray-900/50 p-5 md:p-6 rounded-xl border border-gray-700">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <History className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-blue-500`} /> {t.speedtest.history}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[500px] md:min-w-full">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
                        <tr>
                          <th className="px-4 py-2 text-start">{language === 'ar' ? 'الوقت' : 'Time'}</th>
                          <th className="px-4 py-2 text-start">{t.speedtest.download}</th>
                          <th className="px-4 py-2 text-start">{t.speedtest.upload}</th>
                          <th className="px-4 py-2 text-start">{t.speedtest.ping}</th>
                          <th className="px-4 py-2 text-start">{t.speedtest.jitter}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((res) => (
                          <tr key={res.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                            <td className="px-4 py-3 font-mono text-gray-300 text-start">
                              {res.date instanceof Date ? res.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Invalid'}
                            </td>
                            <td className="px-4 py-3 font-bold text-white text-start">{res.download.toFixed(1)} Mbps</td>
                            <td className="px-4 py-3 text-gray-300 text-start">{res.upload.toFixed(1)} Mbps</td>
                            <td className="px-4 py-3 text-gray-300 text-start">{res.ping} ms</td>
                            <td className="px-4 py-3 text-gray-300 text-start">{res.jitter} ms</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Dynamic Plan Recommendation */}
              {recommendedPlan && (
                <div className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 border border-blue-500/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                  <div className="flex-1 text-center md:text-start">
                    <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full mb-2">
                      {t.speedtest.recommendation}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {t.speedtest.switch_to} {recommendedPlan.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 md:mb-0">
                      {t.speedtest.based_on} <strong>{download.toFixed(0)} Mbps</strong>. 
                      {download < 20 
                        ? t.speedtest.rec_text_slow 
                        : t.speedtest.rec_text_fast}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                    <div className="text-2xl font-bold text-white">{recommendedPlan.priceUSD}/{t.plans.per_mo}</div>
                    <div className="text-xs text-gray-400 line-through">{t.speedtest.competitor}: $20+</div>
                    <a 
                      href={`${config.contact.whatsappUrl}?text=I%20did%20the%20speed%20test%20and%20I%20want%20to%20switch%20to%20${encodeURIComponent(recommendedPlan.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => analytics.track('plan_selected', { plan: recommendedPlan.name, source: 'speed_test_recommendation', language })}
                      className="w-full md:w-auto justify-center mt-2 px-6 py-4 md:py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg shadow-lg transition flex items-center"
                    >
                      {t.speedtest.get_plan} 
                      {language === 'ar' ? <ArrowLeft className="mr-2 w-4 h-4" /> : <ArrowRight className="ml-2 w-4 h-4" />}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

SpeedTest.displayName = 'SpeedTest';
export default SpeedTest;
