import React, { useState } from 'react';
import { Send, Mail, Phone, Loader2, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { validateEmail, validatePhone, validateLength } from '@/utils/validation';
import { notify } from '@/components/Notification';
import { analytics } from '@/utils/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';
import { containerClasses, sectionPadding } from '@/utils/layout';
import { submitContactForm } from '@/services/api';
import { logger } from '@/utils/logger';
import { VALIDATION } from '@/constants';
import { config } from '@/config';

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
    type: 'support' | 'sales' | 'billing';
  }>({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'support', 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateLength(formData.name, VALIDATION.NAME_MIN_LENGTH)) newErrors.name = t.contact.name_error;
    if (!validateEmail(formData.email)) newErrors.email = t.contact.email_error;
    if (!validatePhone(formData.phone)) newErrors.phone = t.contact.phone_error;
    if (!validateLength(formData.message, VALIDATION.MESSAGE_MIN_LENGTH)) newErrors.message = t.contact.msg_error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notify('error', t.contact.validation_error);
      return;
    }

    setIsSubmitting(true);
    analytics.track('contact_form_submit', { type: formData.type });

    try {
      const response = await submitContactForm(formData);
      
      if (response.success) {
        notify('success', t.contact.success);
        setFormData({ name: '', email: '', phone: '', message: '', type: 'support' });
      } else {
        notify('error', response.error || t.contact.error);
      }
    } catch (error) {
      logger.error('Contact form submission failed', error);
      notify('error', t.contact.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className={`${sectionPadding.default} bg-blue-900 text-white`}
      dir={dir.direction}
      aria-labelledby="contact-title"
    >
      <div className={containerClasses}>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 
              id="contact-title"
              className="text-3xl md:text-4xl font-extrabold mb-6"
            >
              {t.contact.title}
            </h2>
            <p className="text-blue-100 mb-8">
              {t.contact.subtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <a href={`tel:${config.contact.phone}`} className="text-white hover:text-blue-300 transition-colors">
                    {config.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <a href={`mailto:${config.contact.email}`} className="text-white hover:text-blue-300 transition-colors">
                    {config.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white">
                    {t.contact.location_text}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href="#" className="text-white hover:text-blue-300 transition-colors" aria-label="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-blue-300 transition-colors" aria-label="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-blue-300 transition-colors" aria-label="Twitter">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 text-base border-2 rounded-xl min-h-[48px] touch-manipulation focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  dir={dir.direction}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 text-base border-2 rounded-xl min-h-[48px] touch-manipulation focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 text-base border-2 rounded-xl min-h-[48px] touch-manipulation focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200 ${
                    errors.phone 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  dir="ltr"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.subject}
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 text-base border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl min-h-[48px] touch-manipulation focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
                >
                  <option value="support">{t.contact.subjects.support}</option>
                  <option value="sales">{t.contact.subjects.sales}</option>
                  <option value="billing">{t.contact.subjects.billing}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-5 py-3.5 text-base border-2 rounded-xl min-h-[120px] touch-manipulation focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200 resize-none ${
                    errors.message 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  dir={dir.direction}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <a
                href="https://wa.me/96170977970"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:from-green-800 active:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mb-4 min-h-[52px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              >
                {t.contact.whatsapp_button}
                <Send className="h-5 w-5" />
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:from-blue-800 active:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-h-[52px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    {t.contact.sending}
                  </>
                ) : (
                  <>
                    {t.contact.send} <Send className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const MemoizedContact = React.memo(Contact);
MemoizedContact.displayName = 'Contact';
export default MemoizedContact;

