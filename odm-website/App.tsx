
import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { Notification, useNotificationSystem } from './components/Notification';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load components that are below the fold or interaction-heavy
const SpeedTest = lazy(() => import('./components/SpeedTest'));
const Plans = lazy(() => import('./components/Plans'));
const CoverageMap = lazy(() => import('./components/CoverageMap'));
const WhyOdm = lazy(() => import('./components/WhyOdm'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const FAQ = lazy(() => import('./components/FAQ'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

const App: React.FC = () => {
  const { notifications, removeNotification } = useNotificationSystem();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        <Header />
        
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

        <main>
          <ErrorBoundary>
            {/* Critical Path: Loaded immediately for LCP (Largest Contentful Paint) */}
            <Hero />
            <ProblemSolution />
          </ErrorBoundary>

          {/* Deferred: Loaded only when needed or in background */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SpeedTest />
              <Plans />
              <CoverageMap />
              <WhyOdm />
              <Testimonials />
              <FAQ />
              <ContactForm />
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
