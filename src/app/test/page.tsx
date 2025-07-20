'use client';

import React, { useState } from 'react';
import { CardStyle } from '@/types/user';
import Button from '@/components/ui/Button';

interface TestResult {
  name: string;
  success: boolean;
  content?: string;
  error?: string;
  duration: number;
}

const TestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testCases = [
    {
      name: "搞笑风格测试",
      data: {
        userProfile: {
          nickname: "小明",
          major: "计算机科学与技术",
          grade: "大一" as const,
          hometown: "北京",
          interests: ["编程", "游戏", "音乐"],
          personality: ["外向", "乐观", "创意"],
          skills: "会弹吉他",
          socialGoals: "想找志同道合的朋友一起学习和玩耍"
        },
        style: "funny" as CardStyle
      }
    },
    {
      name: "文艺风格测试",
      data: {
        userProfile: {
          nickname: "诗雨",
          major: "中文",
          grade: "大二" as const,
          hometown: "杭州",
          interests: ["阅读", "写作", "摄影"],
          personality: ["内向", "文艺", "细心"],
          skills: "写诗",
          socialGoals: "寻找有共同文学爱好的朋友"
        },
        style: "literary" as CardStyle
      }
    },
    {
      name: "学霸风格测试",
      data: {
        userProfile: {
          nickname: "学神",
          major: "数学",
          grade: "大三" as const,
          hometown: "上海",
          interests: ["数学", "物理", "编程"],
          personality: ["理性", "严谨", "专注"],
          skills: "数学建模",
          socialGoals: "找到学术研究伙伴"
        },
        style: "academic" as CardStyle
      }
    },
    {
      name: "炫酷风格测试",
      data: {
        userProfile: {
          nickname: "酷炫",
          major: "设计学",
          grade: "大四" as const,
          hometown: "深圳",
          interests: ["设计", "街舞", "滑板"],
          personality: ["个性", "独立", "创新"],
          skills: "平面设计",
          socialGoals: "结识有创意的朋友"
        },
        style: "cool" as CardStyle
      }
    }
  ];

  const runSingleTest = async (testCase: typeof testCases[0]) => {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/generate-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      });

      const result = await response.json();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        name: testCase.name,
        success: response.ok && result.success,
        responseTime,
        text: result.text,
        error: result.error,
        mock: result.mock
      };
    } catch (error) {
      return {
        name: testCase.name,
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        responseTime: 0
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const results = [];
    for (const testCase of testCases) {
      const result = await runSingleTest(testCase);
      results.push(result);
      setTestResults([...results]);
      
      // 添加延迟
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const successCount = testResults.filter(r => r.success).length;
  const successRate = testResults.length > 0 ? (successCount / testResults.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🔍 AI新生破冰助手 - 前端测试页面
          </h1>
          <p className="text-gray-600 mb-6">
            QA工程师专用测试工具 - 验证前端API调用功能
          </p>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={runAllTests}
              loading={isRunning}
              disabled={isRunning}
              className="min-w-[150px]"
            >
              {isRunning ? '测试进行中...' : '🚀 开始测试'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setTestResults([])}
              disabled={isRunning}
            >
              🗑️ 清空结果
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">📊 测试统计</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">总测试数:</span>
                  <span className="font-medium ml-1">{testResults.length}</span>
                </div>
                <div>
                  <span className="text-green-600">通过:</span>
                  <span className="font-medium ml-1">{successCount}</span>
                </div>
                <div>
                  <span className="text-red-600">失败:</span>
                  <span className="font-medium ml-1">{testResults.length - successCount}</span>
                </div>
                <div>
                  <span className="text-purple-600">成功率:</span>
                  <span className="font-medium ml-1">{successRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {testResults.map((result, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {result.success ? '✅' : '❌'} {result.name}
              </h3>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>⏱️ {result.responseTime}ms</span>
                {result.mock && <span>🤖 Mock</span>}
              </div>
            </div>

            {result.success ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">生成文案:</span>
                  <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded text-gray-800">
                    {result.text}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  文案长度: {result.text?.length || 0} 字符
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <span className="text-sm font-medium text-red-700">错误信息:</span>
                <div className="text-red-600 mt-1">{result.error}</div>
              </div>
            )}
          </div>
        ))}

        {isRunning && testResults.length < testCases.length && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">正在执行测试 {testResults.length + 1}/{testCases.length}...</span>
            </div>
          </div>
        )}

        {testResults.length === testCases.length && !isRunning && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 测试完成</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">✅ 通过测试</div>
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 font-semibold">❌ 失败测试</div>
                <div className="text-2xl font-bold text-red-600">{testResults.length - successCount}</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-blue-800 font-semibold">📊 质量评分</div>
              <div className="text-3xl font-bold text-blue-600">
                {successRate >= 95 ? 'A+' : successRate >= 90 ? 'A' : successRate >= 80 ? 'B' : successRate >= 70 ? 'C' : 'D'}
                <span className="text-lg ml-2">({successRate.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
