import request from './request'

export interface NewsItem {
  _id?: string
  title: string
  content: string
  category: number
  isPublish: number
  editTime?: string
  createTime?: string
}

export interface NewsListParams {
  page?: number
  pageSize?: number
}

export interface NewsListResponse {
  data: NewsItem[]
  total?: number
}

// 获取新闻列表
export const getNewsList = (params?: NewsListParams) => {
  return request.get<NewsListResponse>('/adminapi/news/list', { params })
}

// 获取新闻详情
export const getNewsDetail = (id: string) => {
  return request.get<{ data: NewsItem }>(`/adminapi/news/list/${id}`)
}

// 添加新闻
export const addNews = (data: NewsItem) => {
  return request.post('/adminapi/news/add', data)
}

// 编辑新闻
export const editNews = (id: string, data: NewsItem) => {
  return request.put(`/adminapi/news/list/${id}`, data)
}

// 删除新闻
export const deleteNews = (id: string) => {
  return request.delete(`/adminapi/news/list/${id}`)
}

// 发布/取消发布
export const publishNews = (data: { _id: string, isPublish: number }) => {
  return request.put('/adminapi/news/publish', data)
}
