import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Wifi, Sun, Moon, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { language, toggleLanguage, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  // Memoize navLinks to prevent unnecessary re-renders
  const navLinks = useMemo(() => [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.coverage, href: '#coverage' },
    { name: t.nav.speedtest, href: '#speedtest' },
    { name: t.nav.pricing, href: '#plans' },
    { name: t.nav.equipment, href: '#equipment' },
    { name: t.nav.contact, href: '#contact' },
  ], [t.nav]);

  // Handle Scroll Spy for Active Section with Throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = document.querySelectorAll('section[id]');
          let current = 'home';
          
          // Explicit check for top of page
          if (window.scrollY < 100) {
            setActiveSection('home');
            ticking = false;
            return;
          }

          // Check for bottom of page to highlight last item
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            // Highlight the last section that exists in our nav
            const lastLinkId = navLinks[navLinks.length - 1]?.href.substring(1);
            if (lastLinkId) {
              setActiveSection(lastLinkId);
              ticking = false;
              return;
            }
          }

          sections.forEach((section) => {
            const sectionTop = (section as HTMLElement).offsetTop;
            // Offset for sticky header (approx 100px)
            if (window.scrollY >= sectionTop - 100) {
              current = section.getAttribute('id') || 'home';
            }
          });
          
          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navLinks]);

  const scrollToTop = (e?: React.MouseEvent) => {
    e?.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('home');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <a 
              href="#home"
              className="flex-shrink-0 flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1" 
              onClick={scrollToTop}
              aria-label="ODMSYNC Home"
            >
              <Wifi className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              <div className="flex flex-col -space-y-1">
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300">ODMSYNC</span>
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">odmsync.com</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="hidden md:block bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold transition-colors border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
            >
              {language === 'en' ? (
                <>EN / <span className="font-arabic">العربية</span></>
              ) : (
                <><span className="font-arabic">العربية</span> / EN</>
              )}
            </button>

            {/* Client Login Button */}
            <a
              href="#client-login"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={t.nav.client_login}
            >
              <User className="h-4 w-4" />
              <span>{t.nav.client_login}</span>
            </a>
            
            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block pl-3 pr-4 py-2 ${language === 'ar' ? 'border-r-4' : 'border-l-4'} text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.name}
                </a>
              );
            })}
            
            {/* Mobile Client Login */}
            <a
              href="#client-login"
              onClick={() => setIsMenuOpen(false)}
              className={`block pl-3 pr-4 py-2 ${language === 'ar' ? 'border-r-4' : 'border-l-4'} border-transparent text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2`}
            >
              <User className="h-5 w-5" />
              {t.nav.client_login}
            </a>
            
            {/* Mobile Theme Toggle */}
            <button 
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className={`w-full text-left pl-3 pr-4 py-2 ${language === 'ar' ? 'border-r-4' : 'border-l-4'} border-transparent text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white flex items-center gap-2`}
            >
              {isDark ? (
                <>
                  <Sun className="h-5 w-5" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  Switch to Dark Mode
                </>
              )}
            </button>
            
            {/* Mobile Language Toggle */}
            <button 
              onClick={() => {
                toggleLanguage();
                setIsMenuOpen(false);
              }}
              className={`w-full text-left pl-3 pr-4 py-2 ${language === 'ar' ? 'border-r-4' : 'border-l-4'} border-transparent text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white`}
            >
              {language === 'en' ? (
                <>Switch to Arabic (<span className="font-arabic">العربية</span>)</>
              ) : (
                <>Switch to English (EN)</>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const MemoizedNavbar = React.memo(Navbar);
MemoizedNavbar.displayName = 'Navbar';
export default MemoizedNavbar;

