import React, { useState } from 'react';
import heroImage from '@/assets/odm-hero.jpg';

const Hero: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="home" className="bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* LEFT SIDE: TEXT */}
          <div className="w-full lg:w-2/5 text-center lg:text-left space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Experience the <span className="text-blue-600">Fastest Internet</span> in Lebanon
            </h1>
            <p className="text-gray-600 text-lg">
              Reliable fiber optics, 24/7 support, and plans tailored for your home and business needs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a 
                href="#plans"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                View Plans →
              </a>
              <a 
                href="https://wa.me/96170977970"
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg shadow hover:bg-gray-200 transition"
              >
                Contact via WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: HERO IMAGE */}
          <div className="w-full lg:w-3/5 flex justify-center">
            {!imageError ? (
              <img 
                src={heroImage} 
                alt="ODMSYNC F-150 service vehicle" 
                className="w-full h-auto max-w-full rounded-lg shadow-xl object-cover"
                loading="eager"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-xl flex items-center justify-center">
                <div className="text-center text-blue-600">
                  <div className="text-4xl font-bold mb-2">ODMSYNC</div>
                  <div className="text-sm">Fast Internet for Lebanon</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const MemoizedHero = React.memo(Hero);
MemoizedHero.displayName = 'Hero';
export default MemoizedHero;
