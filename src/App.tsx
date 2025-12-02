import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import ProblemSolution from '@/components/ProblemSolution';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Notification, useNotificationSystem } from '@/components/Notification';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Lazy load components that are below the fold or interaction-heavy
const SpeedTest = lazy(() => import('@/components/SpeedTest'));
const Plans = lazy(() => import('@/components/Plans'));
const Coverage = lazy(() => import('@/components/Coverage'));
const Equipment = lazy(() => import('@/components/Equipment'));
const WhyOdmsync = lazy(() => import('@/components/WhyOdmsync'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const FAQ = lazy(() => import('@/components/FAQ'));
const Contact = lazy(() => import('@/components/Contact'));
const Login = lazy(() => import('@/pages/Login'));
const ServiceStatus = lazy(() => import('@/pages/ServiceStatus'));
const ChatWidget = lazy(() => import('@/components/ChatWidget'));

const App: React.FC = () => {
  const { notifications, removeNotification } = useNotificationSystem();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        <Navbar />
        
        {/* Global Notification Container */}
        <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
          {notifications.map((n) => (
            <Notification
              key={n.id}
              id={n.id}
              type={n.type}
              message={n.message}
              onClose={removeNotification}
            />
          ))}
        </div>

        <main id="main-content">
          <ErrorBoundary>
            {/* Critical Path: Loaded immediately for LCP (Largest Contentful Paint) */}
            <Hero />
            <TrustBadges />
            <ProblemSolution />
          </ErrorBoundary>

          {/* Deferred: Loaded only when needed or in background */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SpeedTest />
              <Plans />
              <Coverage />
              <Equipment />
              <WhyOdmsync />
              <Testimonials />
              <FAQ />
              <ServiceStatus />
              <Login />
              <Contact />
            </Suspense>
          </ErrorBoundary>
        </main>
        
        <Footer />
        
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
        </ErrorBoundary>
        
        <BackToTop />
        <FloatingWhatsApp />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
