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
import { getZcfl } from '@/api/home.js'
export default {
  name: 'BarChart1',
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
        grid: {
          right: 100,
          bottom: 100,
          left: 100
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
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
      tableData: [],
      color: ['#324aa5', '#ed7d31', '#a5a5a5', '#ffc000'],
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
      getZcfl({ 'assetKindId': assetkindId }).then(response => {
        const xdata = []
        const sdata = []
     
  
        if(response.data.propAssetsCount!==null && response.data.propAssetsCount.length>0){
             this.arr = response.data.propAssetsCount
            console.log(response.data.propAssetsCount)
            response.data.propAssetsCount.forEach(function(item) {
              xdata.push(item.assetkind_name)

              sdata.push(item.count_num)
            })

            this.option1.series[0].data = sdata
            this.option1.xAxis.data = xdata
    
            this.drawChart()
           
        }else{
           
            this.$message({
                type: 'warning',
                message: "已经是最后一级了",
                duration: 2000
              })
        }
     
      })
    },
    // 图表点击下钻
    clickChart() {
      this.myChart.off('click') 
      this.myChart.on('click', params => {
        //console.log(72, params.dataIndex)
        //console.log(this.arr[params.dataIndex].assetkind_id)

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
.title{ font-size: 28px; line-height: 1.8; font-weight: 600; color: #324aa5; text-align: center;}
.subTitle{ font-size: 14px; line-height: 1.5; color: #999; text-align: center;}
</style>
