import { http } from './request';
import type { ApiResponse, User, LoginForm, LoginResponse } from './types';

// 用户登录
export const login = (data: LoginForm) => {
  return http.post<LoginResponse>('/user/login', data);
};

// 获取用户列表
export const getUserList = () => {
  return http.get<User[]>('/user/list');
};

// 获取单个用户信息
export const getUserById = (id: string) => {
  return http.get<User[]>(`/user/list/${id}`);
};

// 添加用户
export const addUser = (formData: FormData) => {
  return http.upload('/user/add', formData);
};

// 更新用户
export const updateUser = (id: string, data: Partial<User>) => {
  return http.put(`/user/list/${id}`, data);
};

// 删除用户
export const deleteUser = (id: string) => {
  return http.delete(`/user/list/${id}`);
};

// 上传用户头像/信息
export const uploadUser = (formData: FormData) => {
  return http.upload<LoginResponse>('/user/upload', formData);
};
