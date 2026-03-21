import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PREFIX,
  timeout: 15000,
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: any
  headers?: Record<string, string>
}

export const request = <T = any>(options: RequestOptions): Promise<AxiosResponse<T>> => {
  const { url, method = 'GET', data, params, headers } = options
  const config: AxiosRequestConfig = {
    url,
    method,
    data,
    params,
    headers,
  }
  return service.request<T>(config)
}

export const get = <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> => {
  return request<T>({ url, method: 'GET', params })
}

export const post = <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> => {
  return request<T>({ url, method: 'POST', data })
}

export const put = <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> => {
  return request<T>({ url, method: 'PUT', data })
}

export const del = <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> => {
  return request<T>({ url, method: 'DELETE', params })
}

export const upload = <T = any>(path: string, formData: Record<string, any>): Promise<T> => {
  const params = new FormData()
  for (const key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      params.append(key, formData[key])
    }
  }
  return service.post(path, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data)
}

export default service
