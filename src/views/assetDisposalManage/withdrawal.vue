<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="companyValue" placeholder="请选择搜索类别" style="padding:0 6px 0 0;width: 160px;">
        <el-option label="退运单号" value="2" />
        <el-option label="退运后使用单位" value="3" />
      </el-select>
      <el-dropdown v-if="companyValue === '3'" ref="statusDrop" trigger="click" placement="bottom-start" style="margin-right:20px;">
        <el-input v-model="checkedCompany" placeholder="请选择退运后使用单位" clearable @clear="clearNavSearch" />

        <el-dropdown-menu slot="dropdown" class="innerTreeForDepart" style="min-width:200px;">
          <el-tree
            ref="companyTree"
            node-key="groupId"
            :props="{children: 'children',label: 'groupName'}"
            :data="MainSortData.groupList"
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
        placeholder="退运单号"
        clearable
        @clear="clearNavSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <!-- <el-button type="default" icon="el-icon-printer" plain @click="handlePrint">打印</el-button> -->
      <el-button icon="el-icon-receiving" @click="handleExport">导出</el-button>
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
        :sort-config="{remote:true}"
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
        @sort-change="sortChangeEvent"
      >
        <!-- <vxe-table-column type="checkbox" width="40" :resizable="false" /> -->
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
        <vxe-table-column field="regUserId" title="退运处理人" />
        <vxe-table-column field="operdatetime" title="实际退运时间" sortable />
        <vxe-table-column field="merchantId" title="业务所属单位" />
        <vxe-table-column field="useMerchantId" title="退运后使用单位" />
        <vxe-table-column field="posname" title="退运后区域" />
        <vxe-table-column field="areaId" title="退运后存放地点" />

        <vxe-table-column field="memo" title="退运说明" />

        <!-- <vxe-table-column title="操作">
          <template slot-scope="scope">
            <el-button size="small" plain @click="handleEdit(scope.row)">编辑</el-button>
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
      :main-sort-data="MainSortData"
      @submit-form="submitMethods"
    />
  </div>
</template>
<script>
import { queryAssetBackList, assetBackBaseCode, getAssetBack, saveAssetBack, updateAssetBack, deleteAssetBack } from '@/api/assetManage'
import addDialog from './components/addNewDialog'
import Pagination from '@/components/Pagination'
import axios from 'axios'
import { mapState } from 'vuex'
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
      isAllExpand: false,
      showAddDialog: false,
      modalType: 'new',
      groupList: [],
      pageTotal: 0,
      tableData: [],
      tableSelection: [],
      tableSelectionKeys: [],
      formOption: null,
      companyValue: '2',
      searchIpt: '',
      MainSortData: {
        groupList: []
      },
      checkedCompany: '',
      checkedGroupId: '',
      pageQuery: {
        pageSize: 10,
        pageNo: 1,
        backcode: '',
        useMerchantId: '',
        orderName: '',
        orderType: ''
      },
      tableLoading: false
    }
  },
  computed: {
    ...mapState({
      XToken: state => state.user.token

    })

  },
  mounted() {
    this.getBaseCode()
    this.getList()
  },
  methods: {
    // Fn: 资产调拨新增和修改页面中的码表接口
    getBaseCode() {
      assetBackBaseCode().then(res => {
        if (res.code === 0 && res.data) {
          for (const key in res.data) {
            this.$set(this.MainSortData, key, res.data[key])
          }
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // Fn: 退运列表信息
    getList(obj) {
      const params = {
        ...this.pageQuery
      }
      this.tableLoading = true
      queryAssetBackList(params).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => {
          console.log('err', err)
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // Fn: 新建
    handleNew() {
      this.modalType = 'new'
      this.showAddDialog = true
      this.$nextTick(() => {
        this.$refs.AddDialog && this.$refs.AddDialog.clearAllOptions()
      })
    },
    // Fn: 修改
    handleEdit(item) {
      getAssetBack(item.backId).then((res) => {
        if (res.code === 0) {
          const { back, backAssetList } = res.data
          this.modalType = 'edit'
          this.formOption = {
            formData: back,
            assetList: backAssetList,
            backId: item.backId
          }
          this.showAddDialog = true
        }
      })
    },
    // Fn: 删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该资产退运, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAssetBack(item.backId).then((res) => {
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
    // Fn: 打印
    handlePrint() {
      console.log('打印')
    },
    // Fn: 导出
    handleExport() {
      const query = {
        ...this.pageQuery
      }
      delete query.pageNo
      delete query.pageSize
      const fd = new FormData()
      for (const key in query) {
        fd.append(key, query[key])
      }
      const postUrl = process.env.NODE_ENV === 'development' ? '/dev-api/sys/back/export' : '/sys/back/export'
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
    },
    submitMethods(params, id) {
      const promise = this.modalType === 'new' ? saveAssetBack(params) : updateAssetBack(params, id)
      const msg = this.modalType === 'new' ? '新增' : '编辑'
      promise.then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: msg + '退运成功' })
          this.modalType === 'new' ? this.pageQuery.pageNo = 1 : null
          this.getList()
        } else {
          this.$message({ type: 'error', message: msg + '退运失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: msg + '退运失败，请稍后再试' })
      }).finally(() => {
        this.showAddDialog = false
      })
    },
    companyTreeClick(item) {
      this.pageQuery.backcode = ''
      this.searchIpt = ''
      this.pageQuery.useMerchantId = item.groupId
      this.checkedCompany = item.groupName
      this.$refs.statusDrop.hide()
      this.getList()
    },
    searchList() {
      if (!this.searchIpt) {
        this.$message({ type: 'warning', message: '请输入搜索单号' })
        return
      }

      this.pageQuery = {
        pageSize: 10,
        pageNo: 1,
        backcode: this.searchIpt,
        useMerchantId: '',
        orderName: '',
        orderType: ''
      }
      this.getList()
    },
    clearNavSearch() {
      this.pageQuery = {
        pageSize: 10,
        pageNo: 1,
        backcode: '',
        useMerchantId: '',
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
    }
  }
}
</script>

<style  scoped>
.vxetable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}
</style>
