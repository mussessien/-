import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import MyHttoServe from './plugins/http.js'
import moment from 'moment' // 时间处理函数库
import MyBread from './components/mybread/mybread.vue'

//  全局组件
Vue.component(MyBread.name, MyBread)

// 时间全局过滤器,用于处理时间格式
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.use(ElementUI)
// 后续用网络请求只需要this.$http.get（）即可
Vue.use(MyHttoServe)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
