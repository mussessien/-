import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import User from '../components/user/user.vue'
import Rights from '../components/rights/rights.vue'
import Roles from '../components/role/roles.vue'
import Goods from '../components/goods/goods.vue'
import Params from '../components/params/params.vue'
import Goodsadd from '../components/goods/goodsadd.vue'
import Categories from '../components/categories/categories.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/login', component: Login, name: 'login' },
    {
      path: '/',
      component: Home,
      children: [
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/goods', component: Goods },
        { path: '/params', component: Params },
        { path: '/categories', component: Categories },
        { path: '/goodsadd', component: Goodsadd }
      ]
    }
  ]
})
