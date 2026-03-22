import { defineAsyncComponent } from 'vue'

// 路由懒加载包装函数，添加loading状态
const lazyLoad = (componentPath) => {
    return defineAsyncComponent({
        loader: () => import(componentPath),
        loadingComponent: {
            template: '<div class="route-loading">加载中...</div>'
        },
        delay: 200,
        timeout: 10000
    })
}

const routers = [
    {
        path: '/main',
        name: 'main',
        component: () => import('../pages/MainConent/index.vue'),
        meta: {
            title: '首页',
            requiresAuth: true
        }
    },
    {
        path: '/user-center',
        name: 'UserCenter',
        component: () => import('../pages/user-center/index.vue'),
        meta: {
            title: '用户中心',
            requiresAuth: true
        }
    },
    {
        path: '/user-manage/useradd',
        name: 'UserAdd',
        component: () => import('../pages/user-manage/UserAdd.vue'),
        meta: {
            title: '添加用户',
            requiresAuth: true,
            requireAdmin: true
        }
    },
    {
        path: '/user-manage/userlist',
        name: 'UserList',
        component: () => import('../pages/user-manage/UserList.vue'),
        meta: {
            title: '用户列表',
            requiresAuth: true,
            requireAdmin: true
        }
    },
    {
        path: '/news-manage/newsadd',
        name: 'NewsAdd',
        component: () => import('../pages/news-manage/NewsAdd.vue'),
        meta: {
            title: '添加新闻',
            requiresAuth: true
        }
    },
    {
        path: '/news-manage/newslist',
        name: 'NewsList',
        component: () => import('../pages/news-manage/NewsList.vue'),
        meta: {
            title: '新闻列表',
            requiresAuth: true
        }
    },
    {
        path: '/news-manage/editnews/:id',
        name: 'NewsEdit',
        component: () => import('../pages/news-manage/NewsEdit.vue'),
        meta: {
            title: '编辑新闻',
            requiresAuth: true
        }
    },
    {
        path: '/product-manage/productadd',
        name: 'ProductAdd',
        component: () => import('../pages/product-manage/ProductAdd.vue'),
        meta: {
            title: '添加产品',
            requiresAuth: true
        }
    },
    {
        path: '/product-manage/productlist',
        name: 'ProductList',
        component: () => import('../pages/product-manage/ProductList.vue'),
        meta: {
            title: '产品列表',
            requiresAuth: true
        }
    },
    {
        path: '/product-manage/editproduct/:id',
        name: 'ProductEdit',
        component: () => import('../pages/product-manage/ProductEdit.vue'),
        meta: {
            title: '编辑产品',
            requiresAuth: true
        }
    },
    {
        path: '/home',
        redirect: { name: 'main' }
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../components/NotFound/index.vue'),
        meta: {
            title: '页面未找到'
        }
    }
]

export default routers