import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface TagSelectorProps {
  label?: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelection?: number;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  allowCustom?: boolean;
  customTrigger?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  label,
  options,
  value = [],
  onChange,
  maxSelection = 8,
  error,
  helperText,
  required,
  placeholder = '点击选择标签',
  allowCustom = false,
  customTrigger = '自定义兴趣'
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleTagClick = (tag: string) => {
    if (allowCustom && tag === customTrigger) {
      setShowCustomInput(true);
      return;
    }

    if (value.includes(tag)) {
      // 取消选择
      onChange(value.filter(item => item !== tag));
    } else {
      // 添加选择
      if (value.length < maxSelection) {
        onChange([...value, tag]);
      }
    }
  };

  const handleCustomSubmit = () => {
    if (customValue.trim() && !value.includes(customValue.trim()) && value.length < maxSelection) {
      onChange([...value, customValue.trim()]);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const handleCustomCancel = () => {
    setCustomValue('');
    setShowCustomInput(false);
  };

  const isSelected = (tag: string) => value.includes(tag);
  const isMaxReached = value.length >= maxSelection;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          <span className="text-gray-500 text-xs ml-2">
            ({value.length}/{maxSelection})
          </span>
        </label>
      )}

      {/* 已选择的标签 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              <button
                type="button"
                className="ml-2 text-blue-200 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTagClick(tag);
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 可选择的标签 */}
      <div className={clsx(
        'flex flex-wrap gap-2 p-3 border rounded-lg min-h-[100px]',
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
      )}>
        {value.length === 0 && !showCustomInput && (
          <p className="text-gray-400 text-sm w-full text-center py-4">
            {placeholder}
          </p>
        )}

        {options.map((tag) => {
          const selected = isSelected(tag);
          const disabled = !selected && isMaxReached;
          const isCustomTriggerTag = allowCustom && tag === customTrigger;

          return (
            <button
              key={tag}
              type="button"
              disabled={disabled && !isCustomTriggerTag}
              onClick={() => handleTagClick(tag)}
              className={clsx(
                'px-3 py-1 rounded-full text-sm border transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                {
                  // 已选择状态
                  'bg-blue-600 text-white border-blue-600 hover:bg-blue-700': selected,

                  // 自定义触发器样式
                  'bg-green-100 text-green-700 border-green-300 hover:bg-green-200':
                    isCustomTriggerTag && !disabled,

                  // 未选择状态
                  'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600':
                    !selected && !disabled && !isCustomTriggerTag,

                  // 禁用状态
                  'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed':
                    disabled && !isCustomTriggerTag,
                }
              )}
            >
              {isCustomTriggerTag ? '+ 自定义兴趣' : tag}
            </button>
          );
        })}
      </div>

      {/* 自定义输入框 */}
      {showCustomInput && (
        <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="输入自定义兴趣（如：电竞游戏、古典音乐等）"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCustomSubmit();
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={handleCustomSubmit}
            disabled={!customValue.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            添加
          </button>
          <button
            type="button"
            onClick={handleCustomCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            取消
          </button>
        </div>
      )}

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
};

export default TagSelector;
