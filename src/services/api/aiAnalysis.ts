// AI分析结果相关API服务
import http from '@/services/http';
import type { 
  AiAnalysisQueryDTO, 
  ResultPageResultAiAnalysisResultVO, 
  ResultAiAnalysisResultVO,
  AiAnalysisResultVO 
} from '@/types/api';

/**
 * 获取AI分析结果列表
 */
const getAnalysisList = (params: AiAnalysisQueryDTO): Promise<ResultPageResultAiAnalysisResultVO> => {
  return http.get('/api/social-worker/ai/analysis/list', { params });
};

/**
 * 获取AI分析结果详情
 */
const getAnalysisDetail = (id: number): Promise<ResultAiAnalysisResultVO> => {
  return http.get(`/api/social-worker/ai/analysis/${id}`);
};

/**
 * 根据儿童ID生成AI分析结果
 */
const generateAnalysis = (childId: number): Promise<ResultAiAnalysisResultVO> => {
  return http.post(`/api/social-worker/ai/analysis/${childId}`);
};

/**
 * 删除AI分析结果
 */
const deleteAnalysis = (id: number): Promise<any> => {
  return http.delete(`/api/social-worker/ai/analysis/${id}`);
};

// 创建服务对象并导出
const aiAnalysisService = {
  getAnalysisList,
  getAnalysisDetail,
  generateAnalysis,
  deleteAnalysis
};

// 导出服务对象
export { aiAnalysisService };

// 默认导出服务对象
export default aiAnalysisService;