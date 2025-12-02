export type EventName = 
  | 'speed_test_start' 
  | 'speed_test_complete' 
  | 'speed_test_error'
  | 'plan_selected' 
  | 'coverage_check' 
  | 'chat_opened' 
  | 'chat_message_sent'
  | 'chat_error'
  | 'error_boundary_caught'
  | 'contact_form_submit'
  | 'ai_recommendation_generated';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export const analytics = {
  track: (event: EventName, properties?: EventProperties) => {
    // In a real production environment, this would send data to Google Analytics, Mixpanel, etc.
    // For now, we log to console with a distinctive prefix for debugging.
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.groupCollapsed(`[Analytics] 📊 ${event}`);
      console.dir(properties || {});
      console.groupEnd();
    }
    
    // Example integration points:
    // Google Analytics 4:
    // if (window.gtag) window.gtag('event', event, properties);
    // 
    // Mixpanel:
    // if (window.mixpanel) window.mixpanel.track(event, properties);
    //
    // Custom analytics endpoint:
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event, properties }) });
  }
};
