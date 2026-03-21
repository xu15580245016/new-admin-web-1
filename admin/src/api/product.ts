import { get, del, upload } from './request'
import type { ApiResponse, ProductItem, ProductFormData } from './types'

export const productApi = {
  getList: () => get<ApiResponse<ProductItem[]>>('/product/list'),
  
  getById: (id: string) => get<ApiResponse<ProductItem[]>>(`/product/list/${id}`),
  
  add: (data: ProductFormData) => upload<ApiResponse>('/adminapi/product/add', data),
  
  update: (data: ProductFormData) => upload<ApiResponse>('/adminapi/product/list', data),
  
  delete: (id: string) => del<ApiResponse>(`/product/list/${id}`),
}
