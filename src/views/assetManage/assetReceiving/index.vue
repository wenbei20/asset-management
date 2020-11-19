<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-dropdown ref="statusDrop" trigger="click" placement="bottom-start" style="margin-right:6px;">
          <el-input v-model="checkedCompany" placeholder="请选择领用后使用单位" clearable />

          <el-dropdown-menu slot="dropdown" class="innerTreeForDepart" style="min-width:200px;">
            <el-tree
              ref="companyTree"
              node-key="assetkindId"
              :props="defaultProps"
              :data="MainSortData.groupList"
              :default-expand-all="true"
              :expand-on-click-node="true"
              @node-click="companyTreeClick"
            />
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新建</el-button>
        <!-- <el-dropdown @command="editClick">
          <el-button type="default" icon="el-icon-edit" :style="{ marginLeft: '5px' }" plain>
            编辑<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">修改</el-dropdown-item>
            <el-dropdown-item :command="2">复制</el-dropdown-item>
            <el-dropdown-item :command="3">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button type="default" icon="el-icon-printer" :style="{ marginLeft: '5px' }" plain>
          打印
        </el-button>
        <el-button type="default" icon="el-icon-receiving" :style="{ marginLeft: '5px' }" plain>
          导出
        </el-button>
      </el-col>
    </el-row>
    <div style="padding-top:40px;">

      <vxe-table
        ref="xTree"
        v-loading="tableLoading"
        resizable
        highlight-hover-row
        :auto-resize="true"
        :footer-row-class-name="'lastRow'"
        stripe
        class="vxetable"
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
              <div class="item">删除</div>

            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="receivecode" title="领用单号" min-width="100" />
        <vxe-table-column field="receivedate" title="领用日期" min-width="100" sortable />
        <vxe-table-column field="userName" title="领用人" min-width="80" sortable />
        <vxe-table-column field="receiveMerchantName" title="领用后使用单位" min-width="120" sortable />
        <vxe-table-column field="receiveAreaName" title="领用后区域" min-width="100" sortable />
        <vxe-table-column field="receivePosname" title="领用后存放地点" min-width="120" />
        <vxe-table-column field="receiveUserName" title="处理人" min-width="80" />
        <vxe-table-column title="资产明细" min-width="100">
          <el-link type="primary" :underline="false">详情</el-link>
        </vxe-table-column>
      </vxe-table>
    </div>

    <Dialog
      :visible.sync="showAddOrEdit"
      :title="showAddOrEditTitle"
    >
      <el-form ref="addOption" :model="addOption" label-position="right" class="gjssFormDom" :rules="addOptionRules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="领用后使用单位" :label-width="addOptionWidth" prop="checkedMerchartName">
              <el-dropdown ref="mechartDrop" trigger="click" placement="bottom-start" style="width:100%">
                <el-input v-model="addOption.checkedMerchartName" size="small" placeholder="请选择使用单位" />

                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">

                  <el-tree
                    ref="mechartTree"
                    node-key="groupId"
                    :props="mechartProps"
                    :data="MainSortData.groupList"
                    :default-expand-all="true"
                    :expand-on-click-node="true"
                    @node-click="mechartTreeNodeClick"
                  />
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用人" :label-width="addOptionWidth" prop="userId">
              <el-select v-model="addOption.userId" v-loading="allMechartUser.loading" size="small" placeholder="选择使用单位后，请选择使用人" :style="{ width: '100%' }" :disabled="!addOption.receiveMerchantId">
                <el-option v-for="(ele , i ) in allMechartUser.list" :key="i" :value="ele.reguserId" :label="ele.chineseName" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="领用日期" :label-width="addOptionWidth" prop="receivedate">
              <el-date-picker
                v-model="addOption.receivedate"
                type="date"
                placeholder="请选择领用日期"
                style="width:100%;"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用后区域" :label-width="addOptionWidth" prop="receiveAreaId">
              <el-select v-model="addOption.receiveAreaId" size="small" placeholder="请选择区域" :style="{ width: '100%' }">
                <el-option v-for="(ele , i ) in MainSortData.areaList" :key="i" :value="ele.area_id" :label="ele.area_name" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="领用处理人" :label-width="addOptionWidth">
              <el-input v-model="thisUserName" disabled size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用后存放地点" :label-width="addOptionWidth" prop="receivePosname">
              <el-input v-model="addOption.receivePosname" placeholder="请输入存放地点" size="small" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row />
        <el-row>
          <el-col :span="23">
            <el-form-item label="说明" :label-width="addOptionWidth">

              <el-input v-model="addOption.memo" placeholder="说明" size="small" />
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <div class="selectBtns">
        <el-button type="primary" plain @click="SelectAssetTable">选择资产</el-button>
        <el-button plain>删除所选</el-button>
      </div>

      <vxe-table
        ref="innerTree"
        resizable
        highlight-hover-row
        height="300"
        :auto-resize="true"
        stripe
        class="innerVxetable"
        :data="selectedTableDataArr"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column title="照片" min-width="60">--</vxe-table-column>
        <vxe-table-column title="资产编码" min-width="120">--</vxe-table-column>
        <vxe-table-column title="资产名称" min-width="120">--</vxe-table-column>
        <vxe-table-column title="所属公司" min-width="120">--</vxe-table-column>
        <vxe-table-column title="当前所在公司" min-width="120">--</vxe-table-column>
        <vxe-table-column title="当前所在部门" min-width="120">--</vxe-table-column>
        <vxe-table-column title="当前使用人" min-width="120">--</vxe-table-column>
        <vxe-table-column title="存放地点" min-width="120">--</vxe-table-column>
      </vxe-table>
      <el-dialog title="选择资产" :visible.sync="showSelectTable" :close-on-click-modal="false" append-to-body width="70%" class="innerTreeDialog" @close="closeInnerTreeDialog">
        <vxe-table
          ref="innerSeleTree"
          v-loading="selectInnerTable.loading"
          resizable
          highlight-hover-row
          :auto-resize="true"
          row-id="assetId"
          stripe
          class="innerVxetable"
          :data="selectInnerTable.data"
          :checkbox-config="{checkRowKeys: defaultSelecteRows}"
          @checkbox-change="innerTreeCheckChange"
        >
          <vxe-table-column type="checkbox" width="40" :resizable="false" />
          <vxe-table-column field="imageList" title="照片" min-width="60">
            <template #default="{ row }">
              <span v-if="!row.imageList || row.imageList.length === 0" class="innerTree_noimages">暂无</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="assetcode" title="资产编码" min-width="120" />
          <vxe-table-column field="assetname" title="资产名称" min-width="120" />
          <vxe-table-column field="groupName" title="所属单位" min-width="120" />
          <vxe-table-column field="useMerchantName" title="使用单位" min-width="120" />
          <vxe-table-column field="userName" title="使用人" min-width="120" />
          <vxe-table-column field="posname" title="存放地点" min-width="120" />
        </vxe-table>

        <pagination
          v-show="innerTreePageTotal>0"
          background
          :total="innerTreePageTotal"
          layout=" prev, pager, next, jumper"
          :page.sync="innerSelePageQuery.pageNo"
          :limit.sync="innerSelePageQuery.pageSize"
          style="text-align:right;margin-top:20px;"
          @pagination="getInnerTreeList"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeInnerTreeDialog">取 消</el-button>
          <el-button type="primary" @click="innerTableConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </Dialog>
  </div>
</template>

<script>
import { getReceiveList, baseCode, getAllMechartUser, createReceive, getInnerAssetList } from '@/api/assetManage'
import Dialog from '@/components/Dialog/index'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
  name: 'AssetInfoManage',
  components: { Dialog, Pagination },
  data() {
    return {
      addOptionRules: {
        checkedMerchartName: [
          { required: true, message: '请选择使用单位', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请选择使用人', trigger: 'blur' }
        ],
        receivedate: [
          { required: true, message: '请选择领用日期', trigger: 'blur' }
        ],
        receiveAreaId: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        receivePosname: [
          { required: true, message: '请输入存放地点', trigger: 'blur' }
        ]
      },
      mechartProps: {
        children: 'children',
        label: 'groupName'
      },
      checkedCompany: '',
      allCompanyData: [],
      defaultProps: {
        children: 'children',
        label: 'assetkindName',
        isLeaf: 'leaf'
      },
      showAddOrEditTitle: '',
      showAddOrEdit: false,
      addOptionWidth: '160px',
      addOption: {
        assetsIds: [],
        memo: '',
        receiveAreaId: '',
        receiveMerchantId: '',
        receivePosname: '',
        receivedate: '',
        userId: '',
        checkedMerchartName: ''

      },
      settingVisible: false,
      showSelectTable: false,
      tableData: [],
      formLabelWidth: '100px',
      pageQuery: {
        orderName: '',
        orderType: '',
        pageNo: 1,
        pageSize: 10,
        receiveMerchantId: '',
        receivecode: '',
        receivedate: ''
      },
      pageTotal: 0,
      MainSortData: {},
      allMechartUser: {
        list: [],
        loading: false
      },
      selectInnerTable: {
        loading: false,
        data: []
      },

      selectedTableData: {},
      selectedTableDataArr: [],
      defaultSelecteRows: [],

      innerSelePageQuery: {
        pageNo: 1,
        pageSize: 10
      },
      innerTreePageTotal: 0,
      tableLoading: false

    }
  },
  computed: {
    ...mapState({
      thisMerchantName: state => state.user.merchantName,
      thisUserName: state => state.user.userChname
    })
  },
  created() {
    this.getList()
    baseCode().then(res => {
      if (res.code === 0 && res.data) {
        for (const key in res.data) {
          this.$set(this.MainSortData, key, res.data[key])
        }
      }
    })
  },
  methods: {
    SelectAssetTable() {
      this.showSelectTable = true
      this.getInnerTreeList()
    },
    getInnerTreeList(page) {
      this.selectInnerTable.loading = true
      getInnerAssetList(this.innerSelePageQuery).then(res => {
        console.log('res', res)
        if (res.code === 0 && res.data && res.data.items) {
          // res.data.items.forEach(ele => { ele.hasChild = true })
          this.selectInnerTable.data = res.data.items
          this.innerTreePageTotal = res.data.total
          this.innerSelePageQuery.pageSize = res.data.limit
          this.innerSelePageQuery.pageNo = res.data.page

          // this.$refs.innerSeleTree.reloadData(this.selectInnerTable.data)
          this.$refs.innerSeleTree.reloadData()
        }

        this.selectInnerTable.loading = false
      }).catch(err => {
        console.log('err', err)
        this.selectInnerTable.loading = false
      })
    },
    saveOrDeleteChecked() {
      const checkInfoArr = this.$refs.innerSeleTree.getCheckboxRecords()
      if (checkInfoArr && checkInfoArr.length) {
        checkInfoArr.forEach(item => {
          if (item.assetId) {
            if (!this.selectedTableData[item.assetId]) {
              this.selectedTableData[item.assetId] = { ...item }
            }
            if (this.defaultSelecteRows.findIndex(ele => ele === item.assetId) === -1) {
              this.defaultSelecteRows.push(item.assetId)
            }
          }
        })
      }
    },
    innerTreeCheckChange({ checked, row }) {
      console.log('checked', checked)
      console.log('row', row)

      const idx = this.defaultSelecteRows.findIndex(ele => ele === row.assetId)
      if (checked) {
        if (idx === -1) {
          this.defaultSelecteRows.push(row.assetId)
        }
        this.selectedTableData[row.assetId] = { ...row }
      } else {
        if (this.selectedTableData[row.assetId]) {
          delete this.selectedTableData[row.assetId]
        }
        if (idx !== -1) {
          this.defaultSelecteRows.splice(idx, 1)
        }
      }
    },
    mechartTreeNodeClick(item) {
      this.addOption.receiveMerchantId = item.groupId
      this.addOption.checkedMerchartName = item.groupName
      this.$nextTick(() => {
        this.$refs.mechartDrop.hide()
      })

      this.allMechartUser.loading = true
      getAllMechartUser({ groupId: item.groupId }).then(res => {
        if (res.code === 0) {
          this.allMechartUser.list = res.data
        }
      }).finally(() => {
        this.allMechartUser.loading = false
      })
    },
    companyTreeClick(item) {

    },
    getList(page) {
      if (page && page.limit) this.pageQuery.pageSize = page.limit

      this.tableLoading = true
      getReceiveList(this.pageQuery).then(res => {
        console.log('res', res)
        if (res.code === 0 && res.data && res.data.items) {
          // res.data.items.forEach(ele => { ele.hasChild = true })
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addNew() {
      this.showAddOrEditTitle = '新增'
      this.showAddOrEdit = true
    },
    editClick(e) {
      if (e === 1) {
        this.showAddOrEditTitle = '编辑'
        this.showAddOrEdit = true
      }
    },
    innerTableConfirm() {
      const num = this.$refs.innerSeleTree.getCheckboxRecords()
      console.log('num', num)
      // createReceive()
    },
    closeInnerTreeDialog() {
      this.showSelectTable = false
      this.innerSelePageQuery = { pageNo: 1, pageSize: 10 }
      this.selectInnerTable.data = []
    }
  }
}
</script>

<style lang="scss" scoped>
.popoverSwitchList{ padding: 0; margin-bottom: 10px; max-height: 400px; overflow-y: auto;
  .item{ margin: 15px 0;
    ::v-deep{
      .el-switch__label{ font-weight: 400;
        &.is-active{ color: #333;}
      }
    }
  }
}
.selectBtns {
  padding: 20px 0;
}

</style>
<style  scoped>
.gjssFormDom >>>  .el-form-item {
  margin-bottom: 10px;
}
.gjssFormDom >>> .el-dialog__body {
  padding-bottom: 0;
}
.gjssFormDom >>> .el-form-item__error {
  top: 90%;
}
.innerTreeDialog >>> .el-dialog__body {
  padding-bottom: 0;
}
.innerTree_noimages {
  display: inline-block;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #e9e9e9;
  color: #aaa;
}
</style>
