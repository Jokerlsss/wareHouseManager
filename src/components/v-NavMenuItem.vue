<template>
  <div class="navMenu">
    <label v-for="(navMenu,index) in navMenus" :key="index">
      <el-menu-item
        v-if="navMenu.childs==null&&navMenu.entity&&navMenu.entity.state==='ENABLE'"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.name"
        :route="navMenu.entity.value"
        disabled
      >
        <!-- <i :class="navMenu.entity.icon"></i> -->
        <span slot="title">{{navMenu.entity.alias}}</span>
      </el-menu-item>

      <el-submenu
        v-if="navMenu.childs&&navMenu.entity&&navMenu.entity.state==='ENABLE'"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.name"
      >
        <template slot="title">
          <!-- <i :class="navMenu.entity.icon"></i> -->
          <span>{{navMenu.entity.alias}}</span>
        </template>
        <!-- 递归调用自身 -->
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </label>
  </div>
</template>
<script>
import NavMenu from '@/components/v-NavMenuItem'
export default {
  components: {
    NavMenu
  },
  name: 'NavMenu',
  props: ['navMenus'],
  data () {
    return {}
  },
  mounted () {
    console.log('menus:', this.navMenus)
  },
  methods: {}
}
</script>
<style scoped>
</style>
