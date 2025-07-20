import { NextRequest, NextResponse } from 'next/server';
import { validateGenerateRequest } from '@/utils/validation';
import { UserProfile, CardStyle } from '@/types/user';

// Mock AI响应生成器
function generateMockResponse(userProfile: UserProfile, style: CardStyle): string {
  const { nickname, major, grade, hometown, interests, personality, skills, socialGoals } = userProfile;
  
  const mockResponses = {
    funny: [
      `哈喽大家好！我是${nickname}，一个${grade}的${major}小萌新！🎉 来自${hometown || '神秘之地'}的我，平时喜欢${interests?.slice(0, 2).join('和') || '各种有趣的事情'}。朋友们都说我${personality?.slice(0, 2).join('又') || '很有趣'}，${skills ? `还会${skills}呢！` : ''}${socialGoals ? socialGoals : '希望能和大家成为好朋友！'}快来和我一起玩耍吧！😄`,
      
      `大家好呀！我是传说中的${nickname}同学！📚 作为${major}专业的${grade}学生，我从${hometown || '远方'}来到这里开启新的冒险！平时我是个${personality?.slice(0, 2).join('且') || '有趣'}的人，超爱${interests?.slice(0, 3).join('、') || '探索新事物'}！${skills ? `我的隐藏技能是${skills}，` : ''}${socialGoals || '希望能遇到志同道合的小伙伴！'}让我们一起创造美好的大学时光吧！🌟`,
    ],
    
    literary: [
      `我是${nickname}，如一缕清风，从${hometown || '远方'}飘来。在${major}的学术殿堂里，我是一名${grade}的求学者。喜欢在${interests?.slice(0, 2).join('与') || '书海'}中徜徉，性格${personality?.slice(0, 2).join('而') || '温和'}。${skills ? `偶尔${skills}，` : ''}${socialGoals || '愿与有缘人共赏人生风景。'}愿我们的相遇，如诗如画。🌸`,
      
      `我叫${nickname}，来自${hometown || '诗意的远方'}。在${major}的知识海洋中，我是一名${grade}的探索者。心中藏着对${interests?.slice(0, 2).join('和') || '美好事物'}的热爱，性格${personality?.slice(0, 2).join('且') || '如水般温柔'}。${skills ? `闲暇时光里，我喜欢${skills}，` : ''}${socialGoals || '期待与同样热爱生活的你相遇。'}让我们在这美好的时光里，共同书写青春的诗篇。✨`,
    ],
    
    academic: [
      `我是${nickname}，${major}专业${grade}学生。来自${hometown || '某地'}，专注于学术研究和知识探索。研究兴趣包括${interests?.slice(0, 3).join('、') || '多个学科领域'}，性格${personality?.slice(0, 2).join('、') || '严谨认真'}。${skills ? `具备${skills}等专业技能。` : ''}${socialGoals || '希望与同样热爱学术的同学建立联系，共同进步。'}期待在学术道路上与大家相互学习，共同成长。📚`,
      
      `${nickname}，${major}${grade}在读。来自${hometown || '某城市'}，致力于专业学习和能力提升。主要关注${interests?.slice(0, 2).join('和') || '专业相关领域'}，个人特点是${personality?.slice(0, 2).join('、') || '勤奋好学'}。${skills ? `掌握${skills}技能，` : ''}${socialGoals || '寻求学术合作伙伴。'}愿与志同道合的同学一起在知识的海洋中探索前行。🎓`,
    ],
    
    cool: [
      `Yo！我是${nickname}，${major}专业的${grade}潮人！🔥 从${hometown || 'Cool City'}来的我，就是这么与众不同！平时沉迷于${interests?.slice(0, 2).join('和') || '各种酷炫的事情'}，性格${personality?.slice(0, 2).join('又') || '超级个性'}！${skills ? `我的绝技是${skills}，` : ''}${socialGoals || '想找到同样有态度的朋友！'}准备好和我一起燃爆这个校园了吗？Let's go！⚡`,
      
      `Hey！${nickname}在此！💎 作为${major}的${grade}新星，我从${hometown || '潮流之都'}带来了不一样的vibe！我的世界里有${interests?.slice(0, 3).join('、') || '无限可能'}，性格${personality?.slice(0, 2).join('且') || '独一无二'}。${skills ? `${skills}是我的超能力，` : ''}${socialGoals || '寻找同频的灵魂！'}一起创造属于我们的传奇吧！🚀`,
    ],
  };
  
  const responses = mockResponses[style];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

// Mock API路由处理
export async function POST(request: NextRequest) {
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
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const { userProfile, style } = validation.data;

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // 生成Mock响应
    const generatedText = generateMockResponse(userProfile, style);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      text: generatedText,
      timestamp: new Date().toISOString(),
      mock: true, // 标识这是Mock响应
    });

  } catch (error) {
    console.error('Mock AI生成错误:', error);
    
    // 返回错误响应
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Mock生成失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

// 健康检查
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Mock AI文案生成服务',
    timestamp: new Date().toISOString(),
    mock: true,
  });
}
