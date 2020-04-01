<template>
  <el-menu
    :default-active="currentPageRouter"
    class="el-menu-vertical-demo"
    @open="handleSelect"
    @close="handleSelect"
    background-color="#2B303B"
    text-color="#fff"
    active-text-color="#25C386"
    router
    @select="handleSelect"
    unique-opened="true"
  >
    <NavMenu :menuList="menuList"></NavMenu>

    <!-- 把样式修改： -->
    <!-- 1、字体高度变小，可以容纳更多栏目 -->
    <!-- 2、做三级菜单 -->
    <!-- 3、把字变多，考虑字多的情况下如何显示 -->

    <!-- <div v-for="(menuItem,index) in menuList" :key="index" v-show="menuItem.isShow">
      <el-tooltip class="item" effect="dark" :content="menuItem.title" placement="right">
        <el-menu-item :index="menuItem.index">
          <i class="el-icon-setting"></i>
          <span slot="title">{{menuItem.title | ellipsis}}</span>
        </el-menu-item>
      </el-tooltip>
    </div>-->
  </el-menu>
</template>

<script>
import globalStore from '../stores/global-stores'
import NavMenu from '@/components/NavMenuItem'
export default {
  components: {
    NavMenu
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0, 8) + '...'
      }
      return value
    }
  },
  data () {
    return {
      menuList: [
        {
          index: '1',
          title: '入库',
          isShow: true,
          icon: 'el-icon-download',
          child: [
            {
              index: '1-1',
              title: '入库1-1',
              isShow: true,
              icon: 'el-icon-s-help',
              child: [
                {
                  index: '1-1-1',
                  title: '入库1-1-1',
                  isShow: true,
                  icon: 'el-icon-help',
                  child: null
                },
                {
                  index: '1-1-2',
                  title: '入库1-1-2',
                  isShow: true,
                  icon: 'el-icon-s-operation',
                  child: null
                },
                {
                  index: '1-1-3',
                  title: '入库1-1-3',
                  isShow: true,
                  icon: 'el-icon-s-promotion',
                  child: null
                }
              ]
            }
          ]
        },
        {
          index: '2',
          title: '库存-是世界上规模最大面积最大的库存',
          isShow: true,
          icon: 'el-icon-s-goods',
          child: [
            {
              index: '2-1',
              title: '库存2-1',
              isShow: true,
              icon: 'el-icon-s-flag',
              child: [
                {
                  index: '2-1-1',
                  title: '库存2-1-1',
                  icon: 'el-icon-s-grid',
                  isShow: true,
                  child: null
                }
              ]
            }
          ]
        },
        {
          index: '3',
          content: '出库',
          title: '出库',
          isShow: true,
          icon: 'el-icon-upload2',
          child: null
        }
      ]
    }
  },
  computed: {
    currentPageRouter () {
      return globalStore.state.currentPageRouter
    }
  },
  methods: {
    clickEvent (e) {
      console.log('clickEvent:', e)
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    // 根据查询条件判断 menu 是否展示出来
    judgeInputIsShow (input) {
      for (var i = 0; i < this.menuList.length; i++) {
        // search():返回值 -1 不存在，返回值 0 则存在
        if (this.menuList[i].title.search(input) !== -1) {
          this.menuList[i].isShow = true
        } else {
          this.menuList[i].isShow = false
        }
      }
    }
  }
}
</script>

<style>
.el-submenu__title,
.el-submenu .el-menu-item,
.el-menu-item {
  height: 36px;
  line-height: 36px;
}
</style>

<style scoped>
.item {
  margin: 4px;
}
</style>
