<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog=true">新建</el-button>
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
      <el-button disabled icon="el-icon-setting" :style="{ marginLeft: '10px' }">开始维修</el-button>
      <el-button disabled icon="el-icon-setting">完成维修</el-button>
      <el-button icon="el-icon-printer">打印</el-button>

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
        <vxe-table-column field="eventID" title="维修单号" />
        <vxe-table-column field="diedai" title="维修花费" />
        <vxe-table-column field="status" title="状态" />
        <vxe-table-column field="date" title="修理日期" />
        <vxe-table-column field="person" title="处理人" />
        <vxe-table-column field="name" title="报修人" />
        <vxe-table-column field="title" title="维修内容" />
        <vxe-table-column title="备注">
          <template #default>
            --
          </template>
        </vxe-table-column>
        <vxe-table-column field="assetCash" title="资产费用" />
        <vxe-table-column field="options" title="操作">
          <el-button size="small" plain>修改</el-button>
          <el-button size="small" plain>删除</el-button>
        </vxe-table-column>
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
      @submit-form="submitForm"
    />
  </div>
</template>

<script>
import { queryAssetRepairList, saveAssetRepair, updateAssetRepair } from '@/api/assetManage'
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
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 资源维修列表
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
    // 确认提交（新建/修改）
    submitForm(params, id) {
      console.log('外层 submitForm', params, id)
      this.submitMethods(params, id).then((res) => {
        console.log('348 res', res)
      })
        .catch((err) => { console.log('err', err) })
    },
    // 确认提交方法
    submitMethods(params, id) {
      return this.modalType === 'new' ? saveAssetRepair(params) : updateAssetRepair(params, id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
