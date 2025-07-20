'use client';

import React, { useState } from 'react';
import { useGenerate, STYLE_OPTIONS } from '@/hooks/useGenerate';
import { UserProfile, CardStyle } from '@/types/user';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const APITest: React.FC = () => {
  const { loading, error, generatedText, generate, regenerate, reset } = useGenerate();
  
  const [testProfile, setTestProfile] = useState<UserProfile>({
    nickname: '小明',
    major: '计算机科学与技术',
    grade: '大一' as const,
    hometown: '北京',
    interests: ['编程', '游戏', '音乐'],
    personality: ['外向', '乐观', '创意'],
    skills: '会弹吉他',
    socialGoals: '想找志同道合的朋友一起学习和玩耍',
  });
  
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('funny');

  const handleGenerate = async () => {
    await generate(testProfile, selectedStyle);
  };

  const handleRegenerate = async () => {
    await regenerate();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI API 测试工具</h2>
        
        {/* 测试数据输入 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="昵称"
            value={testProfile.nickname}
            onChange={(e) => setTestProfile(prev => ({ ...prev, nickname: e.target.value }))}
            required
          />
          
          <Input
            label="专业"
            value={testProfile.major}
            onChange={(e) => setTestProfile(prev => ({ ...prev, major: e.target.value }))}
            required
          />
          
          <Select
            label="年级"
            value={testProfile.grade}
            onChange={(e) => setTestProfile(prev => ({ ...prev, grade: e.target.value as '大一' | '大二' | '大三' | '大四' }))}
            options={[
              { value: '大一', label: '大一' },
              { value: '大二', label: '大二' },
              { value: '大三', label: '大三' },
              { value: '大四', label: '大四' },
            ]}
            required
          />
          
          <Input
            label="家乡"
            value={testProfile.hometown || ''}
            onChange={(e) => setTestProfile(prev => ({ ...prev, hometown: e.target.value }))}
          />
          
          <Input
            label="兴趣爱好（逗号分隔）"
            value={testProfile.interests?.join(', ') || ''}
            onChange={(e) => setTestProfile(prev => ({ 
              ...prev, 
              interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
          />
          
          <Input
            label="性格特点（逗号分隔）"
            value={testProfile.personality?.join(', ') || ''}
            onChange={(e) => setTestProfile(prev => ({ 
              ...prev, 
              personality: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
          />
          
          <Input
            label="特殊技能"
            value={testProfile.skills || ''}
            onChange={(e) => setTestProfile(prev => ({ ...prev, skills: e.target.value }))}
          />
          
          <Input
            label="交友目标"
            value={testProfile.socialGoals || ''}
            onChange={(e) => setTestProfile(prev => ({ ...prev, socialGoals: e.target.value }))}
          />
        </div>

        {/* 风格选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择风格
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STYLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStyle(option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedStyle === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={handleGenerate}
            loading={loading}
            disabled={loading}
          >
            {loading ? '生成中...' : '生成文案'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={loading || !generatedText}
          >
            重新生成
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={loading}
          >
            重置
          </Button>
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">生成失败</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        )}

        {/* 结果显示 */}
        {generatedText && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 font-medium mb-2">生成结果</div>
            <div className="text-gray-800 whitespace-pre-wrap">{generatedText}</div>
            <div className="mt-3 text-xs text-gray-500">
              字数：{generatedText.length} 字
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APITest;
