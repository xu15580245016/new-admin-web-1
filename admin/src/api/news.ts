import { get, post, put, del, upload } from './request'
import type { ApiResponse, NewsItem, NewsFormData } from './types'

export const newsApi = {
  getList: () => get<ApiResponse<NewsItem[]>>('/news/list'),
  
  getById: (id: string) => get<ApiResponse<NewsItem[]>>(`/news/list/${id}`),
  
  add: (data: NewsFormData) => upload<ApiResponse>('/adminapi/news/add', data),
  
  update: (data: NewsFormData) => upload<ApiResponse>('/adminapi/news/list', data),
  
  delete: (id: string) => del<ApiResponse>(`/news/list/${id}`),
  
  publish: (id: string, isPublish: number) => 
    put<ApiResponse>('/news/publish', { _id: id, isPublish }),
}
