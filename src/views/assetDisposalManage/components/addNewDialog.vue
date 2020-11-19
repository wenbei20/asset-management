<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form ref="assetForm" :model="addOption" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="退库处理人" :label-width="addOptionWidth" prop="backUserId">
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

      <!--选择资产-->
      <DialogSelectAsset
        :asset-selected="assetSelected"
        :query-asset-list="queryAssetList"
        @changeAssetSelected="changeAssetSelected"
      />

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import DialogSelectAsset from '@/components/Dialog/selectAsset'
import { saveAssetBack, updateAssetBack, queryNewAssetBackList } from '@/api/assetManage'
export default {
  components: {
    DialogSelectAsset
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    groupList: {
      type: Array,
      default: () => []
    },
    modalType: {
      type: String,
      default: ''
    },
    formOption: {
      type: Object,
      default: null
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
      assetSelected: [] // 当前选中资产
    }
  },
  computed: {
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return queryNewAssetBackList
    },
    modalTitle() {
      return this.modalType === 'new' ? '新增' : '编辑'
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
          this.confirmSave(this.addOption).then((res) => {
            // if (res.code === 0) {
            this.$emit('update:visible', false)
            this.$parent.getList()
            // }
          }).catch((err) => { console.log('err', err) })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
