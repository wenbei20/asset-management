<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog=true">新建</el-button>
      <el-dropdown :style="{ marginLeft: '5px' }">
        <el-button type="default" icon="el-icon-edit" plain>
          编辑<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改</el-dropdown-item>
          <el-dropdown-item>复制</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button disabled icon="el-icon-setting" :style="{ marginLeft: '10px' }">开始维修</el-button>
      <el-button disabled icon="el-icon-setting">完成维修</el-button>
      <el-button icon="el-icon-printer">打印</el-button>

    </el-row>
    <el-row style="padding-top:20px;">
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
        <vxe-table-column field="eventID" title="维修单号" />
        <vxe-table-column field="diedai" title="维修花费" />
        <vxe-table-column field="status" title="状态" />
        <vxe-table-column field="date" title="修理日期" />
        <vxe-table-column field="person" title="处理人" />
        <vxe-table-column field="name" title="报修人" />
        <vxe-table-column field="title" title="维修内容" />
        <vxe-table-column title="备注">
          <template #default>
            --
          </template>
        </vxe-table-column>
        <vxe-table-column field="assetCash" title="资产费用" />
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-row>
    <!--新增/编辑-->
    <add-dialog
      v-if="showAddDialog"
      :visible.sync="showAddDialog"
      @submit-form="submitForm"
    />
  </div>
</template>

<script>
import { queryAssetRepairList, saveAssetRepair } from '@/api/assetManage'
import addDialog from './components/addnew'
export default {
  name: 'AssetMaintenanceManage',
  components: { addDialog },
  data() {
    return {
      showAddDialog: false,
      modalType: 'new',
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          title: '按照部门统计巡检漏检结果',
          checked: false,
          eventID: '1018723',
          youxian: 'High',
          diedai: 'V3.2',
          status: '已实现',
          person: '赵鹏翔;刘彩萍',
          startTime: '2020-09-07',
          endTime: '2020-09-11'
        },
        {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          title: '终端软件更新web端开发',
          checked: false,
          eventID: '1003470',
          youxian: 'High',
          diedai: '--',
          status: '已拒绝',
          person: '刘峰',
          startTime: '2019-03-04',
          endTime: '2019-09-11',
          children: [
            {
              id: 31,
              date: '2016-05-01',
              name: '王小虎',
              title: '版本号',
              checked: false,
              eventID: '1003471',
              youxian: 'High',
              diedai: '--',
              status: '已拒绝',
              person: '刘峰',
              startTime: '2019-03-04',
              endTime: '2019-03-05',
              children: [
                {
                  id: 31,
                  date: '2016-05-01',
                  name: '王小虎',
                  title: '版本文件列表',
                  checked: false,
                  eventID: '1003481',
                  youxian: 'High',
                  diedai: '服务端',
                  status: '已拒绝',
                  person: '刘峰',
                  startTime: '2019-03-04',
                  endTime: '2019-03-04'
                }, {
                  id: 31,
                  date: '2016-05-01',
                  name: '王小虎',
                  title: '添加版本号',
                  checked: false,
                  eventID: '1003480',
                  youxian: 'High',
                  diedai: '服务端',
                  status: '已拒绝',
                  person: '刘峰',
                  startTime: '2019-03-04',
                  endTime: '2019-03-04'
                }
              ]
            }
          ]
        },
        {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          title: '系统管理',
          checked: false,
          eventID: '1003031',
          youxian: 'High',
          diedai: '--',
          status: '规划中',
          person: '安喜喜',
          startTime: '--',
          endTime: '--',
          children: [
            {
              id: 31,
              date: '2016-05-01',
              name: '王小虎',
              title: '系统管理菜单-（菜单管理）',
              checked: false,
              eventID: '1003480',
              youxian: 'High',
              diedai: '--',
              status: '规划中',
              person: '安喜喜',
              startTime: '--',
              endTime: '--',
              children: [
                {
                  id: 3,
                  date: '2016-05-01',
                  name: '王小虎',
                  title: '系统管理菜单-（菜单管理）列表数据及分页',
                  checked: false,
                  eventID: '1004511',
                  youxian: 'High',
                  diedai: 'WEB前端',
                  status: '已实现',
                  person: '安喜喜',
                  startTime: '2019-03-05',
                  endTime: '2019-03-05'
                },
                {
                  id: 3,
                  date: '2016-05-01',
                  name: '王小虎',
                  title: '系统管理-（菜单管理）-需求讨论',
                  checked: false,
                  eventID: '1004507',
                  youxian: 'High',
                  diedai: 'WEB前端',
                  status: '已实现',
                  person: '安喜喜',
                  startTime: '2019-03-05',
                  endTime: '2019-03-05'
                }, {
                  id: 3,
                  date: '2016-05-01',
                  name: '王小虎',
                  title: '系统管理-（菜单管理）-页面搭建',
                  checked: false,
                  eventID: '1004506',
                  youxian: 'High',
                  diedai: 'WEB前端',
                  status: '已实现',
                  person: '安喜喜',
                  startTime: '2019-03-05',
                  endTime: '2019-03-05'
                }, {
                  id: 3,
                  date: '2016-05-01',
                  name: '王小虎',
                  title: '添加 菜单/按钮 权限',
                  checked: false,
                  eventID: '1004505',
                  youxian: 'High',
                  diedai: 'WEB前端',
                  status: '已实现',
                  person: '安喜喜',
                  startTime: '2019-03-05',
                  endTime: '2019-03-05'
                }
              ]
            }
          ]
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          title: '调试下载临时任务接口',
          checked: false,
          eventID: '1003026',
          youxian: 'Middle',
          diedai: '--',
          status: '已实现',
          person: '代海涛',
          startTime: '2019-03-05',
          endTime: '2019-03-05'
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          title: '优化视频视频录制播放功能',
          checked: false,
          eventID: '1002733',
          youxian: 'Middle',
          diedai: '--',
          status: '已实现',
          person: '代海涛',
          startTime: '2019-02-19',
          endTime: '2019-02-19',
          children: [
            {
              id: 4,
              date: '2016-05-03',
              name: '王小虎',
              title: '优化视频录制播放',
              checked: false,
              eventID: '1002736',
              youxian: 'Middle',
              diedai: 'APP安卓',
              status: '已实现',
              person: '代海涛',
              startTime: '2019-02-19',
              endTime: '2019-02-19'
            },
            {
              id: 4,
              date: '2016-05-03',
              name: '王小虎',
              title: '优化视频录制大小',
              checked: false,
              eventID: '1002734',
              youxian: 'Middle',
              diedai: 'APP安卓',
              status: '已实现',
              person: '代海涛',
              startTime: '2019-02-19',
              endTime: '2019-02-19'
            }
          ]
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          title: '调试刷纽扣提交开始和结束时间接口',
          checked: false,
          eventID: '1002705',
          youxian: 'Middle',
          diedai: '--',
          status: '已实现',
          person: '代海涛',
          startTime: '2019-03-04',
          endTime: '2019-03-04'
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          title: '调试同步巡检任务数据接口',
          checked: false,
          eventID: '1002704',
          youxian: 'Middle',
          diedai: '--',
          status: '已实现',
          person: '代海涛',
          startTime: '2019-03-01',
          endTime: '2019-03-01'
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 资源维修列表
    getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryAssetRepairList(params).then((res) => {
        console.log('资源维修列表', res)
        if(res.code === 0 && res.data) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
      .catch((err) => { console.log('err', err) })
    },
    // 确认提交（新建/修改）
    submitForm(params, id) {
      console.log('外层 submitForm', params, id)
      this.submitMethods(params, id).then((res) => {
        console.log('348 res', res)
      })
      .catch((err) => { console.log('err', err) })
    },
    // 确认提交方法
    submitMethods(params, id) {
      return this.modalType === 'new' ? saveAssetRepair(params) : updateAssetRepair(params, id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
