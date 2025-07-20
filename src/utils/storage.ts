import { UserProfile, CardStyle, CardData } from '@/types/user';

// 存储键名常量
const STORAGE_KEYS = {
  USER_PROFILE: 'icebreaker_user_profile',
  LAST_STYLE: 'icebreaker_last_style',
  GENERATED_CARDS: 'icebreaker_generated_cards',
  APP_SETTINGS: 'icebreaker_app_settings',
} as const;

// 应用设置类型
interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  autoSave: boolean;
  showTips: boolean;
}

// 默认设置
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'zh',
  autoSave: true,
  showTips: true,
};

// 安全的localStorage操作
class SafeStorage {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  get<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set item to localStorage: ${key}`, error);
      return false;
    }
  }

  remove(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage', error);
      return false;
    }
  }
}

const storage = new SafeStorage();

// 用户资料存储
export const userProfileStorage = {
  save: (profile: UserProfile): boolean => {
    return storage.set(STORAGE_KEYS.USER_PROFILE, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });
  },

  load: (): UserProfile | null => {
    const data = storage.get(STORAGE_KEYS.USER_PROFILE, null);
    if (!data) return null;
    
    // 移除时间戳字段
    const { updatedAt, ...profile } = data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = updatedAt;
    return profile as UserProfile;
  },

  clear: (): boolean => {
    return storage.remove(STORAGE_KEYS.USER_PROFILE);
  },

  exists: (): boolean => {
    return storage.get(STORAGE_KEYS.USER_PROFILE, null) !== null;
  },
};

// 风格偏好存储
export const styleStorage = {
  save: (style: CardStyle): boolean => {
    return storage.set(STORAGE_KEYS.LAST_STYLE, style);
  },

  load: (): CardStyle => {
    return storage.get(STORAGE_KEYS.LAST_STYLE, 'funny');
  },

  clear: (): boolean => {
    return storage.remove(STORAGE_KEYS.LAST_STYLE);
  },
};

// 生成的卡片历史存储
export const cardHistoryStorage = {
  save: (card: CardData): boolean => {
    const history = this.loadAll();
    const newHistory = [card, ...history.slice(0, 9)]; // 最多保存10张
    return storage.set(STORAGE_KEYS.GENERATED_CARDS, newHistory);
  },

  loadAll: (): CardData[] => {
    return storage.get(STORAGE_KEYS.GENERATED_CARDS, []);
  },

  loadLatest: (): CardData | null => {
    const history = this.loadAll();
    return history.length > 0 ? history[0] : null;
  },

  clear: (): boolean => {
    return storage.remove(STORAGE_KEYS.GENERATED_CARDS);
  },

  remove: (timestamp: string): boolean => {
    const history = this.loadAll();
    const filtered = history.filter(card => card.timestamp !== timestamp);
    return storage.set(STORAGE_KEYS.GENERATED_CARDS, filtered);
  },

  count: (): number => {
    return this.loadAll().length;
  },
};

// 应用设置存储
export const settingsStorage = {
  save: (settings: Partial<AppSettings>): boolean => {
    const current = this.load();
    const updated = { ...current, ...settings };
    return storage.set(STORAGE_KEYS.APP_SETTINGS, updated);
  },

  load: (): AppSettings => {
    return storage.get(STORAGE_KEYS.APP_SETTINGS, DEFAULT_SETTINGS);
  },

  reset: (): boolean => {
    return storage.set(STORAGE_KEYS.APP_SETTINGS, DEFAULT_SETTINGS);
  },

  clear: (): boolean => {
    return storage.remove(STORAGE_KEYS.APP_SETTINGS);
  },
};

// 数据导出和导入
export const dataManager = {
  export: (): string => {
    const data = {
      userProfile: userProfileStorage.load(),
      lastStyle: styleStorage.load(),
      cardHistory: cardHistoryStorage.loadAll(),
      settings: settingsStorage.load(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  },

  import: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // 验证数据格式
      if (!data.version || !data.exportedAt) {
        throw new Error('Invalid data format');
      }

      // 导入数据
      if (data.userProfile) {
        userProfileStorage.save(data.userProfile);
      }
      if (data.lastStyle) {
        styleStorage.save(data.lastStyle);
      }
      if (data.cardHistory && Array.isArray(data.cardHistory)) {
        storage.set(STORAGE_KEYS.GENERATED_CARDS, data.cardHistory);
      }
      if (data.settings) {
        settingsStorage.save(data.settings);
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },

  clearAll: (): boolean => {
    try {
      userProfileStorage.clear();
      styleStorage.clear();
      cardHistoryStorage.clear();
      settingsStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  },

  getStorageInfo: () => {
    const info = {
      hasUserProfile: userProfileStorage.exists(),
      cardCount: cardHistoryStorage.count(),
      lastStyle: styleStorage.load(),
      settings: settingsStorage.load(),
    };
    return info;
  },
};

// 自动保存Hook
export const useAutoSave = () => {
  const settings = settingsStorage.load();
  return settings.autoSave;
};

// 存储事件监听
export const addStorageListener = (callback: (key: string, newValue: unknown) => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key && Object.values(STORAGE_KEYS).includes(e.key as string)) {
      try {
        const newValue = e.newValue ? JSON.parse(e.newValue) : null;
        callback(e.key, newValue);
      } catch (error) {
        console.warn('Failed to parse storage event value:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export default storage;
