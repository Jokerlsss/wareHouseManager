<template>
  <div class="container">
    <div class="oprateArea">
      <el-button @click="insertStockIn()" class="greenBtn">新增</el-button>
    </div>
    <!-- 出库单汇总 -->
    <vxe-table
      border
      row-key
      highlight-hover-row
      highlight-current-row
      ref="xTable"
      :data="tableBaseData"
      @cell-dblclick="cellDBLClickEvent"
      align="center"
      stripe
    >
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="stockInNum" title="出库单号" sortable type="html"></vxe-table-column>
      <vxe-table-column field="stockInDate" title="出库日期" sortable type="html"></vxe-table-column>
      <vxe-table-column field="remark" title="备注" show-overflow type="html"></vxe-table-column>
      <vxe-table-column title="操作" width="100" show-overflow>
        <template v-slot="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="editEvent(row)" style="color:#25c386"></el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="removeEvent(row)"
            style="color:#FF6600;"
          ></el-button>
        </template>
      </vxe-table-column>
      <template v-slot:empty>
        <span style="color: #9898a0;">
          <p>没有更多数据了！</p>
        </span>
      </template>
    </vxe-table>
    <!-- 分页 -->
    <!--// TODO: 分页数据获取-->
    <vxe-pager
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.totalResult"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    ></vxe-pager>
    <!-- 编辑 & 新增 弹窗 -->
    <!-- // TODO: 当子表格新增空行时，不予保存-->
    <vxe-modal
      v-model="showEdit"
      :title="selectRow ? '编辑' : '新增'"
      width="800"
      :loading="submitLoading"
      resize
      destroy-on-close
      mask-closable
    >
      <!------------------------------------ 表单部分 ---------------------------------->
      <div style="width:100%;height:30px;font-size:14px;color:#9898a0">>> 基本信息</div>
      <div style="width:100%;height:150px">
        <el-form :model="formInline" class="demo-form-inline" :rules="formRules" label-width="80px">
          <!-- 入库单号 -->
          <el-col :span="12">
            <el-form-item label="出库单号" prop="num">
              <el-col :span="20">
                <el-input v-model="stockOutForm.num" clearable maxlength="10"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <!-- 入库日期 -->
          <el-col :span="12">
            <el-form-item label="出库日期" prop="date">
              <el-col :span="20">
                <el-date-picker v-model="stockOutForm.date" type="date" placeholder="选择日期"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>

          <!-- 备注 -->
          <el-col :span="24">
            <el-form-item label="备注">
              <el-col :span="21">
                <el-input type="textarea" v-model="stockOutForm.remark" resize="none"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- ---------------子表-------------------- -->
      <div style="width:100%;height:30px;font-size:14px;color:#9898a0">>> 详细信息</div>
      <div style="width:100%;height:auto">
        <vxe-toolbar>
          <template v-slot:buttons>
            <el-button icon="el-icon-plus" class="greenBtn" @click="choseInventory">选择库存</el-button>
            <el-button @click="deleteRowData" icon="el-icon-delete" class="dangerBtn"></el-button>
          </template>
        </vxe-toolbar>
        <!-- 表格：从库存选择过来的数据 -->
        <vxe-table
          border
          show-overflow
          ref="productTable"
          class="my_table_insert"
          max-height="200"
          :data="selectData"
          :edit-config="{trigger: 'click', mode: 'cell', icon: 'fa fa-pencil'}"
          :edit-rules="tableRules"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column
            field="productName"
            title="产品名称"
            :edit-render="{name: 'input',attrs:{disabled:'false'}}"
          ></vxe-table-column>
          <vxe-table-column
            field="productSize"
            title="产品规格"
            :edit-render="{name: 'input',attrs:{disabled:'false'}}"
          ></vxe-table-column>
          <vxe-table-column
            field="amount"
            title="数量"
            :edit-render="{name: 'input',attrs: { type:'number',max:maxAmount}}"
          ></vxe-table-column>
        </vxe-table>
        <div style="display:flex;justify-content:center;margin-top:20px;">
          <el-button type="primary" @click="commitEvent">提交</el-button>
          <el-button type="default">取消</el-button>
        </div>
      </div>
    </vxe-modal>
    <!-- // TODO:启用range范围选中 -->
    <vxe-modal
      v-model="showInventory"
      width="800"
      title="选择库存"
      :loading="submitLoading"
      resize
      destroy-on-close
      mask-closable
    >
      <!-- 填写出库单-打开 选择库存 界面 -->
      <ChoseInventory
        :selectDataId="selectDataId"
        @getSelectData="getListData"
        @closeInventory="closeInventory"
      ></ChoseInventory>
    </vxe-modal>
  </div>
</template>

<script>
// import XEUtils from 'xe-utils'
import globalStore from '../stores/global-stores'
import ChoseInventory from '@/views/ChoseInventory'
export default {
  components: {
    ChoseInventory
  },
  data () {
    return {
      test: 100,
      stockOutForm: {
        num: '',
        date: '',
        remark: ''
      },
      // 接收来自库存选择的产品
      selectData: [],
      selectDataId: [],
      maxAmount: '',
      inputValue: '',

      submitLoading: false,
      tableBaseData: [],
      tableProductData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      selectRow: null,
      showEdit: false,
      showInventory: false,

      formData: {
        stockInNum: null,
        stockInDate: null,
        remark: null
      },
      formRules: {
        num: [
          { required: true, message: '请输入出库单号' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符' }
        ],
        date: [
          { required: true, message: '请选择出库日期' }
        ]
      },
      tableRules: {
        // TODO: 如何判断该数组长度为0（当新增一条空数据时可以进行校验，但长度为0时则无法）
        productName: [
          { required: true, message: '请输入产品名称' }
        ],
        productSize: [
          { required: true, message: '请输入产品规格' }
        ],
        amount: [
          { required: true, message: '请输入出库数量' }
        ]
      }
    }
  },
  // 全表搜索
  // ? 如果使用了分页之后，搜索出来的结果是一页的还是多页的？

  mounted () {
    // TODO: 数据接口挂载到此钩子函数下
    this.mockTableBaseData()
    this.cutBreadTitle()
  },
  methods: {
    /** 删除事件：删除行数据的同时，也删除存放row_id中的对应id */
    deleteRowData () {
      // 删除行数据
      this.$refs.productTable.removeCheckboxRow()
      // 删除数组中的数据
      let insertRecords = this.$refs.productTable.getRecordset()
      for (var i = 0; i < insertRecords.removeRecords.length; i++) {
        for (var j = 0; j < this.selectDataId.length; j++) {
          if (this.selectDataId[j] === insertRecords.removeRecords[i]._XID) {
            this.selectDataId.splice(j, 1)
          }
        }
      }
    },
    /** 提交事件 */
    commitEvent () {
      console.log('this.selectData', this.selectData)
    },
    // 保存当前选中的值
    getListData (list) {
      this.selectDataId = []
      for (var i = 0; i < list.length; i++) {
        // 将当前库存值，作为可选的最大出库数量，用新的属性字段存进数组中
        this.$set(list[i], 'maxAmount', list[i].amount)
        // this.selectData.push(list[i])
        // TODO：后台需要增加“产品ID”，保持自增即可
        this.selectDataId.push(list[i]._XID)
      }
      this.selectData = list
      console.log('selectData:', this.selectData)
    },
    cutBreadTitle () {
      globalStore.commit('cutPage', 4)
    },
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
          'amount|+3': 1
        }]
      }).list
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
        amount: ''
      }
      this.selectRow = null
      this.showEdit = true
    },
    choseInventory () {
      this.showInventory = true
    },
    closeInventory () {
      this.showInventory = false
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
.oprateArea {
  width: 100%;
  height: auto;
  display: flex;
  margin-bottom: 20px;
}
.greenBtn {
  background-color: #25c386;
  color: #fff;
  /* font-size: 16px; */
}
.dangerBtn {
  background-color: #ff3300;
  color: #fff;
}
.greenBtn:hover {
  opacity: 0.7;
}
</style>
