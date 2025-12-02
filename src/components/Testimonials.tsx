import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

const Testimonials: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);

  // Lebanese testimonials data
  const englishTestimonials = [
    {
      name: "Ahmad S.",
      location: "Tripoli",
      text: "First time an ISP stays stable during generator switches. They answer on WhatsApp and actually follow up.",
      stars: 5,
      role: "Home Customer"
    },
    {
      name: "Rana K.",
      location: "Al-Mina",
      text: "We used to switch providers every few months. With ODM the line is finally stable enough for our work and Zoom calls.",
      stars: 5,
      role: "Business Owner"
    },
    {
      name: "Bilal H.",
      location: "Dam w Farz",
      text: "Installation was fast and clean. Speeds are close to what they promised, even at night.",
      stars: 5,
      role: "Home Customer"
    },
    {
      name: "Hiba M.",
      location: "Qalamoun",
      text: "They explain everything clearly – no hidden conditions. I feel I can actually trust them with my connection.",
      stars: 5,
      role: "Home Customer"
    }
  ];

  const arabicTestimonials = [
    {
      name: "أحمد س.",
      location: "طرابلس",
      text: "أول مرة شركة إنترنت تثبت معي وقت تبديل الموتور. بيردّوا على الواتساب وبيتابعوا فعلاً.",
      stars: 5,
      role: "زبون منزلي"
    },
    {
      name: "رنا ك.",
      location: "الميناء",
      text: "كنّا نغيّر شركات كل فترة. مع ODM الخط صار أهدى وأثبت للشغل وZoom.",
      stars: 5,
      role: "صاحبة عمل"
    },
    {
      name: "بلال ح.",
      location: "ضَمّ وفرز",
      text: "التركيب كان سريع ونظيف. السرعة قريبة من اللي وعدونا فيها، حتى بالليل.",
      stars: 5,
      role: "زبون منزلي"
    },
    {
      name: "هبة م.",
      location: "قلمون",
      text: "بيشرحوا كل شي بوضوح – بدون شروط مخفية. بحس إنني أقدر أثق فيهم مع اتصالي.",
      stars: 5,
      role: "زبونة منزلية"
    }
  ];

  const testimonials = language === 'ar' ? arabicTestimonials : englishTestimonials;

  return (
    <section 
      className="py-20 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white"
      dir={dir.direction}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in"
        >
          {t.testimonials.title}
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, idx) => (
            <article 
              key={`testimonial-${language}-${idx}`}
              className="bg-blue-800/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-700/50 hover:bg-blue-800/80 hover:shadow-2xl hover:scale-105 active:scale-100 transition-all duration-300 animate-fade-in focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-blue-900"
              style={{ animationDelay: `${idx * 0.1}s` }}
              tabIndex={0}
            >
              {/* Stars */}
              <div className="flex mb-6 text-yellow-400 gap-1" aria-label={`${testimonial.stars} stars`}>
                {[...Array(testimonial.stars)].map((_, starIdx) => (
                  <Star 
                    key={`star-${idx}-${starIdx}`}
                    className="w-6 h-6 fill-current drop-shadow-sm" 
                    aria-hidden="true"
                  />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="mb-8">
                <p className="text-blue-50 mb-0 leading-relaxed text-base font-medium selection:bg-blue-600/50">
                  "{testimonial.text}"
                </p>
              </blockquote>
              
              {/* Author */}
              <footer className="border-t border-blue-700/50 pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-blue-300 mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-300 mt-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{testimonial.location}</span>
                </div>
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
