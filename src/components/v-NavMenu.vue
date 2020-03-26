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
    <!-- <vNavMenuItem :navMenus="leftMenus"></vNavMenuItem> -->

    <!-- 把样式修改： -->
    <!-- 1、字体高度变小，可以容纳更多栏目 -->
    <!-- 2、做三级菜单 -->
    <!-- 3、把字变多，考虑字多的情况下如何显示 -->

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
import vNavMenuItem from '@/components/v-NavMenuItem'
export default {
  components: {
    vNavMenuItem
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
      // leftMenus: {
      //   'entity': null,
      //   'childs': [
      //     {
      //       'entity': {
      //         'id': 1,
      //         'parentMenuId': 0,
      //         'name': 'systemManage',
      //         'icon': 'el-icon-message\r\n',
      //         'alias': '系统管理',
      //         'state': 'ENABLE',
      //         'sort': 0,
      //         'value': null,
      //         'type': 'NONE',
      //         'discription': '用于系统管理的菜单',
      //         'createUserId': 1
      //       },
      //       'childs': [
      //         {
      //           'entity': {
      //             'id': 3,
      //             'parentMenuId': 1,
      //             'name': 'authManage',
      //             'icon': 'el-icon-loading',
      //             'alias': '权限管理',
      //             'state': 'ENABLE',
      //             'sort': 0,
      //             'value': '/system/auth',
      //             'type': 'LINK',
      //             'discription': '用于权限管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         },
      //         {
      //           'entity': {
      //             'id': 4,
      //             'parentMenuId': 1,
      //             'name': 'roleManage',
      //             'icon': 'el-icon-bell',
      //             'alias': '角色管理',
      //             'state': 'ENABLE',
      //             'sort': 1,
      //             'value': '/system/role',
      //             'type': 'LINK',
      //             'discription': '用于角色管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         },
      //         {
      //           'entity': {
      //             'id': 2,
      //             'parentMenuId': 1,
      //             'name': 'menuManage',
      //             'icon': 'el-icon-edit',
      //             'alias': '菜单管理',
      //             'state': 'ENABLE',
      //             'sort': 2,
      //             'value': '/system/menu',
      //             'type': 'LINK',
      //             'discription': '用于菜单管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         },
      //         {
      //           'entity': {
      //             'id': 5,
      //             'parentMenuId': 1,
      //             'name': 'groupManage',
      //             'icon': 'el-icon-mobile-phone\r\n',
      //             'alias': '分组管理',
      //             'state': 'ENABLE',
      //             'sort': 3,
      //             'value': '/system/group',
      //             'type': 'LINK',
      //             'discription': '用于分组管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         }
      //       ]
      //     },
      //     {
      //       'entity': {
      //         'id': 6,
      //         'parentMenuId': 0,
      //         'name': 'userManage',
      //         'icon': 'el-icon-news',
      //         'alias': '用户管理',
      //         'state': 'ENABLE',
      //         'sort': 1,
      //         'value': null,
      //         'type': 'NONE',
      //         'discription': '用于用户管理的菜单',
      //         'createUserId': 1
      //       },
      //       'childs': [
      //         {
      //           'entity': {
      //             'id': 7,
      //             'parentMenuId': 6,
      //             'name': 'accountManage',
      //             'icon': 'el-icon-phone-outline\r\n',
      //             'alias': '帐号管理',
      //             'state': 'ENABLE',
      //             'sort': 0,
      //             'value': '',
      //             'type': 'NONE',
      //             'discription': '用于帐号管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': [
      //             {
      //               'entity': {
      //                 'id': 14,
      //                 'parentMenuId': 7,
      //                 'name': 'emailManage',
      //                 'icon': 'el-icon-sold-out\r\n',
      //                 'alias': '邮箱管理',
      //                 'state': 'ENABLE',
      //                 'sort': 0,
      //                 'value': '/content/email',
      //                 'type': 'LINK',
      //                 'discription': '用于邮箱管理的菜单',
      //                 'createUserId': 1
      //               },
      //               'childs': null
      //             },
      //             {
      //               'entity': {
      //                 'id': 13,
      //                 'parentMenuId': 7,
      //                 'name': 'passManage',
      //                 'icon': 'el-icon-service\r\n',
      //                 'alias': '密码管理',
      //                 'state': 'ENABLE',
      //                 'sort': 1,
      //                 'value': '/content/pass',
      //                 'type': 'LINK',
      //                 'discription': '用于密码管理的菜单',
      //                 'createUserId': 1
      //               },
      //               'childs': null
      //             }
      //           ]
      //         },
      //         {
      //           'entity': {
      //             'id': 8,
      //             'parentMenuId': 6,
      //             'name': 'integralManage',
      //             'icon': 'el-icon-picture',
      //             'alias': '积分管理',
      //             'state': 'ENABLE',
      //             'sort': 1,
      //             'value': '/user/integral',
      //             'type': 'LINK',
      //             'discription': '用于积分管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         }
      //       ]
      //     },
      //     {
      //       'entity': {
      //         'id': 9,
      //         'parentMenuId': 0,
      //         'name': 'contentManage',
      //         'icon': 'el-icon-rank',
      //         'alias': '内容管理',
      //         'state': 'ENABLE',
      //         'sort': 2,
      //         'value': null,
      //         'type': 'NONE',
      //         'discription': '用于内容管理的菜单',
      //         'createUserId': 1
      //       },
      //       'childs': [
      //         {
      //           'entity': {
      //             'id': 10,
      //             'parentMenuId': 9,
      //             'name': 'classifyManage',
      //             'icon': 'el-icon-printer',
      //             'alias': '分类管理',
      //             'state': 'ENABLE',
      //             'sort': 0,
      //             'value': '/content/classify',
      //             'type': 'LINK',
      //             'discription': '用于分类管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         },
      //         {
      //           'entity': {
      //             'id': 11,
      //             'parentMenuId': 9,
      //             'name': 'articleManage',
      //             'icon': 'el-icon-star-on',
      //             'alias': '文章管理',
      //             'state': 'ENABLE',
      //             'sort': 1,
      //             'value': '/content/article',
      //             'type': 'LINK',
      //             'discription': '用于文章管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         },
      //         {
      //           'entity': {
      //             'id': 12,
      //             'parentMenuId': 9,
      //             'name': 'commentManage',
      //             'icon': 'el-icon-share',
      //             'alias': '评论管理',
      //             'state': 'ENABLE',
      //             'sort': 2,
      //             'value': '/content/comment',
      //             'type': 'LINK',
      //             'discription': '用于评论管理的菜单',
      //             'createUserId': 1
      //           },
      //           'childs': null
      //         }
      //       ]
      //     }
      //   ]
      // },
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
