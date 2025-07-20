import React from 'react';
import { clsx } from 'clsx';

interface CommunityPromoProps {
  className?: string;
  variant?: 'default' | 'compact' | 'footer';
}

const CommunityPromo: React.FC<CommunityPromoProps> = ({ 
  className, 
  variant = 'default' 
}) => {
  const handleContactClick = () => {
    // 这里可以添加统计或其他逻辑
    console.log('用户点击了联系方式');
  };

  if (variant === 'compact') {
    return (
      <div className={clsx(
        'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4',
        'text-center',
        className
      )}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-base sm:text-lg">🤖</span>
            <span className="whitespace-nowrap">由 AI社区 提供技术支持</span>
          </div>
          <span className="hidden sm:inline text-lg">·</span>
          <button
            onClick={handleContactClick}
            className="text-blue-600 hover:text-blue-800 font-medium underline text-xs sm:text-sm"
          >
            让AI帮你更好地表达自己
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={clsx(
        'bg-gradient-to-r from-gray-900 to-blue-900 text-white',
        'border-t border-gray-200',
        className
      )}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🚀</span>
              <h3 className="text-lg sm:text-xl font-bold">Chat is All You Need</h3>
              <span className="text-xl sm:text-2xl">🚀</span>
            </div>

            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base px-2 sm:px-0">
              相信AI的力量，用对话改变世界。加入我们的AI社群，学习如何用AI实现不可能的事情，
              让每一次对话都成为创造的起点。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
              <div className="flex items-center gap-2 text-blue-300">
                <span className="text-base sm:text-lg">💬</span>
                <span className="font-medium text-sm sm:text-base">微信：yyy246jhh888</span>
              </div>
              <div className="hidden sm:block text-gray-500">|</div>
              <div className="flex items-center gap-2 text-purple-300">
                <span className="text-base sm:text-lg">📧</span>
                <span className="font-medium text-sm sm:text-base break-all">邮箱：3243332126@qq.com</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                🎯 专注AI应用 · 🔥 实战分享 · 🌟 技术交流 · 💡 创意无限
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // default variant
  return (
    <div className={clsx(
      'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      'border border-blue-200 rounded-xl p-4 sm:p-6',
      'shadow-sm hover:shadow-md transition-shadow duration-300',
      className
    )}>
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl">🤖</span>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">Chat is All You Need</h3>
          <span className="text-xl sm:text-2xl">✨</span>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto px-2 sm:px-0">
          相信AI的力量！加入我们的AI社群，学习如何用对话实现不可能的事情。
          从破冰文案到产品创意，让AI成为你最好的伙伴。
        </p>
        
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 pt-2">
          <button
            onClick={handleContactClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium"
          >
            <span>💬</span>
            <span>加入AI社群</span>
          </button>
          <div className="text-xs text-gray-500">
            微信：yyy246jhh888
          </div>
        </div>
        
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
          🎯 AI实战技巧 · 🔥 创意分享 · 🌟 技术交流
        </div>
      </div>
    </div>
  );
};

export default CommunityPromo;
