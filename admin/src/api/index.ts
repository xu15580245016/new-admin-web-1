import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_PREFIX || '/adminapi',
  timeout: 10000
})

request.interceptors.request.use(
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

request.interceptors.response.use(
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

export default request

export const get = <T>(url: string, params?: object): Promise<T> => {
  return request.get(url, { params }).then(res => res.data)
}

export const post = <T>(url: string, data?: object): Promise<T> => {
  return request.post(url, data).then(res => res.data)
}

export const put = <T>(url: string, data?: object): Promise<T> => {
  return request.put(url, data).then(res => res.data)
}

export const del = <T>(url: string): Promise<T> => {
  return request.delete(url).then(res => res.data)
}

export const upload = <T>(path: string, formData: Record<string, any>): Promise<T> => {
  const params = new FormData()
  for (const key in formData) {
    params.append(key, formData[key])
  }
  return request.post(path, params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data)
}
