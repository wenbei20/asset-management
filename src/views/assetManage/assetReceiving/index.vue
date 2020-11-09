<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
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
      <el-col :span="6" :style="{ textAlign: 'right' }">
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="帮助文字..."
        >
          <el-button slot="reference" type="text"><i class="el-icon-question" :style="{ fontSize: '18px' }" /></el-button>
        </el-popover>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" :style="{ textAlign: 'right' }">
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
                v-model="tableShowColumn[item.active]"
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
      <!--  <el-button type="text" :style="{ marginLeft: '10px' }"><i class="el-icon-lock" /></el-button> -->
      </el-col>
    </el-row>

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
            <div class="item">复制</div>
            <div class="item">删除</div>

          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column title="办理状态" min-width="80" :visible="tableShowColumn.blzt">--</vxe-table-column>
      <vxe-table-column title="领用单号" min-width="80" :visible="tableShowColumn.lydh">--</vxe-table-column>
      <vxe-table-column title="领用日期" min-width="80" :visible="tableShowColumn.lyrq">--</vxe-table-column>
      <vxe-table-column title="领用人" min-width="80" :visible="tableShowColumn.lyr">--</vxe-table-column>
      <vxe-table-column title="领用后使用公司" min-width="120" :visible="tableShowColumn.lysygs">--</vxe-table-column>
      <vxe-table-column title="领用后使用部门" min-width="120" :visible="tableShowColumn.lysybm">--</vxe-table-column>
      <vxe-table-column title="领用后区域" min-width="100" :visible="tableShowColumn.lyly">--</vxe-table-column>
      <vxe-table-column title="领用后存放地点" min-width="120" :visible="tableShowColumn.lycfdd">--</vxe-table-column>
      <vxe-table-column title="领用备注" min-width="80" :visible="tableShowColumn.lybz">--</vxe-table-column>
      <vxe-table-column title="处理人" min-width="80" :visible="tableShowColumn.clr">--</vxe-table-column>
      <vxe-table-column title="资产明细" min-width="80" :visible="tableShowColumn.zcmx">--</vxe-table-column>
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
          <el-col :span="24">
            <el-form-item label="说明" :label-width="addOptionWidth">

              <el-input v-model="addOption.receiveMemo" placeholder="说明" />
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
    </Dialog>
  </div>
</template>

<script>
import Dialog from '@/components/Dialog/index'
export default {
  name: 'AssetInfoManage',
  components: { Dialog },
  data() {
    return {
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
      tableShowColumn: {
        blzt: true,
        lydh: true,
        lyrq: true,
        lyr: true,
        lysygs: true,
        lysybm: true,
        lyly: true,
        lycfdd: true,
        lybz: true,
        clr: true,
        zcmx: true
      },
      gjssVisible: false,
      settingVisible: false,
      popoverSwitchList: [
        { name: '办理状态', active: 'blzt', disabled: false },
        { name: '领用单号', active: 'lydh', disabled: false },
        { name: '领用日期', active: 'lyrq', disabled: false },
        { name: '领用人', active: 'lyr', disabled: false },
        { name: '领用后使用公司', active: 'lysygs', disabled: false },
        { name: '领用后使用部门', active: 'lysybm', disabled: false },
        { name: '领用后区域', active: 'lyly', disabled: false },
        { name: '领用后存放地点', active: 'lycfdd', disabled: false },
        { name: '领用备注', active: 'lybz', disabled: false },
        { name: '处理人', active: 'clr', disabled: false },
        { name: '资产明细', active: 'zcmx', disabled: false }
      ],
      tableData: [
        { handleStatus: '' },
        { handleStatus: '' },
        { handleStatus: '' },
        { handleStatus: '' },
        { handleStatus: '' },
        { handleStatus: '' },
        { handleStatus: '' }
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

</style>
