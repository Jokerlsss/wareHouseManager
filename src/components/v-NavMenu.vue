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
  >
    <!-- 把样式修改： -->
    <!-- 1、字体高度变小，可以容纳更多栏目 -->
    <!-- 2、做三级菜单 -->
    <!-- 3、把字变多，考虑字多的情况下如何显示 -->

    <!-- <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="1-4">
        <template slot="title">选项4</template>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>-->

    <div v-for="(menuItem,index) in menuList" :key="index" v-show="menuItem.isShow">
      <el-tooltip class="item" effect="dark" :content="menuItem.title" placement="right">
        <el-menu-item :index="menuItem.index">
          <i class="el-icon-setting"></i>
          <span slot="title">{{menuItem.title | ellipsis}}</span>
        </el-menu-item>
      </el-tooltip>
    </div>
  </el-menu>
</template>

<script>
import globalStore from '../stores/global-stores'
export default {
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
      // menuGroupList: [
      //   {
      //     index: '1',
      //     title: '入库',
      //     isShow: true,
      //     menuGroupTwo: [
      //       {
      //         index: '1-1',
      //         title: '入库1-1',
      //         isShow: true,
      //         menuGroupThree: [
      //           {
      //             index: '1-1-1',
      //             title: '入库1-1-1',
      //             isShow: true
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     index: '2',
      //     title: '库存-是世界上规模最大面积最大的库存',
      //     isShow: true
      //   },
      //   {
      //     index: '3',
      //     content: '出库',
      //     title: '出库',
      //     isShow: true
      //   }
      // ],
      menuList: [
        {
          index: '1',
          title: '入库',
          isShow: true
        },
        {
          index: '2',
          title: '库存-是世界上规模最大面积最大的库存',
          isShow: true
        },
        {
          index: '3',
          content: '出库',
          title: '出库',
          isShow: true
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
