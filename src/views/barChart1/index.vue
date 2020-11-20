<template>
  <div class="app-container">
    <div v-if="barChartVisible" id="myChart" ref="myChart" style="width: 100%; height: 600px;" />
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
          data: ['资产1', '资产2', '资产3', '资产4', '资产5', '资产6', '资产7']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
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
      option2: {
        xAxis: {
          type: 'category',
          data: ['二级1', '二级2', '二级3', '二级4', '二级5', '二级6', '二级7']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [130, 110, 70, 80, 150, 200, 120],
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
      tableData: []
    }
  },
  mounted() {

    this.getZcfl()

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
    getZcfl(){
      //this.option4.series[0].data=[]
      getZcfl().then(response => {
          let xdata=[]
          let sdata=[]
          response.data.propAssetsCount.forEach(function (item){
            
            xdata.push(item.assetkind_name)
           
            sdata.push(item.count_num)
          })
          console.log(xdata)
          this.option1.series[0].data=sdata
          this.option1.xAxis.data=xdata
          this.drawChart()
      })
    },
    // 图表点击下钻
    clickChart() {
      this.myChart.on('click', params => {
        console.log(72, params)
        if (params.name.includes('资产')) {
          this.drawChart(this.option2)
        } else if (params.name.includes('二级')) {
          this.barChartVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
