<template>
  <div class="app-container">
    <el-row style="padding-bottom:20px;">
      <el-input
        v-model="pageQuery.repaircode"
        :style="{ width: '260px',marginRight:'20px' }"
        placeholder="维修单号"
        clearable
        @clear="getList"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <el-button :disabled="!tableSelection.length" icon="el-icon-setting" @click="handleFinish">完成维修</el-button>

    </el-row>

    <vxe-table
      ref="xTree"
      v-loading="tableLoading"
      resizable
      highlight-hover-row
      :auto-resize="true"
      stripe
      class="vxetable"
      :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
      :data="tableData"
      :sort-config="{remote:true}"
      @checkbox-all="handleSelectionAll"
      @sort-change="sortChangeEvent"
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
      <vxe-table-column field="repaircode" title="维修单号" width="240" />
      <vxe-table-column field="fee" title="维修花费" />
      <vxe-table-column field="statusId" title="状态">
        <template #default="{row}">
          {{ row.statusId === 0 ? '开始维修' :'完成维修' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="repairdate" title="修理日期" sortable />
      <vxe-table-column field="reguserId" title="处理人" />
      <vxe-table-column field="userId" title="报修人" />
      <vxe-table-column field="content" title="维修内容" />
      <vxe-table-column field="memo" title="备注" />

    </vxe-table>

    <pagination
      v-show="pageTotal>0"
      background
      :total="pageTotal"
      layout="prev, pager, next, jumper"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      style="text-align:right;margin-top:20px;"
      @pagination="getList"
    />
    <!--新增/编辑-->
    <add-dialog
      v-if="showAddDialog"
      ref="AddDialog"
      :visible.sync="showAddDialog"
      :modal-type="modalType"
      :form-option="formOption"
      :main-sort-data="MainSortData"
      @submit-form="submitMethods"
    />
  </div>
</template>

<script>
import { queryAssetRepairList, saveAssetRepair, endAssetRepair, getAssetRepair, updateAssetRepair, deleteAssetRepair, repairBaseCode } from '@/api/assetManage'
import addDialog from './components/addnew'
import Pagination from '@/components/Pagination'
export default {
  name: 'AssetMaintenanceManage',
  components: { addDialog, Pagination },
  data() {
    return {
      showAddDialog: false,
      modalType: 'new',
      pageTotal: 0,
      tableData: [],
      tableSelection: [],
      tableSelectionKeys: [],
      formOption: null,
      MainSortData: {},
      searchIpt: '',
      pageQuery: {
        pageSize: 10,
        pageNo: 1,
        repaircode: '',
        orderName: '',
        orderType: ''

      },
      tableLoading: false
    }
  },
  mounted() {
    this.getList()
    this.getBaseCode()
  },
  methods: {
    // Fn: 初始化请求参数
    initSetting() {
      this.pageQuery.pageNo = 1
    },
    getBaseCode() {
      repairBaseCode().then(res => {
        if (res.code === 0 && res.data) {
          for (const key in res.data) {
            this.$set(this.MainSortData, key, res.data[key])
          }
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // Fn: 资源维修列表
    getList() {
      const params = {
        ...this.pageQuery
      }
      this.tableLoading = true
      queryAssetRepairList(params).then((res) => {
        if (res.code === 0 && res.data) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => { console.log('err', err) })
        .finally(() => { this.tableLoading = false })
    },
    // Fn: 多选项转成id数组
    selection2keys(selection) {
      return selection.map((item) => item.repairId)
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
      this.modalType = 'new'
      this.showAddDialog = true
      this.$nextTick(() => {
        this.$refs.AddDialog && this.$refs.AddDialog.clearAllOptions()
      })
    },
    // Fn: 完成维修
    handleFinish() {
      const query = this.tableSelectionKeys.join(',')
      endAssetRepair({ repairIds: query }).then((res) => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '维修状态修改完成' })
          this.getList()
        } else {
          this.$message({ type: 'error', message: '维修状态修改失败，请稍后再试' })
        }
      })
        .catch((err) => {
          console.log('err', err)
          this.$message({ type: 'error', message: '维修状态修改失败，请稍后再试' })
        })
    },
    // Fn: 修改
    handleEdit(item) {
      getAssetRepair(item.repairId).then((res) => {
        if (res.code === 0) {
          const { repair, repairAssetList, repairPicList } = res.data
          this.modalType = 'edit'
          this.formOption = {
            formData: repair,
            imagesList: repairPicList.map((item) => ({
              name: item.picname,
              path: item.filepath,
              url: item.filepath
            })),
            assetList: repairAssetList,
            repairId: item.repairId
          }
          this.showAddDialog = true
        }
      })
    },
    // Fn: 删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该维修单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAssetRepair(item.repairId).then((res) => {
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
    submitMethods(params, id) {
      console.log('params', params)
      console.log('id', id)
      const promise = this.modalType === 'new' ? saveAssetRepair(params) : updateAssetRepair(params, id)
      const msg = this.modalType === 'new' ? '新增' : '编辑'
      promise.then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: msg + '维修成功' })
          this.modalType === 'new' ? this.pageQuery.pageNo = 1 : null
          this.getList()
        } else {
          this.$message({ type: 'error', message: msg + '维修失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: msg + '维修失败，请稍后再试' })
      }).finally(() => {
        this.showAddDialog = false
      })
    },
    searchList() {
      if (!this.pageQuery.repaircode) {
        this.$message({ type: 'warning', message: '请输入搜索单号' })
        return
      }
      this.getList()
    },
    sortChangeEvent(column, property, order) {
      if (!column.order) {
        this.pageQuery.orderName = ''
        this.pageQuery.orderType = ''
        this.getList()
        return
      }
      this.pageQuery.pageNo = 1
      this.pageQuery.pageSize = 10
      this.pageQuery.orderName = column.property
      this.pageQuery.orderType = column.order.toUpperCase()
      this.getList()
    }

  }
}
</script>

<style  scoped>
.vxetable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}
</style>

