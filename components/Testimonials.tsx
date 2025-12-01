import React from 'react';
import { Star } from 'lucide-react';
import { getTestimonials } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';
import { containerClasses, sectionPadding, borderRadius, shadows } from '../utils/layout';

const Testimonials: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const testimonials = getTestimonials(language);
  const dir = getDirectionHelpers(language);

  return (
    <section 
      className={`${sectionPadding.default} bg-blue-900 text-white`}
      dir={dir.direction}
      aria-labelledby="testimonials-title"
    >
      <div className={containerClasses}>
        <h2 
          id="testimonials-title"
          className="text-3xl font-extrabold text-center mb-12"
        >
          {t.testimonials.title}
        </h2>
        <div className="grid gap-4 md:gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <article 
              key={`testimonial-${language}-${idx}`}
              className={`bg-blue-800 p-6 ${borderRadius.xl} ${shadows.xl}`}
              aria-label={`Testimonial from ${testimonial.name} in ${testimonial.location}`}
            >
              <div className="flex mb-4 text-yellow-400" aria-label={`${testimonial.stars} stars`}>
                {[...Array(testimonial.stars)].map((_, starIdx) => (
                  <Star 
                    key={`star-${idx}-${starIdx}`}
                    className="w-5 h-5 fill-current" 
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote>
                <p className="text-blue-100 mb-6 italic">
                  "{testimonial.text}"
                </p>
              </blockquote>
              <footer className="border-t border-blue-700 pt-4">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-blue-300">
                  {testimonial.location} • {testimonial.role}
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
