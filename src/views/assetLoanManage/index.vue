<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <el-button :disabled="!tableSelection.length" icon="el-icon-printer" @click="handleReturn">归还</el-button>
      <el-dropdown :style="{ marginLeft: '5px' }">
        <el-button type="default" icon="el-icon-edit" plain>
          编辑<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改</el-dropdown-item>
          <el-dropdown-item>复制</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button icon="el-icon-printer" :style="{ marginLeft: '10px' }">打印</el-button> -->

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
        <vxe-table-column field="dataStatus" title="办理状态" />
        <vxe-table-column field="status" title="状态" />
        <vxe-table-column field="lendrecode" title="借还单号" />
        <vxe-table-column field="userId" title="借用人" />
        <vxe-table-column field="lenddate" title="借出时间" />
        <vxe-table-column field="planReturndate" title="预计归还时间" />
        <vxe-table-column field="returndate" title="归还时间" />
        <!-- <vxe-table-column field="options" title="操作" width="200">
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
      :visible.sync="showAddDialog"
      :modal-type="modalType"
      :form-option="formOption"
      @submit-form="submitForm"
    />
  </div>
</template>

<script>
import { queryAssetLendreList, saveAssetLendre, returnAssetLendre, getAssetLendre, updateAssetLendre, deleteAssetLendre } from '@/api/assetManage'
import addDialog from './components/addnew'
export default {
  name: 'AssetLoanManage',
  components: { addDialog },
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
      formOption: null
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // Fn: 初始化请求参数
    initSetting() {
      this.pageNo = 1
    },
    // Fn: 资源维修列表
    getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryAssetLendreList(params).then((res) => {
        if (res.code === 0 && res.data) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => { console.log('err', err) })
    },
    // Fn: 多选项转成id数组
    selection2keys(selection) {
      return selection.map((item) => item.lendreId)
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
    },
    // Fn: 归还
    handleReturn() {
      returnAssetLendre(this.tableSelectionKeys).then((res) => {
        console.log('121 归还', res)
      })
        .catch((err) => { console.log('err', err) })
    },
    // Fn: 修改
    handleEdit(item) {
      getAssetLendre(item.lendreId).then((res) => {
        console.log('112 getAssetLendre', res)
        if (res.code === 0) {
          const { lendre, lendreAssetList, lendrePicList } = res.data
          this.modalType = 'edit'
          this.formOption = {
            formData: lendre,
            imagesList: lendrePicList,
            assetList: lendreAssetList
          }
          this.showAddDialog = true
        }
      })
    },
    // Fn: 删除
    handleDelete(item) {
      deleteAssetLendre(item.lendreId).then((res) => {
        if (res.code === 0) {
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    // Fn: 确认提交（新建/修改）
    submitForm(params, id) {
      this.submitMethods(params, id).then((res) => {
        this.showAddDialog = false
        if (res.code === 0) {
          this.initSetting()
          this.getList()
        }
      })
        .catch((err) => { console.log('err', err) })
    },
    // Fn: 确认提交方法
    submitMethods(params, id) {
      return this.modalType === 'new' ? saveAssetLendre(params) : updateAssetLendre(params, id)
    }
  }
}
</script>

<style  scoped>
.vxetable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}
</style>
