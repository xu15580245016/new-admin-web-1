import request from './request'

export interface UserItem {
  _id?: string
  username: string
  password?: string
  role: number
  introduction: string
  avatar?: string
  gender?: number
}

export interface UserListParams {
  page?: number
  pageSize?: number
}

export interface UserListResponse {
  data: UserItem[]
  total?: number
}

export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  ActionType: string
  data?: UserItem
  error?: string
}

// 登录
export const login = (data: LoginData) => {
  return request.post<LoginResponse>('/adminapi/user/login', data)
}

// 获取用户列表
export const getUserList = (params?: UserListParams) => {
  return request.get<UserListResponse>('/adminapi/user/list', { params })
}

// 获取用户详情
export const getUserDetail = (id: string) => {
  return request.get<{ data: UserItem[] }>(`/adminapi/user/list/${id}`)
}

// 添加用户
export const addUser = (data: UserItem) => {
  return request.post('/adminapi/user/add', data)
}

// 编辑用户
export const editUser = (id: string, data: UserItem) => {
  return request.put(`/adminapi/user/list/${id}`, data)
}

// 删除用户
export const deleteUser = (id: string) => {
  return request.delete(`/adminapi/user/list/${id}`)
}
