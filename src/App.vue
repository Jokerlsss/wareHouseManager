<template>
  <div id="app">
    <el-container>
      <!-- 侧边栏 -->
      <!-- // TODO: 侧边栏的树形控件 -> 手风琴模式  可能符合 navmenu 的新样式 -->
      <el-aside width="200px">
        <div class="inputDiv">
          <el-input placeholder="请输入内容" v-model="input" clearable @input="inputChange"></el-input>
        </div>

        <vNavMenu ref="judgeInputIsShow"></vNavMenu>
      </el-aside>
      <el-container>
        <!-- 顶部 -->
        <el-header>
          <vBreadCrumb></vBreadCrumb>
        </el-header>
        <!-- 内容 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vNavMenu from '@/components/v-NavMenu'
import vBreadCrumb from '@/components/v-BreadCrumb'
export default {
  name: 'App',
  components: {
    vNavMenu,
    vBreadCrumb
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    inputChange () {
      this.$refs['judgeInputIsShow'].judgeInputIsShow(this.input)
    }
  }
}
</script>
<style>
html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
}
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
  background-color: #e9eef3;
  color: #333;
}

.el-aside {
  background-color: #2b303b;
  color: #333;
}

.el-main {
  background-color: #fff;
}
/* 搜索输入框 */
.inputDiv {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.inputDiv > .el-input {
  width: 85%;
}
.inputDiv > .el-input > .el-input__inner {
  background-color: #e9eef3;
  width: 100%;
  border-radius: 20px;
}
</style>
