<template>
  <div class="app-container">
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

      <vxe-table-column field="checkcode" title="盘点单号" />
      <vxe-table-column field="checkname" title="盘点名称" />
      <vxe-table-column field="checktime" title="盘点时间" />
      <vxe-table-column field="taskQty" title="盘点任务量" />
      <vxe-table-column field="taskCheck" title="已盘点任务量" />
      <vxe-table-column field="taskPy" title="盘盈量" />
      <vxe-table-column field="taskPk" title="盘亏量" />

    </vxe-table>
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      style="text-align:right;margin-top:20px;"
      :total="pageLogTotal"
    />
  </div>
</template>

<script>
import { listCheckCollect } from '@/api/analysis.js'
export default {
  name: 'StatisticalAnalysis',
  data() {
    return {
      tableData: [

      ],
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      const { pageLogNo, pageLogSize } = this
      const params = { ...this.requestParams, pageLogNo, pageLogSize }
      listCheckCollect(params).then(response => {
        this.tableData = response.data.items
        this.pageTotal = response.data.total
        this.pageSize = response.data.limit
        this.pageNo = response.data.page
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
