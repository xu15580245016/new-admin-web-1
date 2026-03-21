import { createRouter, createWebHashHistory } from "vue-router";
import pinia from '../store/index'
import { useMenuStore } from "../store/menu.js";
import { useLoadingStore } from "../store/loading.js";

import routeConfig from './router-config.js'

// 路由组件
const routes = [
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Home/index.vue'),
        meta: {
            title: '首页',
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../pages/Login/index.vue'),
        meta: {
            title: '登录',
            requiresAuth: false
        }
    },
    {
        path: '',
        redirect: { name: 'home' }
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import(/* webpackChunkName: "notfound" */ '../components/NotFound/index.vue'),
        meta: {
            title: '页面未找到'
        }
    }
]

// 注册路由
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const loadingStore = useLoadingStore()
    const useMenu = useMenuStore()
    
    // 开始加载
    if (to.meta.requiresAuth !== false) {
        loadingStore.startLoading()
    }

    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 门户管理系统` : '门户管理系统'

    if (to.name === 'Login') {
        if (!localStorage.getItem('token')) {
            loadingStore.stopLoading()
            next()
        } else {
            loadingStore.stopLoading()
            next({ path: '/home' })
        }
    } else {
        // 如果授权(已经登陆过) next()
        if (!localStorage.getItem('token')) {
            loadingStore.stopLoading()
            next({ path: '/login' })
        } else {
            if (!useMenu.isGetterRouter) {
                // 删除所有的嵌套路由
                router.removeRoute('home')
                configRouter()
                next({ path: to.fullPath })
            } else {
                next()
            }
        }
    }
})

router.afterEach(() => {
    const loadingStore = useLoadingStore()
    loadingStore.stopLoading()
})

const configRouter = () => {
    const useMenu = useMenuStore()
    if (!router.hasRoute('home')) {
        router.addRoute(
            {
                path: '/home',
                name: 'home',
                component: () => import(/* webpackChunkName: "home" */ '../pages/Home/index.vue'),
                meta: {
                    title: '首页',
                    requiresAuth: true
                }
            }
        )
    }
    routeConfig.forEach(item => {
        checkPermission(item) && router.addRoute('home', item)
    })
    useMenu.changeGetterRouter(true)
}

const checkPermission = (item) => {
    // 函数体
    if (item.meta && item.meta.requireAdmin) {
        const userInfo = JSON.parse(localStorage.getItem('user'))
        return userInfo && userInfo.userInfo && userInfo.userInfo.role === 1
    }
    return true
}

export default router
