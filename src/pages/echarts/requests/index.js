import axios from 'axios'
import { message } from 'antd'
// 获取文章阅读量
const isDev = process.env.NODE_ENV === 'development'
const service = axios.create({
  baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/176929' : ''
})
export const getArticleAmount = () => {
  return service.post('/api/v1/articleAmount')
}