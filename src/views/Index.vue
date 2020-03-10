<template>
  <el-container>
    <el-aside width="200px">
      <vNavMenu></vNavMenu>
    </el-aside>
    <el-container>
      <el-header>
        <vBreadCrumb></vBreadCrumb>
      </el-header>
      <el-main></el-main>
    </el-container>
  </el-container>
</template>

<script>
import vNavMenu from '@/components/v-NavMenu'
import vBreadCrumb from '@/components/v-BreadCrumb'
export default {
  components: {
    vNavMenu,
    vBreadCrumb
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
  /* 外部间距为 0  */
  margin: 0;
  /* 设置内部填充为 0 ，布局元素之间没有间距 */
  padding: 0;
}

.el-header,
.el-footer {
  display: flex;
  align-items: center;
  background-color: #fff;
  color: #333;
}

.el-aside {
  background-color: #545c64;
  color: #333;
}

.el-main {
  /* height: 700px; */
  background-color: #e9eef3;
  color: #333;
}
</style>
