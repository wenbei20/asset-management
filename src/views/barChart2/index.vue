<template>
  <div class="app-container">
    <div class="title">公司部门数据统计分析</div>
    <div class="subTitle">公司部门数据统计分析</div>
    <div v-if="barChartVisible" id="myChart" ref="myChart" style="width: 100%; height: calc(100vh - 150px);" />
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
import { getGssy } from '@/api/home.js'
export default {
  name: 'BarChart2',
  data() {
    return {
      barChartVisible: true,
      myChart: null,
      option1: {
            toolbox: {
              show : true,
              feature : {
                  mark : {show: false},
                  dataView : {show: false, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: false},
                  saveAsImage : {show: true}
              }
          },
        xAxis: {
          type: 'value',
          offset: 10,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#ccc',
            fontSize: 14
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [{
          data: [],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(0, 0, 0, .05)',
            barBorderRadius: 10
          },
          itemStyle: {
            normal: {
              color: (params) => {
                const colors = this.color
                return colors[params.dataIndex % this.color.length]
              },
              barBorderRadius: 10
            }
          }
        }]
      },
      option2: {
        xAxis: {
          type: 'value',
          offset: 10,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#ccc',
            fontSize: 14
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: ['二级1', '二级2', '二级3', '二级4', '二级5', '二级6', '二级7'],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [{
          data: [130, 110, 70, 80, 150, 200, 120],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: '#f9f9f9',
            barBorderRadius: 10
          },
          itemStyle: {
            normal: {
              color: (params) => {
                const colors = this.color
                return colors[params.dataIndex % this.color.length]
              },
              barBorderRadius: 10
            }
          }
        }]
      },
      tableData: [],
      color: ['#324aa5', '#ed7d31', '#a5a5a5', '#ffc000'],
      arr: []
    }
  },
  mounted() {
    this.getGssy('')
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    drawChart() {
      // 绘制图表
      this.myChart = this.$echarts.init(this.$refs.myChart)
      this.myChart.off('click') 
      this.myChart.setOption(this.option1)
      this.clickChart()
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },
    getGssy(group_id) {
      // this.option4.series[0].data=[]
      getGssy({ 'groupId': group_id }).then(response => {
        const xdata = []
        const sdata = []

        this.arr = response.data.compCount
        console.log(response.data.compCount)

        response.data.compCount.forEach(function(item) {
          xdata.push(item.group_name)
          sdata.push(item.group_num)
        })

        this.option1.series[0].data = sdata
        this.option1.yAxis.data = xdata
        this.drawChart()
      })
    },
    // 图表点击下钻
    clickChart() {

      this.myChart.on('click', params => {
        console.log(72, params)
        if(this.arr[params.dataIndex].group_pid!=='0'){
          this.getGssy(this.arr[params.dataIndex].group_id)
        }else{
          const xdata = []
          const sdata = []
          this.option1.series[0].data = sdata
          this.option1.yAxis.data = xdata
          this.drawChart()
        }
        
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title{ font-size: 28px; line-height: 1.8; font-weight: 600; color: #324aa5; text-align: center;}
.subTitle{ font-size: 14px; line-height: 1.5; color: #999; text-align: center;}
</style>
