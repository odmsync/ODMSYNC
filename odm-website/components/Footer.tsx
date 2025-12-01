import React from 'react';
import { Facebook, Instagram, Twitter, Wifi, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { config } from '../config';
import { QuickLink } from './QuickLink';
import { ContactItem } from './ContactItem';
import { SocialLink } from './SocialLink';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer 
      className="bg-gray-900 text-gray-300"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center text-blue-500 mb-4">
              <Wifi className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl text-white">ODM</span>
            </div>
            <p className="text-sm text-gray-400">
              {t.footer.desc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              {t.footer.quick_links}
            </h3>
            <ul className="space-y-2">
              <QuickLink href="#plans" text={t.nav.plans} />
              <QuickLink href="#speedtest" text={t.nav.speedtest} />
              <QuickLink href="#coverage" text={t.nav.coverage} />
              <QuickLink href="#faq" text="FAQ" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              {t.footer.contact}
            </h3>
            <ul className="space-y-2">
              <ContactItem 
                icon={<MapPin className="h-4 w-4" />} 
                text={config.contact.address}
              />
              <ContactItem 
                icon={<Mail className="h-4 w-4" />} 
                text={config.contact.email}
                href={`mailto:${config.contact.email}`}
              />
              <ContactItem 
                icon={<Phone className="h-4 w-4" />} 
                text={config.contact.phone}
                href={`tel:${config.contact.phone}`}
              />
            </ul>
            <div className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''} gap-4 mt-4`}>
              <SocialLink 
                href="https://instagram.com/odm.lb" 
                icon={<Instagram className="h-6 w-6" />}
                label="Instagram"
              />
              <SocialLink 
                href="https://facebook.com/odm.lb" 
                icon={<Facebook className="h-6 w-6" />}
                label="Facebook"
              />
              <SocialLink 
                href="https://twitter.com/odm_lb" 
                icon={<Twitter className="h-6 w-6" />}
                label="Twitter"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

const MemoizedFooter = React.memo(Footer);
MemoizedFooter.displayName = 'Footer';
export default MemoizedFooter;
