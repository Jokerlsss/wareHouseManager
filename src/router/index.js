import Vue from 'vue'
import Router from 'vue-router'
import vBreadCrumb from '@/components/v-BreadCrumb'
import StockIn from '@/views/StockIn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vBreadCrumb',
      component: vBreadCrumb
    },
    {
      path: '/1-2',
      name: 'StockIn',
      component: StockIn
    }
  ]
})
