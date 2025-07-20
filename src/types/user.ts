// 用户数据类型定义
export interface UserProfile {
  // 必填字段
  nickname: string;
  major: string;
  grade: '大一' | '大二' | '大三' | '大四';
  
  // 可选字段
  hometown?: string;
  interests?: string[];
  personality?: string[];
  skills?: string;
  socialGoals?: string;
}

// 表单验证Schema类型
export type FormData = UserProfile;

// 卡片风格类型
export type CardStyle = 'funny' | 'literary' | 'academic' | 'cool';

// 卡片数据类型
export interface CardData {
  userProfile: UserProfile;
  generatedText: string;
  style: CardStyle;
  timestamp: string;
}

// AI生成请求类型
export interface GenerateRequest {
  userProfile: UserProfile;
  style: CardStyle;
}

// AI生成响应类型
export interface GenerateResponse {
  success: boolean;
  text?: string;
  error?: string;
}

// 兴趣标签选项
export const INTEREST_OPTIONS = [
  '运动健身', '音乐', '游戏', '阅读', '旅行', '美食',
  '摄影', '编程', '绘画', '电影', '动漫', '舞蹈',
  '书法', '手工', '烹饪', '园艺', '宠物', '时尚',
  '科技', '历史', '心理学', '哲学', '经济', '投资',
  '自定义兴趣'
] as const;

// 性格标签选项
export const PERSONALITY_OPTIONS = [
  '外向', '内向', '乐观', '理性', '创意', '逻辑',
  '冒险', '稳重', '幽默', '认真', '随和', '独立',
  '团队合作', '领导力', '细心', '大胆', '温和', '坚强'
] as const;

// 专业选项（常见专业）
export const MAJOR_OPTIONS = [
  '计算机科学与技术', '软件工程', '人工智能', '数据科学',
  '电子信息工程', '通信工程', '自动化', '机械工程',
  '土木工程', '建筑学', '经济学', '金融学',
  '工商管理', '市场营销', '会计学', '国际贸易',
  '中文', '英语', '新闻学', '广告学',
  '法学', '政治学', '社会学', '心理学',
  '医学', '护理学', '药学', '生物学',
  '化学', '物理学', '数学', '统计学',
  '美术学', '设计学', '音乐学', '体育学',
  '自定义专业'
] as const;
