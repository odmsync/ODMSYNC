
import React, { useState } from 'react';
import { getFaqs } from '../constants';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ: React.FC = () => {
  const { t, language } = useLanguage();
  const faqs = getFaqs(language);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section 
      id="faq" 
      className="py-16 bg-gray-50" 
      aria-labelledby="faq-heading" 
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
               <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 id="faq-heading" className="text-3xl font-extrabold text-gray-900">
            {t.faq.title}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
             {t.faq.subtitle}
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-md"
                itemScope 
                itemProp="mainEntity" 
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-start focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="text-lg font-bold text-gray-900 px-4" itemProp="name">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-blue-600' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                
                {/* Interactive Accordion Content */}
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="border-t border-gray-100 bg-gray-50/50 animate-fade-in-down"
                    itemScope 
                    itemProp="acceptedAnswer" 
                    itemType="https://schema.org/Answer"
                  >
                    <div className="px-5 pb-5 pt-5 text-gray-600 leading-relaxed" itemProp="text">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

FAQ.displayName = 'FAQ';
export default FAQ;
