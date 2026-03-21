// 路由配置 - 扁平化结构
const routeConfig = [
    {
        path: '/main',
        name: 'Main',
        component: () => import('../pages/MainConent/index.vue'),
        meta: {
            title: '首页',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: false,
            icon: 'HomeFilled'
        }
    },
    {
        path: '/user-center',
        name: 'UserCenter',
        component: () => import('../pages/user-center/index.vue'),
        meta: {
            title: '用户中心',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: false,
            icon: 'User'
        }
    },
    {
        path: '/user-manage/useradd',
        name: 'UserAdd',
        component: () => import('../pages/user-manage/UserAdd.vue'),
        meta: {
            title: '添加用户',
            requiresAuth: true,
            requireAdmin: true,
            keepAlive: false,
            icon: 'UserPlus'
        }
    },
    {
        path: '/user-manage/userlist',
        name: 'UserList',
        component: () => import('../pages/user-manage/UserList.vue'),
        meta: {
            title: '用户列表',
            requiresAuth: true,
            requireAdmin: true,
            keepAlive: true,
            icon: 'UserFilled'
        }
    },
    {
        path: '/news-manage/newsadd',
        name: 'NewsAdd',
        component: () => import('../pages/news-manage/NewsAdd.vue'),
        meta: {
            title: '添加新闻',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: false,
            icon: 'DocumentAdd'
        }
    },
    {
        path: '/news-manage/newslist',
        name: 'NewsList',
        component: () => import('../pages/news-manage/NewsList.vue'),
        meta: {
            title: '新闻列表',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: true,
            icon: 'Document'
        }
    },
    {
        path: '/news-manage/editnews/:id',
        name: 'NewsEdit',
        component: () => import('../pages/news-manage/NewsEdit.vue'),
        meta: {
            title: '编辑新闻',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: false,
            hidden: true
        }
    },
    {
        path: '/product-manage/productadd',
        name: 'ProductAdd',
        component: () => import('../pages/product-manage/ProductAdd.vue'),
        meta: {
            title: '添加产品',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: false,
            icon: 'Goods'
        }
    },
    {
        path: '/product-manage/productlist',
        name: 'ProductList',
        component: () => import('../pages/product-manage/ProductList.vue'),
        meta: {
            title: '产品列表',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: true,
            icon: 'Shop'
        }
    },
    {
        path: '/product-manage/editproduct/:id',
        name: 'ProductEdit',
        component: () => import('../pages/product-manage/ProductEdit.vue'),
        meta: {
            title: '编辑产品',
            requiresAuth: true,
            requireAdmin: false,
            keepAlive: false,
            hidden: true
        }
    }
]

export default routeConfig
