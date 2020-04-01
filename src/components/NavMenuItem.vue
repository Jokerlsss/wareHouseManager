<template>
  <div class="container">
    <!-- menuItem：当child为null时 -->
    <!-- submenu：当child存在时 -->
    <div v-for="(menuItem,index) in menuList" :key="index" v-show="menuItem.isShow">
      <el-tooltip class="item" effect="dark" :content="menuItem.title" placement="right">
        <el-menu-item :index="menuItem.index" v-if="menuItem.child===null">
          <i :class="menuItem.icon"></i>
          <span slot="title">{{menuItem.title | ellipsis}}</span>
        </el-menu-item>
      </el-tooltip>

      <!-- // TODO: 在router中添加对应路径后，选中菜单栏时没有颜色 -->
      <!-- // TODO: tooltip展示时，子级会展示父级的信息 -->
      <!-- <el-tooltip class="item" effect="dark" :content="menuItem.title" placement="right"> -->
      <el-submenu :index="menuItem.index" v-if="menuItem.child">
        <template slot="title">
          <i :class="menuItem.icon"></i>
          <span slot="title">{{menuItem.title | ellipsis}}</span>
        </template>
        <NavMenu :menuList="menuItem.child"></NavMenu>
      </el-submenu>
      <!-- </el-tooltip> -->
    </div>
  </div>
</template>

<script>
// 递归调用自身：当有 submenu 时，调用自身的 menuItem 来为 submenu 填充
import NavMenu from '@/components/NavMenuItem'
export default {
  name: 'NavMenu',
  props: {
    menuList: ''
  },
  components: {
    NavMenu
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 7) {
        return value.slice(0, 7) + '...'
      }
      return value
    }
  }
}
</script>

<style scoped>
.container {
  font-family: PingFang SC;
}
</style>
