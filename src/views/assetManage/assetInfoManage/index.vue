<template>
  <div class="app-container">
    <el-row>
      <el-col :span="17">
        <el-select v-model="companyValue" placeholder="请选择搜索类别" style="padding:0 6px;width: 160px;" @change="changeSelectdepartment">
          <el-option label="使用部门" value="1" />
          <el-option label="资产类别" value="2" />
          <el-option label="资产名称" value="3" />
        </el-select>

        <el-input
          v-model="searchIpt"
          :style="{ width: '160px',marginRight:'20px' }"
          placeholder="搜索..."
          clearable
          @clear="clearSearchRes"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchList" />
        </el-input>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新建</el-button>
        <el-dropdown :style="{ marginLeft: '5px' }" @command="operationSelect">
          <el-button type="default" icon="el-icon-receiving" plain>
            操作<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">下载导入模板</el-dropdown-item>
            <el-dropdown-item>批量导入资产</el-dropdown-item>
            <el-dropdown-item>导出资产</el-dropdown-item>
            <el-dropdown-item style="border-top:1px solid #dfe6ee;">批量打印标签</el-dropdown-item>
            <el-dropdown-item>批量发卡</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="7">

        <!-- <el-input
          v-model="input1"
          :style="{ width: '200px', float: 'right' }"
          placeholder="搜索..."
          suffix-icon="el-icon-search"
        /> -->

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
        v-loading="tableLoading"
        resizable
        highlight-hover-row
        row-class-name="VxeTable_Row"
        :auto-resize="true"
        stripe
        class="vxetable"
        :tree-config="{children: 'children',iconOpen: 'el-icon-remove-outline', iconClose: 'el-icon-circle-plus-outline',expandAll:true}"
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :sort-config="{remote:true}"
        :data="tableData"
        @sort-change="sortChangeEvent"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column width="32" class="meuntd" :resizable="false" :edit-render="{}">
          <template>
            <div class="moreOuter">
              <i class="el-icon-more" />

            </div>
          </template>
          <template slot="edit" slot-scope="scope">
            <i class="el-icon-more" style="position:relative;top:1px;left: -1px;" />

            <div class="editmenu">
              <div class="item">编辑</div>
              <div class="item" @click="addNewDeputyAssets">副资产</div>
              <div class="item" @click="showCopyPage(scope.row)">复制</div>
              <!-- <el-popconfirm
                title="这是一段内容确定删除吗？"
              >
                <div slot="reference" class="item">删除</div>
              </el-popconfirm> -->
              <div class="item" @click="deteleAsset(scope.row)">删除</div>
              <div class="item create">发卡</div>
              <div class="item">换卡</div>
              <div class="item create">标签打印</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column width="80" title="状态" sortable>
          <template #default="{ row }">
            <span class="statuspan" :class="row.status | statusClass">{{ row.status }}</span>
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column width="80" title="状态" :filters="[{ data: '' }]" :filter-method="filterStatusMethod" :filter-multiple="true">
          <template #default="{ row }">
            <span class="statuspan" :class="row.status | statusClass">{{ row.status }}</span>
          </template>
          <template v-slot:filter="{ $panel, column }">
            <el-checkbox-group v-for="(option, index) in column.filters" :key="index" v-model="option.data" style="padding:10px" @change="$panel.changeOption($event, !!option.data, option)">
              <el-checkbox v-for="(item,i) in MainSortData.statusList " :key="i" :label="item.status_name" style="display:block;" />
            </el-checkbox-group>
          </template>
        </vxe-table-column> -->
        <vxe-table-column field="assetcode" title="资产编码" sortable min-width="100" :visible="tableShowColumn.zcbm" />
        <vxe-table-column field="assetname" title="资产名称" sortable tree-node width="300" :visible="tableShowColumn.zcmc">
          <template slot="header">
            <i v-if="isAllExpand" class="el-icon-remove-outline biaotiicon" @click="closeAllNode" />
            <i v-else class="el-icon-circle-plus-outline biaotiicon" @click="closeAllNode" />
            资产名称
          </template>
          <template #default="{ row }">
            <span class="titleText"><i /> {{ row.assetname }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="assetkindName" title="资产类别" sortable min-width="100" :visible="tableShowColumn.zclb">--</vxe-table-column>

        <vxe-table-column field="standardtypeName" title="标准型号" sortable min-width="100" :visible="tableShowColumn.bzxh" />

        <vxe-table-column field="norms" title="规格型号" sortable min-width="100" :visible="tableShowColumn.ggxh">
          <template #default="{ row }">
            <span>{{ row.diedai ? row.diedai : '--' }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="unitname" title="计量单位" min-width="100" sortable :visible="tableShowColumn.jldw" />

        <vxe-table-column field="buydate" title="购入日期" sortable min-width="120" :visible="tableShowColumn.grrq" />

        <vxe-table-column field="groupName" title="所属单位" min-width="100" sortable :visible="tableShowColumn.ssdw" />

        <vxe-table-column field="money" title="金额" min-width="100" sortable :visible="tableShowColumn.je">--</vxe-table-column>

        <vxe-table-column field="adminReguserName" title="管理员" sortable min-width="100" :visible="tableShowColumn.gly" />
        <vxe-table-column field="userName" title="使用人" min-width="100" sortable :visible="tableShowColumn.syr" />
        <vxe-table-column field="useMerchantName" title="使用单位" min-width="100" sortable :visible="tableShowColumn.sydw" />
        <!-- <vxe-table-column field="useBranchMerchantName" title="使用部门" min-width="100" sortable :visible="tableShowColumn.sybm" /> -->
        <vxe-table-column field="limitdate" title="使用期限" min-width="100" sortable :visible="tableShowColumn.syqx" />
        <vxe-table-column field="areaName" title="区域" min-width="100" sortable :visible="tableShowColumn.qy" />
        <vxe-table-column field="posname" title="存放地点" min-width="100" sortable :visible="tableShowColumn.cfdd" />
        <vxe-table-column field="memo" title="备注信息" min-width="100" :visible="tableShowColumn.bzxx" />
        <vxe-table-column field="statusName" title="物资状态" min-width="100" sortable :visible="tableShowColumn.wzzt" />
        <vxe-table-column field="rfidCode" title="RFID码" min-width="100" :visible="tableShowColumn.RFID" />
        <!-- <vxe-table-column title="自定义字段1" min-width="120" sortable :visible="tableShowColumn.zdyzd1">--</vxe-table-column> -->
        <!-- <vxe-table-column field="rfidCode" title="供应商" min-width="100" sortable :visible="tableShowColumn.gys" /> -->
        <!-- <vxe-table-column title="联系人" min-width="100" sortable :visible="tableShowColumn.lxr">--</vxe-table-column>
        <vxe-table-column title="联系方式" min-width="100" sortable :visible="tableShowColumn.lxfs">--</vxe-table-column>
        <vxe-table-column title="负责人" min-width="100" sortable :visible="tableShowColumn.fzr">--</vxe-table-column>

        <vxe-table-column field="endTime" title="维保时间" sortable min-width="120" :visible="tableShowColumn.wbsj" />
        <vxe-table-column title="维保说明" min-width="100" sortable :visible="tableShowColumn.wbsm">--</vxe-table-column> -->

      </vxe-table>
    </div>
    <pagination
      v-show="pageTotal>0"
      background
      :total="pageTotal"
      layout="prev, pager, next, jumper"
      :page.sync="pageQuery.pageNo"
      :limit.sync="pageQuery.pageSize"
      style="text-align:right;margin-top:20px;"
      @pagination="getList"
    />

    <!-- 模态框 -->
    <from-dialog
      :visible.sync="xjzyxxVisible"
      :title="xjzyxxTitle"
      :father-asset-code="fatherAssetCode"
      :main-sort-data="MainSortData"
      @confirm="submitData"
    />

    <!-- 模态框 高级搜索-->
    <el-dialog title="高级搜索" :visible.sync="gjssVisible" width="60%" class="gjssFormDom">
      <el-form :model="gjssForm" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" :label-width="formLabelWidth">
              <!-- <el-select v-model="gjssForm.status" size="small" placeholder="请选择状态" :style="{ width: '100%' }">
                <el-option label="状态一" value="1" />
              </el-select> -->

              <el-dropdown trigger="click" :style="{ width: '100%' }" placement="bottom-start">
                <el-input v-model="highSearch_status" size="small" readonly placeholder="请选择状态" />

                <el-dropdown-menu slot="dropdown">
                  <el-checkbox-group v-model="gjssForm.statusId" class="highSearchCheckbox">
                    <el-checkbox v-for="(item,i) in MainSortData.statusList" :key="i" :label="item.status_name" :value="item.status_id" />
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产编码" :label-width="formLabelWidth">
              <el-col :span="10" style="padding:0px;">
                <el-select v-model="gjssForm.assetcodeLogicType" size="small" placeholder="请选择条件" :style="{ width: '100%' }">
                  <el-option label="等于" value="EQ" />
                  <el-option label="不等于" value="NOTEQ" />
                  <el-option label="包含" value="CON" />
                  <el-option label="开头为" value="STARTWITH" />
                </el-select>
              </el-col>
              <el-col :span="13" :offset="1" style="padding:0px;">
                <el-input v-model="gjssForm.assetcode" size="small" placeholder="请输入资产编码" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产名称" :label-width="formLabelWidth">
              <el-col :span="10" style="padding:0px;">
                <el-select v-model="gjssForm.assetnameLogicType" size="small" placeholder="请选择条件" :style="{ width: '100%' }">
                  <el-option label="等于" value="EQ" />
                  <el-option label="不等于" value="NOTEQ" />
                  <el-option label="包含" value="CON" />
                  <el-option label="开头为" value="STARTWITH" />
                </el-select>
              </el-col>
              <el-col :span="13" :offset="1" style="padding:0px;">
                <el-input v-model="gjssForm.assetname" size="small" placeholder="请输入资产名称" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产类别" :label-width="formLabelWidth">
              <!-- <el-select v-model="gjssForm.assetkindId" size="small" placeholder="请选择资产类别" :style="{ width: '100%' }">
                <el-option label="资产类别" value="1" />
                <el-checkbox v-for="(item,i) in MainSortData.statusList" :key="i" :label="item.status_name" :value="item.status_id" />

              </el-select> -->

              <el-dropdown trigger="click" placement="bottom-start" style="width:100%" @visible-change="highSearchChangeAssetkind">
                <el-input v-model="checkedDepartTags" size="small" />

                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <!-- <el-tree
                    ref="dialogTree"
                    show-checkbox
                    node-key="groupId"
                    :props="defaultProps"
                    :data="MainSortData.assetkindList"
                  /> -->
                  <el-tree
                    ref="dialogTree"
                    show-checkbox
                    node-key="status_id"
                    :props="defaultProps"
                    :data="MainSortData.statusList"
                  />
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准型号" :label-width="formLabelWidth">
              <el-select v-model="gjssForm.standardtypeId" size="small" placeholder="请选择条件" :style="{ width: '100%' }">
                <el-option label="标准型号" value="1" />
              </el-select>

            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="规格型号" :label-width="formLabelWidth">
              <el-col :span="10" style="padding:0px;">
                <el-select v-model="gjssForm.normsLogicType" size="small" placeholder="请选择条件" :style="{ width: '100%' }">
                  <el-option label="等于" value="EQ" />
                  <el-option label="不等于" value="NOTEQ" />
                  <el-option label="包含" value="CON" />
                  <el-option label="开头为" value="STARTWITH" />
                </el-select>
              </el-col>
              <el-col :span="13" :offset="1" style="padding:0px;">
                <el-input v-model="gjssForm.norms" size="small" placeholder="请输入规格型号" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="购入日期" :label-width="formLabelWidth">
              <el-date-picker
                v-model="gjssForm.buydate"
                type="date"
                placeholder="选择日期"
                style="width:100%"
                size="small"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="所属单位" :label-width="formLabelWidth">

              <el-dropdown trigger="click" placement="bottom-start" style="width:100%" @visible-change="highSearchChangeAssetkind">
                <el-input v-model="checkedDepartTags" size="small" />

                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">

                  <el-tree
                    ref="dialogTree"
                    show-checkbox
                    node-key="status_id"
                    :props="defaultProps"
                    :data="MainSortData.statusList"
                  />
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="存放地点" :label-width="formLabelWidth">
              <el-col :span="10" style="padding:0px;">
                <el-select v-model="gjssForm.posnameLogicType" size="small" placeholder="请选择条件" :style="{ width: '100%' }">
                  <el-option label="等于" value="EQ" />
                  <el-option label="不等于" value="NOTEQ" />
                  <el-option label="包含" value="CON" />
                  <el-option label="开头为" value="STARTWITH" />
                </el-select>
              </el-col>
              <el-col :span="13" :offset="1" style="padding:0px;">
                <el-input v-model="gjssForm.posname" size="small" placeholder="请输入存放地点" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用单位" :label-width="formLabelWidth">
              <el-select v-model="gjssForm.useMerchantId" size="small" placeholder="请选择使用单位" :style="{ width: '100%' }">
                <el-option label="使用单位" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用人" :label-width="formLabelWidth">
              <!-- <el-select v-model="gjssForm.userId" size="small" placeholder="请先选择使用单位" :style="{ width: '100%' }" :disabled="!gjssForm.useMerchantId">
                <el-option label="使用人1" value="1" />
              </el-select> -->
              <el-autocomplete
                v-model="highSearchSeleUser"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                style="width:100%"
                size="small"
                :disabled="gjssForm.useMerchantId"
                @select="handleSelect "
              >
                <template slot-scope="{ item }">
                  <span> {{ item.chineseName }} </span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="使用期限" :label-width="formLabelWidth">

              <el-input v-model="gjssForm.limitdate" size="small" placeholder="请输入使用期限" />

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域" :label-width="formLabelWidth">
              <!-- <el-select v-model="gjssForm.areaId" size="small" placeholder="请选择区域" :style="{ width: '100%' }">
                <el-option label="区域" value="1" />
              </el-select> -->
              <el-dropdown trigger="click" placement="bottom-start" style="width:100%" @visible-change="highSearchChangeAssetkind">
                <el-input v-model="checkedDepartTags" size="small" />

                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">

                  <el-tree
                    ref="dialogTree"
                    show-checkbox
                    node-key="status_id"
                    :props="defaultProps"
                    :data="MainSortData.statusList"
                  />
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:10px;">
        <el-button @click="gjssVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHighSearch">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 复制资产 -->
    <el-dialog title="资产复制" :visible.sync="assetCopyVisible" width="600px" class="assetCopyDialog">
      <el-row>
        <el-col :span="10" class="assetCopy_title">
          资产名称：
        </el-col>
        <el-col :span="14">
          {{ assetCopyOptions.name }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" class="assetCopy_title">
          资产类别：
        </el-col>
        <el-col :span="14">
          {{ assetCopyOptions.type }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" class="assetCopy_title">
          输入数量：
        </el-col>
        <el-col :span="14">
          <el-input-number v-model="copyNum" :min="1" :max="99" @change="handleChange" />
          份
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assetCopyVisible = false">取 消</el-button>
        <el-button type="primary" @click="assetCopyConfirm">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import { getAssetsList, createAssets, deleteAsset, baseCode, copyAsset } from '@/api/assetManage'
import { getListRegUserByChineseName } from '@/api/settings'
import fromDialog from './components/formDialog'
import Pagination from '@/components/Pagination'
export default {
  name: 'AssetInfoManage',
  components: { fromDialog, Pagination },
  filters: {
    statusClass(e) {
      switch (e) {
        case '在库':
          return 'zaik'
        case '在运':
          return 'zaiy'
        case '闲置':
          return 'xianz'
        case '维修':
          return 'weix'
        case '报废':
          return 'baof'
        case '退运':
          return 'tuiy'
        default :
          return ' '
      }
    }

  },
  data() {
    return {
      highSearchSeleUser: '',
      filterStatusList: [],
      assetCopyVisible: false,
      fatherAssetCode: '',
      PerviewDialogImageUrl: '',
      PerviewDialogVisible: false,
      copyNum: 1,
      assetCopyOptions: {
        assetsId: '',
        name: '测试',
        type: '测试分类',
        number: 1
      },
      companyOptions: [
        { value: 'company1', label: '公司一' },
        { value: 'company2', label: '公司二' },
        { value: 'company3', label: '公司三' }
      ],
      avatarImageUrl: '',
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
      statusValue: '',
      searchIpt: '',
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
        { name: 'RFID码', model: 'RFID', disabled: false }
        // { name: '自定义字段1', model: 'zdyzd1', disabled: false },
        // { name: '供应商', model: 'gys', disabled: false },
        // { name: '联系人', model: 'lxr', disabled: false },
        // { name: '联系方式', model: 'lxfs', disabled: false },
        // { name: '负责人', model: 'fzr', disabled: false },
        // { name: '维保时间', model: 'wbsj', disabled: false },
        // { name: '维保说明', model: 'wbsm', disabled: false }
      ],

      gjssForm: {
        statusId: [],
        assetcode: '',
        assetcodeLogicType: '',
        assetname: '',
        assetnameLogicType: '',
        assetkindId: '',
        standardtypeId: '',
        norms: '',
        normsLogicType: '',
        buydate: '',
        merchantId: '',
        userId: '',
        useMerchantId: '',
        useBranchMerchantId: '',
        limitdate: '',
        posnameLogicType: '',
        posname: '',
        areaId: ''

      },
      formLabelWidth: '100px',
      isAllExpand: true,
      tableData: [],
      addDialogRoles: {
        assetname: [
          { required: true, message: '请输入资产名称', trigger: 'blur' }
        ],
        assetkindId: [
          { required: true, message: '请选择资产类别', trigger: 'change' }
        ],
        assetcode: [
          { required: true, message: '请输入资产编码', trigger: 'blur' }
        ]
      },
      pageQuery: {
        orderType: '',
        orderName: '',
        pageNo: 1,
        pageSize: 10
      },
      pageTotal: 0,
      tableLoading: false,
      MainSortData: {},
      // defaultProps: {
      //   children: 'zones',
      //   label: 'groupName',
      //   isLeaf: 'leaf'
      // }
      defaultProps: {
        children: 'children',
        label: 'status_name',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    highSearch_status() {
      return this.gjssForm.statusId.join(';')
    },
    checkedDepartTags() {
      return ''
    }
  },
  created() {
    this.getList()
    baseCode().then(res => {
      if (res.code === 0 && res.data) {
        for (const key in res.data) {
          this.$set(this.MainSortData, key, res.data[key])
        }
      }
      // this.MainSortData = res.data ? res.data : {}
    })
  },
  methods: {
    getList() {
      this.tableLoading = true
      getAssetsList(this.pageQuery).then(res => {
        console.log('res', res)
        if (res.code === 0 && res.data && res.data.items) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
          this.pageQuery.pageSize = res.data.limit
          this.pageQuery.pageNo = res.data.page
        }

        this.tableLoading = false
      }).catch(err => {
        console.log('err', err)
        this.tableLoading = false
      })
    },
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
      this.xjzyxxTitle = '新建资产信息'
      this.xjzyxxVisible = true
    },
    addNewDeputyAssets() {
      this.xjzyxxTitle = '新建副资产信息'
      this.xjzyxxVisible = true
      this.fatherAssetCode = 'testCode'
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
    },
    sortChangeEvent(column, property, order) {
      console.log('order', column.order)
      console.log('column', column)
      if (!column.order) {
        this.pageQuery.orderName = ''
        this.pageQuery.orderType = ''
        this.getList()
        return
      }
      this.pageQuery.pageNo = 1
      this.pageQuery.pageSize = 10
      this.pageQuery.orderName = column.property
      this.pageQuery.orderType = column.order.toUpperCase()
      this.getList()
    },
    operationSelect(command) {
      console.log('command', command)
      const a = document.createElement('a')
      a.setAttribute('href', '/asset/static/img/wave.29c712eb.png')
      a.setAttribute('download', '11222')
      a.setAttribute('target', '_blank')
      const clickEvent = new MouseEvent('click', { 'bubbles': true, 'cancelable': true })
      a.dispatchEvent(clickEvent)
    },

    showCopyPage(row) {
      console.log('row', row)
      this.assetCopyVisible = true
      this.assetCopyOptions.assetsId = row.assetId
      this.assetCopyOptions.name = row.assetname
      this.assetCopyOptions.type = row.assetkindName
    },
    deteleAsset(row) {
      console.log('row', row)
      this.$confirm('此操作将永久删除该资产, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAsset({ assetsId: row.assetId }).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '删除成功!' })
          } else {
            this.$message({ type: 'error', message: '删除失败，请稍后再试' })
          }
        }).catch(err => {
          this.$message({ type: 'error', message: '删除失败，请稍后再试' })
          console.log('err', err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleChange(val) {

    },
    handleRemove(file) {
      this.$refs.upload.handleRemove(file)
    },
    handlePictureCardPreview(file) {
      this.PerviewDialogImageUrl = file.url
      this.PerviewDialogVisible = true
    },
    submitData(data) {
      console.log('data', data)
      // return
      createAssets(data).then(res => {
        console.log('createAssets', res)
        if (res.code === 0) {
          this.$message({ type: 'success', message: '添加资产成功！' })
        } else {
          this.$message({ type: 'error', message: '添加资产失败，请稍后再试' })
        }
        this.xjzyxxVisible = false
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '添加资产失败，请稍后再试' })
        this.xjzyxxVisible = false
      })
    },
    confirmHighSearch() {
      const obj = { ...this.pageQuery, ...this.gjssForm }
      obj.statusId = [...this.gjssForm.statusId]
      console.log('obj', obj)
    },
    searchList() {

    },
    clearSearchRes() {

    },
    changeSelectdepartment(val) {
      console.log('changeSelectdepartment', val)
    },
    changeSelectType(val) {
      console.log('changeSelectType', val)
    },
    changeFilterEvent() {

    },
    filterStatusMethod() {

    },
    highSearchChangeAssetkind() {

    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        getListRegUserByChineseName({ chineseName: queryString }).then(res => {
          if (res.code === 0) {
            return cb(res.data)
          }
        })
        cb([])
      } else {
        cb([])
      }
    },
    handleSelect(item) {
      // console.log('item', item)
      this.gjssForm.userId = item.reguserId
      this.highSearchSeleUser = item.chineseName
    },
    assetCopyConfirm() {
      console.log('数量', this.copyNum)
      if (this.copyNum) {
        const obj = {
          count: this.copyNum,
          assetsId: this.assetCopyOptions.assetId
        }
        copyAsset(obj).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '复制成功！' })
          } else {
            this.$message({ type: 'error', message: '复制失败，请稍后再试！' })
          }
          this.assetCopyVisible = false
        }).catch(err => {
          console.log('err', err)
          this.assetCopyVisible = false
          this.$message({ type: 'error', message: '复制失败，请稍后再试！' })
        })
      } else {
        this.$message({ type: 'warning', message: '请输入复制数量' })
      }
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

 .statuspan { display: inline-block; border: 1px solid #8091a5; color: #8091a5; max-height: 66px; font-size: 12px; line-height: 20px; vertical-align: middle; border-radius: 12px; cursor: pointer; overflow: visible; padding: 2px 10px;
 border-color: transparent;
            &.zaik{border-color: #71C496; color: #71C496; }
            &.zaiy { border-color: #3582fb; background-color: #3582fb; color: #fff; }
            &.xianz { border-color: #818C95; background-color: #818C95;  color: #fff;}
            &.weix { border-color: #AD89C5; background-color: #AD89C5; color: #fff; }
            &.baof { border-color: #D56D53; background-color: #D56D53; color: #fff; }
            &.tuiy { border-color: #EEA446; background-color: #EEA446; color: #fff; }
          }

</style>
<style  scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader >>> .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 79px;
  height: 79px;
  line-height: 79px;
  text-align: center;
}
.avatar-uploader >>> .el-upload--picture-card {
  width: 79px;
  height: 79px;
  line-height: 79px;
}
.avatar-uploader >>> .el-upload-list--picture-card .el-upload-list__item {
      width: 79px;
    height: 79px;
}
.avatar {
  width: 79px;
  height: 79px;
  display: block;
}
/* .maintable >>> .VxeTable_Row:nth-last-of-type(1) .editmenu {
  top:-162px
} */

.maintable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}

.assetCopyDialog >>> .el-row {
  line-height: 50px;
  font-size: 14px;
}
.assetCopyDialog .assetCopy_title {
  text-align: right;
  padding-right: 20px;
}

.gjssFormDom >>>  .el-form-item {
  margin-bottom: 10px;
}
.gjssFormDom >>> .el-dialog__body {
  padding-bottom: 0;
}
.xjzyxx_dialog >>> .el-form-item{
  margin-bottom: 10px;
}
.xjzyxx_dialog >>> .el-form-item__error {
  top:90%;
}
.highSearchCheckbox >>> .el-checkbox {
  display: block;
  padding: 4px 10px;
}
</style>
