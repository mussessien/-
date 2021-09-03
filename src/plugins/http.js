// 插件模块
import axios from 'axios'
const MyHttpSever = {}

MyHttpSever.install = (Vue) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // 4. 添加实例方法
  //  动态添加token头部，除了登陆请求之外全部添加头部
  // const AUTH_TOKEN = localStorage.getItem('token')
  // config.headers.common.Authorization = AUTH_TOKEN
  axios.interceptors.request.use(function (config) {
    //  判断请求是否为登录请求，不是登录请求则添加头部token值
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.common.Authorization = AUTH_TOKEN
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  Vue.prototype.$http = axios
}

export default MyHttpSever
