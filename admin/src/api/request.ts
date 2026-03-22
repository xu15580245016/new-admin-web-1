import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/adminapi',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { authorization } = response.headers
    if (authorization) {
      localStorage.setItem('token', authorization)
    }
    return response
  },
  (error) => {
    const { status } = error.response || {}
    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '#/login'
    }
    return Promise.reject(error)
  }
)

// 封装请求方法
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    service
      .request<T>(config)
      .then((res: AxiosResponse<T>) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const get = <T = any>(url: string, params?: any): Promise<T> => {
  return request<T>({ method: 'GET', url, params })
}

export const post = <T = any>(url: string, data?: any): Promise<T> => {
  return request<T>({ method: 'POST', url, data })
}

export const put = <T = any>(url: string, data?: any): Promise<T> => {
  return request<T>({ method: 'PUT', url, data })
}

export const del = <T = any>(url: string): Promise<T> => {
  return request<T>({ method: 'DELETE', url })
}

export default service
