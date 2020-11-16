<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="newAsset">新建</el-button>
      <el-button disabled icon="el-icon-sort">调入确认</el-button>
      <el-button disabled icon="el-icon-sort">取消调拨</el-button>
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
        :v-loading="tableLoading"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="tableData"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="dataStatus" title="办理状态" />
        <vxe-table-column field="allotcode" title="调拨单号" />
        <vxe-table-column field="operdatetime" title="调出日期" />
        <vxe-table-column field="merchantId" title="调出管理员" />
        <vxe-table-column field="sendMerchantId" title="调出单位" />
        <vxe-table-column field="getMerchantId" title="调入单位" />
        <vxe-table-column field="getUserId" title="调入管理员" />
        <vxe-table-column field="memo" title="调拨说明" />
        <vxe-table-column title="操作">
          <template slot-scope="scope">
            <el-button size="small" icon="el-icon-edit" plain @click="editItem(scope.row)"></el-button>
            <el-button size="small" icon="el-icon-delete" plain @click="deleteItem(scope.row)"></el-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-row>
    <!--新增/修改信息-->
    <addDialog
      :modalType="modalType"
      :visible.sync="showAddDialog"
      :info="currnetDialogData"
      :group-list="groupList"
      :destroy-on-close="true"
    />
  </div>
</template>

<script>
import { assetTransferBaseCode, assetTransferList, queryAssetAllot, deleteAssetAllot } from '@/api/assetManage'
import addDialog from './components/addNewDialog'
import { Message } from 'element-ui'
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
      tableLoading: false,
      initDialogData: { // 初始化弹出框信息
        allotId: "",
        allotcode: "",
        dataStatus: 0,
        getMerchantId: "",
        getUserId: "",
        groupId: null,
        id: 1,
        memo: "",
        merchantId: "",
        operdatetime: "",
        reguserId: "",
        sendMerchantId: "",
        statusId: 0
      },
      currnetDialogData: {}, // 当前弹出框信息
      modalType: 'new',
      requestParams: {
        allotcode: '',
        getMerchantId: '',
        sendMerchantId: '',
        statusId: ''
      },
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      areaList: [],
      groupList: []
    }
  },
  watch: {
    showAddDialog(val) {
      if(!val) {
        this.currnetDialogData = this.initDialogData
      }
    }
  },
  mounted() {
    this.getBaseCode()
    this.getList()
  },
  methods: {
    // 新建资产调拨
    newAsset() {
      this.modalType = 'new'
      this.showAddDialog = true
    },
    // 资产调拨新增和修改页面中的码表接口
    getBaseCode() {
      assetTransferBaseCode().then(res => {
        console.log('res', res)
        if (res.code === 0 && res.data) {
          this.areaList = res.data.areaList
          this.groupList = res.data.groupList
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 查询资产调拨列表
    getList() {
      this.tableLoading = true
      const { pageNo, pageSize } = this;
      const params = { ...this.requestParams, pageNo, pageSize }
      assetTransferList(params).then(res => {
        if (res.code === 0 && res.data && res.data.items) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
          this.pageSize = res.data.limit
          this.pageNo = res.data.page
        }
        this.tableLoading = false
      }).catch(err => {
        console.log('err', err)
        this.tableLoading = false
      })
    },
    // 编辑当前列
    editItem(item) {
      this.modalType = 'edit'
      queryAssetAllot(item.allotId).then((res) => {
        if (res.code === 0) {
          this.currnetDialogData = res.data.allot
          this.showAddDialog = true
        } else {
          Message.warining(res.msg)
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
    },
    // 删除当前列
    deleteItem(item) {
      deleteAssetAllot(item.allotId).then((res) => {
        if (res.code === 0) {
          this.getList();
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
