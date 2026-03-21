import { createRouter, createWebHashHistory } from 'vue-router'
import pinia from '../store/index'
import { useMenuStore } from '../store/menu.js'
import { staticRoutes, dynamicRoutes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes,
})

const configRouter = () => {
  const useMenu = useMenuStore()
  
  if (!router.hasRoute('home')) {
    router.addRoute({
      path: '/home',
      name: 'home',
      component: () => import('../pages/Home/index.vue'),
    })
  }
  
  dynamicRoutes.forEach((item) => {
    if (checkPermission(item)) {
      router.addRoute('home', item)
    }
  })
  
  useMenu.changeGetterRouter(true)
}

const checkPermission = (item: { meta?: { requireAdmin?: boolean } }) => {
  if (item.meta?.requireAdmin) {
    const userStr = localStorage.getItem('user')
    if (!userStr) return false
    try {
      const user = JSON.parse(userStr)
      return user.userInfo?.role === 1
    } catch {
      return false
    }
  }
  return true
}

router.beforeEach((to, from, next) => {
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

export default router
