import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required, 
    fullWidth = true, 
    className, 
    ...props 
  }, ref) => {
    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={clsx(
            // 基础样式
            'px-3 py-2 border rounded-lg text-sm transition-colors',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            
            // 状态样式
            error 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 bg-white hover:border-gray-400',
            
            // 禁用状态
            props.disabled && 'bg-gray-100 cursor-not-allowed',
            
            // 宽度
            fullWidth && 'w-full',
            
            // 自定义样式
            className
          )}
          {...props}
        />
        
        {/* 错误信息或帮助文本 */}
        {(error || helperText) && (
          <p className={clsx(
            'text-xs',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
