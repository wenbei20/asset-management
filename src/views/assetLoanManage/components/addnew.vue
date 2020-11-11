<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form :model="addOption" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="处理人" :label-width="addOptionWidth">
            <el-input v-model="addOption.receivePerson" placeholder="请输入处理人" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="借出时间" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.receiveDate"
              type="date"
              placeholder="请选择借出时间"
            />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="预计归还时间" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.receivePosition"
              type="date"
              placeholder="请选择预计归还时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="借出处理人" :label-width="addOptionWidth">
            <el-input v-model="addOption.receiveHandler" placeholder="请输入借出处理人" disabled />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="实际归还时间" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.receivePosition"
              type="date"
              placeholder="请选择实际归还时间"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归还处理人" :label-width="addOptionWidth">
            <el-input v-model="addOption.receiveHandler" placeholder="请输入归还处理人" disabled />
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
      addOptionWidth: '100px',
      addOption: {
        id: '',
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
