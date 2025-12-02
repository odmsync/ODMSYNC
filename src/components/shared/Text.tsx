import React, { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  variant?: 'body' | 'lead' | 'small' | 'caption';
  className?: string;
  as?: 'p' | 'span' | 'div';
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted';
}

const variantClasses = {
  body: 'text-base leading-relaxed',
  lead: 'text-lg md:text-xl leading-relaxed',
  small: 'text-sm leading-relaxed',
  caption: 'text-xs leading-relaxed',
};

const colorClasses = {
  primary: 'text-gray-900 dark:text-gray-100',
  secondary: 'text-gray-700 dark:text-gray-300',
  tertiary: 'text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-500',
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  className = '',
  as: Component = 'p',
  color = 'secondary',
}) => {
  return (
    <Component
      className={`
        ${variantClasses[variant]}
        ${colorClasses[color]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

