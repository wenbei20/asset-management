<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form :model="addOption" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="清理单号" :label-width="addOptionWidth">
            <el-input v-model="addOption.receivePerson" placeholder="单号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="清理日期" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.receiveDate"
              type="date"
              placeholder="请选择清理日期"
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
          <el-form-item label="清理人" :label-width="addOptionWidth">
            <el-select v-model="addOption.receiveDepartment" placeholder="请选择清理人" :style="{ width: '100%' }">
              <el-option label="部门一" value="1" />
              <el-option label="部门2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="23">
          <el-form-item label="说明" :label-width="addOptionWidth">

            <el-input v-model="addOption.receiveMemo" type="textarea" placeholder="说明" />
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
