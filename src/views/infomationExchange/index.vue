<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="盘点任务下载" name="taskDownload">
        <el-table
          :data="tableTaskDownload"
          border
          style="width: 100%"
        >
          <el-table-column prop="checkcode" label="盘点单号" />
          <el-table-column prop="checkname" label="任务名称" />
          <el-table-column prop="taskQty" label="资产数量" />
          <el-table-column prop="operdatetime" label="任务时间" />
          <el-table-column label="文件下载" width="120">
             <template slot-scope="scope">
              <el-button type="primary" @click="downLoad(scope.row)">文件下载</el-button>
             </template>
          </el-table-column>
        </el-table>
          <el-pagination
          background
          layout="prev, pager, next, jumper"
          style="text-align:right;margin-top:20px;"
          :total="pageTotal"
        />
        <div style="margin-top: 20px">
          <el-button plain @click="getStatus()">测试链接</el-button>
       
        </div>
      </el-tab-pane>
  
      <el-tab-pane label="备份文件上传" name="fileUpload">
        <el-table
          :data="tableFilepload"
          border
          style="width: 100%"
        >
          <el-table-column prop="fileName" label="文件名称" />
          <el-table-column label="文件上传" width="120">
             <template slot-scope="scope">
              <el-button type="primary" @click="taskUpload(scope.row)">文件上传</el-button>
             </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button plain  @click="getStatus()">测试链接</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="备份文件上传记录" name="taskUpload">
        <el-table
          :data="tableTaskUpload"
          border
          style="width: 100%"
        >
          <el-table-column prop="filename" label="文件名" />
          <el-table-column prop="uploadtime" label="上传时间" />
           <el-table-column label="数据导入" width="120">
             <template slot-scope="scope">
              <el-button type="primary" @click="dataImport(scope.row)">数据导入</el-button>
             </template>
          </el-table-column>
        </el-table>
          <el-pagination
          background
          layout="prev, pager, next, jumper"
          style="text-align:right;margin-top:20px;"
          :total="pageLogTotal"
        />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { getTaskList,taskDownload,taskUploadList,taskUpload,getStatus,listBackFile,dataImport } from '@/api/check.js'
export default {
  name: 'InfomationExchange',
  data() {
    return {
      activeName: 'taskDownload',
      tableTaskDownload: [],
      tableTaskUpload: [],
      tableFilepload: [],
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      pageLogNo:1,
      pageLogSize: 10,
      pageLogTotal: 0
    }
  },
  created(){
    this.getTaskList()
    this.taskUploadList()
    this.listBackFile()
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
     getTaskList() {
      this.tableLoading = true
      const { pageNo, pageSize } = this;
      const params = { ...this.requestParams, pageNo, pageSize }
      getTaskList(params).then(res => {
        if (res.code === 0 && res.data && res.data.items) {
          this.tableTaskDownload = res.data.items
          this.pageTotal = res.data.total
          this.pageSize = res.data.limit
          this.pageNo = res.data.page
        }
        this.tableLoading = false
      }).catch(err => {
        console.log('err', err)
        this.tableLoading = false
      })
    },
    listBackFile(){
      this.tableLoading = true
      const { pageLogNo, pageLogSize } = this;
      const params = { ...this.requestParams, pageLogNo, pageLogSize }
      listBackFile(params).then(res => {
        if (res.code === 0 && res.data && res.data.items) {
          this.tableTaskUpload = res.data.items
          this.pageLogTotal = res.data.total
          this.pageLogSize = res.data.limit
          this.pageLogNo = res.data.page
        }
        this.tableLoading = false
      }).catch(err => {
        console.log('err', err)
        this.tableLoading = false
      })
    },
    dataImport(item){
      const params = {
        uuid: item.uuid
      }

      dataImport(params).then((res) => {
        if (res.code === 0) {
            this.$message({ type:'success',message:'操作成功'});
          //this.assetList = res.data.items
        }
        //this.tableLoading = false
      }).catch(err => {
           this.$message({ type:'error',message:'操作失败'});
        console.log('err', err)
        //this.tableLoading = false
      })
    },
    downLoad(item){
      const params = {
        checkId: item.checkId
      }
     // this.tableLoading = true
      taskDownload(params).then((res) => {
        if (res.code === 0) {
            this.$message({ type:'success',message:'下载成功'});
          //this.assetList = res.data.items
        }
        //this.tableLoading = false
      }).catch(err => {
           this.$message({ type:'error',message:'下载失败'});
        console.log('err', err)
        //this.tableLoading = false
      })
    },
    taskUploadList(){
       taskUploadList().then((res) => {
        if (res.code === 0 && res.data) {
          console.log(res.data)
          this.tableFilepload  = res.data
        }
        //this.tableLoading = false
      }).catch(err => {
        console.log('err', err)
        //this.tableLoading = false
      })
    },
    taskUpload(item){
      const params = {
        fileName: item.fileName
      }
       taskUpload(params).then((res) => {
         console.log(res)
        if (res.code === 0) {
               this.$message({ type:'success',message:'上传成功'});
        }

      }).catch(err => {
         this.$message({ type:'error',message:'上传失败'});
        console.log('err', err)

      })
    },
    getStatus(){
      getStatus().then((res) => {
        if (res.code === 0) {
               this.$message({ type:'success',message:'手持终端连接成功！'});
        }

      }).catch(err => {
         this.$message({ type:'error',message:'手持终端连接失败！'});
        console.log('err', err)

      })
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
