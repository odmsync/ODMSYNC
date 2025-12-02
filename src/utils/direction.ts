/**
 * Centralized directionality utilities for RTL/LTR support
 * Provides consistent helpers for all components
 */

export type Direction = 'ltr' | 'rtl';

export interface DirectionHelpers {
  direction: Direction;
  isRTL: boolean;
  // Margin helpers
  ml2: string; // margin-left (LTR) or margin-right (RTL)
  mr2: string; // margin-right (LTR) or margin-left (RTL)
  ml3: string;
  mr3: string;
  ml4: string;
  mr4: string;
  // Padding helpers
  pl2: string;
  pr2: string;
  pl3: string;
  pr3: string;
  // Text alignment
  textStart: string; // text-left (LTR) or text-right (RTL)
  textEnd: string;   // text-right (LTR) or text-left (RTL)
  // Flex direction
  flexRow: string;  // flex-row (LTR) or flex-row-reverse (RTL)
  // Border helpers
  borderStart: string; // border-l (LTR) or border-r (RTL)
  borderEnd: string;   // border-r (LTR) or border-l (RTL)
  // Transform helpers
  translateX: string; // translate-x-0 (LTR) or -translate-x-0 (RTL)
}

/**
 * Get directionality helpers based on language
 */
export const getDirectionHelpers = (language: 'en' | 'ar'): DirectionHelpers => {
  const isRTL = language === 'ar';
  const direction: Direction = isRTL ? 'rtl' : 'ltr';

  return {
    direction,
    isRTL,
    // Margins
    ml2: isRTL ? 'mr-2' : 'ml-2',
    mr2: isRTL ? 'ml-2' : 'mr-2',
    ml3: isRTL ? 'mr-3' : 'ml-3',
    mr3: isRTL ? 'ml-3' : 'mr-3',
    ml4: isRTL ? 'mr-4' : 'ml-4',
    mr4: isRTL ? 'ml-4' : 'mr-4',
    // Padding
    pl2: isRTL ? 'pr-2' : 'pl-2',
    pr2: isRTL ? 'pl-2' : 'pr-2',
    pl3: isRTL ? 'pr-3' : 'pl-3',
    pr3: isRTL ? 'pl-3' : 'pr-3',
    // Text alignment
    textStart: isRTL ? 'text-right' : 'text-left',
    textEnd: isRTL ? 'text-left' : 'text-right',
    // Flex
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    // Borders
    borderStart: isRTL ? 'border-r-4' : 'border-l-4',
    borderEnd: isRTL ? 'border-l-4' : 'border-r-4',
    // Transform
    translateX: isRTL ? '-translate-x-0' : 'translate-x-0',
  };
};

/**
 * Get appropriate arrow icon direction
 */
export const getArrowDirection = (isRTL: boolean) => {
  return isRTL ? 'left' : 'right';
};

