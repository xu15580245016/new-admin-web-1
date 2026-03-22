export interface ApiResponse<T = any> {
  ActionType: string
  data: T
  error?: string
}

export interface NewsItem {
  _id: string
  title: string
  content: string
  category: number
  cover: string
  editTime: string
  isPublish: number
  file?: File | null
}

export interface NewsFormData {
  title: string
  content: string
  category: number
  cover: string
  file: File | null
  isPublish: number
  _id?: string
}

export interface ProductItem {
  _id: string
  title: string
  introduction: string
  detail: string
  cover: string
  editTime: string
  file?: File | null
}

export interface ProductFormData {
  title: string
  introduction: string
  detail: string
  cover: string
  file: File | null
  _id?: string
}

export interface UserItem {
  _id: string
  username: string
  password?: string
  role: number
  introduction: string
  avatar: string
  gender?: number
  file?: File | null
}

export interface UserFormData {
  username: string
  password: string
  role: number
  introduction: string
  avatar: string
  gender?: number
  file: File | null
  _id?: string
}

export interface UserInfo {
  _id: string
  username: string
  role: number
  introduction: string
  avatar: string
  gender: number
}

export interface LoginFormData {
  username: string
  password: string
}

export interface LoginResponse {
  ActionType: string
  data: UserInfo
  error?: string
}

export interface PublishParams {
  _id: string
  isPublish: number
}
