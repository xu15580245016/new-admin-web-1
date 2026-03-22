import { get, del, upload } from './index'
import type { 
  ApiResponse, 
  ProductItem, 
  ProductFormData 
} from './types'

export const getProductList = (): Promise<ApiResponse<ProductItem[]>> => {
  return get<ApiResponse<ProductItem[]>>('/product/list')
}

export const getProductDetail = (id: string): Promise<ApiResponse<ProductItem[]>> => {
  return get<ApiResponse<ProductItem[]>>(`/product/list/${id}`)
}

export const addProduct = (data: ProductFormData): Promise<ApiResponse> => {
  return upload<ApiResponse>('/product/add', data)
}

export const updateProduct = (data: ProductFormData): Promise<ApiResponse> => {
  return upload<ApiResponse>('/product/list', data)
}

export const deleteProduct = (id: string): Promise<ApiResponse> => {
  return del<ApiResponse>(`/product/list/${id}`)
}
