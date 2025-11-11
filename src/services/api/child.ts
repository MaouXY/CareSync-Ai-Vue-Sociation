import { http } from './index';
import type { 
  ChildQueryDTO, 
  ResultPageResultChildQueueVO,
  ChildInfoVO,
  ResultChildInfoVO
} from '@/types/api';

/**
 * 儿童管理API服务
 */
export const childApi = {
  /**
   * 获取儿童列表
   * @param params 查询参数
   * @returns 儿童列表
   */
  getChildrenList: async (params: ChildQueryDTO = {}): Promise<ResultPageResultChildQueueVO> => {
    console.log('请求儿童列表数据...', params);
    const response = await http.post('/api/social-worker/children/list', params);
    console.log('儿童列表API响应:', response);
    return response;
  },

  /**
   * 获取儿童详情
   * @param id 儿童ID
   * @returns 儿童详情
   */
  getChildDetail: async (id: number): Promise<ResultChildInfoVO> => {
    console.log('请求儿童详情数据...', id);
    const response = await http.get(`/api/social-worker/children/${id}`);
    console.log('儿童详情API响应:', response);
    return response;
  }
};