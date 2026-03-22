import { get, post, put, del } from '../request'

// 产品类型定义
export interface ProductItem {
  _id: string
  title: string
  introduction: string
  editTime: string
  [key: string]: any
}

export interface ProductListResponse {
  data: ProductItem[]
  [key: string]: any
}

// 获取产品列表
export const getProductList = () => {
  return get<ProductListResponse>('/product/list')
}

// 获取产品详情
export const getProductDetail = (id: string) => {
  return get(`/product/list/${id}`)
}

// 删除产品
export const deleteProduct = (id: string) => {
  return del(`/product/list/${id}`)
}

// 添加产品
export const addProduct = (data: any) => {
  return post('/product/add', data)
}

// 编辑产品
export const updateProduct = (id: string, data: any) => {
  return put(`/product/editproduct/${id}`, data)
}
