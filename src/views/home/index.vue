<template>
  <div class="app-container">
    <el-row gutter="20">
      <el-col span="4" v-for="(item, index) in statisGroup" :key="item.name">
        <el-card :class="['statis', `s${index + 1}`]" shadow="never" :body-style="{ padding: 10 }">
          <h4 class="title">{{ item.name }}</h4>
          <p class="count">{{ item.count }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      statisGroup: [
        { name: '报修资产数', count: 0 },
        { name: '待确认调拨单', count: 21 },
        { name: '安全库存警报', count: 5 },
        { name: '待盘点任务数量', count: 0 },
        { name: '资产总数', count: 12 },
        { name: '资产总金额', count: 7 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.statis{ background: url('~@/assets/wave.png') center bottom -50px no-repeat; background-size: auto 100px;
  .title{ margin: 0 0 10px; font-size: 14px; color: rgba(255, 255, 255, .5);}
  .count{ font-size: 30px; line-height: 1.5; margin: 10px 0; color: #fff;}
  &.s1{ background-color: #3c78f9;}
  &.s2{ background-color: #fd4c3a;}
  &.s3{ background-color: #7a46fb;}
  &.s4{ background-color: #388cfd;}
  &.s5{ background-color: #7bc555;}
  &.s6{ background-color: #3cb3f9;}
}
</style>