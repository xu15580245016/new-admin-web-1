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
  isPublish: number
  editTime: string
  file?: File | null
}

export interface NewsFormData {
  _id?: string
  title: string
  content: string
  category: number
  cover: string
  isPublish: number
  file?: File | null
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
  _id?: string
  title: string
  introduction: string
  detail: string
  cover: string
  file?: File | null
}

export interface UserItem {
  _id: string
  username: string
  password?: string
  avatar?: string
  role: number
  gender?: number
  introduction?: string
  file?: File | null
}

export interface UserFormData {
  _id?: string
  username: string
  password?: string
  avatar?: string
  role: number
  gender?: number
  introduction?: string
  file?: File | null
}

export interface LoginFormData {
  username: string
  password: string
}

export interface UserInfo {
  _id: string
  username: string
  avatar?: string
  role: number
  gender?: number
  introduction?: string
}
