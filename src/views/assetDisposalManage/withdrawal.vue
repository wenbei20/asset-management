<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog=true">新建</el-button>
      <!-- <el-dropdown :style="{ marginLeft: '5px' }">
        <el-button type="default" icon="el-icon-edit" plain>
          编辑<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改</el-dropdown-item>
          <el-dropdown-item>复制</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-dropdown :style="{ marginLeft: '5px' }">
        <el-button type="default" icon="el-icon-printer" plain>
          打印<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>打印资产标签</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="el-icon-receiving" style="margin-left:5px" @click="handleExport">导出</el-button>
    </el-row>
    <el-row style="padding-top:20px;">
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        stripe
        class="vxetable"
        :tree-config="{children: 'children',iconOpen: 'el-icon-remove-outline', iconClose: 'el-icon-circle-plus-outline',expandAll:true}"
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="person" title="退库处理人">
          <template #default="{ row }">
            {{ row.person ? row.person : '--' }}
          </template>

          <template slot="edit" slot-scope="scope">
            <el-input v-model="scope.row.person" size="mini" />
          </template>

        </vxe-table-column>
        <vxe-table-column field="date" title="实际退库时间" />
        <vxe-table-column field="youxian" title="业务所属单位" />
        <vxe-table-column field="status" title="退库后使用公司" />
        <vxe-table-column field="eventID" title="退库后区域" />
        <vxe-table-column field="title" title="退库后存放地点" tree-node width="300">
          <template slot="header">
            <i v-if="isAllExpand" class="el-icon-remove-outline biaotiicon" />
            <i v-else class="el-icon-circle-plus-outline biaotiicon" />

            退库后存放地点
          </template>

          <template #default="{ row }">
            <span class="titleText"><i /> {{ row.title }}</span>
          </template>

        </vxe-table-column>

        <vxe-table-column field="startTime" title="退库说明" :edit-render="{}">
          <template #default="{ row }">
            {{ row.startTime ? row.startTime : '--' }}
          </template>
          <template slot="edit" slot-scope="scope">
            <el-date-picker
              v-model="scope.row.startTime"
              type="date"
              placeholder="选择日期"
            />
          </template>
        </vxe-table-column>

        <vxe-table-column title="操作">
          <template slot-scope="scope">
            <el-button size="small" plain @click="editItem(scope.row)">编辑</el-button>
            <el-button size="small" plain @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </vxe-table-column>

      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-row>
    <add-dialog
      :visible.sync="showAddDialog"
      :group-list="groupList"
      :modal-type="modalType"
    />
  </div>
</template>
<script>
import addDialog from './components/addNewDialog'
import { queryAssetBackList, assetBackBaseCode, assetBackExport } from '@/api/assetManage'
export default {
  components: { addDialog },
  filters: {
    statusClass(e) {
      switch (e) {
        case '已实现':
          return 'gray'
        case '实现中':
          return 'blue'
        case '规划中':
          return 'green'
        case '已拒绝':
          return 'blue'
        default :
          return 'green'
      }
    }
  },
  data() {
    return {
      isAllExpand: false,
      showAddDialog: false,
      modalType: 'new',
      groupList: [],
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      tableLoading: false,
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
    this.getBaseCode()
    this.getList()
  },
  methods: {
    // 资产调拨新增和修改页面中的码表接口
    getBaseCode() {
      assetBackBaseCode().then(res => {
        if (res.code === 0 && res.data) {
          this.areaList = res.data.areaList
          this.groupList = res.data.groupList
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 获取退运列表信息
    getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryAssetBackList(params).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => {
          console.log('err', err)
        })
    },
    // 编辑项
    editItem(item) {
      console.log('编辑', item)
    },
    // 删除项
    deleteItem(item) {
      console.log('删除', item)
    },
    // 导出
    handleExport() {
      assetBackExport().then((res) => {
        console.log(409, res)
      })
    }
  }
}
</script>
