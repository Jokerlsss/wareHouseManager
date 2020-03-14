import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/* eslint-disable */
export default new Vuex.Store({
    // 项目筛选按钮状态
    state: {
        currentPage: '入库单汇总'
    },
    mutations: {
        // 项目页面-切换成列表形式
        cutPageToInventory: (state) => {
            state.currentPage = '库存'
        },
        cutPageToStockIn: (state) => {
            state.currentPage = '入库单汇总'
        },
        cutPageToStockOut: (state) => {
            state.currentPage = '出库单汇总'
        }
    }
})
