<template>
  <div class="container">
    <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus" @click="insertEvent()">新增</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      border
      resizable
      row-key
      highlight-hover-row
      ref="xTable"
      height="auto"
      :data="tableData"
      @cell-dblclick="cellDBLClickEvent"
      align="center"
    >
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="stockInNum" title="入库单号"></vxe-table-column>
      <vxe-table-column field="stockInDate" title="入库日期"></vxe-table-column>
      <vxe-table-column field="remark" title="备注" show-overflow></vxe-table-column>
      <vxe-table-column title="操作" width="150" show-overflow>
        <template v-slot="{ row }">
          <vxe-button type="text" icon="fa fa-edit" @click="editEvent(row)">编辑</vxe-button>
          <vxe-button type="text" icon="fa fa-trash-o" @click="removeEvent(row)">删除</vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-modal
      v-model="showEdit"
      :title="selectRow ? '编辑' : '新增'"
      width="800"
      :loading="submitLoading"
      resize
      destroy-on-close
    >
      <vxe-table
        border
        resizable
        row-key
        highlight-hover-row
        ref="xTable"
        height="auto"
        :data="tableData"
        @cell-dblclick="cellDBLClickEvent"
        align="center"
      >
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column field="stockInNum" title="入库单号"></vxe-table-column>
        <vxe-table-column field="stockInDate" title="入库日期"></vxe-table-column>
        <vxe-table-column field="remark" title="备注" show-overflow></vxe-table-column>
        <vxe-table-column title="操作" width="100" show-overflow>
          <template v-slot="{ row }">
            <vxe-button type="text" icon="fa fa-edit" @click="editEvent(row)"></vxe-button>
            <vxe-button type="text" icon="fa fa-trash-o" @click="removeEvent(row)"></vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </vxe-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      submitLoading: false,
      tableData: [],
      selectRow: null,
      showEdit: false,
      sexList: [
        { label: '女', value: '0' },
        { label: '男', value: '1' }
      ],
      formData: {
        name: null,
        nickname: null,
        role: null,
        sex: null,
        age: null,
        num: null,
        checkedList: [],
        flag1: null,
        date3: null,
        address: null
      },
      formRules: {
        name: [
          { required: true, message: '请输入名称' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
        ],
        nickname: [
          { required: true, message: '请输入昵称' }
        ],
        sex: [
          { required: true, message: '请选择性别' }
        ]
      }
    }
  },
  mounted () {
    // TODO: 数据接口挂载到此钩子函数下
    var Mock = require('mockjs')
    var Random = Mock.Random
    this.tableData = Mock.mock({
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      //   stockInNum,stockInDate，remark
      'list|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'stockInNum|+1': 1,
        'stockInDate': Random.date('yyyy-MM-dd'),
        'remark|+3': 1
      }]
    }).list
    // 输出结果
    console.log(JSON.stringify(this.tableData, null, 4))
  },
  methods: {
    formatterSex ({ cellValue }) {
      let item = this.sexList.find(item => item.value === cellValue)
      return item ? item.label : ''
    },
    visibleMethod ({ data }) {
      return data.flag1 === 'Y'
    },
    cellDBLClickEvent ({ row }) {
      this.editEvent(row)
    },
    insertEvent () {
      this.formData = {
        name: '',
        nickname: '',
        role: '',
        sex: '',
        age: '',
        num: '',
        checkedList: [],
        flag1: '',
        date3: '',
        address: ''
      }
      this.selectRow = null
      this.showEdit = true
    },
    editEvent (row) {
      this.formData = {
        name: row.name,
        nickname: row.nickname,
        role: row.role,
        sex: row.sex,
        age: row.age,
        num: row.num,
        checkedList: row.checkedList,
        flag1: row.flag1,
        date3: row.date3,
        address: row.address
      }
      this.selectRow = row
      this.showEdit = true
    },
    removeEvent (row) {
      this.$XModal.confirm('您确定要删除该数据?').then(type => {
        if (type === 'confirm') {
          this.$refs.xTable.remove(row)
        }
      })
    },
    submitEvent () {
      this.submitLoading = true
      setTimeout(() => {
        this.submitLoading = false
        this.showEdit = false
        if (this.selectRow) {
          this.$XModal.message({ message: '保存成功', status: 'success' })
          Object.assign(this.selectRow, this.formData)
        } else {
          this.$XModal.message({ message: '新增成功', status: 'success' })
          this.$refs.xTable.insert(this.formData)
        }
      }, 500)
    }
  }
}
</script>

<style scoped>
</style>
