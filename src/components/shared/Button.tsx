import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { buttonClasses } from '@/config/design';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        ${buttonClasses.base}
        ${buttonClasses.size[size]}
        ${buttonClasses.variant[variant]}
        ${fullWidth ? 'w-full' : ''}
        active:scale-95
        disabled:active:scale-100
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2 inline-flex items-center">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex items-center">{icon}</span>
      )}
    </button>
  );
};

