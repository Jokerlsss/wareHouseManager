import Vue from 'vue'
import Router from 'vue-router'
// import vBreadCrumb from '@/components/v-BreadCrumb'
import StockIn from '@/views/StockIn'
import Inventory from '@/views/Inventory'
import StockOut from '@/views/StockOut'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StockIn',
      component: StockIn
    },
    {
      path: '/1-1-1',
      name: 'StockIn',
      component: StockIn
    },
    {
      path: '/2-1-1',
      name: 'Inventory',
      component: Inventory
    },
    {
      path: '/3',
      name: 'StockOut',
      component: StockOut
    }
  ]
})
