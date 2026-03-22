import { http } from './request';
import type { Product, ProductForm } from './types';

// 获取产品列表
export const getProductList = () => {
  return http.get<Product[]>('/product/list');
};

// 获取单个产品
export const getProductById = (id: string) => {
  return http.get<Product[]>(`/product/list/${id}`);
};

// 添加产品
export const addProduct = (formData: FormData) => {
  return http.upload('/product/add', formData);
};

// 更新产品
export const updateProduct = (formData: FormData) => {
  return http.upload('/product/list', formData);
};

// 删除产品
export const deleteProduct = (id: string) => {
  return http.delete(`/product/list/${id}`);
};
