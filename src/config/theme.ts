/**
 * Theme Configuration
 * Dark mode and theme-related settings
 */

export const themeConfig = {
  // Dark mode colors
  dark: {
    background: {
      primary: '#111827', // gray-900
      secondary: '#1f2937', // gray-800
      tertiary: '#374151', // gray-700
    },
    text: {
      primary: '#f9fafb', // gray-50
      secondary: '#e5e7eb', // gray-200
      tertiary: '#9ca3af', // gray-400
    },
    border: {
      default: '#374151', // gray-700
      light: '#4b5563', // gray-600
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    },
  },

  // Light mode colors
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb', // gray-50
      tertiary: '#f3f4f6', // gray-100
    },
    text: {
      primary: '#111827', // gray-900
      secondary: '#374151', // gray-700
      tertiary: '#6b7280', // gray-500
    },
    border: {
      default: '#e5e7eb', // gray-200
      light: '#f3f4f6', // gray-100
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
  },

  // Gradients
  gradients: {
    hero: 'bg-gradient-to-br from-blue-900/40 via-black to-black',
    section: 'bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
    card: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
  },

  // Animation durations
  animation: {
    fast: 150,
    default: 300,
    slow: 500,
  },
} as const;

