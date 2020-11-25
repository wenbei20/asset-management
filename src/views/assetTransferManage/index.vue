<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <el-button :disabled="!tableSelection.length" icon="el-icon-sort" @click="handleTransferConfirm">调入确认</el-button>
      <el-button :disabled="!tableSelection.length" icon="el-icon-sort" @click="handleTransferCancel">取消调拨</el-button>
      <!-- <el-button icon="el-icon-printer">打印</el-button> -->
      <el-button type="default" icon="el-icon-receiving" :style="{ marginLeft: '5px' }" plain @click="exportAllAsset">
        导出
      </el-button>
    </el-row>
    <el-row style="padding-top:20px;">
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        stripe
        class="vxetable"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="tableData"
        @checkbox-all="handleSelectionAll"
        @checkbox-change="handleSelectionChange"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column width="32" class="meuntd" :resizable="false" :edit-render="{}">
          <template>
            <div class="moreOuter">
              <i class="el-icon-more" />

            </div>
          </template>
          <template slot="edit" slot-scope="scope">
            <i class="el-icon-more" style="position:relative;top:1px;left: -1px;" />

            <div class="editmenu">
              <div class="item" @click="handleEdit(scope.row)">修改</div>
              <div class="item" @click="handleDelete(scope.row)">删除</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="dataStatus" title="办理状态">
          <template #default="{row}">
            {{ row.statusId === 0 ? '待确认' :row.statusId === 1 ? '确认调入':'取消调拨' }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="allotcode" title="调拨单号" />
        <vxe-table-column field="operdatetime" title="调出日期" />
        <vxe-table-column field="merchantId" title="调出管理员" />
        <vxe-table-column field="sendMerchantId" title="调出单位" />
        <vxe-table-column field="getMerchantId" title="调入单位" />
        <vxe-table-column field="getUserId" title="调入管理员" />
        <vxe-table-column field="memo" title="调拨说明" />
        <!-- <vxe-table-column title="操作">
          <template slot-scope="scope">
            <el-button size="small" plain @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </vxe-table-column> -->
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-row>
    <!--新增/编辑-->
    <add-dialog
      v-if="showAddDialog"
      ref="AddDialog"
      :visible.sync="showAddDialog"
      :modal-type="modalType"
      :form-option="formOption"
      :group-list="groupList"
      @submit-form="submitForm"
    />
  </div>
</template>

<script>
import { assetTransferList, queryAssetAllot, deleteAssetAllot, saveAssetAllot, updateAssetAllot, confirmAssetAllot, cancelAssetAllot, assetTransferBaseCode } from '@/api/assetManage'
import addDialog from './components/addNewDialog'
export default {
  components: { addDialog },
  filters: {
    statusClass(e) {
      switch (e) {
        case '已实现':
          return 'gray'
        case '实现中':
          return 'blue'
        case '规划中':
          return 'green'
        case '已拒绝':
          return 'blue'
        default :
          return 'green'
      }
    }
  },
  data() {
    return {
      showAddDialog: false,
      modalType: 'new',
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      tableSelection: [],
      tableSelectionKeys: [],
      formOption: null,
      groupList: []
    }
  },
  mounted() {
    this.getList()
    this.getBaseCode()
  },
  methods: {
    // Fn: 初始化请求参数
    initSetting() {
      this.pageNo = 1
    },
    // Fn: 获取新增/修改页面的码表
    getBaseCode() {
      assetTransferBaseCode().then((res) => {
        if (res.code === 0) {
          console.log(104, res)
          this.groupList = res.data.groupList
        }
      }).catch((err) => { console.log('err', err) })
    },
    // Fn: 资产调拨列表
    getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      assetTransferList(params).then(res => {
        if (res.code === 0 && res.data && res.data.items) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // Fn: 多选项转成id数组
    selection2keys(selection) {
      return selection.map((item) => item.allotId)
    },
    // Fn: 多选
    handleSelectionChange(val) {
      this.tableSelection = val.selection
      this.tableSelectionKeys = this.selection2keys(this.tableSelection)
    },
    // Fn: 全选
    handleSelectionAll(val) {
      this.tableSelection = val.selection
      this.tableSelectionKeys = this.selection2keys(this.tableSelection)
    },
    // Fn: 新建
    handleNew() {
      this.showAddDialog = true
      this.$nextTick(() => {
        console.log('this.$refs', this.$refs.AddDialog)
        this.$refs.AddDialog && this.$refs.AddDialog.clearAllOptions()
      })
      this.modalType = 'new'
    },
    // Fn: 调入确认
    handleTransferConfirm() {
      const checkedArr = this.$refs.xTree.getCheckboxRecords()
      if (!checkedArr.length) {
        this.$message({ type: 'warning', message: '请选择调拨单' })
        return
      }
      confirmAssetAllot({ allotIds: this.tableSelectionKeys.join(',') }).then((res) => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '调拨成功' })
          this.getList()
        } else {
          this.$message({ type: 'error', message: '调拨失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '调拨失败，请稍后再试' })
      })
    },
    // Fn: 取消调拨
    handleTransferCancel() {
      const checkedArr = this.$refs.xTree.getCheckboxRecords()
      if (!checkedArr.length) {
        this.$message({ type: 'warning', message: '请选择需要取消的调拨单' })
        return
      }
      cancelAssetAllot({ allotIds: this.tableSelectionKeys.join(',') }).then((res) => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '取消调拨成功' })
          this.getList()
        } else {
          this.$message({ type: 'error', message: '取消调拨失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '取消调拨失败，请稍后再试' })
      })
    },
    // Fn: 修改
    handleEdit(item) {
      queryAssetAllot(item.allotId).then((res) => {
        if (res.code === 0) {
          const { allot, allotAssetList = [], allotPicList = [] } = res.data
          this.modalType = 'edit'
          this.formOption = {
            formData: allot,
            imagesList: allotPicList,
            assetList: allotAssetList
          }
          this.showAddDialog = true
        }
      })
    },
    // Fn: 删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该资产调拨, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAssetAllot(item.allotId).then((res) => {
          if (res.code === 0) {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          }
        })
          .catch((err) => {
            console.log('err', err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // Fn: 确认提交（新建/修改）
    submitForm(params, id) {
      this.submitMethods(params, id)
    },
    // Fn: 确认提交方法
    submitMethods(params, id) {
      const promise = this.modalType === 'new' ? saveAssetAllot(params) : updateAssetAllot(params, id)
      const msg = this.modalType === 'new' ? '新增' : '编辑'
      promise.then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: msg + '调拨成功' })
          this.modalType === 'new' ? this.pageNo = 1 : null
          this.getList()
        } else {
          this.$message({ type: 'error', message: msg + '调拨失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: msg + '调拨失败，请稍后再试' })
      }).finally(() => {
        this.showAddDialog = false
      })
    },
    exportAllAsset() {

    }
  }
}
</script>

<style  scoped>
.vxetable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}
</style>

