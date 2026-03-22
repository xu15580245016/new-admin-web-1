import { HomeFilled, UserFilled, Reading, List, Pointer, Grid } from '@element-plus/icons-vue'
import { defineAsyncComponent } from 'vue'
const routes = [
    {
        path: '/main-content',
        name: 'main-content',
        component: () => import('../pages/MainConent/index.vue'),
        meta: {
            title: '首页',
            icon: HomeFilled
        }
    },
    {
        path: '/user-manage',
        name: 'user-manage',
        component: () => import('../components/mainbox/MainBox.vue'),
        meta: {
            title: '用户管理',
            icon: UserFilled
        },
        children: [
            {
                path: '/user-manage/userlist',
                name: 'userlist',
                component: () => import('../pages/user-manage/UserList.vue'),
                meta: {
                    title: '用户列表',
                    icon: List
                }
            },
            {
                path: '/user-manage/adduser',
                name: 'adduser',
                component: () => import('../pages/user-manage/UserAdd.vue'),
                meta: {
                    title: '添加用户',
                    icon: Pointer,
                    requireAdmin: true
                }
            }
        ]
    },
    {
        path: '/news-manage',
        name: 'news-manage',
        component: () => import('../components/mainbox/MainBox.vue'),
        meta: {
            title: '新闻管理',
            icon: Reading
        },
        children: [
            {
                path: '/news-manage/newslist',
                name: 'newslist',
                component: () => import('../pages/news-manage/NewsList.vue'),
                meta: {
                    title: '新闻列表',
                    icon: List
                }
            },
            {
                path: '/news-manage/addnews',
                name: 'addnews',
                component: () => import('../pages/news-manage/NewsAdd.vue'),
                meta: {
                    title: '添加新闻',
                    icon: Pointer
                }
            },
            {
                path: '/news-manage/editnews/:id',
                name: 'editnews',
                component: () => import('../pages/news-manage/NewsEdit.vue'),
                meta: {
                    title: '编辑新闻',
                    icon: Pointer
                }
            }
        ]
    },
    {
        path: '/product-manage',
        name: 'product-manage',
        component: () => import('../components/mainbox/MainBox.vue'),
        meta: {
            title: '产品管理',
            icon: Grid
        },
        children: [
            {
                path: '/product-manage/productlist',
                name: 'productlist',
                component: () => import('../pages/product-manage/ProductList.vue'),
                meta: {
                    title: '产品列表',
                    icon: List
                }
            },
            {
                path: '/product-manage/addproduct',
                name: 'addproduct',
                component: () => import('../pages/product-manage/ProductAdd.vue'),
                meta: {
                    title: '添加产品',
                    icon: Pointer
                }
            },
            {
                path: '/product-manage/editproduct/:id',
                name: 'editproduct',
                component: () => import('../pages/product-manage/ProductEdit.vue'),
                meta: {
                    title: '编辑产品',
                    icon: Pointer
                }
            }
        ]
    }
]

export default routes