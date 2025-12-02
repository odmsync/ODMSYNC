import React from 'react';
import { CheckCircle, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDirectionHelpers } from '@/utils/direction';

interface StatusItem {
  id: string;
  type: 'operational' | 'maintenance' | 'outage';
  title: string;
  description: string;
  affectedAreas?: string[];
  scheduledTime?: string;
}

const ServiceStatus: React.FC = () => {
  const { t, language } = useLanguage();
  const dir = getDirectionHelpers(language);

  // Mock status data - in production, this would come from an API
  const statusItems: StatusItem[] = [
    // Example: All systems operational
    // Uncomment below to show maintenance/outage examples:
    // {
    //   id: 'maintenance-1',
    //   type: 'maintenance',
    //   title: 'Planned Maintenance - Beirut',
    //   description: 'Network upgrade scheduled for tonight 2 AM - 4 AM',
    //   affectedAreas: ['Beirut', 'Jounieh'],
    //   scheduledTime: '2024-12-02 02:00 - 04:00',
    // },
  ];

  const isAllOperational = statusItems.length === 0;

  return (
    <section 
      id="status" 
      className="py-20 bg-gradient-to-b from-white to-gray-50"
      dir={dir.direction}
      aria-labelledby="status-title"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="status-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.status.title}
          </h2>
          <p className="text-lg text-gray-600">
            {t.status.subtitle}
          </p>
        </div>

        {isAllOperational ? (
          /* All Systems Operational */
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-green-100 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t.status.operational}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {t.status.operational_desc}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  {t.status.last_updated}: {new Date().toLocaleString(language === 'ar' ? 'ar-LB' : 'en-LB')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Status Items List */
          <div className="space-y-4">
            {statusItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-lg border p-6 ${
                  item.type === 'outage' ? 'border-red-200 bg-red-50' :
                  item.type === 'maintenance' ? 'border-yellow-200 bg-yellow-50' :
                  'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-full ${
                    item.type === 'outage' ? 'bg-red-100' :
                    item.type === 'maintenance' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    {item.type === 'outage' ? (
                      <AlertTriangle className={`w-6 h-6 ${
                        item.type === 'outage' ? 'text-red-600' :
                        item.type === 'maintenance' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                    ) : item.type === 'maintenance' ? (
                      <Clock className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {item.description}
                    </p>
                    {item.affectedAreas && item.affectedAreas.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            {t.status.affected_areas}:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.affectedAreas.map((area, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.scheduledTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{item.scheduledTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Issues Message */}
        {!isAllOperational && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {t.status.no_issues}
          </div>
        )}
      </div>
    </section>
  );
};

const MemoizedServiceStatus = React.memo(ServiceStatus);
MemoizedServiceStatus.displayName = 'ServiceStatus';
export default MemoizedServiceStatus;

