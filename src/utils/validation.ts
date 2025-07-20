import { z } from 'zod';

// 用户表单验证Schema
export const userProfileSchema = z.object({
  // 必填字段
  nickname: z
    .string()
    .min(1, '请输入昵称')
    .max(20, '昵称不能超过20个字符')
    .regex(/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/, '昵称只能包含中英文、数字、下划线和横线'),
  
  major: z
    .string()
    .min(1, '请选择专业'),
  
  grade: z
    .enum(['大一', '大二', '大三', '大四'])
    .refine((val) => val, { message: '请选择年级' }),
  
  // 可选字段
  hometown: z
    .string()
    .max(50, '家乡不能超过50个字符')
    .optional(),
  
  interests: z
    .array(z.string())
    .max(8, '最多选择8个兴趣爱好')
    .optional(),
  
  personality: z
    .array(z.string())
    .max(5, '最多选择5个性格特点')
    .optional(),
  
  skills: z
    .string()
    .max(100, '特殊技能描述不能超过100个字符')
    .optional(),
  
  socialGoals: z
    .string()
    .max(100, '交友目标不能超过100个字符')
    .optional()
});

// 卡片风格验证
export const cardStyleSchema = z
  .enum(['funny', 'literary', 'academic', 'cool'])
  .refine((val) => val, { message: '请选择卡片风格' });

// AI生成请求验证
export const generateRequestSchema = z.object({
  userProfile: userProfileSchema,
  style: cardStyleSchema
});

// 表单数据类型（从Schema推导）
export type FormData = z.infer<typeof userProfileSchema>;
export type CardStyle = z.infer<typeof cardStyleSchema>;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;

// 验证辅助函数
export const validateUserProfile = (data: unknown) => {
  return userProfileSchema.safeParse(data);
};

export const validateGenerateRequest = (data: unknown) => {
  return generateRequestSchema.safeParse(data);
};

// 表单字段验证函数
export const fieldValidators = {
  nickname: (value: string) => {
    const result = z.string()
      .min(1, '请输入昵称')
      .max(20, '昵称不能超过20个字符')
      .regex(/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/, '昵称只能包含中英文、数字、下划线和横线')
      .safeParse(value);
    
    return result.success ? true : result.error.issues[0].message;
  },

  major: (value: string) => {
    const result = z.string().min(1, '请选择专业').safeParse(value);
    return result.success ? true : result.error.issues[0].message;
  },

  grade: (value: string) => {
    const result = z.enum(['大一', '大二', '大三', '大四']).safeParse(value);
    return result.success ? true : '请选择年级';
  },
  
  hometown: (value: string) => {
    if (!value) return true; // 可选字段
    const result = z.string().max(50, '家乡不能超过50个字符').safeParse(value);
    return result.success ? true : result.error.issues[0].message;
  },

  skills: (value: string) => {
    if (!value) return true; // 可选字段
    const result = z.string().max(100, '特殊技能描述不能超过100个字符').safeParse(value);
    return result.success ? true : result.error.issues[0].message;
  },

  socialGoals: (value: string) => {
    if (!value) return true; // 可选字段
    const result = z.string().max(100, '交友目标不能超过100个字符').safeParse(value);
    return result.success ? true : result.error.issues[0].message;
  }
};
