import { Message } from '@arco-design/web-vue'

/**
 * 显示消息提示
 * @param content 消息内容
 * @param type 消息类型
 * @param duration 显示时长（毫秒）
 */
export const showMessage = (
  content: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration: number = 3000
) => {
  Message[type]({
    content,
    duration
  })
}

/**
 * 成功提示
 * @param content 消息内容
 * @param duration 显示时长
 */
export const showSuccess = (content: string, duration: number = 3000) => {
  showMessage(content, 'success', duration)
}

/**
 * 错误提示
 * @param content 消息内容
 * @param duration 显示时长
 */
export const showError = (content: string, duration: number = 3000) => {
  showMessage(content, 'error', duration)
}

/**
 * 警告提示
 * @param content 消息内容
 * @param duration 显示时长
 */
export const showWarning = (content: string, duration: number = 3000) => {
  showMessage(content, 'warning', duration)
}

/**
 * 信息提示
 * @param content 消息内容
 * @param duration 显示时长
 */
export const showInfo = (content: string, duration: number = 3000) => {
  showMessage(content, 'info', duration)
}