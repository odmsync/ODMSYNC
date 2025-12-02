import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { getTestimonials } from '@/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

const Testimonials: React.FC = () => {
  const { t, language } = useLanguage();
  const testimonials = getTestimonials(language);
  const dir = getDirectionHelpers(language);

  return (
    <section 
      className="py-16 bg-gradient-to-b from-blue-900 to-blue-800 text-white"
      dir={dir.direction}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          {t.testimonials.title}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, idx) => (
            <article 
              key={`testimonial-${language}-${idx}`}
              className="bg-blue-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-700/50 hover:bg-blue-800/70 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex mb-4 text-yellow-400" aria-label={`${testimonial.stars} stars`}>
                {[...Array(testimonial.stars)].map((_, starIdx) => (
                  <Star 
                    key={`star-${idx}-${starIdx}`}
                    className="w-5 h-5 fill-current" 
                    aria-hidden="true"
                  />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote>
                <p className="text-blue-100 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </blockquote>
              
              {/* Author */}
              <footer className="border-t border-blue-700/50 pt-4">
                <p className="font-bold text-white mb-1">{testimonial.name}</p>
                <div className="flex items-center gap-2 text-sm text-blue-300">
                  <MapPin className="w-4 h-4" />
                  <span>{testimonial.location}</span>
                </div>
                <p className="text-xs text-blue-400 mt-1">
                  {testimonial.role}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const MemoizedTestimonials = React.memo(Testimonials);
MemoizedTestimonials.displayName = 'Testimonials';
export default MemoizedTestimonials;
