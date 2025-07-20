'use client';

import React from 'react';
import { CardStyle } from '@/types/user';
import { CARD_STYLES } from '@/constants/cardDesign';
import { clsx } from 'clsx';

interface StylePreviewProps {
  selectedStyle: CardStyle;
  onStyleChange: (style: CardStyle) => void;
  className?: string;
}

const StylePreview: React.FC<StylePreviewProps> = ({
  selectedStyle,
  onStyleChange,
  className,
}) => {
  const styles = Object.entries(CARD_STYLES) as [CardStyle, typeof CARD_STYLES[CardStyle]][];

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="text-lg font-semibold text-gray-800">
        🎨 选择卡片风格
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map(([styleKey, styleConfig]) => {
          const isSelected = selectedStyle === styleKey;
          
          return (
            <button
              key={styleKey}
              onClick={() => onStyleChange(styleKey)}
              className={clsx(
                'relative p-4 rounded-xl border-2 transition-all duration-300 text-left',
                'hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500',
                isSelected 
                  ? 'border-blue-500 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {/* 风格预览卡片 */}
              <div 
                className="relative overflow-hidden rounded-lg mb-3"
                style={{
                  height: '120px',
                  background: styleConfig.gradients.background,
                }}
              >
                {/* 装饰性背景 */}
                <div 
                  className="absolute inset-0 opacity-10 text-lg flex flex-wrap justify-center items-center"
                  style={{ 
                    fontSize: '1.5rem',
                    lineHeight: '2rem',
                    letterSpacing: '1rem',
                  }}
                >
                  {styleConfig.patterns.background?.slice(0, 8)}
                </div>
                
                {/* 预览内容 */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  {/* 头部 */}
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ 
                        background: styleConfig.gradients.accent,
                        color: 'white',
                      }}
                    >
                      {styleConfig.emoji}
                    </div>
                    <div>
                      <div 
                        className="font-medium text-sm"
                        style={{ color: styleConfig.colors.text }}
                      >
                        示例昵称
                      </div>
                      <div 
                        className="text-xs opacity-80"
                        style={{ color: styleConfig.colors.textSecondary }}
                      >
                        计算机科学 · 大一
                      </div>
                    </div>
                  </div>
                  
                  {/* 内容预览 */}
                  <div 
                    className="text-xs leading-relaxed"
                    style={{ color: styleConfig.colors.text }}
                  >
                    这是{styleConfig.name}风格的预览文案...
                  </div>
                  
                  {/* 标签预览 */}
                  <div className="flex gap-1">
                    {['标签1', '标签2'].map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: styleConfig.colors.accent + '20',
                          color: styleConfig.colors.accent,
                          border: `1px solid ${styleConfig.colors.accent}40`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 风格信息 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{styleConfig.emoji}</span>
                  <span className="font-semibold text-gray-800">
                    {styleConfig.name}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-blue-500">
                      ✓
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  {getStyleDescription(styleKey)}
                </div>
                
                {/* 颜色预览 */}
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: styleConfig.colors.primary }}
                    title="主色"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: styleConfig.colors.secondary }}
                    title="辅助色"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: styleConfig.colors.accent }}
                    title="强调色"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 当前选择的风格信息 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{CARD_STYLES[selectedStyle].emoji}</span>
          <span className="font-semibold text-blue-800">
            已选择：{CARD_STYLES[selectedStyle].name}
          </span>
        </div>
        <div className="text-sm text-blue-700">
          {getStyleDescription(selectedStyle)}
        </div>
      </div>
    </div>
  );
};

// 获取风格描述
function getStyleDescription(style: CardStyle): string {
  const descriptions: Record<CardStyle, string> = {
    funny: '活泼搞笑，充满趣味性，适合外向开朗的同学。使用明亮的暖色调和有趣的装饰元素。',
    literary: '文艺清新，富有诗意，适合内敛文艺的同学。使用柔和的紫色调和优雅的设计元素。',
    academic: '专业严谨，突出学术气质，适合学霸型同学。使用稳重的蓝色调和简洁的设计风格。',
    cool: '个性炫酷，充满活力，适合追求潮流的同学。使用深色背景和炫彩的渐变效果。',
  };
  
  return descriptions[style];
}

export default StylePreview;
