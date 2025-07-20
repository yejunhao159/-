'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, FormData } from '@/utils/validation';
import { MAJOR_OPTIONS, INTEREST_OPTIONS, PERSONALITY_OPTIONS } from '@/types/user';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TagSelector from '@/components/ui/TagSelector';
import Button from '@/components/ui/Button';

interface UserProfileFormProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  initialData?: Partial<FormData>;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
}) => {
  // 自定义专业状态
  const [isCustomMajor, setIsCustomMajor] = useState(
    initialData?.major && !(MAJOR_OPTIONS as readonly string[]).includes(initialData.major)
  );
  const [customMajorValue, setCustomMajorValue] = useState(
    initialData?.major && !(MAJOR_OPTIONS as readonly string[]).includes(initialData.major)
      ? initialData.major
      : ''
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      nickname: initialData?.nickname || '',
      major: initialData?.major || '',
      grade: initialData?.grade || undefined,
      hometown: initialData?.hometown || '',
      interests: initialData?.interests || [],
      personality: initialData?.personality || [],
      skills: initialData?.skills || '',
      socialGoals: initialData?.socialGoals || '',
    },
    mode: 'onChange',
  });

  // 监听表单数据变化
  const watchedData = watch();

  // 重置表单
  const handleReset = () => {
    reset({
      nickname: '',
      major: '',
      grade: undefined,
      hometown: '',
      interests: [],
      personality: [],
      skills: '',
      socialGoals: '',
    });
    setIsCustomMajor(false);
    setCustomMajorValue('');
  };

  // 处理专业选择变化
  const handleMajorChange = (value: string) => {
    if (value === '自定义专业') {
      setIsCustomMajor(true);
      // 如果已有自定义值，使用它；否则设置为空，等待用户输入
      setValue('major', customMajorValue || '');
    } else {
      setIsCustomMajor(false);
      setCustomMajorValue('');
      setValue('major', value);
    }
  };

  // 处理自定义专业输入变化
  const handleCustomMajorChange = (value: string) => {
    setCustomMajorValue(value);
    setValue('major', value);
  };

  // 专业选项
  const majorOptions = MAJOR_OPTIONS.map(major => ({
    value: major,
    label: major,
  }));

  // 年级选项
  const gradeOptions = [
    { value: '大一', label: '大一' },
    { value: '大二', label: '大二' },
    { value: '大三', label: '大三' },
    { value: '大四', label: '大四' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            👤 基本信息
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Controller
              name="nickname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="昵称"
                  placeholder="请输入你的昵称"
                  error={errors.nickname?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="年级"
                  placeholder="请选择年级"
                  options={gradeOptions}
                  error={errors.grade?.message}
                  required
                />
              )}
            />
            
            <div className="md:col-span-2">
              <div className="space-y-3">
                <Controller
                  name="major"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={isCustomMajor ? '自定义专业' : (field.value || '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleMajorChange(value);
                      }}
                      label="专业"
                      placeholder="请选择专业"
                      options={majorOptions}
                      error={errors.major?.message}
                      required
                    />
                  )}
                />

                {/* 自定义专业输入框 */}
                {isCustomMajor && (
                  <Controller
                    name="major"
                    control={control}
                    render={() => (
                      <Input
                        value={customMajorValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleCustomMajorChange(value);
                        }}
                        label="请输入您的专业"
                        placeholder="例如：数字媒体艺术、生物信息学等"
                        error={errors.major?.message}
                        required
                      />
                    )}
                  />
                )}
              </div>
            </div>
            
            <Controller
              name="hometown"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="家乡"
                  placeholder="请输入家乡（可选）"
                  error={errors.hometown?.message}
                />
              )}
            />
          </div>
        </div>

        {/* 兴趣爱好 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 兴趣爱好
          </h3>
          
          <Controller
            name="interests"
            control={control}
            render={({ field }) => (
              <TagSelector
                label="选择你的兴趣爱好"
                options={INTEREST_OPTIONS}
                value={field.value || []}
                onChange={field.onChange}
                maxSelection={8}
                error={errors.interests?.message}
                placeholder="点击选择你感兴趣的领域"
                helperText="最多选择8个兴趣爱好，可以添加自定义兴趣"
                allowCustom={true}
                customTrigger="自定义兴趣"
              />
            )}
          />
        </div>

        {/* 性格特点 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✨ 性格特点
          </h3>
          
          <Controller
            name="personality"
            control={control}
            render={({ field }) => (
              <TagSelector
                label="选择你的性格特点"
                options={PERSONALITY_OPTIONS}
                value={field.value || []}
                onChange={field.onChange}
                maxSelection={5}
                error={errors.personality?.message}
                placeholder="点击选择符合你的性格特点"
                helperText="最多选择5个性格特点"
              />
            )}
          />
        </div>

        {/* 其他信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎪 其他信息
          </h3>
          
          <div className="space-y-4">
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="特殊技能"
                  placeholder="例如：会弹吉他、精通PS、会做饭..."
                  error={errors.skills?.message}
                  helperText="展示你的特殊才能，让别人更了解你"
                />
              )}
            />
            
            <Controller
              name="socialGoals"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="交友目标"
                  placeholder="例如：想找学习伙伴、寻找兴趣相投的朋友..."
                  error={errors.socialGoals?.message}
                  helperText="说说你希望结交什么样的朋友"
                />
              )}
            />
          </div>
        </div>

        {/* 表单统计 */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-sm text-blue-700">
            <div className="flex justify-between items-center">
              <span>表单完成度</span>
              <span className="font-medium">
                {getFormCompleteness(watchedData)}%
              </span>
            </div>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getFormCompleteness(watchedData)}%` }}
              />
            </div>
            <div className="mt-2 text-xs">
              必填项已完成，可选项能让AI生成更个性化的内容
            </div>
          </div>
        </div>



        {/* 操作按钮 */}
        <div className="flex gap-4">
          <Button
            type="submit"
            loading={loading}
            disabled={loading || !isValid}
            fullWidth
            className="text-lg py-3"
          >
            {loading ? '生成中...' : '🚀 生成我的破冰卡片'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
            className="min-w-[100px]"
          >
            重置
          </Button>
        </div>
      </form>
    </div>
  );
};

// 计算表单完成度
function getFormCompleteness(data: Partial<FormData>): number {
  const requiredFields = ['nickname', 'major', 'grade'];
  const optionalFields = ['hometown', 'interests', 'personality', 'skills', 'socialGoals'];
  
  let completed = 0;
  const total = requiredFields.length + optionalFields.length;
  
  // 必填字段
  requiredFields.forEach(field => {
    if (data[field as keyof FormData]) {
      completed += 1;
    }
  });
  
  // 可选字段
  optionalFields.forEach(field => {
    const value = data[field as keyof FormData];
    if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim())) {
      completed += 1;
    }
  });
  
  return Math.round((completed / total) * 100);
}

export default UserProfileForm;
