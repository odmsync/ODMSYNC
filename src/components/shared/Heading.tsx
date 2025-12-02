import React, { ReactNode } from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
}

const headingClasses = {
  1: 'text-4xl md:text-5xl lg:text-6xl font-extrabold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-bold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-semibold',
  6: 'text-base md:text-lg font-semibold',
};

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  children,
  className = '',
  id,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const baseClasses = 'text-gray-900 dark:text-white';

  return (
    <Tag
      id={id}
      className={`
        ${headingClasses[level]}
        ${baseClasses}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

