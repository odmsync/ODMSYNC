import React from 'react';
import { Wifi, Battery, Router, Network } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectionHelpers } from '../utils/direction';
import { containerClasses, sectionPadding, borderRadius, shadows } from '../utils/layout';

interface EquipmentItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  image?: string;
}

const Equipment: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);

  const equipmentItems: EquipmentItem[] = [
    {
      id: 'router',
      category: t.equipment.categories.router,
      name: t.equipment.items.router.name,
      description: t.equipment.items.router.description,
      price: '$45',
      icon: <Router className="w-6 h-6" />,
    },
    {
      id: 'ups',
      category: t.equipment.categories.ups,
      name: t.equipment.items.ups.name,
      description: t.equipment.items.ups.description,
      price: '$25',
      icon: <Battery className="w-6 h-6" />,
    },
    {
      id: 'ont',
      category: t.equipment.categories.ont,
      name: t.equipment.items.ont.name,
      description: t.equipment.items.ont.description,
      price: '$30',
      icon: <Network className="w-6 h-6" />,
    },
    {
      id: 'mesh',
      category: t.equipment.categories.accessory,
      name: t.equipment.items.mesh.name,
      description: t.equipment.items.mesh.description,
      price: '$120',
      icon: <Wifi className="w-6 h-6" />,
    },
  ];

  return (
    <section 
      id="equipment" 
      className={`${sectionPadding.default} bg-white`}
      dir={dir.direction}
      aria-labelledby="equipment-title"
    >
      <div className={containerClasses}>
        <div className="text-center mb-12">
          <h2 
            id="equipment-title"
            className="text-3xl md:text-4xl font-extrabold text-gray-900"
          >
            {t.equipment.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t.equipment.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipmentItems.map((item) => (
            <article
              key={item.id}
              className={`bg-white ${borderRadius.xl} ${shadows.lg} border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              aria-label={`${item.name} - ${item.price}`}
            >
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-blue-600 opacity-20 scale-150">
                  {item.icon}
                </div>
                {/* Category Badge */}
                <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className={`flex items-start justify-between mb-2 ${dir.flexRow}`}>
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-extrabold text-blue-600">
                    {item.price}
                  </span>
                </div>
                <p className={`text-gray-600 text-sm leading-relaxed ${dir.textStart}`}>
                  {item.description}
                </p>
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

