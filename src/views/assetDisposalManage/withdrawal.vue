<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <!-- <el-button type="default" icon="el-icon-printer" plain @click="handlePrint">打印</el-button> -->
      <el-button icon="el-icon-receiving" @click="handleExport">导出</el-button>
    </el-row>
    <el-row style="padding-top:20px;">
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        stripe
        class="vxetable"
        :tree-config="{children: 'children',iconOpen: 'el-icon-remove-outline', iconClose: 'el-icon-circle-plus-outline',expandAll:true}"
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
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
        <vxe-table-column field="regUserId" title="退库处理人" />
        <vxe-table-column field="operdatetime" title="实际退库时间" />
        <vxe-table-column field="useMerchantId" title="业务所属单位" />
        <vxe-table-column field="status" title="退库后使用公司" />
        <vxe-table-column field="posname" title="退库后区域" />
        <vxe-table-column field="areaId" title="退库后存放地点" />

        <vxe-table-column field="memo" title="退库说明" />

        <!-- <vxe-table-column title="操作">
          <template slot-scope="scope">
            <el-button size="small" plain @click="handleEdit(scope.row)">编辑</el-button>
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
      :visible.sync="showAddDialog"
      :modal-type="modalType"
      :form-option="formOption"
      :main-sort-data="MainSortData"
      :group-list="groupList"
      @submit-form="submitForm"
    />
  </div>
</template>
<script>
import { queryAssetBackList, assetBackBaseCode, exportAssetBack, getAssetBack, saveAssetBack, updateAssetBack, deleteAssetBack } from '@/api/assetManage'
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
      isAllExpand: false,
      showAddDialog: false,
      modalType: 'new',
      groupList: [],
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      tableSelection: [],
      tableSelectionKeys: [],
      formOption: null,
      MainSortData: {}
    }
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
    getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryAssetBackList(params).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => {
          console.log('err', err)
        })
    },
    // Fn: 新建
    handleNew() {
      this.modalType = 'new'
      this.showAddDialog = true
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
      exportAssetBack().then((res) => {
        console.log(409, res)
      })
    },
    submitForm(params, id) {
      this.submitMethods(params, id)
    },
    submitMethods(params, id) {
      const promise = this.modalType === 'new' ? saveAssetBack(params) : updateAssetBack(params, id)
      const msg = this.modalType === 'new' ? '新增' : '编辑'
      promise.then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: msg + '退运成功' })
          this.pageNo = 1
        } else {
          this.$message({ type: 'error', message: msg + '退运失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: msg + '退运失败，请稍后再试' })
      }).finally(() => {
        this.showAddDialog = false
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
