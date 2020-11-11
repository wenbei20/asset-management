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
      <el-dropdown :style="{ marginLeft: '5px' }">
        <el-button type="default" icon="el-icon-printer" plain>
          打印<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>打印资产标签</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="el-icon-receiving" style="margin-left:5px">导出</el-button>
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
        <!-- <vxe-table-column width="32" class="meuntd" :resizable="false" :edit-render="{}">
          <template>
            <div class="moreOuter">
              <i class="el-icon-more" />

            </div>
          </template>
          <template slot="edit">
            <i class="el-icon-more" style="position:relative;top:-2px;" />

            <div class="editmenu">
              <div class="item">编辑</div>
              <div class="item">复制</div>
              <div class="item">关注</div>
              <div class="item">删除</div>
              <div class="item create">创建子需求</div>
            </div>
          </template>
        </vxe-table-column> -->
        <!-- <vxe-table-column field="eventID" title="ID" /> -->
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
        <!-- <vxe-table-column field="youxian" title="优先级" :edit-render="{}">

          <template #default="{ row }">
            <span class="youxianspan" :class="row.youxian">{{ row.youxian }}</span>
          </template>

          <template slot="edit" slot-scope="scope">
            <span>{{ scope.row.youxian }}</span>
            <div class="edityouxian">
              <ul>
                <li class="empty">--空--</li>
                <li class="high">High</li>
                <li class="middle">Middle</li>
                <li class="low">Low</li>
                <li class="nice">Nice to Have</li>
              </ul>
            </div>
          </template>

        </vxe-table-column> -->

        <!-- <vxe-table-column field="diedai" title="迭代">
          <template #default="{ row }">
            <span>{{ row.diedai ? row.diedai : '--' }}</span>
          </template>

        </vxe-table-column> -->

        <!-- <vxe-table-column field="status" title="状态">
          <template #default="{ row }">
            <span class="statuspan" :class="row.status | statusClass">{{ row.status }}</span>
          </template>

        </vxe-table-column> -->

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

        <!-- <vxe-table-column field="endTime" title="预计结束" :edit-render="{}">
          <template #default="{ row }">
            {{ row.endTime ? row.endTime : '--' }}
          </template>
          <template slot="edit" slot-scope="scope">

            <el-date-picker
              v-model="scope.row.endTime"
              type="date"
              placeholder="选择日期"
            />
          </template>

        </vxe-table-column> -->

      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="1000"
      />
    </el-row>
    <add-dialog :visible.sync="showAddDialog" />
  </div>
</template>
<script>
import addDialog from './components/addNewDialog'
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
  }
}
</script>
