<template>
  <div class="dialogSelectAsset">
    <div :style="{ margin: '10px 0' }">
      <el-button plain @click="selectAsset">选择资产</el-button>
      <el-button :disabled="!this.assetTableData.length" @click="deleteAsset">删除所选</el-button>
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
      <vxe-table-column field="imageList" title="照片">
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
      :total="pageTotal"
    />
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
        resizable
        highlight-hover-row
        class="vxetable"
        row-id="assetId"
        :auto-resize="true"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="innerTableData"
        :checkbox-config="{ checkRowKeys: this.innerTableSelectionKeys }"
        @checkbox-all="innerSelectionAll"
        @checkbox-change="innerSelectionChange"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="imageList" title="照片">
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
  props: {
    assetSelected: {
      type: Array,
      default: () => []
    },
    queryAssetList: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      innerVisible: false,
      // 外层选中资产列表
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      assetTableData: [],
      assetTableSelection: [],
      assetTableSelectionKeys: [],
      // 内层全部资产列表
      innerPageNo: 1,
      innerPageSize: 10,
      innerPageTotal: 0,
      innerTableData: [],
      innerTableSelection: [],
      innerTableSelectionKeys: []
    }
  },
  created() {
    this.assetTableData = this.assetSelected
    // console.log(134, this.assetTableData)
  },
  mounted() {
    this.queryAssetListFunction()
  },
  methods: {
    // Fn: 获取新增页面资产列表
    queryAssetListFunction() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.queryAssetList(params).then((res) => {
        if (res.code === 0 && res.data && res.data.items) {
          this.innerTableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => { console.log('err', err) })
    },
    // Fn: 多选项转成id数组
    selection2keys(selection) {
      return selection.map((item) => item.assetId)
    },
    // Fn: 选择资产
    selectAsset() {
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
      this.assetTableData = [...this.innerTableSelection]
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
