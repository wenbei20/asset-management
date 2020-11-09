<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form :model="addOption" label-position="right">
      <el-row>
        <el-col :span="8">
          <el-form-item label="维修编号" :label-width="addOptionWidth">
            <el-input v-model="addOption.id" placeholder="维修编号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="业务日期" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.receiveDate"
              type="date"
              placeholder="请选择业务日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="处理人" :label-width="addOptionWidth">
            <el-input v-model="addOption.receivePerson" placeholder="请输入处理人" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="维修花费" :label-width="addOptionWidth">
            <el-input v-model="addOption.receivePerson" placeholder="请输入维修花费" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="状态" :label-width="addOptionWidth">
            <el-select v-model="addOption.receiveCompany" placeholder="请选择状态" :style="{ width: '100%' }">
              <el-option label="公司一" value="1" />
              <el-option label="公司2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修人" :label-width="addOptionWidth">
            <el-select v-model="addOption.receiveDepartment" placeholder="请选择报修人" :style="{ width: '100%' }">
              <el-option label="部门一" value="1" />
              <el-option label="部门2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="维修内容" :label-width="addOptionWidth">

            <el-input v-model="addOption.receiveMemo" placeholder="维修内容" />
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
