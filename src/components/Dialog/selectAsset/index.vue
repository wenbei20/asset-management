<template>
  <div class="dialogSelectAsset">
    <div :style="{ margin: '10px 0' }">
      <el-button plain @click="selectAsset">选择资产</el-button>
      <el-button :disabled="!assetTableData.length" @click="deleteAsset">删除所选</el-button>
    </div>
    <vxe-table
      ref="xTree"
      resizable
      highlight-hover-row
      :auto-resize="true"
      class="vxetable"
      :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
      :data="assetTableData"
      @checkbox-all="handleSelectionAll"
      @checkbox-change="handleSelectionChange"
    >
      <vxe-table-column type="checkbox" width="40" :resizable="false" />
      <vxe-table-column field="imageList" title="照片" width="100">
        <!-- <template slot-scope="scope">
          <tempalte v-if="(scope.row.imageList || []).length">
            <el-image
              v-for="image in scope.row.imageList"
              :key="image.url"
              style="width: 50px; height: 50px"
              :src="url"
              :fit="fit"
            />
          </tempalte>
        </template> -->
        <template #default="{ row }">
          <span v-if="!row.imageList || row.imageList.length === 0" class="innerTree_noimages">暂无</span>
          <svg-icon v-else icon-class="tupian" style="height:36px;width:36px;" />
        </template>
      </vxe-table-column>
      <vxe-table-column field="statusName" width="100" title="状态">
        <template #default="{ row }">
          <span class="statuspan" :class="row.status | statusClass">{{ row.status }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="assetcode" title="资产编号" />
      <vxe-table-column field="assetname" title="资产名称" />
      <vxe-table-column field="guizeNo" title="规格型号" />
      <vxe-table-column field="snNo" title="SN号" />
      <vxe-table-column field="groupName" title="所属公司" />
      <vxe-table-column field="posname" title="存放地点" />
    </vxe-table>

    <!--第二个弹出框选择资产-->
    <el-dialog
      width="1200px"
      title="选择资产"
      :visible.sync="innerVisible"
      :destroy-on-close="true"
      append-to-body
    >
      <vxe-table
        ref="xTree"
        v-loading="innerTableLoading"
        resizable
        highlight-hover-row
        class="vxetable"
        row-id="assetId"
        :auto-resize="true"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="innerTableData"
        :checkbox-config="{ checkRowKeys: innerTableSelectionKeys }"
        @checkbox-all="innerSelectionAll"
        @checkbox-change="innerSelectionChange"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="imageList" title="照片" width="100">
          <!-- <template slot-scope="scope">
            <el-image
              v-for="image in scope.row.imageList"
              :key="image.url"
              style="width: 50px; height: 50px"
              :src="url"
              :fit="fit"
            />
          </template> -->
          <template #default="{ row }">
            <span v-if="!row.imageList || row.imageList.length === 0" class="innerTree_noimages">暂无</span>
            <svg-icon v-else icon-class="tupian" style="height:36px;width:36px;" />
          </template>
        </vxe-table-column>
        <vxe-table-column field="statusName" width="100" title="状态">
          <template #default="{ row }">
            <span class="statuspan" :class="row.status | statusClass">{{ row.status }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="assetcode" title="资产编号" />
        <vxe-table-column field="assetname" title="资产名称" />
        <vxe-table-column field="guizeNo" title="规格型号" />
        <vxe-table-column field="snNo" title="SN号" />
        <vxe-table-column field="groupName" title="所属公司" />
        <vxe-table-column field="posname" title="存放地点" />
      </vxe-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="innerPageTotal"
        @current-change="ChangeInnerTablePage"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerCancel">取 消</el-button>
        <el-button type="primary" @click="innerConfirm">确定添加</el-button>
      </div>
    </el-dialog>
    <!--/第二个弹出框选择资产 over-->
  </div>
</template>

<script>
export default {
  // 资产选择组件
  name: 'DialogSelectAsset',
  filters: {
    statusClass(e) {
      switch (e) {
        case '在库':
          return 'zaik'
        case '在运':
          return 'zaiy'
        case '闲置':
          return 'xianz'
        case '维修':
          return 'weix'
        case '报废':
          return 'baof'
        case '退运':
          return 'tuiy'
        default :
          return ' '
      }
    }
  },
  props: {
    assetSelected: {
      type: Array,
      default: () => []
    },
    queryAssetList: {
      type: Function,
      default: () => {}
    },
    isSelectedToREfresh: {
      type: String,
      default: ''
    },
    merchantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerVisible: false,
      // 外层选中资产列表
      pageNo: 1,
      pageSize: 10,
      assetTableData: [],
      assetTableSelection: [],
      assetTableSelectionKeys: [],
      // 内层全部资产列表
      innerPageNo: 1,
      innerPageSize: 10,
      innerPageTotal: 0,
      innerTableData: [],
      innerTableSelection: [],
      innerTableSelectionKeys: [],
      innerTableLoading: false
    }
  },
  watch: {
    assetSelected: {
      handler(val) {
        this.assetTableData = val
      },
      deep: true
    }
  },
  created() {
    this.assetTableData = this.assetSelected
  },
  mounted() {
    if (!this.isSelectedToREfresh) {
      this.queryAssetListFunction()
    }
  },
  methods: {
    ChangeInnerTablePage(item) {
      this.pageNo = item
      this.queryAssetListFunction()
    },
    // Fn: 获取新增页面资产列表
    queryAssetListFunction() {
      this.innerTableLoading = true

      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (this.merchantId) params.useMerchantId = this.merchantId
      this.queryAssetList(params).then((res) => {
        if (res.code === 0 && res.data && res.data.items) {
          this.innerTableData = res.data.items
          this.innerPageTotal = res.data.total
        }
      })
        .catch((err) => { console.log('err', err) })
        .finally(() => {
          this.innerTableLoading = false
        })
    },
    // Fn: 多选项转成id数组
    selection2keys(selection) {
      return selection.map((item) => item.assetId)
    },
    // Fn: 选择资产
    selectAsset() {
      if (this.isSelectedToREfresh) {
        if (!this.merchantId) {
          this.$message({ type: 'warning', message: '请先选择' + this.isSelectedToREfresh })
          return
        }

        this.queryAssetListFunction()
      }
      this.innerVisible = true
    },
    // Fn: 删除资产
    deleteAsset() {
      if (!this.assetTableSelection.length) {
        this.$message({
          showClose: true,
          message: '请至少选择一项资源，才能进行删除！',
          type: 'warning'
        })
        return
      }
      const selectionKeys = this.assetTableSelection.map((item) => item.assetId)
      // 内层模态框table选中项
      this.innerTableSelection = this.assetTableData.filter((item) => !selectionKeys.includes(item.assetId))
      this.innerTableSelectionKeys = this.selection2keys(this.innerTableSelection)
      // 外层table剩余项
      this.assetTableData = this.assetTableData.filter((item) => !selectionKeys.includes(item.assetId))
      this.$emit('changeAssetSelected', this.assetTableData)
    },
    // Fn: 多选
    handleSelectionChange(val) {
      this.assetTableSelection = val.selection
      this.assetTableSelectionKeys = this.selection2keys(this.assetTableSelection)
    },
    // Fn: 全选
    handleSelectionAll(val) {
      this.assetTableSelection = val.selection
      this.assetTableSelectionKeys = this.selection2keys(this.assetTableSelection)
    },
    // Fn: 取消模态框（内层模态框）
    innerCancel() {
      this.innerVisible = false
    },
    // Fn: 确认（内层模态框）
    innerConfirm() {
      this.innerTableSelection.forEach(ele => {
        const idx = this.assetTableData.findIndex(item => ele.assetId === item.assetId)
        if (idx === -1) {
          this.assetTableData.push(ele)
        }
      })

      // this.assetTableData = [...this.innerTableSelection, ...this.assetTableData]
      this.innerVisible = false
      this.$emit('changeAssetSelected', this.assetTableData)
    },
    // Fn: 多选（内层模态框）
    innerSelectionChange(val) {
      this.innerTableSelection = val.selection
      this.innerTableSelectionKeys = this.selection2keys(this.innerTableSelection)
    },
    // Fn: 全选（内层模态框）
    innerSelectionAll(val) {
      this.innerTableSelection = val.selection
      this.innerTableSelectionKeys = this.selection2keys(this.innerTableSelection)
    },
    clearOptions() {
      this.assetTableData = []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
