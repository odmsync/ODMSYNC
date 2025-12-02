/**
 * Centralized layout utilities
 * Provides consistent spacing, typography, and responsive patterns
 */

/**
 * Standard section padding classes
 */
export const sectionPadding = {
  default: 'py-16',
  large: 'py-20',
  small: 'py-12',
  xlarge: 'py-24',
};

/**
 * Standard container classes
 */
export const containerClasses = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

/**
 * Standard transition classes
 */
export const transitions = {
  default: 'transition-all duration-300',
  fast: 'transition-all duration-200',
  slow: 'transition-all duration-500',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-300',
};

/**
 * Standard shadow classes
 */
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  hover: 'hover:shadow-xl',
};

/**
 * Standard border radius classes
 */
export const borderRadius = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
};

/**
 * Standard text sizes
 */
export const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

/**
 * Standard font weights
 */
export const fontWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

/**
 * Standard spacing (gap, margin, padding)
 */
export const spacing = {
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

/**
 * Get responsive grid columns
 */
export const getGridCols = (cols: number, breakpoint: 'sm' | 'md' | 'lg' = 'md') => {
  return `grid grid-cols-1 ${breakpoint}:grid-cols-${cols} gap-8`;
};

