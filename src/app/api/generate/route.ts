import { NextRequest, NextResponse } from 'next/server';
import { validateGenerateRequest } from '@/utils/validation';
import { UserProfile, CardStyle } from '@/types/user';

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 并发控制
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 10;

// Prompt模板
const PROMPT_TEMPLATES = {
  funny: `你是一位风趣幽默的文案大师，专门为大学新生写搞笑风格的自我介绍。

请根据以下信息，写一段100-150字的搞笑幽默自我介绍：
- 昵称：{nickname}
- 专业：{major}
- 年级：{grade}
{hometown}
{interests}
{personality}
{skills}
{socialGoals}

要求：
1. 风格活泼搞笑，适合年轻人
2. 可以适当使用网络梗和表情包文字
3. 突出个性特点，让人印象深刻
4. 直接输出自我介绍文案，不要额外说明
5. 控制在100-150字之间`,

  literary: `你是一位文艺清新的文案大师，专门为大学新生写文艺风格的自我介绍。

请根据以下信息，写一段100-150字的文艺清新自我介绍：
- 昵称：{nickname}
- 专业：{major}
- 年级：{grade}
{hometown}
{interests}
{personality}
{skills}
{socialGoals}

要求：
1. 风格文艺清新，富有诗意
2. 语言优美，有一定的文学色彩
3. 体现内在气质和精神追求
4. 直接输出自我介绍文案，不要额外说明
5. 控制在100-150字之间`,

  academic: `你是一位专业严谨的文案大师，专门为大学新生写学霸风格的自我介绍。

请根据以下信息，写一段100-150字的学霸专业自我介绍：
- 昵称：{nickname}
- 专业：{major}
- 年级：{grade}
{hometown}
{interests}
{personality}
{skills}
{socialGoals}

要求：
1. 风格专业严谨，体现学术素养
2. 突出学习能力和专业特长
3. 语言简洁有力，逻辑清晰
4. 直接输出自我介绍文案，不要额外说明
5. 控制在100-150字之间`,

  cool: `你是一位个性炫酷的文案大师，专门为大学新生写炫酷风格的自我介绍。

请根据以下信息，写一段100-150字的个性炫酷自我介绍：
- 昵称：{nickname}
- 专业：{major}
- 年级：{grade}
{hometown}
{interests}
{personality}
{skills}
{socialGoals}

要求：
1. 风格个性炫酷，充满活力
2. 可以使用一些潮流词汇和表达
3. 突出独特个性和态度
4. 直接输出自我介绍文案，不要额外说明
5. 控制在100-150字之间`
};

// 构建Prompt
function buildPrompt(userProfile: UserProfile, style: CardStyle): string {
  const template = PROMPT_TEMPLATES[style];

  return template
    .replace('{nickname}', userProfile.nickname)
    .replace('{major}', userProfile.major)
    .replace('{grade}', userProfile.grade)
    .replace('{hometown}',
      userProfile.hometown ? `- 家乡：${userProfile.hometown}` : '')
    .replace('{interests}',
      userProfile.interests?.length ? `- 兴趣爱好：${userProfile.interests.join('、')}` : '')
    .replace('{personality}',
      userProfile.personality?.length ? `- 性格特点：${userProfile.personality.join('、')}` : '')
    .replace('{skills}',
      userProfile.skills ? `- 特殊技能：${userProfile.skills}` : '')
    .replace('{socialGoals}',
      userProfile.socialGoals ? `- 交友目标：${userProfile.socialGoals}` : '');
}

// 调用DeepSeek API
async function callDeepSeekAPI(prompt: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API Key未配置');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
      stream: false
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API调用失败: ${response.status} ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('DeepSeek API返回格式异常');
  }

  return data.choices[0].message.content.trim();
}

// API路由处理
export async function POST(request: NextRequest) {
  // 并发控制检查
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    return NextResponse.json(
      {
        success: false,
        error: '🚀 服务器繁忙，请稍后重试！AI社群正在为你准备更好的体验~'
      },
      { status: 429 }
    );
  }

  activeRequests++;

  try {
    // 解析请求体
    const body = await request.json();
    
    // 验证请求数据
    const validation = validateGenerateRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: '请求数据格式错误',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const { userProfile, style } = validation.data;

    // 构建Prompt
    const prompt = buildPrompt(userProfile, style);

    // 调用AI API
    const generatedText = await callDeepSeekAPI(prompt);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      text: generatedText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI生成错误:', error);

    // 根据错误类型返回不同的错误信息
    let errorMessage = '生成失败，请稍后重试';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = '🤖 AI服务暂时繁忙，请稍后重试！加入我们的AI社群获取更多技巧~';
        statusCode = 429;
      } else if (error.message.includes('timeout')) {
        errorMessage = '⏰ 请求超时，请重试！';
        statusCode = 408;
      } else if (error.message.includes('API key')) {
        errorMessage = '🔑 服务配置错误，请联系管理员';
        statusCode = 500;
      }
    }

    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: statusCode }
    );
  } finally {
    // 确保请求计数器正确递减
    activeRequests--;
  }
}

// 健康检查
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI文案生成服务',
    timestamp: new Date().toISOString()
  });
}
