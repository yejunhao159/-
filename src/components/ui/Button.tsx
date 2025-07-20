import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    children,
    className,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          // 基础样式
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          
          // 尺寸样式
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          
          // 变体样式
          {
            // Primary
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': 
              variant === 'primary' && !isDisabled,
            'bg-blue-400 text-white cursor-not-allowed': 
              variant === 'primary' && isDisabled,
            
            // Secondary
            'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': 
              variant === 'secondary' && !isDisabled,
            'bg-gray-400 text-white cursor-not-allowed': 
              variant === 'secondary' && isDisabled,
            
            // Outline
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500': 
              variant === 'outline' && !isDisabled,
            'border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed': 
              variant === 'outline' && isDisabled,
            
            // Ghost
            'text-gray-700 hover:bg-gray-100 focus:ring-gray-500': 
              variant === 'ghost' && !isDisabled,
            'text-gray-400 cursor-not-allowed': 
              variant === 'ghost' && isDisabled,
          },
          
          // 宽度
          fullWidth && 'w-full',
          
          // 自定义样式
          className
        )}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
