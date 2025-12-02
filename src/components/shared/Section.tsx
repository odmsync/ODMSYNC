import React, { ReactNode } from 'react';
import { sectionClasses } from '@/config/design';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'dark' | 'gradient';
  centered?: boolean;
  ariaLabelledby?: string;
  ariaLabel?: string;
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = '',
  padding = 'md',
  background = 'white',
  centered = false,
  ariaLabelledby,
  ariaLabel,
}) => {
  const backgroundClasses = {
    white: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-800',
    dark: 'bg-gray-900 dark:bg-gray-950',
    gradient: 'bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
  };

  return (
    <section
      id={id}
      className={`
        ${sectionClasses.base}
        ${sectionClasses.padding[padding]}
        ${backgroundClasses[background]}
        ${centered ? sectionClasses.centered : ''}
        ${className}
      `}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
};

