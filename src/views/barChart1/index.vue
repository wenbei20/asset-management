<template>
  <div class="app-container">
    <div v-if="barChartVisible" id="myChart" ref="myChart" style="width: 100%; height: calc(100vh - 100px);" />
    <div v-else>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="zc1" label="资产1" />
        <el-table-column prop="zc2" label="资产2" />
        <el-table-column prop="zc3" label="资产3" />
        <el-table-column prop="zc4" label="资产4" />
        <el-table-column prop="zc5" label="资产5" />
        <el-table-column prop="zc6" label="资产6" />
        <el-table-column prop="zc7" label="资产7" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getZcfl } from '@/api/home.js'
export default {
  name: 'BarChart1',
  data() {
    return {
      barChartVisible: true,
      myChart: null,
      option1: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'bar',
          showBackground: false,
          itemStyle: {
            normal: {
              color: (params) => {
                const colors = ['#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#4a5bdc', '#4cd698']
                return colors[params.dataIndex]
              }
            }
          }
        }]
      },
      tableData: [],
      arr: []
    }
  },
  mounted() {
    this.getZcfl('')
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    drawChart() {
      // 绘制图表
      this.myChart = this.$echarts.init(this.$refs.myChart)
      this.myChart.setOption(this.option1)
      this.clickChart()
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },
    getZcfl(assetkindId) {
      // this.option4.series[0].data=[]
      getZcfl({ 'groupId': assetkindId }).then(response => {
        const xdata = []
        const sdata = []
        this.arr = response.data.propAssetsCount
        response.data.propAssetsCount.forEach(function(item) {
          xdata.push(item.assetkind_name)

          sdata.push(item.count_num)
        })

        this.option1.series[0].data = sdata
        this.option1.xAxis.data = xdata
        this.drawChart()
      })
    },
    // 图表点击下钻
    clickChart() {
      this.myChart.on('click', params => {
        console.log(72, params.dataIndex)
        console.log(this.arr[params.dataIndex].assetkind_id)
        this.getZcfl(this.arr[params.dataIndex].assetkind_id)
        // if (params.name.includes('资产')) {
        // this.drawChart(this.option2)
        // } else if (params.name.includes('二级')) {
        // this.barChartVisible = false
        // }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
