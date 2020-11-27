<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="companyValue" placeholder="请选择搜索类别" style="padding:0 6px 0 0;width: 160px;">
        <el-option label="调拨单号" value="2" />
        <el-option label="调入单位" value="3" />
      </el-select>
      <el-dropdown v-if="companyValue === '3'" ref="statusDrop" trigger="click" placement="bottom-start" style="margin-right:20px;">
        <el-input :value="checkedCompany" placeholder="请选择调入单位" clearable @clear="clearNavSearch" />

        <el-dropdown-menu slot="dropdown" class="innerTreeForDepart" style="min-width:200px;">
          <el-tree
            ref="companyTree"
            node-key="groupId"
            :props="{children: 'children',label: 'groupName'}"
            :data="groupList"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="companyTreeClick"
          />
        </el-dropdown-menu>
      </el-dropdown>

      <el-input
        v-else
        v-model="searchIpt"
        :style="{ width: '200px',marginRight:'20px' }"
        placeholder="调拨单号"
        clearable
        @clear="clearNavSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchList" />
      </el-input>

      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <el-button :disabled="tableSelectionStatus.confirm" icon="el-icon-sort" @click="handleTransferConfirm">调入确认</el-button>
      <el-button :disabled="tableSelectionStatus.cancal" icon="el-icon-sort" @click="handleTransferCancel">取消调拨</el-button>
      <!-- <el-button icon="el-icon-printer">打印</el-button> -->
      <el-button type="default" icon="el-icon-receiving" :style="{ marginLeft: '5px' }" plain @click="exportAllAsset">
        导出
      </el-button>
    </el-row>
    <el-row style="padding-top:20px;">
      <vxe-table
        ref="xTree"
        v-loading="tableLoading"
        resizable
        highlight-hover-row
        :auto-resize="true"
        stripe
        class="vxetable"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
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
              <div v-if="scope.row.statusId === 1" class="item" @click="handleEdit(scope.row)">修改</div>
              <div v-else class="item disabled">修改</div>
              <!-- <div class="item" @click="handleDelete(scope.row)">删除</div>   -->
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="dataStatus" title="办理状态">
          <template #default="{row}">
            {{ row.statusId === 0 ? '待确认' :row.statusId === 1 ? '确认调入':'取消调拨' }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="allotcode" title="调拨单号" />
        <vxe-table-column field="operdatetime" title="调出日期" sortable />
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
import axios from 'axios'
import { mapState } from 'vuex'
import addDialog from './components/addNewDialog'
import Pagination from '@/components/Pagination'
export default {
  components: { addDialog, Pagination },
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
      tableData: [],
      tableSelection: [],
      tableSelectionKeys: [],
      tableSelectionStatus: {
        confirm: true,
        cancal: true
      },
      formOption: null,
      groupList: [],
      companyValue: '2',
      searchIpt: '',
      MainSortData: {
        groupList: []
      },
      checkedCompany: '',
      pageQuery: {
        pageSize: 10,
        pageNo: 1,
        allotcode: '',
        getMerchantId: '',
        orderName: '',
        orderType: ''
      },
      pageTotal: 0,
      tableLoading: false
    }
  },
  computed: {
    ...mapState({
      XToken: state => state.user.token
    })
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
        ...this.pageQuery
      }
      this.tableLoading = true
      assetTransferList(params).then(res => {
        if (res.code === 0 && res.data && res.data.items) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(() => {
        this.tableLoading = false
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
      this.handleNavButtonDisable(val.selection)
    },
    handleNavButtonDisable(arr) {
      let tobeconfirm = false
      let confirmed = false
      let cancal = false

      arr.forEach(item => {
        if (item.statusId === 0) {
          tobeconfirm = true
        } else if (item.statusId === 1) {
          confirmed = true
        } else if (item.statusId === 2) {
          cancal = true
        }
      })
      if (tobeconfirm && !confirmed && !cancal) {
        this.tableSelectionStatus.confirm = false
        this.tableSelectionStatus.cancal = true
        return
      }

      if (confirmed && !tobeconfirm && !cancal) {
        this.tableSelectionStatus.confirm = true
        this.tableSelectionStatus.cancal = false
        return
      }

      if (cancal && !tobeconfirm && !confirmed) {
        this.tableSelectionStatus.confirm = true
        this.tableSelectionStatus.cancal = true
        return
      }

      this.tableSelectionStatus = {
        confirm: true,
        cancal: true
      }
    },
    // Fn: 全选
    handleSelectionAll(val) {
      this.tableSelection = val.selection
      this.tableSelectionKeys = this.selection2keys(this.tableSelection)
      this.handleNavButtonDisable(val.selection)
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
      this.$confirm('是否确认该调拨?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
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
            this.$message({ type: 'error', message: '调拨失败，' + res.msg })
          }
        }).catch(err => {
          console.log('err', err)
          this.$message({ type: 'error', message: '调拨失败，' + err })
        }).finally(() => {
          this.tableSelectionStatus = {
            confirm: true,
            cancal: true
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消调拨'
        })
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
          this.$message({ type: 'error', message: '取消调拨失败，' + res.msg })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '取消调拨失败，' + err })
      }).finally(() => {
        this.tableSelectionStatus = {
          confirm: true,
          cancal: true
        }
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
          this.modalType === 'new' ? this.pageQuery.pageNo = 1 : null
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
    companyTreeClick(item) {
      this.pageQuery.allotcode = ''
      this.searchIpt = ''
      this.pageQuery.getMerchantId = item.groupId
      this.checkedCompany = item.groupName
      this.$refs.statusDrop.hide()
      this.getList()
    },
    searchList() {
      // if (!this.searchIpt) {
      //   this.$message({ type: 'warning', message: '请输入搜索单号' })
      //   return
      // }

      this.pageQuery = {
        pageSize: 10,
        pageNo: 1,
        allotcode: this.searchIpt,
        getMerchantId: '',
        orderName: '',
        orderType: ''
      }
      this.getList()
    },
    clearNavSearch() {
      this.pageQuery = {
        pageSize: 10,
        pageNo: 1,
        allotcode: '',
        getMerchantId: '',
        orderName: '',
        orderType: ''
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
    },
    exportAllAsset() {
      const query = {
        ...this.pageQuery
      }
      delete query.pageNo
      delete query.pageSize

      const fd = new FormData()
      for (const key in query) {
        fd.append(key, query[key])
      }
      const postUrl = process.env.NODE_ENV === 'development' ? '/dev-api/sys/allot/export' : '/sys/allot/export'
      axios({
        method: 'post',
        url: postUrl,
        data: fd,
        headers: {
          'X-Token': this.XToken
        },
        responseType: 'blob'
      })
        .then(res => {
          const file = new FileReader()
          const that = this

          file.onload = function() {
            try {
              const resData = JSON.parse(this.result)
              console.log('resData', resData)
              that.$message({ type: 'error', message: '导出失败，' + resData.msg })
            } catch (err) {
              if (window.navigator.msSaveOrOpenBlob) {
                try {
                  const blobObject = new Blob([res.data])
                  window.navigator.msSaveOrOpenBlob(blobObject)
                } catch (e) {
                  console.log(e)
                }
                return
              }
              const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
              const link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              // link.download = '导出资产'
              document.body.appendChild(link)
              link.click()
            }
          }
          file.readAsText(res.data)
        })
        .catch(error => {
          console.log('error', error)
        })
    }
  }
}
</script>

<style  scoped>
.vxetable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}
</style>

