// API 通用响应类型
export interface ApiResponse<T = any> {
  ActionType: string;
  data?: T;
  error?: string;
}

// 用户相关类型
export interface User {
  _id: string;
  username: string;
  password?: string;
  role: number; // 1是管理员，2编辑
  gender?: number; // 0保密，1男，2女
  introduction: string;
  avatar?: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  username: string;
  role: number;
  gender: number;
  introduction: string;
  avatar: string;
}

// 新闻相关类型
export interface News {
  _id: string;
  title: string;
  content: string;
  category: number; // 1最新动态，2典型案例，3通知公告
  cover: string;
  isPublish: number; // 0未发布，1已发布
  editTime: string;
  file?: File | null;
}

export interface NewsForm {
  title: string;
  content: string;
  category: number;
  cover: string;
  file?: File | null;
  isPublish?: number;
  _id?: string;
}

// 产品相关类型
export interface Product {
  _id: string;
  title: string;
  introduction: string;
  detail: string;
  cover: string;
  editTime: string;
}

export interface ProductForm {
  title: string;
  introduction: string;
  detail: string;
  cover: string;
  file?: File | null;
  _id?: string;
}

// 表格列配置类型
export interface TableColumn {
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  slot?: string; // 自定义插槽名称
  formatter?: (row: any, column: any, cellValue: any, index: number) => string;
}

// 分页参数类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 路由元信息类型
export interface RouteMeta {
  title: string;
  requireAdmin?: boolean;
  icon?: string;
  keepAlive?: boolean;
}
