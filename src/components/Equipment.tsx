import React, { useState } from 'react';
import { Wifi, Battery, Router, Network, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

// Import equipment images (user will add these files)
const routerImage = '';
const upsImage = '';
const ontImage = '';
const meshImage = '';

interface EquipmentItem {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  features: string[];
}

const Equipment: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const equipmentItems: EquipmentItem[] = [
    {
      id: 'router',
      category: t.equipment.categories.router,
      name: t.equipment.items.router.name,
      description: t.equipment.items.router.description,
      icon: <Router className="w-6 h-6" />,
      image: routerImage,
      features: language === 'ar' 
        ? ['WiFi 6', 'تغطية قوية', 'سهل الإعداد']
        : ['WiFi 6', 'Strong Coverage', 'Easy Setup']
    },
    {
      id: 'ups',
      category: t.equipment.categories.ups,
      name: t.equipment.items.ups.name,
      description: t.equipment.items.ups.description,
      icon: <Battery className="w-6 h-6" />,
      image: upsImage,
      features: language === 'ar'
        ? ['4-6 ساعات', 'صامت', 'موثوق']
        : ['4-6 Hours', 'Silent', 'Reliable']
    },
    {
      id: 'ont',
      category: t.equipment.categories.ont,
      name: t.equipment.items.ont.name,
      description: t.equipment.items.ont.description,
      icon: <Network className="w-6 h-6" />,
      image: ontImage,
      features: language === 'ar'
        ? ['فايبر', 'سريع', 'مضمون']
        : ['Fiber', 'Fast', 'Guaranteed']
    },
    {
      id: 'mesh',
      category: t.equipment.categories.accessory,
      name: t.equipment.items.mesh.name,
      description: t.equipment.items.mesh.description,
      icon: <Wifi className="w-6 h-6" />,
      image: meshImage,
      features: language === 'ar'
        ? ['3 قطع', 'تغطية كاملة', 'بدون مناطق ميتة']
        : ['3-Pack', 'Full Coverage', 'No Dead Zones']
    },
  ];

  return (
    <section 
      id="equipment" 
      className="py-16 bg-white"
      dir={dir.direction}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.equipment.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.equipment.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipmentItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Equipment Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                {!imageErrors[item.id] && item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(item.id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-blue-600 opacity-20 scale-150">
                      {item.icon}
                    </div>
                  </div>
                )}
                {/* Category Badge */}
                <div className={`absolute top-4 ${dir.isRTL ? 'right-4' : 'left-4'}`}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Availability Badge */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {language === 'ar' ? 'متوفر' : 'Available'}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            {t.equipment.cta_text}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            {t.equipment.cta_button}
          </a>
        </div>
      </div>
    </section>
  );
};

const MemoizedEquipment = React.memo(Equipment);
MemoizedEquipment.displayName = 'Equipment';
export default MemoizedEquipment;
