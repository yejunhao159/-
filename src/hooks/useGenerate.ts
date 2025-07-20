import { useState, useCallback, useRef, useEffect } from 'react';
import { UserProfile, CardStyle, GenerateResponse, CardData } from '@/types/user';
import { cardHistoryStorage, userProfileStorage, styleStorage } from '@/utils/storage';

interface UseGenerateState {
  loading: boolean;
  error: string | null;
  generatedText: string | null;
  lastRequest: { userProfile: UserProfile; style: CardStyle } | null;
  retryCount: number;
  cacheHit: boolean;
}

interface UseGenerateReturn extends UseGenerateState {
  generate: (userProfile: UserProfile, style: CardStyle) => Promise<void>;
  regenerate: () => Promise<void>;
  reset: () => void;
  saveCard: () => CardData | null;
  loadFromHistory: (card: CardData) => void;
}

export const useGenerate = (): UseGenerateReturn => {
  const [state, setState] = useState<UseGenerateState>({
    loading: false,
    error: null,
    generatedText: null,
    lastRequest: null,
    retryCount: 0,
    cacheHit: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, { text: string; timestamp: number }>>(new Map());

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 生成缓存键
  const getCacheKey = useCallback((userProfile: UserProfile, style: CardStyle): string => {
    const key = JSON.stringify({
      nickname: userProfile.nickname,
      major: userProfile.major,
      grade: userProfile.grade,
      style,
      // 只包含影响生成结果的字段
      interests: userProfile.interests?.sort(),
      personality: userProfile.personality?.sort(),
    });
    // 使用简单的哈希函数替代btoa，避免中文字符编码问题
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36); // 转换为36进制字符串
  }, []);

  // 检查缓存
  const checkCache = useCallback((userProfile: UserProfile, style: CardStyle): string | null => {
    const cacheKey = getCacheKey(userProfile, style);
    const cached = cacheRef.current.get(cacheKey);

    if (cached) {
      const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000; // 5分钟过期
      if (!isExpired) {
        return cached.text;
      } else {
        cacheRef.current.delete(cacheKey);
      }
    }

    return null;
  }, [getCacheKey]);

  // 设置缓存
  const setCache = useCallback((userProfile: UserProfile, style: CardStyle, text: string) => {
    const cacheKey = getCacheKey(userProfile, style);
    cacheRef.current.set(cacheKey, {
      text,
      timestamp: Date.now(),
    });

    // 限制缓存大小
    if (cacheRef.current.size > 20) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }
  }, [getCacheKey]);

  // 重试机制
  const generateWithRetry = useCallback(async (
    userProfile: UserProfile,
    style: CardStyle,
    retryCount = 0
  ): Promise<string> => {
    const maxRetries = 3;
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000); // 指数退避

    try {
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          style,
        }),
        signal: abortControllerRef.current.signal,
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || '生成失败');
      }

      return data.text || '';

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求已取消');
      }

      if (retryCount < maxRetries) {
        console.warn(`生成失败，${retryDelay}ms后重试 (${retryCount + 1}/${maxRetries}):`, error);

        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return generateWithRetry(userProfile, style, retryCount + 1);
      }

      throw error;
    }
  }, []);

  const generate = useCallback(async (userProfile: UserProfile, style: CardStyle) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      retryCount: 0,
      cacheHit: false,
    }));

    try {
      // 检查缓存
      const cachedText = checkCache(userProfile, style);
      if (cachedText) {
        setState(prev => ({
          ...prev,
          loading: false,
          generatedText: cachedText,
          lastRequest: { userProfile, style },
          error: null,
          cacheHit: true,
        }));
        return;
      }

      // 生成新内容
      const generatedText = await generateWithRetry(userProfile, style);

      // 设置缓存
      setCache(userProfile, style, generatedText);

      // 自动保存用户资料和风格偏好
      userProfileStorage.save(userProfile);
      styleStorage.save(style);

      setState(prev => ({
        ...prev,
        loading: false,
        generatedText,
        lastRequest: { userProfile, style },
        error: null,
        cacheHit: false,
      }));

    } catch (error) {
      console.error('AI生成错误:', error);

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '生成失败，请稍后重试',
        generatedText: null,
        retryCount: prev.retryCount + 1,
      }));
    }
  }, [checkCache, generateWithRetry, setCache]);

  const regenerate = useCallback(async () => {
    if (!state.lastRequest) {
      setState(prev => ({
        ...prev,
        error: '没有可重新生成的请求',
      }));
      return;
    }

    // 清除缓存以强制重新生成
    const cacheKey = getCacheKey(state.lastRequest.userProfile, state.lastRequest.style);
    cacheRef.current.delete(cacheKey);

    await generate(state.lastRequest.userProfile, state.lastRequest.style);
  }, [state.lastRequest, generate, getCacheKey]);

  const reset = useCallback(() => {
    // 取消正在进行的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      loading: false,
      error: null,
      generatedText: null,
      lastRequest: null,
      retryCount: 0,
      cacheHit: false,
    });
  }, []);

  // 保存卡片到历史记录
  const saveCard = useCallback((): CardData | null => {
    if (!state.generatedText || !state.lastRequest) {
      return null;
    }

    const cardData: CardData = {
      userProfile: state.lastRequest.userProfile,
      generatedText: state.generatedText,
      style: state.lastRequest.style,
      timestamp: new Date().toISOString(),
    };

    cardHistoryStorage.save(cardData);
    return cardData;
  }, [state.generatedText, state.lastRequest]);

  // 从历史记录加载卡片
  const loadFromHistory = useCallback((card: CardData) => {
    setState(prev => ({
      ...prev,
      generatedText: card.generatedText,
      lastRequest: {
        userProfile: card.userProfile,
        style: card.style,
      },
      error: null,
      loading: false,
      cacheHit: true,
    }));
  }, []);

  return {
    ...state,
    generate,
    regenerate,
    reset,
    saveCard,
    loadFromHistory,
  };
};

// 风格选项配置
export const STYLE_OPTIONS = [
  {
    value: 'funny' as CardStyle,
    label: '搞笑幽默',
    description: '风趣活泼，适合外向型同学',
    emoji: '😄',
    color: 'bg-yellow-500',
  },
  {
    value: 'literary' as CardStyle,
    label: '文艺清新',
    description: '诗意优美，适合文艺型同学',
    emoji: '🌸',
    color: 'bg-pink-500',
  },
  {
    value: 'academic' as CardStyle,
    label: '学霸专业',
    description: '严谨专业，适合学术型同学',
    emoji: '📚',
    color: 'bg-blue-500',
  },
  {
    value: 'cool' as CardStyle,
    label: '个性炫酷',
    description: '独特个性，适合潮流型同学',
    emoji: '🔥',
    color: 'bg-purple-500',
  },
] as const;

// 获取风格配置
export const getStyleConfig = (style: CardStyle) => {
  return STYLE_OPTIONS.find(option => option.value === style);
};

// 验证生成请求
export const validateGenerateInput = (userProfile: UserProfile, style: CardStyle): string | null => {
  // 检查必填字段
  if (!userProfile.nickname?.trim()) {
    return '请输入昵称';
  }
  
  if (!userProfile.major?.trim()) {
    return '请选择专业';
  }
  
  if (!userProfile.grade) {
    return '请选择年级';
  }
  
  // 检查风格
  if (!STYLE_OPTIONS.some(option => option.value === style)) {
    return '请选择有效的卡片风格';
  }
  
  return null;
};
