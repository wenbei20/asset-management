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
      <vxe-table-column type="checkbox" width="40" :resizable="false" />
      <vxe-table-column field="merchantName" title="使用部门" />
      <vxe-table-column field="sumMoney" title="金额" />
      <vxe-table-column field="countNum" title="数量" />
      <vxe-table-column field="checkedFlag" :formatter="stateFormat" title="是否盘点"></vxe-table-column>

    </vxe-table>
  </div>
</template>

<script>
import { getList } from '@/api/analysis.js'
export default {
  name: 'StatisticalAnalysis',
  data() {
    return {
      tableData: [
        
      ]
    }
  },
  mounted() {
    this.getData()

  },
   methods: {
     getData(){
      getList().then(response => {
        this.tableData=response.data
      })
    },
    stateFormat(row, column) {
    if (row.checkedFlag === 0) {
        return '否'
      } else  {
        return '是'
      } 
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
