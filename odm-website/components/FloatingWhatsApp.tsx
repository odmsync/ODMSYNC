import React from 'react';
import { MessageCircle } from 'lucide-react';
import { config } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';

const FloatingWhatsApp: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const dir = getDirectionHelpers(language);
  const whatsappMessage = language === 'ar' 
    ? 'مرحبا%20ODM-LB،%20بدي%20مساعدة%20مع%20الإنترنت'
    : 'Hi%20ODM-LB%20Support,%20I%20need%20help%20with%20my%20internet.';

  return (
    <a
      href={`${config.contact.whatsappUrl}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-24 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 group flex items-center gap-3 ${dir.flexRow}`}
      aria-label={language === 'ar' ? 'تواصل مع دعم ODM-LB على واتساب' : 'Chat with ODM-LB Support on WhatsApp'}
      title={language === 'ar' ? 'تواصل مع دعم ODM-LB' : 'Chat with ODM-LB Support'}
    >
      <MessageCircle className="w-6 h-6 fill-current" aria-hidden="true" />
      <span className="font-bold text-sm hidden md:inline whitespace-nowrap">
        {language === 'ar' ? 'دعم ODM-LB' : 'Chat with ODM-LB Support'}
      </span>
    </a>
  );
};

FloatingWhatsApp.displayName = 'FloatingWhatsApp';
export default FloatingWhatsApp;

