import { CardStyle } from '@/types/user';

// 卡片尺寸配置（适合社交媒体分享）
export const CARD_DIMENSIONS = {
  width: 1080,
  height: 1350,
  padding: 60,
  borderRadius: 24,
} as const;

// 字体配置
export const FONTS = {
  primary: {
    family: 'PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  secondary: {
    family: 'SF Mono, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    weights: {
      regular: 400,
      medium: 500,
    }
  }
} as const;

// 四种风格的设计配置
export const CARD_STYLES: Record<CardStyle, {
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  gradients: {
    background: string;
    accent: string;
  };
  patterns: {
    background?: string;
    decorative?: string;
  };
  typography: {
    titleSize: number;
    contentSize: number;
    tagSize: number;
    lineHeight: number;
  };
}> = {
  funny: {
    name: '搞笑幽默',
    emoji: '😄',
    colors: {
      primary: '#FF6B35',
      secondary: '#FFE66D',
      accent: '#FF8E53',
      background: '#FFF8E1',
      text: '#2D3748',
      textSecondary: '#4A5568',
      border: '#FFD54F',
    },
    gradients: {
      background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFE082 100%)',
      accent: 'linear-gradient(45deg, #FF6B35 0%, #FF8E53 100%)',
    },
    patterns: {
      background: '🎉🎊✨🌟💫⭐🎈🎁',
      decorative: '😄😊😆🤣😂🥳🎭🎪',
    },
    typography: {
      titleSize: 48,
      contentSize: 32,
      tagSize: 24,
      lineHeight: 1.4,
    },
  },
  
  literary: {
    name: '文艺清新',
    emoji: '🌸',
    colors: {
      primary: '#8E7CC3',
      secondary: '#C8B2DB',
      accent: '#A594C7',
      background: '#F8F6FF',
      text: '#4A4A4A',
      textSecondary: '#6B6B6B',
      border: '#E1D5E7',
    },
    gradients: {
      background: 'linear-gradient(135deg, #F8F6FF 0%, #F3F0FF 50%, #EDE7F6 100%)',
      accent: 'linear-gradient(45deg, #8E7CC3 0%, #A594C7 100%)',
    },
    patterns: {
      background: '🌸🌺🌻🌷🌹🍃🌿🦋',
      decorative: '📚📖✍️🎨🎭🎵🎼🌙',
    },
    typography: {
      titleSize: 44,
      contentSize: 30,
      tagSize: 22,
      lineHeight: 1.5,
    },
  },
  
  academic: {
    name: '学霸专业',
    emoji: '📚',
    colors: {
      primary: '#2563EB',
      secondary: '#60A5FA',
      accent: '#3B82F6',
      background: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#475569',
      border: '#CBD5E1',
    },
    gradients: {
      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
      accent: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 100%)',
    },
    patterns: {
      background: '📚📊📈📉💼🎓🔬⚗️',
      decorative: '🏆🥇📜🎯💡🔍📐📏',
    },
    typography: {
      titleSize: 42,
      contentSize: 28,
      tagSize: 20,
      lineHeight: 1.6,
    },
  },
  
  cool: {
    name: '个性炫酷',
    emoji: '🔥',
    colors: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      accent: '#8B5CF6',
      background: '#0F0F23',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      border: '#4C1D95',
    },
    gradients: {
      background: 'linear-gradient(135deg, #0F0F23 0%, #1E1B4B 50%, #312E81 100%)',
      accent: 'linear-gradient(45deg, #7C3AED 0%, #8B5CF6 100%)',
    },
    patterns: {
      background: '🔥⚡💎🌟✨💫🚀🎮',
      decorative: '🎸🎧🎤🎬🎯🏀⚽🛹',
    },
    typography: {
      titleSize: 46,
      contentSize: 30,
      tagSize: 22,
      lineHeight: 1.4,
    },
  },
};

// 布局配置
export const LAYOUT_CONFIG = {
  header: {
    height: 200,
    avatarSize: 120,
    titleMarginTop: 20,
  },
  content: {
    marginTop: 40,
    marginBottom: 40,
    maxWidth: 900,
  },
  tags: {
    marginTop: 30,
    itemSpacing: 12,
    itemPadding: { x: 16, y: 8 },
    borderRadius: 20,
  },
  footer: {
    height: 80,
    marginTop: 40,
  },
  watermark: {
    fontSize: 18,
    opacity: 0.6,
    position: 'bottom-right',
    margin: 20,
  },
} as const;

// 动画配置
export const ANIMATIONS = {
  fadeIn: {
    duration: 0.6,
    easing: 'ease-out',
  },
  slideUp: {
    duration: 0.8,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  bounce: {
    duration: 1.2,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// 品牌水印配置
export const BRAND_CONFIG = {
  text: '由 AI社区 智能生成',
  logo: '🤖',
  website: 'ai-community.com',
  colors: {
    light: '#64748B',
    dark: '#94A3B8',
  },
} as const;

// 获取风格配置的辅助函数
export const getStyleConfig = (style: CardStyle) => {
  return CARD_STYLES[style];
};

// 获取对比色的辅助函数
export const getContrastColor = (backgroundColor: string): string => {
  // 简单的对比度计算，实际项目中可以使用更复杂的算法
  const darkColors = ['#0F0F23', '#1E1B4B', '#312E81'];
  return darkColors.some(color => backgroundColor.includes(color)) ? '#FFFFFF' : '#000000';
};
