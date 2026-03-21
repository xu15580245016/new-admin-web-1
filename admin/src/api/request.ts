import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token")
  config.headers.Authorization = `Bearer ${token}`
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  const { authorization } = response.headers
  authorization && localStorage.setItem('token', authorization)
  return response;
}, function (error) {
  const { status } = error.response
  if (status === 401) {
    localStorage.removeItem('token')
    window.location.href = '#/login'
  }
  return Promise.reject(error);
});

export default service
