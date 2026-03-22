import request, { get, post, put, del, upload } from './index'
import type { 
  ApiResponse, 
  NewsItem, 
  NewsFormData, 
  PublishParams 
} from './types'

export const getNewsList = (): Promise<ApiResponse<NewsItem[]>> => {
  return get<ApiResponse<NewsItem[]>>('/news/list')
}

export const getNewsDetail = (id: string): Promise<ApiResponse<NewsItem[]>> => {
  return get<ApiResponse<NewsItem[]>>(`/news/list/${id}`)
}

export const addNews = (data: NewsFormData): Promise<ApiResponse> => {
  return upload<ApiResponse>('/news/add', data)
}

export const updateNews = (data: NewsFormData): Promise<ApiResponse> => {
  return upload<ApiResponse>('/news/list', data)
}

export const deleteNews = (id: string): Promise<ApiResponse> => {
  return del<ApiResponse>(`/news/list/${id}`)
}

export const updateNewsPublish = (data: PublishParams): Promise<ApiResponse> => {
  return put<ApiResponse>('/news/publish', data)
}
