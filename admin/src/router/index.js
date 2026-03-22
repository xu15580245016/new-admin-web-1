import { createRouter, createWebHashHistory } from "vue-router";
import { useMenuStore } from "../store/menu.js";
import RouteConfig from './router-config.js'

const routes = [
    {
        path: '/home',
        name: 'home',
        component: () => import('../pages/Home/index.vue'),
        meta: {
            title: '首页'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/Login/index.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '',
        redirect: { name: 'home' }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

let loadingInstance = null

router.beforeEach((to, from, next) => {
    if (loadingInstance) {
        loadingInstance.close()
    }
    loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(255, 255, 255, 0.7)'
    })
    
    document.title = to.meta?.title || '门户管理系统'
    
    const useMenu = useMenuStore()
    if (to.name === 'Login') {
        if (!localStorage.getItem('token')) {
            next()
        } else {
            next({ path: '/home' })
        }
    } else {
        if (!localStorage.getItem('token')) {
            next({ path: '/login' })
        } else {
            if (!useMenu.isGetterRouter) {
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
    if (loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
    }
})

router.onError(() => {
    if (loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
    }
})

const configRouter = () => {
    const useMenu = useMenuStore()
    if (!router.hasRoute('home')) {
        router.addRoute({
            path: '/home',
            name: 'home',
            component: () => import('../pages/Home/index.vue'),
            meta: {
                title: '首页'
            }
        })
    }
    RouteConfig.forEach(item => {
        checkPermission(item) && router.addRoute('home', item)
    })
    useMenu.changeGetterRouter(true)
}

const checkPermission = (item) => {
    if (item.meta?.requireAdmin) {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            return JSON.parse(userStr).userInfo.role === 1
        }
        return false
    }
    return true
}

export default router
