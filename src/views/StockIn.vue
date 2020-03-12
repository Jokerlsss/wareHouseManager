<template>
  <div class="container">
    <vxe-toolbar>
      <template v-slot:buttons>
        <el-button @click="insertStockIn()" class="insertBtn">新增</el-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      border
      row-key
      highlight-hover-row
      ref="xTable"
      :data="tableBaseData"
      @cell-dblclick="cellDBLClickEvent"
      align="center"
    >
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="stockInNum" title="入库单号"></vxe-table-column>
      <vxe-table-column field="stockInDate" title="入库日期" sortable></vxe-table-column>
      <vxe-table-column field="remark" title="备注" show-overflow></vxe-table-column>
      <vxe-table-column title="操作" width="150" show-overflow>
        <template v-slot="{ row }">
          <vxe-button type="text" icon="fa fa-edit" @click="editEvent(row)">编辑</vxe-button>
          <vxe-button type="text" icon="fa fa-trash-o" @click="removeEvent(row)">删除</vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 弹窗 -->
    <vxe-modal
      v-model="showEdit"
      :title="selectRow ? '编辑' : '新增'"
      width="800"
      :loading="submitLoading"
      resize
      destroy-on-close
      mask-closable
    >
      <vxe-form
        :data="formData"
        :rules="formRules"
        title-align="right"
        title-width="100"
        @submit="submitEvent"
      >
        <!-- 入库基本信息 -->
        <vxe-form-item
          title="基本信息"
          span="24"
          title-align="left"
          title-width="200px"
          :title-prefix="{icon: 'fa fa-address-card-o'}"
        ></vxe-form-item>
        <!-- // TODO:入库单号使用时间戳+当天流水号（后端） -->
        <vxe-form-item
          title="入库单号"
          field="stockInNum"
          span="12"
          :item-render="{name: '$input', props: {placeholder: '请输入名称'}}"
        ></vxe-form-item>
        <!-- // TODO: 选择日期改为不可输入 -->
        <vxe-form-item
          title="入库日期"
          field="stockInDate"
          span="11"
          :item-render="{name: '$input', props: {type: 'date', placeholder: '请选择日期'}}"
        ></vxe-form-item>
        <vxe-form-item
          title="备注"
          field="remark"
          span="23"
          :item-render="{name: 'textarea', attrs: {placeholder: '请输入备注'}}"
        ></vxe-form-item>
        <!-- 入库产品详情信息 -->
        <vxe-form-item
          title="入库产品信息"
          span="24"
          title-align="left"
          title-width="200px"
          :title-prefix="{message: '请填写必填项', icon: 'fa fa-info-circle'}"
        ></vxe-form-item>
        <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-button icon="fa fa-plus" @click="insertRow()">新增</vxe-button>
            <vxe-button @click="insertRow(-1)">在最后行插入</vxe-button>
            <vxe-button @click="$refs.xTable.removeCheckboxRow()">删除选中</vxe-button>
          </template>
        </vxe-toolbar>
        <!-- // TODO: 新增空值不能提交 -->
        <vxe-table
          border
          show-overflow
          ref="xTable"
          class="my_table_insert"
          max-height="200"
          :data="tableProductData"
          :edit-config="{trigger: 'click', mode: 'cell', icon: 'fa fa-pencil'}"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="productName" title="产品名称" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="productSize" title="产品规格" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="acount" title="数量" :edit-render="{name: 'input',type:'number'}"></vxe-table-column>
        </vxe-table>
        <vxe-form-item
          align="center"
          span="24"
          :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: '提交', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] }"
        ></vxe-form-item>
      </vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      submitLoading: false,
      tableBaseData: [],
      tableProductData: [],
      product: {
        productName: null,
        productSize: null,
        acount: null
      },
      selectRow: null,
      showEdit: false,
      sexList: [
        { label: '女', value: '0' },
        { label: '男', value: '1' }
      ],
      formData: {
        stockInNum: null,
        stockInDate: null,
        remark: null
      },
      formRules: {
        stockInNum: [
          { required: true, message: '请输入名称' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
        ],
        stockInDate: [
          { required: true, message: '请输入日期' }
        ]
      }
    }
  },
  mounted () {
    // TODO: 数据接口挂载到此钩子函数下
    this.mockTableBaseData()
  },
  methods: {
    mockTableBaseData () {
      var Mock = require('mockjs')
      var Random = Mock.Random
      this.tableBaseData = Mock.mock({
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
      // console.log(JSON.stringify(this.tableBaseData, null, 4))
    },
    mockTableProductData () {
      var Mock = require('mockjs')
      this.tableProductData = Mock.mock({
        'list|1-5': [{
          'productName|+1': 'name' + 1,
          'productSize|+2': 1,
          'acount|+3': 1
        }]
      }).list
    },
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
    insertStockIn () {
      this.formData = {
        stockInNum: '',
        stockInDate: '',
        remark: ''
      }
      this.tableProductData = {
        productName: '',
        productSize: '',
        acount: ''
      }
      this.selectRow = null
      this.showEdit = true
    },
    // TODO:在打开编辑时，带着 id 的参数访问后端，取得 tableProductData 数据
    editEvent (row) {
      this.mockTableProductData()
      this.formData = {
        stockInNum: row.stockInNum,
        stockInDate: row.stockInDate,
        remark: row.remark
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
    // TODO: 在新增后，分成两个 post 请求去保存
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
    },
    async insertRow (row) {
      let { row: newRow } = await this.$refs.xTable.insertAt(row)
      await this.$refs.xTable.setActiveCell(newRow, 'sex')
    }
  }
}
</script>

<style scoped>
.insertBtn {
  background-color: #25c386;
  color: #fff;
  /* font-size: 16px; */
}
.insertBtn:hover {
  opacity: 0.7;
}
</style>
