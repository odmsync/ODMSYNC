import React, { useState } from 'react';
import { Send, Mail, Phone, Loader2, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { validateEmail, validatePhone, validateLength } from '../utils/validation';
import { notify } from './Notification';
import { analytics } from '../utils/analytics';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';
import { containerClasses, sectionPadding } from '../utils/layout';
import { submitContactForm } from '../services/api';
import { logger } from '../utils/logger';
import { VALIDATION } from '../constants';
import { config } from '../config';

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
                  <p className="text-white">{config.contact.address}</p>
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

          <div className="bg-white rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={dir.direction}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir="ltr"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.subject}
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="support">{t.contact.subjects.support}</option>
                  <option value="sales">{t.contact.subjects.sales}</option>
                  <option value="billing">{t.contact.subjects.billing}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={dir.direction}
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

