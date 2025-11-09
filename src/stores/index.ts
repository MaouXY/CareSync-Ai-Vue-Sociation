import { defineStore } from 'pinia'

// 定义用户store
export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isLoggedIn: false
  }),
  actions: {
    login(username: string) {
      this.username = username
      this.isLoggedIn = true
    },
    logout() {
      this.username = ''
      this.isLoggedIn = false
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