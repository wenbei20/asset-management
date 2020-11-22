<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="dialogFormRules"
      label-width="100px"
      style="margin-right: 20px;"
    >
      <el-form-item label="分类编码" prop="assetkindId">
        <el-input v-model="dialogForm.assetkindId" />
      </el-form-item>
      <el-form-item label="分类名称" prop="assetkindName">
        <el-input v-model="dialogForm.assetkindName" />
      </el-form-item>
      <el-form-item label="上级" prop="parentAssetcode">
        <el-input v-model="dialogForm.parentAssetcode" disabled />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkAssetKindByAssetKindIdExist, saveAssetKind } from '@/api/settings'
export default {
  name: 'AddDialogClassification',
  props: {
    type: {
      type: String,
      default: ''
    },
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
    // 验证：分类编码
    const validateAssetkindId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('必填'))
      } else {
        const params = {
          assetKindId: value
        }
        checkAssetKindByAssetKindIdExist(params).then((res) => {
          // console.log(157, res)
          if (res.code !== 0) {
            callback(new Error('已经存在，不能重复'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      dialogForm: {
        assetkindId: '',
        assetkindName: '',
        parentAssetcode: '',
        chargePerson: ''
      },
      dialogFormRules: {
        assetkindId: [
          { required: true, message: '请输入分类编号', validator: validateAssetkindId, trigger: 'blur' }
        ],
        assetkindName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.type === 'sibling' ? '新建同级分类' : '新建下级分类'
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
          console.log(101)
          this.saveAssetKind()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // Fn: 保存
    saveAssetKind() {
      const { assetkindId, assetkindName } = this.dialogForm
      const { depth, parentAssetcode } = this.currentNode
      const params = {
        assetkindId,
        assetkindName,
        depth,
        parentAssetcode
      }
      saveAssetKind(params).then((res) => {
        console.log(119, res)
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功！',
            showClose: true
          })
          this.$emit('saveClassificationSuccess')
        }
      }).catch((err) => { console.log('err', err) })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
