// AI模拟训练对话服务
import type {
  ApiResponse,
  SimulationScenario,
  TrainingSession,
  TrainingMessageRequest,
  TrainingChatResponse,
  TrainingEvaluation,
  ChatMessage
} from './types';

export class SimulationService {
  private baseUrl = '/api/social-worker/simulation';

  // 获取训练场景列表
  async getScenarios(): Promise<SimulationScenario[]> {
    try {
      const response = await fetch(`${this.baseUrl}/scenarios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result: ApiResponse<SimulationScenario[]> = await response.json();
      
      if (result.code === 1) {
        return result.data;
      } else {
        throw new Error(result.msg || '获取场景列表失败');
      }
    } catch (error) {
      console.error('获取训练场景失败:', error);
      // 返回模拟数据
      return this.getMockScenarios();
    }
  }

  // 开始新的训练会话
  async startTrainingSession(scenarioId: number): Promise<TrainingSession> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenarioId }),
      });
      
      const result: ApiResponse<TrainingSession> = await response.json();
      
      if (result.code === 1) {
        return result.data;
      } else {
        throw new Error(result.msg || '开始训练失败');
      }
    } catch (error) {
      console.error('开始训练会话失败:', error);
      // 返回模拟数据
      return this.getMockTrainingSession(scenarioId);
    }
  }

  // 发送训练消息
  async sendTrainingMessage(request: TrainingMessageRequest): Promise<TrainingChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      const result: ApiResponse<TrainingChatResponse> = await response.json();
      
      if (result.code === 1) {
        return result.data;
      } else {
        throw new Error(result.msg || '发送消息失败');
      }
    } catch (error) {
      console.error('发送训练消息失败:', error);
      // 返回模拟数据
      return this.getMockChatResponse(request.sessionId, request.prompt);
    }
  }

  // 结束训练会话
  async endTrainingSession(sessionId: number): Promise<TrainingEvaluation> {
    try {
      const response = await fetch(`${this.baseUrl}/end/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      const result: ApiResponse<TrainingEvaluation> = await response.json();
      
      if (result.code === 1) {
        return result.data;
      } else {
        throw new Error(result.msg || '结束训练失败');
      }
    } catch (error) {
      console.error('结束训练会话失败:', error);
      // 返回模拟数据
      return this.getMockTrainingEvaluation(sessionId);
    }
  }

  // 获取模拟场景数据
  private getMockScenarios(): SimulationScenario[] {
    return [
      {
        id: 1,
        scenarioName: '孤独的留守儿童',
        scenarioType: '情感表达',
        description: '模拟一个性格内向、缺乏陪伴的留守儿童，需要建立信任关系。',
        difficultyLevel: 1
      },
      {
        id: 2,
        scenarioName: '学习困难的儿童',
        scenarioType: '自主学习',
        description: '模拟一个学习成绩下滑、对学习失去信心的儿童，需要学习支持。',
        difficultyLevel: 2
      },
      {
        id: 3,
        scenarioName: '情绪波动的儿童',
        scenarioType: '情绪管理',
        description: '模拟一个情绪不稳定、有行为问题的儿童，需要情绪管理指导。',
        difficultyLevel: 3
      }
    ];
  }

  // 获取模拟训练会话数据
  private getMockTrainingSession(scenarioId: number): TrainingSession {
    return {
      id: Date.now(),
      workerId: 1, // 当前社工ID
      scenarioId,
      sessionStatus: 'IN_PROGRESS',
      startTime: new Date().toISOString(),
      totalRounds: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
  }

  // 获取模拟聊天响应数据
  private getMockChatResponse(sessionId: number, prompt: string): TrainingChatResponse {
    const responses = [
      '……嗯。姐姐，你的手好暖呀。',
      '我今天过得一般...同学们都有爸爸妈妈来接放学，只有我是自己回家的。我很想爸爸妈妈...',
      '真的吗？但是我总是做不好，老师总说我不用功...',
      '我不想说话，我觉得很累...',
      '谢谢姐姐陪我聊天，我感觉好一些了。',
      '我...我不知道该说什么，就是觉得很难过...'
    ];

    const emotionAnalyses = [
      '{"detected_emotions": [{"emotion": "开心", "confidence": 85}], "emotion_intensity": 60}',
      '{"detected_emotions": [{"emotion": "悲伤", "confidence": 80}, {"emotion": "思念", "confidence": 75}], "emotion_intensity": 85}',
      '{"detected_emotions": [{"emotion": "沮丧", "confidence": 70}, {"emotion": "不安", "confidence": 65}], "emotion_intensity": 75}',
      '{"detected_emotions": [{"emotion": "疲惫", "confidence": 60}, {"emotion": "沮丧", "confidence": 55}], "emotion_intensity": 70}',
      '{"detected_emotions": [{"emotion": "感谢", "confidence": 80}, {"emotion": "平静", "confidence": 70}], "emotion_intensity": 50}',
      '{"detected_emotions": [{"emotion": "悲伤", "confidence": 90}, {"emotion": "困惑", "confidence": 60}], "emotion_intensity": 85}'
    ];

    const guidances = [
      '社工可回应："姐姐的手暖，你的小脑袋也软软的呢～"（用具体细节强化温暖感受），同时保持轻柔抚摸动作，接着轻声问："刚才是不是心里也暖暖的呀？"（引导孩子表达内在感受，巩固安全感与情感连接）。',
      '建议表达理解和共情："小明一定很想爸爸妈妈吧，这种感觉很正常。"接着问："在学校有没有什么有趣的事情想和姐姐分享呢？"（认可情绪，引导积极思维）。',
      '共情回应："学习确实不容易，姐姐理解你的感受。"然后说："每个人都有自己的节奏，重要的是不放弃。我们一起想想，有什么办法能让学习变得有趣一些吗？"（认可困难，鼓励坚持）。',
      '给予陪伴和安全感："没关系，不想说话的时候就静静坐着，姐姐陪着你。"保持静默陪伴，轻声问："需要姐姐做什么吗？或者我们就这样静静地待一会儿。"（尊重感受，提供安全空间）。',
      '强化积极体验："看到你感觉好一些，姐姐也很开心。这就是我们聊天的力量呢。"接着问："这种感觉能保持多久呢？我们下次再聊好不好？"（巩固效果，建立期待）。',
      '深度共情："心里的难过就像小怪兽一样，让你觉得喘不过气对吗？"轻柔地问："愿意告诉姐姐这个小怪兽是什么时候来的吗？"（用比喻帮助表达，温和引导）。'
    ];

    const randomIndex = Math.floor(Math.random() * responses.length);

    return {
      sessionId,
      childReply: responses[randomIndex],
      emotionAnalysis: emotionAnalyses[randomIndex],
      aiGuidance: guidances[randomIndex],
      timestamp: new Date().toISOString()
    };
  }

  // 获取模拟训练评估数据
  private getMockTrainingEvaluation(sessionId: number): TrainingEvaluation {
    return {
      id: Date.now(),
      sessionId,
      empathyScore: 85,
      communicationScore: 90,
      problemSolvingScore: 65,
      emotionalRecognitionScore: 90,
      strengths: '优点：能记住过往互动细节（画画、小兔子）建立连接，通过肢体安抚传递温暖。不足：面对服务对象不安表现（低头抠衣角），缺乏对情绪的语言确认与回应。改进方向：增加情绪关注语言，如"看起来有点紧张，愿意说说吗？"，引导情绪表达。',
      areasForImprovement: null,
      aiComprehensiveComment: '您在本次训练中表现优秀，能够很好地识别儿童的情感需求并给予共情回应。特别是在儿童表达孤独感时，您的回应让儿童感受到了被理解和关怀。建议在未来的对话中，可以尝试使用更多开放性问题引导儿童表达内心想法，同时注意给予具体的积极反馈，而不仅仅是一般性的安慰。继续保持这样的沟通方式，您将能够与留守儿童建立更有效的信任关系，为后续的服务工作奠定良好基础。',
      createTime: new Date().toISOString()
    };
  }
}

// 导出单例
export const simulationService = new SimulationService();