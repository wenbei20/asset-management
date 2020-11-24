<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <el-button disabled icon="el-icon-setting" :style="{ marginLeft: '10px' }">开始维修</el-button>
      <el-button :disabled="!tableSelection.length" icon="el-icon-setting" @click="handleFinish">完成维修</el-button>

    </el-row>
    <!-- <el-row style="padding-top:20px;">
      <el-card shadow="never" body-style="padding: 10px;">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
        <el-button size="small" disabled icon="el-icon-setting" :style="{ marginLeft: '10px' }">开始维修</el-button>
        <el-button size="small" :disabled="!tableSelection.length" icon="el-icon-setting" @click="handleFinish">完成维修</el-button>
        <el-button size="small" icon="el-icon-printer">打印</el-button>
      </el-card>
    </el-row> -->
    <el-card shadow="never" body-style="padding: 10px; min-height: calc(100vh - 160px)" style="margin-top:10px;">
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        stripe
        class="vxetable"
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
        border
        @checkbox-all="handleSelectionAll"
        @checkbox-change="handleSelectionChange"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="repaircode" title="维修单号" width="240" />
        <vxe-table-column field="fee" title="维修花费" />
        <vxe-table-column field="dataStatus" title="状态" />
        <vxe-table-column field="repairdate" title="修理日期" />
        <vxe-table-column field="userId" title="处理人" />
        <vxe-table-column field="name" title="报修人" />
        <vxe-table-column field="content" title="维修内容" />
        <vxe-table-column field="memo" title="备注" />
        <vxe-table-column field="assetCash" title="资产费用" />
        <vxe-table-column field="options" title="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" plain @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-card>
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
import { queryAssetRepairList, saveAssetRepair, endAssetRepair, getAssetRepair, updateAssetRepair, deleteAssetRepair } from '@/api/assetManage'
import addDialog from './components/addnew'
export default {
  name: 'AssetMaintenanceManage',
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
      queryAssetRepairList(params).then((res) => {
        if (res.code === 0 && res.data) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => { console.log('err', err) })
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
    },
    // Fn: 完成维修
    handleFinish() {
      endAssetRepair(this.tableSelectionKeys).then((res) => {
        if (res.code === 0) {
          this.getList()
        }
      })
        .catch((err) => { console.log('err', err) })
    },
    // Fn: 修改
    handleEdit(item) {
      getAssetRepair(item.repairId).then((res) => {
        if (res.code === 0) {
          const { repair, repairAssetList, repairPicList } = res.data
          this.modalType = 'edit'
          this.formOption = {
            formData: repair,
            imagesList: repairPicList,
            assetList: repairAssetList
          }
          this.showAddDialog = true
        }
      })
    },
    // Fn: 删除
    handleDelete(item) {
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
      return this.modalType === 'new' ? saveAssetRepair(params) : updateAssetRepair(params, id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
