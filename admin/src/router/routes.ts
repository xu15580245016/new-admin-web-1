import type { RouteRecordRaw } from 'vue-router'

export interface RouteMeta {
  title: string
  icon?: string
  requireAdmin?: boolean
  keepAlive?: boolean
  hidden?: boolean
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children' | 'meta'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}

export const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    redirect: '/home',
  },
]

export const dynamicRoutes: AppRouteRecordRaw[] = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../pages/MainConent/index.vue'),
    meta: {
      title: '首页',
      icon: 'HomeFilled',
      keepAlive: true,
    },
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: () => import('../pages/user-center/index.vue'),
    meta: {
      title: '个人中心',
      icon: 'User',
      keepAlive: true,
    },
  },
  {
    path: '/user-manage/useradd',
    name: 'UserAdd',
    component: () => import('../pages/user-manage/UserAdd.vue'),
    meta: {
      title: '添加用户',
      icon: 'UserFilled',
      requireAdmin: true,
    },
  },
  {
    path: '/user-manage/userlist',
    name: 'UserList',
    component: () => import('../pages/user-manage/UserListNew.vue'),
    meta: {
      title: '用户列表',
      icon: 'UserFilled',
      requireAdmin: true,
    },
  },
  {
    path: '/news-manage/newsadd',
    name: 'NewsAdd',
    component: () => import('../pages/news-manage/NewsAdd.vue'),
    meta: {
      title: '创建新闻',
      icon: 'MessageBox',
      keepAlive: true,
    },
  },
  {
    path: '/news-manage/newslist',
    name: 'NewsList',
    component: () => import('../pages/news-manage/NewsListNew.vue'),
    meta: {
      title: '新闻列表',
      icon: 'MessageBox',
      keepAlive: true,
    },
  },
  {
    path: '/news-manage/editnews/:id',
    name: 'NewsEdit',
    component: () => import('../pages/news-manage/NewsEdit.vue'),
    meta: {
      title: '编辑新闻',
      icon: 'MessageBox',
      hidden: true,
    },
  },
  {
    path: '/product-manage/productadd',
    name: 'ProductAdd',
    component: () => import('../pages/product-manage/ProductAdd.vue'),
    meta: {
      title: '添加产品',
      icon: 'FolderOpened',
      keepAlive: true,
    },
  },
  {
    path: '/product-manage/productlist',
    name: 'ProductList',
    component: () => import('../pages/product-manage/ProductListNew.vue'),
    meta: {
      title: '产品列表',
      icon: 'FolderOpened',
      keepAlive: true,
    },
  },
  {
    path: '/product-manage/editproduct/:id',
    name: 'ProductEdit',
    component: () => import('../pages/product-manage/ProductEdit.vue'),
    meta: {
      title: '编辑产品',
      icon: 'FolderOpened',
      hidden: true,
    },
  },
  {
    path: '/home',
    redirect: { name: 'Main' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/NotFound/index.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
    },
  },
]

export default {
  staticRoutes,
  dynamicRoutes,
}
