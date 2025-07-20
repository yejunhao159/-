import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required, 
    fullWidth = true, 
    options,
    placeholder = '请选择...',
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
        
        <select
          ref={ref}
          className={clsx(
            // 基础样式
            'px-3 py-2 border rounded-lg text-sm transition-colors',
            'bg-white cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            
            // 状态样式
            error 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 hover:border-gray-400',
            
            // 禁用状态
            props.disabled && 'bg-gray-100 cursor-not-allowed',
            
            // 宽度
            fullWidth && 'w-full',
            
            // 自定义样式
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
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

Select.displayName = 'Select';

export default Select;
