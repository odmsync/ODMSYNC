
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-3',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full absolute border-solid border-gray-200 dark:border-gray-700`}></div>
        <div className={`${sizeClasses[size]} rounded-full animate-spin absolute border-solid border-blue-600 dark:border-blue-400 border-t-transparent shadow-md`}></div>
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';
export default LoadingSpinner;
