<template>
  <el-dialog
    title="新建标准型号"
    :visible.sync="visible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="dialogFormRules"
      label-width="120px"
      style="margin-right: 20px;"
    >
      <el-form-item label="资产类型">
        <el-input :value="`${currentNode.assetkindId}-${currentNode.assetkindName}`" disabled />
      </el-form-item>
      <el-form-item label="资产名称" prop="assetName">
        <el-input v-model="dialogForm.assetName" />
      </el-form-item>
      <el-form-item label="规格型号" prop="standardtypeName">
        <el-input v-model="dialogForm.standardtypeName" />
      </el-form-item>
      <el-form-item label="标准规格编号" prop="standardtypeId">
        <el-input v-model="dialogForm.standardtypeId" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveStandardType } from '@/api/settings'
export default {
  name: 'AddDialogStandardType',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogForm: {
        assetName: '',
        standardtypeName: '',
        standardtypeId: ''
      },
      dialogFormRules: {
        assetName: [
          { required: true, message: '请输入资产名称', trigger: 'blur' }
        ],
        standardtypeName: [
          { required: true, message: '请输入规格型号', trigger: 'blur' }
        ],
        standardtypeId: [
          { required: true, message: '请输入标准规格编号', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // Fn: 关闭
    handleClose() {
      this.$emit('changeNewClassificationVisible', false)
    },
    // Fn: 确认
    handleConfirm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.saveStandardType()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // Fn: 保存
    saveStandardType() {
      const { assetkindId } = this.currentNode
      const params = {
        assetkindId,
        ...this.dialogForm
      }
      saveStandardType(params).then((res) => {
        console.log(119, res)
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功！',
            showClose: true
          })
          this.$emit('saveStandardTypeSuccess')
        }
      }).catch((err) => { console.log('err', err) })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
