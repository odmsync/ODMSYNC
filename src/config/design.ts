/**
 * Unified Design Tokens
 * Centralized design system for consistent styling across the application
 */

export const designTokens = {
  // Colors
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      arabic: ['Cairo', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // Spacing
  spacing: {
    section: {
      sm: 'py-12',
      md: 'py-16',
      lg: 'py-20',
      xl: 'py-24',
    },
    container: {
      padding: 'px-4 sm:px-6 lg:px-8',
      maxWidth: 'max-w-7xl',
    },
    gap: {
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    },
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    inner: 'shadow-inner',
  },

  // Border Radius
  borderRadius: {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },

  // Transitions
  transitions: {
    fast: 'transition-all duration-150',
    default: 'transition-all duration-300',
    slow: 'transition-all duration-500',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-300',
  },

  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },
} as const;

/**
 * Standard section wrapper classes
 */
export const sectionClasses = {
  base: 'w-full',
  padding: {
    sm: `${designTokens.spacing.section.sm}`,
    md: `${designTokens.spacing.section.md}`,
    lg: `${designTokens.spacing.section.lg}`,
    xl: `${designTokens.spacing.section.xl}`,
  },
  container: `${designTokens.spacing.container.maxWidth} mx-auto ${designTokens.spacing.container.padding}`,
  centered: 'text-center',
} as const;

/**
 * Standard card classes
 */
export const cardClasses = {
  base: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700',
  hover: 'hover:shadow-xl hover:-translate-y-1',
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
} as const;

/**
 * Standard button classes
 */
export const buttonClasses = {
  base: 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation',
  size: {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  },
  variant: {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:text-white shadow-sm hover:shadow-md focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:active:bg-blue-900/30 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600 focus:ring-gray-500',
  },
} as const;

