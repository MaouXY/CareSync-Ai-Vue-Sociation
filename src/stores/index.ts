import { defineStore } from 'pinia'
import type { UserInfo, LoginState, SocialWorkerLoginDTO, ResultLoginVO } from '@/types/api'
import { authApi } from '@/services/api/auth'

// 定义认证store
export const useAuthStore = defineStore('auth', {
  state: (): LoginState => ({
    isLoggedIn: false,
    userInfo: null,
    loading: false
  }),

  getters: {
    // 获取用户ID
    userId: (state) => state.userInfo?.id || null,
    // 获取用户名
    userName: (state) => state.userInfo?.name || '',
    // 获取用户角色
    userRole: (state) => state.userInfo?.role || 0,
    // 获取token
    token: (state) => state.userInfo?.token || null
  },

  actions: {
    // 初始化store，从localStorage恢复登录状态
    initialize() {
      const token = localStorage.getItem('token')
      const userInfoStr = localStorage.getItem('userInfo')
      
      if (token && userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          this.userInfo = userInfo
          this.isLoggedIn = true
        } catch (error) {
          console.error('解析用户信息失败:', error)
          this.clearAuthData()
        }
      }
    },

    // 社工登录
    async login(loginData: SocialWorkerLoginDTO): Promise<ResultLoginVO> {
      this.loading = true
      
      try {
        const response = await authApi.login(loginData)
        console.log('登录API响应1:', response)
        console.log('响应类型:', typeof response)
        console.log('响应是否包含code:', 'code' in response)
        
        // 直接使用response，因为后端已经返回了完整的响应对象
        if (response.code === 1) {
          // 登录成功，保存用户信息和token
          this.userInfo = response.data
          this.isLoggedIn = true
          
          // 保存到localStorage
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userInfo', JSON.stringify(response.data))
          
          console.log('登录成功，用户信息已保存')
          return response
        } else {
          console.log('登录失败，响应码:', response.code, '数据:', response.data, '消息:', response.msg)
          throw new Error(response.msg || '登录失败')
        }
      } catch (error) {
        console.error('登录过程中发生错误:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 退出登录
    async logout() {
      try {
        await authApi.logout()
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        this.clearAuthData()
      }
    },

    // 清除认证数据
    clearAuthData() {
      this.userInfo = null
      this.isLoggedIn = false
      this.loading = false
      
      // 清除localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    // 刷新token
    async refreshToken(): Promise<void> {
      try {
        const response = await authApi.refreshToken()
        console.log('刷新token响应:', response)
        
        // 兼容response.data或直接response的情况
        const result = response.data || response;
        
        // 注意：根据后端返回格式，成功应该是code === 1
        if (result.code === 1 && result.data) {
          this.userInfo = result.data
          localStorage.setItem('token', result.data.token)
          localStorage.setItem('userInfo', JSON.stringify(result.data))
        }
      } catch (error) {
        console.error('刷新token失败:', error)
        this.clearAuthData()
        throw error
      }
    }
  }
})

// 定义留守儿童store
export const useChildrenStore = defineStore('children', {
  state: () => ({
    childrenList: []
  }),
  actions: {
    // 获取留守儿童列表
    async fetchChildrenList() {
      // 这里将替换为实际的API调用
      // 暂时使用模拟数据
      this.childrenList = []
    }
  }
})