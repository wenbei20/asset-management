<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新建</el-button>

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
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
      >
        <vxe-table-column title="生成任务文件" width="120" :resizable="false">
          <el-button type="primary" size="mini">生成</el-button>
        </vxe-table-column>
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
              <div class="item create">删除</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="eventID" title="盘点单号" sortable />
        <vxe-table-column field="person" title="盘点单名称" sortable />
        <!-- <vxe-table-column field="date" title="分配用户" sortable /> -->
        <vxe-table-column field="diedai" title="资产数量" sortable />
        <vxe-table-column field="status" title="创建时间" sortable />

        <vxe-table-column field="name" title="状态" sortable />
        <vxe-table-column field="title" title="状态修改" />

      </vxe-table>
    </div>
    <!-- 模态框 -->

    <Dialog
      :visible.sync="showAddOrEdit"
      :title="showAddOrEditTitle"
    >
      <el-form :model="addOption" label-position="right" style="padding-right:40px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="盘点单名称" :label-width="addOptionWidth">
              <el-input placeholder="请输入盘点单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配用户" :label-width="addOptionWidth">
              <el-dropdown trigger="click" placement="bottom-start" style="width:100%">
                <el-input v-model="checkedUserTags" placeholder="请选择分配用户" />
                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <el-checkbox-group v-model="addOption.userList" class="UserCheckbox">
                    <el-checkbox label="用户1" />
                    <el-checkbox label="用户2" />
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="购入开始时间" :label-width="addOptionWidth">
              <el-date-picker
                v-model="addOption.receiveDate"
                type="date"
                placeholder="请选择开始时间"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购入结束时间" :label-width="addOptionWidth">
              <el-date-picker
                v-model="addOption.receiveDate"
                type="date"
                placeholder="请选择结束时间"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位" :label-width="addOptionWidth">
              <el-select v-model="addOption.receiveArea" placeholder="请选择单位" :style="{ width: '100%' }">
                <el-option label="区域一" value="1" />
                <el-option label="区域2" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="部门" :label-width="addOptionWidth">
              <el-input v-model="addOption.receivePosition" placeholder="请选择部门" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="资产分类" :label-width="addOptionWidth">

              <el-input v-model="addOption.receiveHandler" placeholder="请选择资产分类" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="区域" :label-width="addOptionWidth">

              <el-input v-model="addOption.receiveMemo" placeholder="说明" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" :label-width="addOptionWidth">
              <el-input v-model="addOption.receiveMemo" placeholder="说明" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </Dialog>
    <el-dialog title="分配用户" :visible.sync="showEditUserDialog" width="600px" :close-on-click-modal="false">
      <el-form ref="EditDialog" :model="DialogData" label-position="right" style="padding-right:20px;">
        <el-form-item label="分配用户" label-width="100px" prop="person">
          <el-dropdown trigger="click" placement="bottom-start" style="width:100%">
            <el-input v-model="checkedUserTags" />
            <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
              <el-checkbox-group v-model="DialogData.userList">
                <el-checkbox label="1" />
                <el-checkbox label="2" />
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import Dialog from '@/components/Dialog/index'
export default {
  name: 'AssetInventoryManage',
  components: { Dialog },
  data() {
    return {
      showEditUserDialog: false,
      DialogData: {
        userList: []
      },
      checkedUserTags: '',
      defaultProps: {
        children: 'children',
        label: 'groupName',
        isLeaf: 'leaf'
      },
      showAddOrEditTitle: '',
      showAddOrEdit: false,
      addOptionWidth: '160px',
      topnav: '',
      addOption: {
        userList: [],
        receivePerson: '',
        receiveDate: '',
        receiveCompany: '',
        receiveDepartment: '',
        receiveArea: '',
        receivePosition: '',
        receiveHandler: '',
        receiveMemo: ''
      },
      gjssVisible: false,
      settingVisible: false,
      tableData: [
        {
          handleStatus: '',
          requisitionNumber: 'RE20201500021285',
          requisitionDate: '2020-10-08',
          requisitionUser: '员工2',
          requisitionCompany: '测试公司',
          requisitionDepartment: '',
          requisitionArea: '',
          requisitionStorage: '',
          requisitionRemark: '',
          updateBy: '孙帆',
          assetDetails: '资产明细'
        }
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
      formLabelWidth: '100px'
    }
  },
  methods: {
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
    handleAddNodeClick(item) {

    }
  }
}
</script>

<style  scoped>
.maintable {
  padding-top: 40px;
}
.UserCheckbox >>> .el-checkbox {
  display: block;
  padding: 4px 10px;
}
</style>
