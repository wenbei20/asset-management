<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form :model="addOption" ref="ruleForm" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="退库处理人" :label-width="addOptionWidth">
            <el-select v-model="addOption.backUserId" placeholder="请选择退库处理人" :style="{ width: '100%' }">
              <el-option label="退库处理人一" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际退库时间" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.backdate"
              type="date"
              placeholder="请选择实际退库时间"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="业务所属公司" :label-width="addOptionWidth">
            <el-select v-model="addOption.receiveCompany" placeholder="请选择业务所属公司" :style="{ width: '100%' }">
              <el-option label="公司一" value="1" />
              <el-option label="公司2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退库后使用公司" :label-width="addOptionWidth">
            <el-select v-model="addOption.useMerchantId" placeholder="请选择退库后使用公司" :style="{ width: '100%' }">
              <el-option label="部门一" value="1" />
              <el-option label="部门2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="退库后区域" :label-width="addOptionWidth">
            <el-select v-model="addOption.areaId" placeholder="请选择区域" :style="{ width: '100%' }">
              <el-option label="区域一" value="1" />
              <el-option label="区域2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退库后存放地点" :label-width="addOptionWidth">
            <el-input v-model="addOption.posname" placeholder="请输入存放地点" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="23">
          <el-form-item label="说明" :label-width="addOptionWidth">

            <el-input v-model="addOption.memo" placeholder="说明" />
          </el-form-item>
        </el-col>

      </el-row>

      <div :style="{ margin: '10px 0' }">
        <el-button plain>选择资产</el-button>
        <el-button disabled>删除所选</el-button>
      </div>

      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        class="vxetable"
        :v-loading="tableLoading"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="tableData"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="picture" title="照片" />
        <vxe-table-column field="assetCode" title="资产编码" />
        <vxe-table-column field="assetName" title="资产名称" />
        <vxe-table-column field="guizeNo" title="规格型号" />
        <vxe-table-column field="snNo" title="SN号" />
        <vxe-table-column field="company" title="所属公司" />
        <vxe-table-column field="storeArea" title="存放地点" />
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeThis">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { saveAssetBack, updateAssetBack } from '@/api/assetManage'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    groupList: {
      type: Array,
      default: []
    },
    modalType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      xjzyxxVisible: false,
      addOptionWidth: '160px',
      addOption: {
        backUserId: '',
        backdate: '',
        receiveCompany: '',
        useMerchantId: '',
        areaId: '',
        posname: '',
        memo: '',
        assetUuids: []
      },
      tableLoading: false,
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.xjzyxxVisible = val
      },
      immediate: true
    }
  },
  methods: {
    closeThis() {
      this.xjzyxxVisible = false
      this.$emit('update:visible', false)
    },
    // 表单确认
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSave(this.addOption)
          .then((res) => {
            // if (res.code === 0) {
              this.$emit('update:visible', false)
              this.$parent.getList()
            // }
          })
          .catch((err) => { console.log('err', err) })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 确认保存接口
    confirmSave(params) {
      if (this.modalType === 'new') {
        return saveAssetBack(params)
      } else if (this.modalType === 'edit') {
        return updateAssetBack(params)
      }
    }
  }
}
</script>
