import { http } from './index';
import type { 
  ResultSocialWorkerHomeVO, 
  SocialWorkerHomeVO,
  HomeStatisticsDTO,
  PendingTaskVO,
  RecentActivityVO
} from '@/types/api';

/**
 * 社工相关API服务
 */
export const socialWorkerApi = {
  /**
   * 获取社工首页数据
   * @returns 社工首页数据
   */
  getHomeData: async (): Promise<SocialWorkerHomeVO> => {
    console.log('请求社工首页数据...');
    const response = await http.get('/api/social-worker/home');
    console.log('社工首页API响应:', response);
    
    if (response.code === 1 && response.data) {
      return response.data;
    } else {
      throw new Error(response.msg || '获取首页数据失败');
    }
  },

  /**
   * 获取统计数据
   * @returns 统计数据
   */
  getStatistics: async (): Promise<HomeStatisticsDTO> => {
    const homeData = await socialWorkerApi.getHomeData();
    return homeData.statistics;
  },

  /**
   * 获取待办任务
   * @returns 待办任务列表
   */
  getPendingTasks: async (): Promise<PendingTaskVO[]> => {
    const homeData = await socialWorkerApi.getHomeData();
    return homeData.pendingTasks;
  },

  /**
   * 获取最近活动
   * @returns 最近活动列表
   */
  getRecentActivities: async (): Promise<RecentActivityVO[]> => {
    const homeData = await socialWorkerApi.getHomeData();
    return homeData.recentActivities;
  }
};