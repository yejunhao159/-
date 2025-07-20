'use client';

import React from 'react';
import { clsx } from 'clsx';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = '加载中...', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <div className={clsx(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size]
      )} />
      {text && (
        <p className={clsx('text-gray-600', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

// 页面级加载组件
export const PageLoading: React.FC<{ text?: string }> = ({ text = '页面加载中...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loading size="lg" text={text} />
  </div>
);

// 卡片加载骨架屏
export const CardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* 头部骨架 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      
      {/* 内容骨架 */}
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      
      {/* 标签骨架 */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-200 rounded-full w-14" />
      </div>
      
      {/* 按钮骨架 */}
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded w-24" />
        <div className="h-10 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

// 表单加载骨架屏
export const FormSkeleton: React.FC = () => (
  <div className="animate-pulse max-w-2xl mx-auto">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
    
    <div className="h-12 bg-gray-200 rounded w-full" />
  </div>
);

export default Loading;
