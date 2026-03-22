import { get, post, put, del } from '../request'

// 用户类型定义
export interface UserItem {
  _id: string
  username: string
  avatar?: string
  role: number
  introduction?: string
  [key: string]: any
}

export interface UserListResponse {
  data: UserItem[]
  [key: string]: any
}

export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  ActionType: string
  data: UserItem
  error?: string
  [key: string]: any
}

// 用户登录
export const login = (data: LoginData) => {
  return post<LoginResponse>('/user/login', data)
}

// 获取用户列表
export const getUserList = () => {
  return get<UserListResponse>('/user/list')
}

// 获取用户详情
export const getUserDetail = (id: string) => {
  return get(`/user/list/${id}`)
}

// 删除用户
export const deleteUser = (id: string) => {
  return del(`/user/list/${id}`)
}

// 添加用户
export const addUser = (data: any) => {
  return post('/user/add', data)
}

// 编辑用户
export const updateUser = (id: string, data: any) => {
  return put(`/user/list/${id}`, data)
}
