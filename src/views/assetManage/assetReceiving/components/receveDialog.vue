<template>
  <el-dialog :title="title" :visible.sync="innerVisible" width="600px" @close="closeThis">
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
      <el-form-item label="资产编号" :label-width="formLabelWidth">
        <el-col :span="10">
          <el-select v-model="form.assetCoding" placeholder="请选择条件" :style="{ width: '100%' }">
            <el-option label="资产编号" value="1" />
          </el-select>
        </el-col>
        <el-col :span="13" :offset="1">
          <el-input v-model="form.assetCodingInput" placeholder="请输入资产编号" />
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
    },
    title: {
      type: String,
      default: '新增'
    }
  },
  data() {
    return {
      innerVisible: false,
      formLabelWidth: '100px',
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
      }
    }
  },
  methods: {
    closeThis() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    }
  }
}
</script>
