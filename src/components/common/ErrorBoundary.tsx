'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              哎呀，出了点问题
            </h2>
            <p className="text-gray-600 mb-6">
              应用遇到了意外错误，请尝试刷新页面或重新开始。
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                fullWidth
              >
                🔄 重新尝试
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                fullWidth
              >
                🔃 刷新页面
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                fullWidth
              >
                🏠 返回首页
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  查看错误详情
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-40">
                  <div className="font-bold mb-2">错误信息:</div>
                  <div className="mb-2">{this.state.error.message}</div>
                  <div className="font-bold mb-2">错误堆栈:</div>
                  <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 简化的错误显示组件
export const ErrorDisplay: React.FC<{
  error: string;
  onRetry?: () => void;
  onReset?: () => void;
}> = ({ error, onRetry, onReset }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="text-red-500 text-xl">⚠️</div>
      <div className="flex-1">
        <h3 className="font-medium text-red-800 mb-1">操作失败</h3>
        <p className="text-red-700 text-sm mb-3">{error}</p>
        <div className="flex gap-2">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
            >
              重试
            </Button>
          )}
          {onReset && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
            >
              重置
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// 网络错误组件
export const NetworkError: React.FC<{
  onRetry?: () => void;
}> = ({ onRetry }) => (
  <div className="text-center py-8">
    <div className="text-6xl mb-4">📡</div>
    <h3 className="text-lg font-medium text-gray-800 mb-2">
      网络连接异常
    </h3>
    <p className="text-gray-600 mb-4">
      请检查网络连接后重试
    </p>
    {onRetry && (
      <Button onClick={onRetry}>
        🔄 重新连接
      </Button>
    )}
  </div>
);

// API错误组件
export const APIError: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = 'API服务暂时不可用', onRetry }) => (
  <div className="text-center py-8">
    <div className="text-6xl mb-4">🤖</div>
    <h3 className="text-lg font-medium text-gray-800 mb-2">
      AI服务异常
    </h3>
    <p className="text-gray-600 mb-4">
      {message}
    </p>
    {onRetry && (
      <Button onClick={onRetry}>
        🔄 重新尝试
      </Button>
    )}
  </div>
);

export default ErrorBoundary;
