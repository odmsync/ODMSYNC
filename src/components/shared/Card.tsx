import React, { ReactNode } from 'react';
import { cardClasses } from '@/config/design';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  ariaLabel,
}) => {
  return (
    <div
      className={`
        ${cardClasses.base}
        ${cardClasses.padding[padding]}
        ${hover ? cardClasses.hover : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

