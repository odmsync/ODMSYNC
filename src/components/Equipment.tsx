import React, { useState } from 'react';
import { Wifi, Battery, Router, Network, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

// Equipment images - using placeholder gradients until images are added
// To add images: import routerImage from '@/assets/equipment/router.jpg';
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
      features: t.equipment.items.router.features
    },
    {
      id: 'ups',
      category: t.equipment.categories.ups,
      name: t.equipment.items.ups.name,
      description: t.equipment.items.ups.description,
      icon: <Battery className="w-6 h-6" />,
      image: upsImage,
      features: t.equipment.items.ups.features
    },
    {
      id: 'ont',
      category: t.equipment.categories.ont,
      name: t.equipment.items.ont.name,
      description: t.equipment.items.ont.description,
      icon: <Network className="w-6 h-6" />,
      image: ontImage,
      features: t.equipment.items.ont.features
    },
    {
      id: 'mesh',
      category: t.equipment.categories.accessory,
      name: t.equipment.items.mesh.name,
      description: t.equipment.items.mesh.description,
      icon: <Wifi className="w-6 h-6" />,
      image: meshImage,
      features: t.equipment.items.mesh.features
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipmentItems.map((item, idx) => (
            <article
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 active:scale-100 active:translate-y-0 animate-fade-in group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-800"
              style={{ animationDelay: `${idx * 0.1}s` }}
              tabIndex={0}
            >
              {/* Equipment Image */}
              <div className="relative h-56 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950/50 dark:via-blue-900/30 dark:to-blue-950/50 overflow-hidden">
                {!imageErrors[item.id] && item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => handleImageError(item.id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-blue-200/30 to-blue-100/50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-blue-900/30 group-hover:from-blue-200/60 group-hover:via-blue-300/40 group-hover:to-blue-200/60 dark:group-hover:from-blue-800/40 dark:group-hover:via-blue-700/30 dark:group-hover:to-blue-800/40 transition-all duration-500" />
                    {/* Icon with better styling */}
                    <div className="relative text-blue-600 dark:text-blue-400 opacity-40 group-hover:opacity-60 scale-150 group-hover:scale-175 transition-all duration-500">
                      {item.icon}
                    </div>
                  </div>
                )}
                {/* Category Badge */}
                <div className={`absolute top-5 ${dir.isRTL ? 'right-5' : 'left-5'}`}>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white uppercase tracking-wider shadow-lg">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Availability Badge */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50">
                    {item.id === 'router' 
                      ? t.equipment.items.router.availability
                      : item.id === 'ups'
                      ? t.equipment.items.ups.availability
                      : item.id === 'ont'
                      ? t.equipment.items.ont.availability
                      : t.equipment.items.mesh.availability}
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
