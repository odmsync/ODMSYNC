import React, { ReactNode } from 'react';
import { sectionClasses } from '@/config/design';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'lg',
}) => {
  return (
    <div
      className={`
        ${maxWidthClasses[size]} 
        mx-auto 
        ${sectionClasses.container.split(' ').slice(1).join(' ')}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

