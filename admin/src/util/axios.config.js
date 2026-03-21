import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    const { authorization } = response.headers
    authorization && localStorage.setItem('token', authorization)
    return response;
}, function (error) {
    // 对响应错误做点什么
    const { status } = error.response
    if (status === 401) {
        localStorage.removeItem('token')
        window.location.href = '#/login'
    }
    return Promise.reject(error);
});

export default service
