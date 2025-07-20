# 🤖 AI破冰卡片生成器

> **Chat is All You Need** - 用AI的力量帮助大学生更好地表达自己

一个基于Next.js和AI技术的智能自我介绍生成器，专为大学生社交场景设计。通过简单的表单填写，AI会生成个性化、有趣的自我介绍文案，帮助大学生在社交中脱颖而出。

## ✨ 核心特性

### 🎯 智能文案生成
- **多风格选择**：搞笑幽默、文艺清新、学霸专业三种风格
- **个性化定制**：基于用户的专业、兴趣、性格等信息生成
- **AI驱动**：使用DeepSeek API提供高质量的文案生成

### 📱 用户体验
- **响应式设计**：完美适配手机、平板、桌面设备
- **表单验证**：智能验证和错误提示
- **实时预览**：所见即所得的编辑体验
- **一键分享**：支持卡片下载和社交分享

### 🛡️ 生产级特性
- **并发控制**：智能限制并发请求，确保服务稳定
- **错误处理**：完善的错误边界和用户友好提示
- **性能优化**：代码分割、懒加载、缓存优化
- **SEO友好**：完整的元数据和结构化数据

## 🚀 快速开始

### 环境要求
- Node.js 18.0+
- npm 或 yarn 或 pnpm

### 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置
创建 `.env.local` 文件并添加以下配置：
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 技术栈

### 前端框架
- **Next.js 15** - React全栈框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架

### 状态管理
- **React Hook Form** - 高性能表单库
- **Zod** - TypeScript优先的模式验证

### AI集成
- **DeepSeek API** - 强大的中文AI模型
- **自定义Prompt工程** - 针对不同风格优化的提示词

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 静态类型检查

## 🌟 社群推广

### Chat is All You Need
相信AI的力量，用对话改变世界。加入我们的AI社群，学习如何用AI实现不可能的事情，让每一次对话都成为创造的起点。

### 联系方式
- **微信**：yyy246jhh888
- **邮箱**：3243332126@qq.com

### 社群特色
- 🎯 AI实战技巧分享
- 🔥 创意项目展示
- 🌟 技术交流讨论
- 💡 产品思维培养

## 📈 部署指南

### Vercel部署（推荐）
1. Fork本仓库到你的GitHub
2. 在[Vercel](https://vercel.com)中导入项目
3. 设置环境变量：`DEEPSEEK_API_KEY`
4. 一键部署完成

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

---

**让AI成为每个大学生最好的表达伙伴！** 🎓✨
