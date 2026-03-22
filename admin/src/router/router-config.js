import { defineAsyncComponent } from 'vue'

const loadComponent = (loader) => {
  return defineAsyncComponent({
    loader,
    loadingComponent: () => null,
    delay: 200,
    timeout: 10000
  })
}

const routers = [
    {
        path: '/main',
        name: 'main',
        component: loadComponent(() => import('../pages/MainConent/index.vue')),
        meta: {
            title: '首页'
        }
    },
    {
        path: '/user-center',
        name: 'UserCenter',
        component: loadComponent(() => import('../pages/user-center/index.vue')),
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/user-manage/useradd',
        name: 'UserAdd',
        component: loadComponent(() => import('../pages/user-manage/UserAdd.vue')),
        meta: {
            title: '添加用户',
            requireAdmin: true
        }
    },
    {
        path: '/user-manage/userlist',
        name: 'UserList',
        component: loadComponent(() => import('../pages/user-manage/UserList.vue')),
        meta: {
            title: '用户列表',
            requireAdmin: true
        }
    },
    {
        path: '/news-manage/newsadd',
        name: 'NewsAdd',
        component: loadComponent(() => import('../pages/news-manage/NewsAdd.vue')),
        meta: {
            title: '添加新闻'
        }
    },
    {
        path: '/news-manage/newslist',
        name: 'NewsList',
        component: loadComponent(() => import('../pages/news-manage/NewsList.vue')),
        meta: {
            title: '新闻列表'
        }
    },
    {
        path: '/news-manage/editnews/:id',
        name: 'NewsEdit',
        component: loadComponent(() => import('../pages/news-manage/NewsEdit.vue')),
        meta: {
            title: '编辑新闻'
        }
    },
    {
        path: '/product-manage/productadd',
        name: 'ProductAdd',
        component: loadComponent(() => import('../pages/product-manage/ProductAdd.vue')),
        meta: {
            title: '添加产品'
        }
    },
    {
        path: '/product-manage/productlist',
        name: 'ProductList',
        component: loadComponent(() => import('../pages/product-manage/ProductList.vue')),
        meta: {
            title: '产品列表'
        }
    },
    {
        path: '/product-manage/editproduct/:id',
        name: 'ProductEdit',
        component: loadComponent(() => import('../pages/product-manage/ProductEdit.vue')),
        meta: {
            title: '编辑产品'
        }
    },
    {
        path: '/home',
        redirect: { name: 'main' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: loadComponent(() => import('../components/NotFound/index.vue')),
        meta: {
            title: '页面未找到'
        }
    }
]

export default routers
