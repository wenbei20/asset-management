<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form :model="xjzyxxForm" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="调出公司" :label-width="formLabelWidth" required>
            <el-col :span="24">
              <el-select v-model="xjzyxxForm.assetCategory" placeholder="请选择调出公司" :style="{ width: '100%' }">
                <el-option label="公司1" value="1" />
                <el-option label="公司2" value="2" />
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入公司" :label-width="formLabelWidth" required>
            <el-col :span="24">
              <el-select v-model="xjzyxxForm.standardModel" placeholder="请选择调入公司" :style="{ width: '100%' }">
                <el-option label="公司1" value="1" />
                <el-option label="公司2" value="2" />
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入管理员" :label-width="formLabelWidth" required>
            <el-col :span="24">
              <el-select v-model="xjzyxxForm.assetCoding" placeholder="请选择调入管理员" :style="{ width: '100%' }">
                <el-option label="公司1" value="1" />
                <el-option label="公司2" value="2" />
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" :label-width="formLabelWidth">
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

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeThis">取 消</el-button>
      <el-button type="primary" @click="closeThis">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      xjzyxxVisible: false,
      formLabelWidth: '100px',
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
      }
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
    }
  }
}
</script>
