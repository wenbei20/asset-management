<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form :model="addOption" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="退库处理人" :label-width="addOptionWidth">
            <el-select v-model="addOption.receivePerson" placeholder="请选择退库处理人" :style="{ width: '100%' }">
              <el-option label="退库处理人一" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际退库时间" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.receiveDate"
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
            <el-select v-model="addOption.receiveDepartment" placeholder="请选择退库后使用公司" :style="{ width: '100%' }">
              <el-option label="部门一" value="1" />
              <el-option label="部门2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="退库后区域" :label-width="addOptionWidth">
            <el-select v-model="addOption.receiveArea" placeholder="请选择区域" :style="{ width: '100%' }">
              <el-option label="区域一" value="1" />
              <el-option label="区域2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退库后存放地点" :label-width="addOptionWidth">
            <el-input v-model="addOption.receivePosition" placeholder="请输入存放地点" />
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
