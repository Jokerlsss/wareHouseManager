<template>
  <div class="container">
    <div class="oprateArea">
      <el-button @click="insertStockIn()" class="greenBtn">新增</el-button>
    </div>
    <!-- 入库单信息汇总 -->
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
      <!--//? 如果入库单可以修改，假设我入库后，进行出库，出库之后修改入库日期到出库时间之后，该怎么算？-->

      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="stockInNum" title="入库单号" sortable type="html"></vxe-table-column>
      <vxe-table-column field="stockInDate" title="入库日期" sortable type="html"></vxe-table-column>
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
      <div style="width:100%;height:30px;font-size:14px;color:#9898a0">>> 基本信息</div>
      <div style="width:100%;height:150px">
        <el-form
          :model="formInline"
          :rules="formRules"
          ref="formRef"
          class="demo-form-inline"
          label-width="80px"
        >
          <!-- 入库单号 -->
          <el-col :span="12">
            <el-form-item label="入库单号" prop="num">
              <el-col :span="20">
                <el-input v-model="formInline.num" clearable maxlength="10"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <!-- 入库日期 -->
          <el-col :span="12">
            <el-form-item label="入库日期" prop="date">
              <el-col :span="20">
                <el-date-picker v-model="formInline.date" type="date" placeholder="选择日期"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>

          <!-- 备注 -->
          <el-col :span="24">
            <el-form-item label="备注">
              <el-col :span="21">
                <el-input type="textarea" v-model="formInline.remark" clearable resize="none"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- ---------------子表(用vxe-table，而非vxe-form)-------------------- -->
      <!-- 编辑表格-插入数据 -->
      <div style="width:100%;height:30px;font-size:14px;color:#9898a0">>> 详细信息</div>
      <div style="width:100%;height:auto">
        <vxe-toolbar>
          <template v-slot:buttons>
            <el-button icon="el-icon-plus" @click="insertRow()" class="greenBtn"></el-button>
            <!-- <el-button @click="insertRow(-1)">在最后行插入</el-button> -->
            <el-button @click="removeRow" icon="el-icon-delete" class="dangerBtn"></el-button>
          </template>
        </vxe-toolbar>
        <vxe-table
          border
          show-overflow
          ref="xTable"
          class="my_table_insert"
          max-height="200"
          :data="tableProductData"
          :edit-config="{trigger: 'click', mode: 'cell', icon: 'fa fa-pencil'}"
          :edit-rules="tableRules"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="productName" title="产品名称" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="productSize" title="产品规格" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column
            field="amount"
            title="数量"
            :edit-render="{name: 'input',attrs: { type:'number'}}"
          ></vxe-table-column>
        </vxe-table>
      </div>
      <div style="margin-top:10px;display:flex;justify-content:center">
        <el-button class="greenBtn" @click="commitEvent()">提交</el-button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
// import XEUtils from 'xe-utils'
import globalStore from '../stores/global-stores'
export default {
  data () {
    return {
      // element 的表单数据
      formInline: {
        num: '',
        date: '',
        remark: ''
      },
      submitLoading: false,
      tableBaseData: [],
      tableProductData: [
        // {
        //   productName: '',
        //   productSize: '',
        //   amount: ''
        // }
      ],
      // tableProductData 中的每一行详细数据
      productDetailData: {
        productName: '',
        productSize: '',
        amount: ''
      },
      tablePage: {
        currentPage: 1,
        pageSize: 5,
        totalResult: 0
      },

      selectRow: null,
      showEdit: false,
      formData: {
        stockInNum: null,
        stockInDate: null,
        remark: null
      },
      formRules: {
        num: [
          { required: true, message: '请输入入库单号' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符' }
        ],
        date: [
          { required: true, message: '请选择入库日期' }
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
          { required: true, message: '请输入入库数量' }
        ]
      }
    }
  },
  // 全表搜索
  // ? 如果使用了分页之后，搜索出来的结果是一页的还是多页的？

  mounted () {
    // TODO: 数据接口挂载到此钩子函数下
    // this.mockTableBaseData()
    this.cutBreadTitle()
    this.getTableBaseData()
  },
  methods: {
    // element 表单提交事件
    commitEvent () {
      console.log('--------------- submitStart -----------------')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit')
        } else {
          console.log('errorSubmit')
        }
      })
      /** 判断：若数组为空 或 数组中字段有空值 ==> 提交失败 */
      let insertRecords = this.$refs.xTable.getInsertRecords()
      if (insertRecords.length === 0) {
        alert('errortwosubmit')
      } else {
        this.$refs.xTable.validate((valid) => {
          if (valid) {
            console.log('twosubmit')
          } else {
            console.log('errortwosubmit')
          }
        })
      }
      // TODO 分成两个请求，第一个请求：入库单基础信息。第二个请求：入库单号+表格内容
      console.log('--------------- submitEnd -----------------')
    },
    // 删除行
    removeRow () {
      this.$refs.xTable.removeCheckboxRow()
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.getTableBaseData()
    },
    // 获取分页数据
    getTableBaseData () {
      this.$http({
        method: 'get',
        url: `http://localhost:9090/StockIn/page`,
        params: {
          current: this.tablePage.currentPage,
          size: this.tablePage.pageSize
        }
      }).then((res) => {
        this.tableBaseData = res.data.records
        console.log('this.tableBaseData:', this.tableBaseData)
        this.tablePage.totalResult = res.data.total
      }).catch(function (err) {
        console.log('err:', err)
      })
    },
    // 切换面包屑名称显示
    cutBreadTitle () {
      console.log(globalStore.state.currentPage)
      globalStore.commit('cutPage', '1-1-2')
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
      this.tableProductData = [
        // {
        //   productName: '',
        //   productSize: '',
        //   amount: ''
        // }
      ]
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
    // TODO 删除行时应删除对应的子数组productDetailData
    removeEvent (row) {
      this.$XModal.confirm('您确定要删除该数据?').then(type => {
        if (type === 'confirm') {
          this.$refs.xTable.remove(row)
        }
      })
    },
    submitEvent () {
      if (this.isProductDetailDataNull()) {
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
      } else {
        // 当有数据为空时，不予提交并且提示警告
        this.$message({
          message: '请填写完整表格后再提交噢！',
          type: 'warning'
        })
      }
    },
    // 新增行
    async insertRow (row) {
      // 将行数据置空，可以push进父数组
      // this.productDetailData = {
      //   productName: '',
      //   productSize: '',
      //   amount: ''
      // }
      // this.tableProductData.push(this.productDetailData)
      let { row: newRow } = await this.$refs.xTable.insertAt(row)
      await this.$refs.xTable.setActiveCell(newRow, 'sex')
    },
    // 判断子表中是否有空值
    isProductDetailDataNull () {
      var isNullFlag
      console.log('pdd:', this.tableProductData)
      for (let i = 0; i < this.tableProductData.length; i++) {
        console.log(this.tableProductData[i].productName)
        console.log(this.tableProductData[i].productSize)
        console.log(this.tableProductData[i].amount)
        if (this.tableProductData[i].productName === '' || this.tableProductData[i].productSize === '' || this.tableProductData[i].amount === '') {
          isNullFlag = false
          break
        } else {
          isNullFlag = true
        }
      }
      console.log('isNullFlag:', isNullFlag)
      return isNullFlag
    },
    getSelectTion () {
      // 获取选中的 XID
      // var idList = []
      let selectRecords = this.$refs.xTable.getCheckboxRecords()
      console.log('selectRecords', selectRecords)
      // for (var i = 0; i < selectRecords.length; i++) {
      //   idList.push(selectRecords[i]._XID)
      // }
      // // TODO: 根据获取的 XID 删除对应数组
      // this.removeRow()
      // console.log('idList:', idList)
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
