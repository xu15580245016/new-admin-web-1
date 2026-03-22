import { get, post, put, del, upload } from './index'
import type { 
  ApiResponse, 
  UserItem, 
  UserFormData, 
  LoginFormData,
  LoginResponse,
  UserInfo
} from './types'

export const login = (data: LoginFormData): Promise<LoginResponse> => {
  return post<LoginResponse>('/user/login', data)
}

export const getUserList = (): Promise<ApiResponse<UserItem[]>> => {
  return get<ApiResponse<UserItem[]>>('/user/list')
}

export const getUserDetail = (id: string): Promise<ApiResponse<UserItem[]>> => {
  return get<ApiResponse<UserItem[]>>(`/user/list/${id}`)
}

export const addUser = (data: UserFormData): Promise<ApiResponse> => {
  return upload<ApiResponse>('/user/add', data)
}

export const updateUser = (data: UserFormData): Promise<ApiResponse> => {
  return put<ApiResponse>(`/user/list/${data._id}`, data)
}

export const deleteUser = (id: string): Promise<ApiResponse> => {
  return del<ApiResponse>(`/user/list/${id}`)
}

export const uploadUserInfo = (data: Partial<UserFormData>): Promise<ApiResponse<UserInfo>> => {
  return upload<ApiResponse<UserInfo>>('/user/upload', data)
}
