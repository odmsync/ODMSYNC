import React from 'react';
import { Facebook, Instagram, MessageCircle, Wifi, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';
import { config } from '@/config';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);

  return (
    <footer 
      className="bg-gray-900 text-gray-300"
      dir={dir.direction}
      aria-label="ODMSYNC Footer"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center text-blue-500 mb-4">
              <Wifi className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl text-white">ODMSYNC</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{t.footer.address}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              {t.footer.quick_links}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#plans" className="hover:text-blue-500 transition-colors text-sm">
                  {t.nav.pricing}
                </a>
              </li>
              <li>
                <a href="#coverage" className="hover:text-blue-500 transition-colors text-sm">
                  {t.nav.coverage}
                </a>
              </li>
              <li>
                <a href="#equipment" className="hover:text-blue-500 transition-colors text-sm">
                  {t.nav.equipment}
                </a>
              </li>
              <li>
                <a href="#login" className="hover:text-blue-500 transition-colors text-sm">
                  {t.nav.client_login}
                </a>
              </li>
              <li>
                <a href="#status" className="hover:text-blue-500 transition-colors text-sm">
                  {t.nav.status}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              {t.footer.contact}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <a href="tel:+96170977970" className="hover:text-blue-500 transition-colors">
                  +961 70 977 970
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <a href="https://wa.me/96170977970" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <a href="mailto:support@odmsync.com" className="hover:text-blue-500 transition-colors">
                  support@odmsync.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              {t.footer.social}
            </h3>
            <div className={`flex ${dir.flexRow} gap-4`}>
              <a
                href="https://facebook.com/odmsync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/odmsync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://tiktok.com/@odmsync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/96170977970"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              {t.footer.copyright}
            </p>
            <div className={`flex ${dir.flexRow} gap-6 text-sm`}>
              <a href="#privacy" className="text-gray-400 hover:text-blue-500 transition-colors">
                {t.footer.privacy}
              </a>
              <a href="#terms" className="text-gray-400 hover:text-blue-500 transition-colors">
                {t.footer.terms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MemoizedFooter = React.memo(Footer);
MemoizedFooter.displayName = 'Footer';
export default MemoizedFooter;
