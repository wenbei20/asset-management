<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="盘点任务下载" name="taskDownload">
        <el-table
          :data="tableTaskDownload"
          border
          style="width: 100%"
        >
          <el-table-column prop="id" label="盘点单号" />
          <el-table-column prop="name" label="任务名称" />
          <el-table-column prop="count" label="资产数量" />
          <el-table-column prop="date" label="任务时间" />
        </el-table>
        <div style="margin-top: 20px">
          <el-button plain>测试链接</el-button>
          <el-button type="primary">文件下载</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="盘点任务上传" name="taskUpload">
        <el-table
          :data="tableTaskDownload"
          border
          style="width: 100%"
        >
          <el-table-column prop="name" label="任务名称" />
        </el-table>
        <div style="margin-top: 20px">
          <el-button plain>测试链接</el-button>
          <el-button plain>读取文件目录</el-button>
          <el-button type="primary">上传文件</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="备份文件上传" name="fileUpload">
        <el-table
          :data="tableFilepload"
          border
          style="width: 100%"
        >
          <el-table-column prop="name" label="文件名称" />
        </el-table>
        <div style="margin-top: 20px">
          <el-button plain>测试链接</el-button>
          <el-button type="primary">文件下载</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'InfomationExchange',
  data() {
    return {
      activeName: 'taskDownload',
      tableTaskDownload: [],
      tableTaskUpload: [],
      tableFilepload: []
    }
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
