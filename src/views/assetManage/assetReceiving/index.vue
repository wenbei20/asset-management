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
              :data="allCompanyData"
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
        <vxe-table-column title="领用单号" min-width="100">--</vxe-table-column>
        <vxe-table-column title="领用日期" min-width="100" sortable>--</vxe-table-column>
        <vxe-table-column title="领用人" min-width="80" sortable>--</vxe-table-column>
        <vxe-table-column title="领用后使用单位" min-width="120" sortable>--</vxe-table-column>
        <vxe-table-column title="领用后区域" min-width="100" sortable>--</vxe-table-column>
        <vxe-table-column title="领用后存放地点" min-width="120">--</vxe-table-column>
        <vxe-table-column title="处理人" min-width="80">--</vxe-table-column>
        <vxe-table-column title="资产明细" min-width="100">--</vxe-table-column>
      </vxe-table>
    </div>

    <Dialog
      :visible.sync="showAddOrEdit"
      :title="showAddOrEditTitle"
    >
      <el-form :model="addOption" label-position="right">
        <el-row>
          <el-col :span="11">
            <el-form-item label="领用人" :label-width="addOptionWidth">
              <el-select v-model="addOption.receivePerson" placeholder="请选择领用人" :style="{ width: '100%' }">
                <el-option label="领用人一" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用日期" :label-width="addOptionWidth">
              <el-date-picker
                v-model="addOption.receiveDate"
                type="date"
                placeholder="请选择领用日期"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="领用后使用公司" :label-width="addOptionWidth">
              <el-select v-model="addOption.receiveCompany" placeholder="请选择使用公司" :style="{ width: '100%' }">
                <el-option label="公司一" value="1" />
                <el-option label="公司2" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用后使用部门" :label-width="addOptionWidth">
              <el-select v-model="addOption.receiveDepartment" placeholder="请选择使用部门" :style="{ width: '100%' }">
                <el-option label="部门一" value="1" />
                <el-option label="部门2" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="领用后区域" :label-width="addOptionWidth">
              <el-select v-model="addOption.receiveArea" placeholder="请选择区域" :style="{ width: '100%' }">
                <el-option label="区域一" value="1" />
                <el-option label="区域2" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用后存放地点" :label-width="addOptionWidth">
              <el-input v-model="addOption.receivePosition" placeholder="请输入存放地点" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="领用处理人" :label-width="addOptionWidth">

              <el-input v-model="addOption.receiveHandler" :disabled="true" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="说明" :label-width="addOptionWidth">

              <el-input v-model="addOption.receiveMemo" placeholder="说明" />
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <div class="selectBtns">
        <el-button type="primary" plain @click="showSelectTable=true">选择资产</el-button>
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
        :data="tableData"
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
      <el-dialog title="选择资产" :visible.sync="showSelectTable" append-to-body width="70%">
        <vxe-table
          ref="innerSeleTree"
          resizable
          highlight-hover-row
          :auto-resize="true"
          stripe
          class="innerVxetable"
          :data="tableData"
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="showSelectTable = false">取 消</el-button>
          <el-button type="primary" @click="innerTableConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </Dialog>
  </div>
</template>

<script>
import { getReceiveList } from '@/api/assetManage'
import Dialog from '@/components/Dialog/index'
export default {
  name: 'AssetInfoManage',
  components: { Dialog },
  data() {
    return {
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
        receivePerson: '',
        receiveDate: '',
        receiveCompany: '',
        receiveDepartment: '',
        receiveArea: '',
        receivePosition: '',
        receiveHandler: 'admin',
        receiveMemo: ''
      },
      settingVisible: false,
      showSelectTable: false,
      tableData: [
        { handleStatus: '12' },
        { handleStatus: '232' },
        { handleStatus: 'asdas' },
        { handleStatus: '' },
        { handleStatus: '' },
        { handleStatus: '' },
        { handleStatus: '' }
      ],
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
      pageTotal: 0

    }
  },
  methods: {
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
