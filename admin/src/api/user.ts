import { get, post, put, del, upload } from './request'
import type { ApiResponse, UserItem, UserFormData, LoginFormData, UserInfo } from './types'

export const userApi = {
  getList: () => get<ApiResponse<UserItem[]>>('/user/list'),
  
  getById: (id: string) => get<ApiResponse<UserItem[]>>(`/user/list/${id}`),
  
  add: (data: UserFormData) => upload<ApiResponse>('/adminapi/user/add', data),
  
  update: (data: UserFormData) => put<ApiResponse>(`/user/list/${data._id}`, data),
  
  delete: (id: string) => del<ApiResponse>(`/user/list/${id}`),
  
  login: (data: LoginFormData) => post<ApiResponse<UserInfo>>('/user/login', data),
  
  upload: (data: UserFormData) => upload<ApiResponse<UserInfo>>('adminapi/user/upload', data),
}
