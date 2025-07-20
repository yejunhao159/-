'use client';

import React, { useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { UserProfile, CardStyle } from '@/types/user';
import { CARD_STYLES, CARD_DIMENSIONS, BRAND_CONFIG } from '@/constants/cardDesign';
import Button from '@/components/ui/Button';

interface CardGeneratorProps {
  userProfile: UserProfile;
  generatedText: string;
  style: CardStyle;
  onDownload?: (dataUrl: string) => void;
  onShare?: (dataUrl: string) => void;
}

const CardGenerator: React.FC<CardGeneratorProps> = ({
  userProfile,
  generatedText,
  style,
  onDownload,
  onShare,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const styleConfig = CARD_STYLES[style];

  // 生成卡片图片
  const generateCardImage = useCallback(async (): Promise<string> => {
    if (!cardRef.current) {
      throw new Error('卡片元素未找到');
    }

    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        width: CARD_DIMENSIONS.width,
        height: CARD_DIMENSIONS.height,
        scale: 2, // 高清输出
        backgroundColor: styleConfig.colors.background,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      return dataUrl;
    } finally {
      setIsGenerating(false);
    }
  }, [styleConfig.colors.background]);

  // 下载卡片
  const handleDownload = useCallback(async () => {
    try {
      const dataUrl = await generateCardImage();
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `${userProfile.nickname}-破冰卡片-${styleConfig.name}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onDownload?.(dataUrl);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请稍后重试');
    }
  }, [generateCardImage, userProfile.nickname, styleConfig.name, onDownload]);

  // 分享卡片
  const handleShare = useCallback(async () => {
    try {
      const dataUrl = await generateCardImage();
      
      if (navigator.share && navigator.canShare) {
        // 使用原生分享API
        const blob = await fetch(dataUrl).then(r => r.blob());
        const file = new File([blob], `${userProfile.nickname}-破冰卡片.png`, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${userProfile.nickname}的破冰卡片`,
            text: '我用AI生成了个性化的自我介绍卡片！',
            files: [file],
          });
        } else {
          // 降级到复制链接
          await navigator.clipboard.writeText(dataUrl);
          alert('卡片链接已复制到剪贴板');
        }
      } else {
        // 降级到复制链接
        await navigator.clipboard.writeText(dataUrl);
        alert('卡片链接已复制到剪贴板');
      }
      
      onShare?.(dataUrl);
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请稍后重试');
    }
  }, [generateCardImage, userProfile.nickname, onShare]);

  // 渲染标签
  const renderTags = (tags: string[] | undefined, label: string) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="text-sm opacity-80 mb-2">{label}</div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm"
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
    );
  };

  return (
    <div className="space-y-6">
      {/* 卡片预览 */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="relative overflow-hidden shadow-2xl"
          style={{
            width: CARD_DIMENSIONS.width / 2, // 显示时缩放50%
            height: CARD_DIMENSIONS.height / 2,
            borderRadius: CARD_DIMENSIONS.borderRadius / 2,
            background: styleConfig.gradients.background,
            color: styleConfig.colors.text,
            fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {/* 装饰性背景图案 */}
          <div 
            className="absolute inset-0 opacity-5 text-6xl flex flex-wrap justify-center items-center"
            style={{ 
              fontSize: '3rem',
              lineHeight: '4rem',
              letterSpacing: '2rem',
            }}
          >
            {styleConfig.patterns.background?.repeat(20)}
          </div>

          {/* 卡片内容 */}
          <div className="relative z-10 p-8 h-full flex flex-col">
            {/* 头部 - 头像和基本信息 */}
            <div className="text-center mb-6">
              {/* 头像占位符 */}
              <div 
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl"
                style={{ 
                  background: styleConfig.gradients.accent,
                  color: 'white',
                }}
              >
                {styleConfig.emoji}
              </div>
              
              {/* 昵称 */}
              <h1 
                className="font-bold mb-1"
                style={{ 
                  fontSize: styleConfig.typography.titleSize / 2,
                  color: styleConfig.colors.text,
                }}
              >
                {userProfile.nickname}
              </h1>
              
              {/* 专业和年级 */}
              <div 
                className="opacity-80"
                style={{ 
                  fontSize: styleConfig.typography.tagSize / 2,
                  color: styleConfig.colors.textSecondary,
                }}
              >
                {userProfile.major} · {userProfile.grade}
                {userProfile.hometown && ` · ${userProfile.hometown}`}
              </div>
            </div>

            {/* AI生成的自我介绍 */}
            <div className="flex-1 mb-6">
              <div 
                className="leading-relaxed"
                style={{ 
                  fontSize: styleConfig.typography.contentSize / 2,
                  lineHeight: styleConfig.typography.lineHeight,
                  color: styleConfig.colors.text,
                }}
              >
                {generatedText}
              </div>
            </div>

            {/* 标签区域 */}
            <div className="space-y-3">
              {renderTags(userProfile.interests, '🎯 兴趣爱好')}
              {renderTags(userProfile.personality, '✨ 性格特点')}
              
              {userProfile.skills && (
                <div className="mb-3">
                  <div className="text-sm opacity-80 mb-1">🎪 特殊技能</div>
                  <div 
                    className="text-sm"
                    style={{ color: styleConfig.colors.textSecondary }}
                  >
                    {userProfile.skills}
                  </div>
                </div>
              )}
              
              {userProfile.socialGoals && (
                <div className="mb-3">
                  <div className="text-sm opacity-80 mb-1">🤝 交友目标</div>
                  <div 
                    className="text-sm"
                    style={{ color: styleConfig.colors.textSecondary }}
                  >
                    {userProfile.socialGoals}
                  </div>
                </div>
              )}
            </div>

            {/* 品牌水印 */}
            <div className="mt-auto pt-4 text-center">
              <div 
                className="text-xs opacity-60"
                style={{ color: styleConfig.colors.textSecondary }}
              >
                {BRAND_CONFIG.logo} {BRAND_CONFIG.text}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleDownload}
          loading={isGenerating}
          disabled={isGenerating}
          className="min-w-[120px]"
        >
          {isGenerating ? '生成中...' : '📥 下载卡片'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleShare}
          disabled={isGenerating}
          className="min-w-[120px]"
        >
          📤 分享卡片
        </Button>
      </div>
    </div>
  );
};

export default CardGenerator;
