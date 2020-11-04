<template>
  <div class="app-container">
    <el-row>
      <el-col :span="7">
        <el-form>
          <el-form-item label="使用公司/部门">
            <el-select v-model="companyValue" placeholder="请选择公司/部门">
              <el-option
                v-for="item in companyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="17">
        <el-button type="primary" icon="el-icon-plus">新建</el-button>
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
          <el-button type="default" icon="el-icon-receiving" plain>
            导入/导出<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>下载导入模板</el-dropdown-item>
            <el-dropdown-item>批量导入资产</el-dropdown-item>
            <el-dropdown-item>导出资产</el-dropdown-item>
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
        <el-dropdown :style="{ marginLeft: '5px' }">
          <el-button type="default" icon="el-icon-files" plain>
            RFID管理<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>发卡</el-dropdown-item>
            <el-dropdown-item>批量发卡</el-dropdown-item>
            <el-dropdown-item>换卡</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-input
          v-model="input1"
          :style="{ width: '200px', float: 'right' }"
          placeholder="搜索..."
          suffix-icon="el-icon-search"
        />
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" align="middle" :style="{ fontSize: '12px' }">
      <el-col :span="8">金额合计：0.00</el-col>
      <el-col :span="8" :style="{ textAlign: 'right' }">
        <el-button type="text" @click="gjssVisible = true">高级搜索</el-button>
        <el-popover
          v-model="settingVisible"
          placement="bottom-end"
          width="200"
        >
          <h4 :style="{ margin: '0', paddingBottom: '10px', borderBottom: '#eee solid 1px' }">列设置</h4>
          <div class="popoverSwitchList">
            <div v-for="item in popoverSwitchList" :key="item.name" class="item">
              <el-switch
                v-model="item.active"
                :active-text="item.name"
                :disabled="item.disabled"
              />
            </div>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="settingVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="settingVisible = false">确定</el-button>
          </div>
          <el-button slot="reference" type="text" :style="{ marginLeft: '10px' }"><i class="el-icon-setting" /></el-button>
        </el-popover>
        <el-button type="text" :style="{ marginLeft: '10px' }"><i class="el-icon-lock" /></el-button>
      </el-col>
    </el-row>
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
      <vxe-table-column width="32" class="meuntd" :resizable="false" :edit-render="{}">
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
      </vxe-table-column>
      <vxe-table-column field="eventID" title="ID" />
      <vxe-table-column field="title" title="标题" tree-node width="300">
        <template slot="header">
          <i v-if="isAllExpand" class="el-icon-remove-outline biaotiicon" @click="closeAllNode" />
          <i v-else class="el-icon-circle-plus-outline biaotiicon" @click="closeAllNode" />

          标题
        </template>

        <template #default="{ row }">
          <span class="titleText" @click="toEditPage"><i /> {{ row.title }}</span>
        </template>

      </vxe-table-column>
      <vxe-table-column field="youxian" title="优先级" :edit-render="{}">

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

      </vxe-table-column>

      <vxe-table-column field="diedai" title="迭代">
        <template #default="{ row }">
          <span>{{ row.diedai ? row.diedai : '--' }}</span>
        </template>

      </vxe-table-column>

      <vxe-table-column field="status" title="状态">
        <template #default="{ row }">
          <span class="statuspan" :class="row.status | statusClass">{{ row.status }}</span>
        </template>

      </vxe-table-column>

      <vxe-table-column field="person" title="处理人" :edit-render="{}">
        <template #default="{ row }">
          {{ row.person ? row.person : '--' }}
        </template>

        <template slot="edit" slot-scope="scope">
          <el-input v-model="scope.row.person" size="mini" />
        </template>

      </vxe-table-column>

      <vxe-table-column field="startTime" title="预计开始" :edit-render="{}">
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

      <vxe-table-column field="endTime" title="预计结束" :edit-render="{}">
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

      </vxe-table-column>

    </vxe-table>

    <!-- 模态框 -->
    <el-dialog title="高级搜索" :visible.sync="gjssVisible" width="600px">
      <el-form :model="form" label-position="left">
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-select v-model="form.status" placeholder="请选择状态" :style="{ width: '100%' }">
              <el-option label="状态一" value="1" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="签字状态" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-select v-model="form.signStatus" placeholder="请选择签字状态" :style="{ width: '100%' }">
              <el-option label="签字状态" value="1" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="资产编码" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="form.assetCoding" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="资产编码" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="form.assetCodingInput" placeholder="请输入资产编码" />
          </el-col>
        </el-form-item>
        <el-form-item label="资产名称" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="form.assetName" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="资产名称" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="form.assetNameInput" placeholder="请输入资产名称" />
          </el-col>
        </el-form-item>
        <el-form-item label="RFID" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="form.rfidName" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="RFID" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="form.rfidNameInput" placeholder="请输入RFID" />
          </el-col>
        </el-form-item>
        <el-form-item label="资产类别" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-select v-model="form.assetCategory" placeholder="请选择资产类别" :style="{ width: '100%' }">
              <el-option label="资产类别" value="1" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="规格型号" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="form.specificationModel" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="规格型号" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="form.specificationModelInput" placeholder="请输入规格型号" />
          </el-col>
        </el-form-item>
        <el-form-item label="SN号" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="form.snNumber" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="SN号" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="form.snNumberInput" placeholder="请输入SN号" />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gjssVisible = false">取 消</el-button>
        <el-button type="primary" @click="gjssVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AssetInfoManage',
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
      companyOptions: [
        { value: 'company1', label: '公司一' },
        { value: 'company2', label: '公司二' },
        { value: 'company3', label: '公司三' }
      ],
      companyValue: '',
      input1: '',
      gjssVisible: false,
      settingVisible: false,
      popoverSwitchList: [
        { name: '状态', active: true, disabled: false },
        { name: '签字状态', active: false, disabled: false },
        { name: '照片', active: false, disabled: false },
        { name: '资产编码', active: true, disabled: true },
        { name: '资产名称', active: true, disabled: true },
        { name: 'RFID', active: true, disabled: false },
        { name: '资产类别编码', active: false, disabled: false },
        { name: '资产类别(短)', active: true, disabled: false },
        { name: '资产类别', active: false, disabled: false },
        { name: '规格型号', active: true, disabled: false },
        { name: 'SN号', active: true, disabled: false },
        { name: '计量单位', active: true, disabled: false },
        { name: '金额', active: true, disabled: false }
      ],
      form: {
        name: '',
        status: '',
        signStatus: '',
        assetCoding: '',
        assetCodingInput: '',
        assetName: '',
        assetNameInput: '',
        rfidName: '',
        rfidNameInput: '',
        assetCategory: '',
        specificationModel: '',
        specificationModelInput: '',
        snNumber: '',
        snNumberInput: ''
      },
      formLabelWidth: '100px',
      isAllExpand: true,
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
  methods: {
    closeAllNode() {
      if (this.isAllExpand) {
        this.$refs.xTree.clearTreeExpand()
      } else {
        this.$refs.xTree.setAllTreeExpand(true)
      }
      this.isAllExpand = !this.isAllExpand
    },
    toaddpage() {
      this.$router.push({ name: 'xuqiuAdd' })
    },
    toEditPage() {
      this.$router.push({ name: 'xuqiuEdit' })
    },
    hidenavtree(e) {
      this.hidetree = e
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{ height: 100%;
  .el-col{ height: 100%;
    &.left{ width: 300px;
      .el-collapse{ border: #ddd solid 1px;
        ::v-deep{
          .el-collapse-item{
            &__header{ padding: 5px 10px; height: auto; line-height: 20px; display: block; background:#f7f7f7; position: relative;
              .title{ font-size: 14px; line-height: 30px; margin-right: 20px; color: #478ee6;}
              .info{ line-height: 20px; font-weight: 400; color: #9298a0;
                span{ font-size: 12px; margin-right: 10px; font-weight: 400;}
              }
            }
            &__wrap{ border-top: #ddd solid 1px;}
            &__arrow{ position: absolute; top: 13px; right: 7px;}
            &__content{ padding: 5px 0;
              .list{
                .item{ display: flex; width: 100%; font-size: 12px; line-height: 20px; padding: 5px 10px; justify-content: flex-start; align-items: center; border-bottom: #eee dashed 1px; color: #999;
                  span{ text-align: center;}
                  .tag{ width: 14px; height: 14px; line-height: 14px; background: #478ee6; color: #fff; margin-right: 10px;}
                  .title{ text-align: left; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333;}
                  .level{ width: 60px;}
                  .num{ width: 20px;}
                  .handle{ width: 20px;}
                }
              }
            }
            &:last-child{ margin-bottom: 0;}
          }
        }
      }
    }
    &.right{ width: calc(100% - 300px - 20px); margin-left: 20px;
      .el-card{ border-radius: 0; height: 100%;
        ::v-deep{
          .el-card__header{ height: 50px; padding: 8px 10px;}
          .el-card__body{ height: calc(100% - 50px); padding: 10px; overflow-y: auto;}
        }
        .titleText { cursor: pointer;
          i { display:inline-block; width: 32px; height:12px; background: url('~@/assets/setting/storysprite.png') no-repeat; background-position: -47px 0; }
          &:hover { color: #5d9bfc; }
        }
        .navtree { margin-left: 20px; height: 100%; }
        .vxetable {
          .youxianspan { display: inline-block; height: 20px; padding: 0 10px; line-height: 20px; color:#fff; border-radius: 2px; font-size: 12px; cursor: pointer;
            &.Low { background-color: #97afd0; }
            &.Nice { background-color: #97afd0; }
            &.High { background-color: #f85e5e; }
            &.Middle { background-color: #93c36b; }
          }
          .statuspan { display: inline-block; border: 1px solid #8091a5; color: #8091a5; max-height: 66px; font-size: 12px; line-height: 20px; vertical-align: middle; border-radius: 12px; cursor: pointer; overflow: visible; padding: 2px 10px;
            &.gray{ color: #999; }
            &.blue { border-color: #3582fb; color: #3582fb; }
            &.green { border-color: #93c46b; color: #93c46b; }
          }
        }
      }
    }
  }
}
.vxetable {
  .el-icon-remove-outline , .el-icon-circle-plus-outline{
      font-size: 16px;
  }
  .el-icon-more {
      transform: rotateZ(90deg);
  }
  .moreOuter {
      i {
          display: none;
          cursor: pointer;
      }
  }
  .editmenu {
      position: absolute;
      top: 40px;
      box-shadow: 0 0 10px rgba(63,74,86,0.3);
      padding: 5px 0;
      background-color: #fff;
      z-index: 999;
      width: 114px;
      .item {
          height: 28px;
          padding: 0 15px;
          line-height: 28px;
          cursor: pointer;
      }
      .item:hover{
          color: #5d9bfc;
          background-color: #eaf2ff;
      }
      .item.create {
          border-top: 1px solid #dfe6ee;
      }
  }
  .vxe-body--row:hover {
      .moreOuter {
          i {
              display: block;
          }
      }
  }
  .biaotiicon {
      cursor: pointer;
  }
  .edityouxian {
      position: absolute;
      width: 150px;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(63,74,86,0.3);
      padding: 15px;
      border: 1px solid #b0bac5;
      z-index: 999;
      ul {
          padding: 0;
          margin: 0;
          list-style: none;
      }
      li {
          width: 100px;
          height: 24px;
          line-height: 24px;
          padding: 0 10px;
          cursor: pointer;
          border-radius: 4px;
          background-color: #f8f8f8;
          margin-bottom: 10px;
          transition: width linear 0.1s;
      }
      li:not(.empty) {
          color: #fff;
      }
      .high {
          background-color: #f85e5e;
      }
      .middle {
          background-color: #93c36b;
      }
      .low , .nice{
          background-color: #97afd0;
      }
      li:hover {
          width: 120px;
      }

  }
}
.popoverSwitchList{ padding: 0; margin-bottom: 10px; max-height: 400px; overflow-y: auto;
  .item{ margin: 15px 0;
    ::v-deep{
      .el-switch__label{ font-weight: 400;
        &.is-active{ color: #333;}
      }
    }
  }
}
</style>
