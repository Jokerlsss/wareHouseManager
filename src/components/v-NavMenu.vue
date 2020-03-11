<template>
  <el-menu
    default-active="1-2"
    class="el-menu-vertical-demo"
    @open="handleSelect"
    @close="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#25C386"
    router
    @select="handleSelect"
  >
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>入库</span>
      </template>
      <el-menu-item index="1-1">
        <template slot="title">入库单填写</template>
      </el-menu-item>
      <el-menu-item index="1-2">
        <template slot="title">入库单汇总</template>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="2">
      <i class="el-icon-setting"></i>
      <span slot="title">库存</span>
    </el-menu-item>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>出库</span>
      </template>
      <el-menu-item index="3-1">
        <template slot="title">出库单填写</template>
      </el-menu-item>
      <el-menu-item index="3-2">
        <template slot="title">出库单汇总</template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
</style>
