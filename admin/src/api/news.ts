import { http } from './request';
import type { News, NewsForm } from './types';

// 获取新闻列表
export const getNewsList = () => {
  return http.get<News[]>('/news/list');
};

// 获取单个新闻
export const getNewsById = (id: string) => {
  return http.get<News[]>(`/news/list/${id}`);
};

// 添加新闻
export const addNews = (formData: FormData) => {
  return http.upload('/news/add', formData);
};

// 更新新闻
export const updateNews = (formData: FormData) => {
  return http.upload('/news/list', formData);
};

// 删除新闻
export const deleteNews = (id: string) => {
  return http.delete(`/news/list/${id}`);
};

// 发布/取消发布新闻
export const publishNews = (data: { _id: string; isPublish: number }) => {
  return http.put('/news/publish', data);
};
