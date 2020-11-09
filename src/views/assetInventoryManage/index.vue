<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新建</el-button>

        <el-button type="default" icon="el-icon-receiving" :style="{ marginLeft: '5px' }" plain>
          导出
        </el-button>
        <el-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right">
          <span :style="{ fontSize: '12px' }">
            <i class="el-icon-question" :style="{ fontSize: '18px' ,margin:'0 5px 0 10px'}" />如何盘点固定资产
          </span>
        </el-tooltip>
      </el-col>
      <el-col :span="6" :style="{ textAlign: 'right' }">
        <el-radio-group v-model="topnav" size="medium">
          <el-radio-button label="全部(1)" />
          <el-radio-button label="已完成(1)" />
          <el-radio-button label="未完成(0)" />
        </el-radio-group>
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
        <!--   <el-button slot="reference" type="text" :style="{ marginLeft: '10px' }"><i class="el-icon-setting" /></el-button> -->
        </el-popover>
      <!--  <el-button type="text" :style="{ marginLeft: '10px' }"><i class="el-icon-lock" /></el-button> -->
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="700px"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="handleStatus" label="盘点名称" />
      <el-table-column prop="requisitionNumber" label="允许手工盘点" />
      <el-table-column prop="requisitionUser" label="创建人" />
      <el-table-column prop="requisitionCompany" label="创建时间" />
      <el-table-column prop="requisitionDepartment" label="状态" />
      <el-table-column prop="requisitionArea" label="完成" />
      <el-table-column prop="requisitionStorage" label="盘点报告" />
      <el-table-column label="操作">
        <el-link icon="el-icon-user" :underline="false" type="primary">分配用户</el-link>
        <el-link icon="el-icon-edit" :underline="false" type="primary">详情</el-link>
        <el-link icon="el-icon-delete" :underline="false" type="primary">删除</el-link>
      </el-table-column>
    </el-table>

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
  name: 'AssetInventoryManage',
  components: { Dialog },
  data() {
    return {
      showAddOrEditTitle: '',
      showAddOrEdit: false,
      addOptionWidth: '160px',
      topnav: '',
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
