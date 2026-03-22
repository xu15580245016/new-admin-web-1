import { get, post, put, del } from '../request'

// 新闻类型定义
export interface NewsItem {
  _id: string
  title: string
  category: number
  content: string
  editTime: string
  isPublish: number
  [key: string]: any
}

export interface NewsListResponse {
  data: NewsItem[]
  [key: string]: any
}

// 获取新闻列表
export const getNewsList = () => {
  return get<NewsListResponse>('/news/list')
}

// 获取新闻详情
export const getNewsDetail = (id: string) => {
  return get(`/news/list/${id}`)
}

// 发布/取消发布新闻
export const publishNews = (data: { _id: string; isPublish: number }) => {
  return put('/news/publish', data)
}

// 删除新闻
export const deleteNews = (id: string) => {
  return del(`/news/list/${id}`)
}

// 添加新闻
export const addNews = (data: any) => {
  return post('/news/add', data)
}

// 编辑新闻
export const updateNews = (id: string, data: any) => {
  return put(`/news/editnews/${id}`, data)
}
