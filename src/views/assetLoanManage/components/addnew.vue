<template>
  <el-dialog :title="modalTitle" :visible.sync="xjzyxxVisible" width="1200px" @close="handleCancel">
    <el-form ref="assetForm" :model="addOption" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="借用人" :label-width="addOptionWidth" prop="userId">
            <el-input v-model="addOption.userId" placeholder="请输入借用人" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="借出时间" :label-width="addOptionWidth" prop="lenddate">
            <el-date-picker
              v-model="addOption.lenddate"
              type="date"
              placeholder="请选择借出时间"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="预计归还时间" :label-width="addOptionWidth" prop="planReturndate">
            <el-date-picker
              v-model="addOption.planReturndate"
              type="date"
              placeholder="请选择预计归还时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="借出处理人" :label-width="addOptionWidth">
            <el-input v-model="addOption.lendUserId" placeholder="请输入借出处理人" disabled />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="实际归还时间" :label-width="addOptionWidth">
            <el-date-picker
              v-model="addOption.returndate"
              type="date"
              placeholder="请选择实际归还时间"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归还处理人" :label-width="addOptionWidth">
            <el-input v-model="addOption.returnUserId" placeholder="请输入归还处理人" disabled />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="23">
          <el-form-item label="说明" :label-width="addOptionWidth">
            <el-input v-model="addOption.memo" type="textarea" placeholder="说明" />
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
import dayjs from 'dayjs'
import DialogSelectAsset from '@/components/Dialog/selectAsset'
import { queryNewAssetLendreList } from '@/api/assetManage'
export default {
  components: {
    DialogSelectAsset
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: 'new'
    },
    formOption: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      xjzyxxVisible: false,
      addOptionWidth: '100px',
      addOption: {
        id: '',
        userId: '', // 借用人
        returnUserId: '', // 归还处理人
        lendUserId: '', // 借出处理人
        lenddate: '', // 借出时间
        returndate: '', // 实际归还日期
        planReturndate: '' // 预计归还日期
      },
      assetSelected: [], // 当前选中资产
      assetUuids: []
    }
  },
  computed: {
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return queryNewAssetLendreList
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
    },
    assetSelected: {
      handler(val) {
        this.addOption.assetUuids = val.map((item) => item.assetId).join(',')
      },
      deep: true
    }
  },
  created() {
    if (this.formOption) { // 当编辑，传入有数据时
      this.addOption = { ...this.formOption.formData }
      this.assetSelected = [...this.formOption.assetList]
      this.fileList = [...this.formOption.imagesList]
    }
  },
  methods: {
    // Fn: 取消模态框
    handleCancel() {
      this.xjzyxxVisible = false
      this.$emit('update:visible', false)
    },
    // Fn: 确认
    handleConfirm() {
      this.$refs.assetForm.validate((validate) => {
        if (validate) {
          const params = {
            ...this.addOption,
            lenddate: this.addOption.lenddate && dayjs(this.addOption.lenddate).format('YYYY-MM-DD'),
            returndate: this.addOption.returndate && dayjs(this.addOption.returndate).format('YYYY-MM-DD'),
            planReturndate: this.addOption.planReturndate && dayjs(this.addOption.planReturndate).format('YYYY-MM-DD')
          }
          this.$emit('submit-form', params, this.addOption.id)
        }
      })
    },
    // Fn: 改变资产选中
    changeAssetSelected(val) {
      this.assetSelected = val
    }
  }
}
</script>
