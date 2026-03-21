import request from './request'

export interface ProductItem {
  _id?: string
  title: string
  introduction: string
  detail: string
  editTime?: string
  createTime?: string
  cover?: string
}

export interface ProductListParams {
  page?: number
  pageSize?: number
}

export interface ProductListResponse {
  data: ProductItem[]
  total?: number
}

// 获取产品列表
export const getProductList = (params?: ProductListParams) => {
  return request.get<ProductListResponse>('/adminapi/product/list', { params })
}

// 获取产品详情
export const getProductDetail = (id: string) => {
  return request.get<{ data: ProductItem }>(`/adminapi/product/list/${id}`)
}

// 添加产品
export const addProduct = (data: ProductItem) => {
  return request.post('/adminapi/product/add', data)
}

// 编辑产品
export const editProduct = (id: string, data: ProductItem) => {
  return request.put(`/adminapi/product/list/${id}`, data)
}

// 删除产品
export const deleteProduct = (id: string) => {
  return request.delete(`/adminapi/product/list/${id}`)
}
