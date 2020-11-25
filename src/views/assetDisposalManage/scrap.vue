<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <el-button icon="el-icon-refresh" :disabled="!tableSelection.length" @click="revert">还原</el-button>
      <el-button type="default" icon="el-icon-receiving" plain :style="{ marginLeft: '5px' }" @click="handleExport">
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
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionAll"
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
        <vxe-table-column field="discardcode" title="报废单号" />
        <vxe-table-column field="operdatetime" title="清理日期" />
        <vxe-table-column field="reguserId" title="清理人" />
        <vxe-table-column field="merchantId" title="业务所属单位" />
        <vxe-table-column field="memo" title="清理说明" />
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-row>
    <add-dialog
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
import addDialog from './components/addScrap'
import axios from 'axios'
import { mapState } from 'vuex'
import { assetDiscardBaseCode, queryAssetDiscardList, assetDiscardReturn, getDiscardInfo, deleteAssetDiscard, saveDiscardInfo, updateDiscardInfo } from '@/api/assetManage'
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
      isAllExpand: false,
      showAddDialog: false,
      selection: [],
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      MainSortData: {},
      formOption: null,
      modalType: '',
      tableSelection: []
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
    handleNew() {
      this.modalType = 'new'
      this.showAddDialog = true
      this.$nextTick(() => {
        this.$refs.AddDialog && this.$refs.AddDialog.clearAllOptions()
      })
    },
    // Fn: 资产调拨新增和修改页面中的码表接口
    getBaseCode() {
      assetDiscardBaseCode().then(res => {
        if (res.code === 0 && res.data) {
          for (const key in res.data) {
            this.$set(this.MainSortData, key, res.data[key])
          }
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // Fn: 资源报废列表
    getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryAssetDiscardList(params).then((res) => {
        if (res.code === 0 && res.data) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      }).catch((err) => { console.log('err', err) })
    },
    // 还原
    revert() {
      const checkedArr = this.$refs.xTree.getCheckboxRecords()
      if (!checkedArr.length) {
        this.$message({ type: 'warning', message: '请勾选需要还原的报废单' })
        return
      }
      const query = {
        discardIds: checkedArr.map(ele => ele.discardId).join(',')
      }
      assetDiscardReturn(query)
        .then((res) => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '还原成功' })
            this.pageNo = 1
            this.getList()
          } else {
            this.$message({ type: 'error', message: '还原失败，请稍后再试' })
          }
        })
        .catch((err) => {
          console.log('err', err)
          this.$message({ type: 'success', message: '还原失败，请稍后再试' })
        })
    },

    handleSelectionChange(val) {
      this.tableSelection = val.selection
      this.tableSelectionKeys = this.selection2keys(this.tableSelection)
    },
    selection2keys(selection) {
      return selection.map((item) => item.lendreId)
    },
    handleEdit(item) {
      getDiscardInfo(item.discardId).then((res) => {
        if (res.code === 0) {
          const { discard, discardAssetList = [] } = res.data
          this.modalType = 'edit'
          this.formOption = {
            formData: discard,
            assetList: discardAssetList,
            discardId: item.discardId
          }
          this.showAddDialog = true
        }
      })
    },
    submitMethods(params, id) {
      const promise = this.modalType === 'new' ? saveDiscardInfo(params) : updateDiscardInfo(params, id)
      const msg = this.modalType === 'new' ? '新增' : '编辑'
      promise.then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: msg + '报废成功' })
          this.modalType === 'new' ? this.pageNo = 1 : null
          this.getList()
        } else {
          this.$message({ type: 'error', message: msg + '报废失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: msg + '报废失败，请稍后再试' })
      }).finally(() => {
        this.showAddDialog = false
      })
    },
    handleDelete(item) {
      this.$confirm('此操作将永久删除该资产退运, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAssetDiscard(item.discardId).then((res) => {
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
    handleExport() {
      const postUrl = process.env.NODE_ENV === 'development' ? '/dev-api/sys/discard/export' : '/sys/discard/export'
      if (!this.XToken) return
      axios({
        method: 'post',
        url: postUrl,
        headers: {
          'X-Token': this.XToken
        },
        responseType: 'blob'
      })
        .then(res => {
          console.log('response: ', res)
          const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          // link.download = '导出资产'
          document.body.appendChild(link)
          link.click()
        })
        .catch(error => {
          console.log('error', error)
        })
    },
    // Fn: 全选
    handleSelectionAll(val) {
      this.tableSelection = val.selection
      this.tableSelectionKeys = this.selection2keys(this.tableSelection)
    }
  }
}
</script>
<style  scoped>
.vxetable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}
</style>

