<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <h4 style="margin: 10px 0;">我的工作台</h4>
          <el-row :gutter="20">
            <el-col v-for="(item, index) in statisGroup" :key="item.name" :span="8" :style="{ marginTop: '20px' }">
              <el-card :class="['statis', `s${index + 1}`]" shadow="never" :body-style="{ padding: 10 }">
                <h4 class="title">{{ item.name }}</h4>
                <p class="count">{{ item.count }}</p>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <h4 style="margin: 10px 0;">资产占比</h4>
            </el-col>
    
          </el-row>
          <div id="myChart1" :style="{width: '100%', height: '300px'}" />
          <div :style="{ textAlign: 'right' }">
            <el-radio-group v-model="radio1" size="mini">
              <el-radio-button label="数量" />
              <el-radio-button label="金额" />
            </el-radio-group>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" :style="{ marginTop: '20px' }">
      <el-col :span="8">
        <el-card>
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <h4 style="margin: 10px 0;">公司使用占比</h4>
            </el-col>
         
          </el-row>
          <div id="myChart2" :style="{width: '100%', height: '300px'}" />
          <div :style="{ textAlign: 'right' }">
            <el-radio-group v-model="radio2" size="mini">
              <el-radio-button label="数量" @click.native="getGssy('num')"/>
              <el-radio-button label="金额" @click.native="getGssy('money')"/>
            </el-radio-group>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <h4 style="margin: 10px 0;">部门使用占比</h4>
            </el-col>
      
          </el-row>
          <div id="myChart3" :style="{width: '100%', height: '300px'}" />
          <div :style="{ textAlign: 'right' }">
            <el-radio-group v-model="radio3" size="mini">
              <el-radio-button label="数量" />
              <el-radio-button label="金额" />
            </el-radio-group>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <h4 style="margin: 10px 0;">资产分类统计</h4>
            </el-col>

          </el-row>
          <div id="myChart4" :style="{width: '100%', height: '300px'}" />
          <div :style="{ textAlign: 'right' }">
            <el-radio-group v-model="radio4" size="mini">
              <el-radio-button label="数量" @click.native="getZcfl('num')"/>
              <el-radio-button label="金额" @click.native="getZcfl('money')"/>
            </el-radio-group>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getData,getZcfl,getGssy,getZczb } from '@/api/home.js'
export default {
  name: 'Home',
  data() {
    return {
      statisGroup: [
        /*{ name: '报修资产数', count: 0 },
        { name: '待确认调拨单', count: 21 },
        { name: '安全库存警报', count: 5 },
        { name: '待盘点任务数量', count: 0 },
        { name: '资产总数', count: 12 },
        { name: '资产总金额', count: 7 }*/
      ],
      selectValue1: 'all',
      radio1: '数量',
      radio2: '数量',
      radio3: '数量',
      radio4: '数量',
      option1: {
        color: ['#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#ccc'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true

        },
        legend: {
          orient: 'vertical',
          right: '5%',
          align: 'left',
          top: 'middle',
          textStyle: {
            color: '#8C8C8C'
          },
          height: 150
        },
        series: [
          {
            name: '资产状态占比',
            type: 'pie',
            radius: [50, 100],
            center: ['40%', '50%'],
            data: [
              /*{ value: 20, name: '闲置' },
              { value: 30, name: '在用' },
              { value: 25, name: '借用' },
              { value: 25, name: '维修中' },
              { value: 20, name: '调拨中' },
              { value: 35, name: '报废' }*/
            ]
          }
        ]
      },
      option2: {
        color: ['#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#ccc'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true

        },
        legend: {
          orient: 'vertical',
          right: '5%',
          align: 'left',
          top: 'middle',
          textStyle: {
            color: '#8C8C8C'
          },
          height: 150
        },
        series: [
          {
            name: '公司使用占比',
            type: 'pie',
            radius: [50, 100],
            center: ['30%', '50%'],
            data: [
              { value: 3, name: '1. 测试公司' }
            ]
          }
        ]
      },
      option3: {
        color: ['#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#ccc'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true

        },
        legend: {
          orient: 'vertical',
          right: '5%',
          align: 'left',
          top: 'middle',
          textStyle: {
            color: '#8C8C8C'
          },
          height: 150
        },
        series: [
          {
            name: '公司使用占比',
            type: 'pie',
            radius: [50, 100],
            center: ['30%', '50%'],
            data: [
              { value: 3, name: '无部门' }
            ]
          }
        ]
      },
      option4: {
        color: ['#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#ccc'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true

        },
        legend: {
          orient: 'vertical',
          right: '5%',
          align: 'left',
          top: 'middle',
          textStyle: {
            color: '#8C8C8C'
          },
          height: 150
        },
        series: [
          {
            name: '业务警种',
            type: 'pie',
            radius: [50, 100],
            center: ['30%', '50%'],
            data: [
              /*{ value: 20, name: '闲置' },
              { value: 30, name: '在用' },
              { value: 25, name: '借用' },
              { value: 25, name: '维修中' },
              { value: 20, name: '调拨中' },
              { value: 35, name: '报废' }*/
            ]
          }
        ]
      }
    }
  },
  created(){

  },
  mounted() {
    this.getData()
    this.getZczb()
    this.getZcfl('num')
    this.getGssy('num')
    this.drawLine('3')

  },
  methods: {
    drawLine(id) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById(`myChart${id}`))
        myChart.showLoading({
        text: '数据正在努力加载...',
        textStyle: { fontSize: 30, color: '#444' },
        effectOption: { backgroundColor: 'rgba(0, 0, 0, 0)' }
      })
      // 绘制图表
      myChart.setOption(this[`option${id}`])
      myChart.hideLoading()
    },
    getData(){
      getData().then(response => {
        this.statisGroup=response.data.everyCount
      })
    },
    getZcfl(type){
      this.option4.series[0].data=[]
      getZcfl().then(response => {
          let zcfl=[]
          response.data.propAssetsCount.forEach(function (item){
            if(type === 'num'){
              zcfl.push({ value: item.count_num,name: item.assetkind_name })
            }else{
              zcfl.push({ value: item.sum_money,name: item.assetkind_name })
            }
            
          })
          this.option4.series[0].data=zcfl
          this.drawLine('4')
      })
    },
    getGssy(type){
      this.option2.series[0].data = [];
      getGssy().then(response => {
          let gssy=[]
          response.data.compCount.forEach(function (item){
            if(type === 'num'){
              gssy.push({ value: item.group_num,name: item.group_name })
            }else{
               gssy.push({ value: item.group_money,name: item.group_name })
            }

          })
          this.option2.series[0].data=gssy
          this.drawLine('2')
      })
    },
    getZczb(){
      getZczb().then(response => {
          let zczb=[]
          response.data.assetStatusCount.forEach(function (item){
            zczb.push({ value: item.count_num,name: item.status_name })
          })
          this.option1.series[0].data=zczb
          this.drawLine('1')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.statis{ background: url('~@/assets/wave.png') center bottom -50px no-repeat; background-size: auto 100px;
  .title{ margin: 0 0 10px; font-size: 15px; color: rgba(255, 255, 255, .5);}
  .count{ font-size: 35px; line-height: 1.66; margin: 10px 0; color: #fff;}
  &.s1{ background-color: #3c78f9;}
  &.s2{ background-color: #fd4c3a;}
  &.s3{ background-color: #7a46fb;}
  &.s4{ background-color: #388cfd;}
  &.s5{ background-color: #7bc555;}
  &.s6{ background-color: #3cb3f9;}
}
</style>
