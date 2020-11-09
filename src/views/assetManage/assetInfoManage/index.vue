<template>
  <div class="app-container">
    <el-row>
      <el-col :span="17">
        <span style="font-size:14px;">使用公司/部门</span>
        <el-select v-model="companyValue" placeholder="请选择公司/部门" style="padding:0 6px;">
          <el-option
            v-for="item in companyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新建</el-button>
        <el-dropdown :style="{ marginLeft: '5px' }">
          <el-button type="default" icon="el-icon-receiving" plain>
            操作<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>下载导入模板</el-dropdown-item>
            <el-dropdown-item>批量导入资产</el-dropdown-item>
            <el-dropdown-item>导出资产</el-dropdown-item>
            <el-dropdown-item style="border-top:1px solid #dfe6ee;">批量打印标签</el-dropdown-item>
            <el-dropdown-item>批量发卡</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="7">

        <el-input
          v-model="input1"
          :style="{ width: '200px', float: 'right' }"
          placeholder="搜索..."
          suffix-icon="el-icon-search"
        />
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" align="middle" :style="{ fontSize: '12px' }">
      <!-- <el-col :span="8">金额合计：0.00</el-col> -->
      <el-col :span="8" :offset="16" :style="{ textAlign: 'right' }">
        <el-button type="text" @click="gjssVisible = true">高级搜索</el-button>
        <el-popover
          v-model="settingVisible"
          placement="bottom-end"
          width="200"
          @show="showTableColSetting"
          @hide="hideTableColSetting"
        >
          <h4 :style="{ margin: '0', paddingBottom: '10px', borderBottom: '#eee solid 1px' }">列设置</h4>
          <div class="popoverSwitchList">
            <div v-for="item in popoverSwitchList" :key="item.name" class="item">
              <el-switch
                v-model="tableShowColumn[item.model]"
                :active-text="item.name"
                :disabled="item.disabled"
              />
            </div>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="cancalColSetting">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmColSetting">确定</el-button>
          </div>
          <el-button slot="reference" type="text" :style="{ marginLeft: '10px' }"><i class="el-icon-setting" /></el-button>
        </el-popover>
        <!-- <el-button type="text" :style="{ marginLeft: '10px' }"><i class="el-icon-lock" /></el-button> -->
      </el-col>
    </el-row>
    <div class="maintable">

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
            <i class="el-icon-more" style="position:relative;top:1px;left: -1px;" />

            <div class="editmenu">
              <div class="item">编辑</div>
              <div class="item">复制</div>
              <div class="item">删除</div>
              <div class="item create">发卡</div>
              <div class="item">换卡</div>
              <div class="item create">标签打印</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="eventID" title="资产编码" sortable min-width="100" :visible="tableShowColumn.zcbm" />
        <vxe-table-column field="title" title="资产名称" tree-node width="300" :visible="tableShowColumn.zcmc">
          <template slot="header">
            <i v-if="isAllExpand" class="el-icon-remove-outline biaotiicon" @click="closeAllNode" />
            <i v-else class="el-icon-circle-plus-outline biaotiicon" @click="closeAllNode" />
            资产名称
          </template>
          <template #default="{ row }">
            <span class="titleText"><i /> {{ row.title }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="status" title="资产类别" min-width="100" :visible="tableShowColumn.zclb">
          <template #default="{ row }">
            <span class="statuspan" :class="row.status | statusClass">{{ row.status }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="youxian" title="标准型号" min-width="80" :visible="tableShowColumn.bzxh" />

        <vxe-table-column field="diedai" title="规格型号" min-width="80" :visible="tableShowColumn.ggxh">
          <template #default="{ row }">
            <span>{{ row.diedai ? row.diedai : '--' }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column title="计量单位" min-width="80" :visible="tableShowColumn.jldw">--</vxe-table-column>

        <vxe-table-column field="startTime" title="购入日期" min-width="120" :visible="tableShowColumn.grrq" />

        <vxe-table-column title="所属单位" min-width="80" :visible="tableShowColumn.ssdw">--</vxe-table-column>

        <vxe-table-column title="金额" min-width="80" :visible="tableShowColumn.je">--</vxe-table-column>

        <vxe-table-column field="person" title="管理员" min-width="80" :visible="tableShowColumn.gly">
          <template #default="{ row }">
            {{ row.person ? row.person : '--' }}
          </template>
          <template slot="edit" slot-scope="scope">
            <el-input v-model="scope.row.person" size="mini" />
          </template>
        </vxe-table-column>

        <vxe-table-column title="使用人" min-width="80" :visible="tableShowColumn.syr">--</vxe-table-column>
        <vxe-table-column title="使用单位" min-width="80" :visible="tableShowColumn.sydw">--</vxe-table-column>
        <vxe-table-column title="使用部门" min-width="80" :visible="tableShowColumn.sybm">--</vxe-table-column>
        <vxe-table-column title="使用期限" min-width="80" :visible="tableShowColumn.syqx">--</vxe-table-column>
        <vxe-table-column title="区域" min-width="80" :visible="tableShowColumn.qy">--</vxe-table-column>
        <vxe-table-column title="存放地点" min-width="80" :visible="tableShowColumn.cfdd">--</vxe-table-column>
        <vxe-table-column title="备注信息" min-width="80" :visible="tableShowColumn.bzxx">--</vxe-table-column>
        <vxe-table-column title="物资状态" min-width="80" :visible="tableShowColumn.wzzt">--</vxe-table-column>
        <vxe-table-column title="RFID码" min-width="80" :visible="tableShowColumn.RFID">--</vxe-table-column>
        <vxe-table-column title="自定义字段1" min-width="100" :visible="tableShowColumn.zdyzd1">--</vxe-table-column>
        <vxe-table-column title="供应商" min-width="80" :visible="tableShowColumn.gys">--</vxe-table-column>
        <vxe-table-column title="联系人" min-width="80" :visible="tableShowColumn.lxr">--</vxe-table-column>
        <vxe-table-column title="联系方式" min-width="80" :visible="tableShowColumn.lxfs">--</vxe-table-column>
        <vxe-table-column title="负责人" min-width="80" :visible="tableShowColumn.fzr">--</vxe-table-column>

        <vxe-table-column field="endTime" title="维保时间" min-width="120" :visible="tableShowColumn.wbsj" />
        <vxe-table-column title="维保说明" min-width="80" :visible="tableShowColumn.wbsm">--</vxe-table-column>

      </vxe-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      style="text-align:right;margin-top:20px;"
      :total="1000"
    />

    <!-- 模态框 -->
    <el-dialog :title="xjzyxxTitle" :visible.sync="xjzyxxVisible" width="80%">
      <el-form :model="xjzyxxForm" label-position="left">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="资产类别" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-select v-model="xjzyxxForm.assetCategory" placeholder="请选择资产类别" :style="{ width: '100%' }">
                  <el-option label="资产类别" value="1" />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标准型号" :label-width="formLabelWidth">
              <el-col :span="24">
                <el-select v-model="xjzyxxForm.standardModel" placeholder="请选择标准型号" :style="{ width: '100%' }">
                  <el-option label="标准型号" value="1" />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产编码" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-input v-model="xjzyxxForm.assetCoding" placeholder="请输入资产编码" disabled />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-input
                  v-model="xjzyxxForm.remark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <div :style="{ background: '#e8ebf9', padding: '10px', margin: '10px 0' }">维保信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="供应商" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-input v-model="xjzyxxForm.assetCoding" placeholder="请输入供应商" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-input v-model="xjzyxxForm.contactUser" placeholder="请输入联系人" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-input v-model="xjzyxxForm.contactInfomation" placeholder="请输入联系方式" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-select v-model="gjssForm.chargePerson" placeholder="请选择负责人" :style="{ width: '100%' }">
                  <el-option label="负责人" value="1" />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维保到期" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-input v-model="xjzyxxForm.maintenanceDate" placeholder="请输入维保到期日期" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="维保说明" :label-width="formLabelWidth" required>
              <el-col :span="24">
                <el-input
                  v-model="xjzyxxForm.maintenanceInstructions"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入维保说明"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="xjzyxxVisible = false">取 消</el-button>
        <el-button type="primary" @click="xjzyxxVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 模态框 高级搜索-->
    <el-dialog title="高级搜索" :visible.sync="gjssVisible" width="600px">
      <el-form :model="gjssForm" label-position="left">
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-select v-model="gjssForm.status" placeholder="请选择状态" :style="{ width: '100%' }">
              <el-option label="状态一" value="1" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="签字状态" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-select v-model="gjssForm.signStatus" placeholder="请选择签字状态" :style="{ width: '100%' }">
              <el-option label="签字状态" value="1" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="资产编码" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="gjssForm.assetCoding" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="资产编码" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="gjssForm.assetCodingInput" placeholder="请输入资产编码" />
          </el-col>
        </el-form-item>
        <el-form-item label="资产名称" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="gjssForm.assetName" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="资产名称" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="gjssForm.assetNameInput" placeholder="请输入资产名称" />
          </el-col>
        </el-form-item>
        <el-form-item label="RFID" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="gjssForm.rfidName" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="RFID" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="gjssForm.rfidNameInput" placeholder="请输入RFID" />
          </el-col>
        </el-form-item>
        <el-form-item label="资产类别" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-select v-model="gjssForm.assetCategory" placeholder="请选择资产类别" :style="{ width: '100%' }">
              <el-option label="资产类别" value="1" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="规格型号" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="gjssForm.specificationModel" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="规格型号" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="gjssForm.specificationModelInput" placeholder="请输入规格型号" />
          </el-col>
        </el-form-item>
        <el-form-item label="SN号" :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select v-model="gjssForm.snNumber" placeholder="请选择条件" :style="{ width: '100%' }">
              <el-option label="SN号" value="1" />
            </el-select>
          </el-col>
          <el-col :span="13" :offset="1">
            <el-input v-model="gjssForm.snNumberInput" placeholder="请输入SN号" />
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
      tableShowColumn: {
        zcbm: true,
        zcmc: true,
        zclb: true,
        bzxh: true,
        ggxh: true,
        jldw: true,
        grrq: true,
        ssdw: true,
        je: true,
        gly: true,
        syr: true,
        sydw: true,
        sybm: true,
        syqx: true,
        qy: true,
        cfdd: true,
        bzxx: true,
        wzzt: true,
        RFID: true,
        zdyzd1: true,
        gys: true,
        lxr: true,
        lxfs: true,
        fzr: true,
        wbsj: true,
        wbsm: true
      },
      copyForTableShowColumn: {},
      isAllreadyConfirmColSetting: false,
      companyValue: '',
      input1: '',
      xjzyxxVisible: false,
      xjzyxxTitle: '新建资源信息',
      gjssVisible: false,
      settingVisible: false,
      popoverSwitchList: [
        { name: '资产编码', model: 'zcbm', disabled: false },
        { name: '资产名称', model: 'zcmc', disabled: false },
        { name: '资产类别', model: 'zclb', disabled: false },
        { name: '标准型号', model: 'bzxh', disabled: false },
        { name: '规格型号', model: 'ggxh', disabled: false },
        { name: '计量单位', model: 'jldw', disabled: false },
        { name: '购入日期', model: 'grrq', disabled: false },
        { name: '所属单位', model: 'ssdw', disabled: false },
        { name: '金额', model: 'je', disabled: false },
        { name: '管理员', model: 'gly', disabled: false },
        { name: '使用人', model: 'syr', disabled: false },
        { name: '使用单位', model: 'sydw', disabled: false },
        { name: '使用部门', model: 'sybm', disabled: false },
        { name: '使用期限', model: 'syqx', disabled: false },
        { name: '区域', model: 'qy', disabled: false },
        { name: '存放地点', model: 'cfdd', disabled: false },
        { name: '备注信息', model: 'bzxx', disabled: false },
        { name: '物资状态', model: 'wzzt', disabled: false },
        { name: 'RFID码', model: 'RFID', disabled: false },
        { name: '自定义字段1', model: 'zdyzd1', disabled: false },
        { name: '供应商', model: 'gys', disabled: false },
        { name: '联系人', model: 'lxr', disabled: false },
        { name: '联系方式', model: 'lxfs', disabled: false },
        { name: '负责人', model: 'fzr', disabled: false },
        { name: '维保时间', model: 'wbsj', disabled: false },
        { name: '维保说明', model: 'wbsm', disabled: false }
      ],
      xjzyxxForm: {
        assetCategory: '',
        standardModel: '',
        assetCoding: '',
        remark: '',
        supplier: '',
        contactUser: '',
        contactInformation: '',
        chargePerson: '',
        maintenanceDate: '',
        maintenanceInstructions: ''
      },
      gjssForm: {
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
    },
    addNew() {
      this.xjzyxxTitle = '新建资源信息'
      this.xjzyxxVisible = true
    },
    confirmColSetting() {
      console.log('confirmhide')
      this.isAllreadyConfirmColSetting = true
      this.settingVisible = false
      this.$nextTick(() => {
        this.$refs.xTree.refreshColumn()
      })
    },
    cancalColSetting() {
      this.settingVisible = false
    },
    showTableColSetting() {
      this.copyForTableShowColumn = { ...this.tableShowColumn }
      console.log('show')
    },
    hideTableColSetting() {
      if (this.isAllreadyConfirmColSetting) {
        this.isAllreadyConfirmColSetting = false
        return
      }
      this.tableShowColumn = { ...this.copyForTableShowColumn }
      this.copyForTableShowColumn = {}
      this.settingVisible = false
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
.maintable {
  width: 100%;
  overflow-x: auto;
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
