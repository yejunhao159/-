'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { CardStyle } from '@/types/user';
import { FormData } from '@/utils/validation';
import { useGenerate } from '@/hooks/useGenerate';
import { userProfileStorage, styleStorage } from '@/utils/storage';
import UserProfileForm from '@/components/forms/UserProfileForm';
import StylePreview from '@/components/cards/StylePreview';
import CardGenerator from '@/components/cards/CardGenerator';
import Button from '@/components/ui/Button';
import CommunityPromo from '@/components/ui/CommunityPromo';
import ErrorBoundary, { ErrorDisplay } from '@/components/common/ErrorBoundary';
import Loading, { PageLoading } from '@/components/common/Loading';

type AppStep = 'form' | 'style' | 'result';

const IcebreakerApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('form');
  const [userProfile, setUserProfile] = useState<FormData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('funny');
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    loading,
    error,
    generatedText,
    generate,
    regenerate,
    reset,
    saveCard,
    cacheHit,
    retryCount
  } = useGenerate();

  // 初始化：从本地存储加载数据
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 加载用户资料
        const savedProfile = userProfileStorage.load();
        if (savedProfile) {
          setUserProfile(savedProfile);
        }

        // 加载风格偏好
        const savedStyle = styleStorage.load();
        setSelectedStyle(savedStyle);

        // 模拟加载时间，提供更好的用户体验
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('初始化失败:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // 处理表单提交
  const handleFormSubmit = useCallback((data: FormData) => {
    setUserProfile(data);
    setCurrentStep('style');
  }, []);

  // 处理风格选择
  const handleStyleConfirm = useCallback(async () => {
    if (!userProfile) return;
    
    setCurrentStep('result');
    await generate(userProfile, selectedStyle);
  }, [userProfile, selectedStyle, generate]);

  // 重新生成
  const handleRegenerate = useCallback(async () => {
    await regenerate();
  }, [regenerate]);

  // 返回上一步
  const handleBack = useCallback(() => {
    if (currentStep === 'style') {
      setCurrentStep('form');
    } else if (currentStep === 'result') {
      setCurrentStep('style');
    }
  }, [currentStep]);

  // 重新开始
  const handleRestart = useCallback(() => {
    setCurrentStep('form');
    setUserProfile(null);
    setSelectedStyle('funny');
    reset();
  }, [reset]);

  // 处理卡片下载
  const handleCardDownload = useCallback((dataUrl: string) => {
    // 保存卡片到历史记录
    const savedCard = saveCard();
    if (savedCard) {
      console.log('卡片已保存到历史记录:', savedCard);
    }
    console.log('卡片已下载:', dataUrl);
  }, [saveCard]);

  // 处理卡片分享
  const handleCardShare = useCallback((dataUrl: string) => {
    // 保存卡片到历史记录
    const savedCard = saveCard();
    if (savedCard) {
      console.log('卡片已保存到历史记录:', savedCard);
    }
    console.log('卡片已分享:', dataUrl);
  }, [saveCard]);

  // 显示初始化加载页面
  if (isInitializing) {
    return <PageLoading text="正在初始化应用..." />;
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🎓 AI新生破冰助手
            </h1>
            <p className="text-lg text-gray-600">
              让AI帮你生成个性化的自我介绍，轻松破冰交友！
            </p>
          </div>
          
          {/* 步骤指示器 */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-4">
              {[
                { key: 'form', label: '填写信息', icon: '📝' },
                { key: 'style', label: '选择风格', icon: '🎨' },
                { key: 'result', label: '生成卡片', icon: '🎉' },
              ].map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                    ${currentStep === step.key 
                      ? 'bg-blue-600 text-white' 
                      : index < ['form', 'style', 'result'].indexOf(currentStep)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {index < ['form', 'style', 'result'].indexOf(currentStep) ? '✓' : step.icon}
                  </div>
                  <span className={`
                    ml-2 text-sm font-medium
                    ${currentStep === step.key ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <div className={`
                      w-8 h-0.5 mx-4
                      ${index < ['form', 'style', 'result'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                      }
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'form' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                📝 填写你的基本信息
              </h2>
              <p className="text-gray-600">
                告诉我们一些关于你的信息，AI会据此生成个性化的自我介绍
              </p>
            </div>
            
            <UserProfileForm
              onSubmit={handleFormSubmit}
              loading={loading}
              initialData={userProfile || undefined}
            />

            {/* 表单页面的社群推广 */}
            <div className="mt-8">
              <CommunityPromo variant="compact" />
            </div>
          </div>
        )}

        {currentStep === 'style' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🎨 选择你喜欢的卡片风格
              </h2>
              <p className="text-gray-600">
                不同的风格会生成不同调性的自我介绍文案
              </p>
            </div>
            
            <StylePreview
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
            
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="min-w-[120px]"
              >
                ← 返回修改
              </Button>
              
              <Button
                onClick={handleStyleConfirm}
                loading={loading}
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? '生成中...' : '确认风格 →'}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'result' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🎉 你的专属破冰卡片
              </h2>
              <p className="text-gray-600">
                AI已为你生成个性化的自我介绍卡片，快去分享给朋友们吧！
              </p>
            </div>
            
            {error && (
              <div className="mb-6">
                <ErrorDisplay
                  error={error}
                  onRetry={handleRegenerate}
                  onReset={handleRestart}
                />
                {retryCount > 0 && (
                  <div className="mt-2 text-sm text-gray-500 text-center">
                    已重试 {retryCount} 次
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="mb-6">
                <Loading size="lg" text="AI正在生成个性化内容..." />
              </div>
            )}

            {cacheHit && generatedText && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-700 text-sm flex items-center gap-2">
                  ⚡ 从缓存快速加载
                </div>
              </div>
            )}
            
            {generatedText && userProfile && (
              <CardGenerator
                userProfile={userProfile}
                generatedText={generatedText}
                style={selectedStyle}
                onDownload={handleCardDownload}
                onShare={handleCardShare}
              />
            )}
            
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loading}
                className="min-w-[120px]"
              >
                ← 换个风格
              </Button>
              
              <Button
                variant="outline"
                onClick={handleRegenerate}
                loading={loading}
                disabled={loading || !generatedText}
                className="min-w-[120px]"
              >
                🔄 重新生成
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleRestart}
                disabled={loading}
                className="min-w-[120px]"
              >
                🆕 重新开始
              </Button>
            </div>

            {/* 结果页面的社群推广 */}
            <div className="mt-8">
              <CommunityPromo />
            </div>
          </div>
        )}
      </div>

      {/* 社群推广区域 */}
      <div className="mt-16">
        <CommunityPromo variant="footer" />
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default IcebreakerApp;
