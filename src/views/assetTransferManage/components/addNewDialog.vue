<template>
  <el-dialog :title="modalTitle" :visible.sync="xjzyxxVisible" width="1200px" @close="handleCancel">
    <el-form ref="assetForm" :model="addOption" :rules="rules" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="调出公司" prop="sendMerchantId" :label-width="formLabelWidth" required>
            <el-col :span="24">
              <treeselect
                v-model="addOption.sendMerchantId"
                placeholder="请选择调出公司"
                :options="groupList"
                :value="addOption.sendMerchantId "
                :normalizer="normalizer"
                :clearable="false"
                @select="sendMerchantIdChange"
              />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入公司" prop="getMerchantId" :label-width="formLabelWidth" required>
            <el-col :span="24">
              <treeselect
                v-model="addOption.getMerchantId "
                placeholder="请选择调入公司"
                :options="groupList"
                :value="addOption.getMerchantId "
                :normalizer="normalizer"
                :clearable="false"
                @select="getMerchantIdChange"
              />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入管理员" :label-width="formLabelWidth">
            <el-col :span="24">
              <!-- <el-select v-model="addOption.getUserId" placeholder="请选择调入管理员" :style="{ width: '100%' }">
                <el-option label="公司1" value="1" />
                <el-option label="公司2" value="2" />
              </el-select> -->
              <el-input :value="thisUserName" disabled />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-col :span="24">
              <el-input
                v-model="addOption.memo"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <!--选择资产-->
      <DialogSelectAsset
        ref="DialogSelectAsset"
        :asset-selected="assetSelected"
        :query-asset-list="queryAssetList"
        :is-selected-to-r-efresh="true"
        :merchant-id="addOption.sendMerchantId"
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { queryNewAssetAllotList } from '@/api/assetManage'
import { mapState } from 'vuex'
export default {
  components: {
    DialogSelectAsset,
    Treeselect
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
    },
    groupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      xjzyxxVisible: false,
      formLabelWidth: '100px',
      addOption: {
        allotId: '',
        allotcode: '',
        dataStatus: 0,
        getMerchantId: null,
        getUserId: '',
        groupId: null,
        id: 1,
        memo: '',
        merchantId: '',
        operdatetime: '',
        reguserId: '',
        sendMerchantId: null,
        statusId: 0,
        assetUuids: []
      },
      assetSelected: [], // 当前选中资产
      rules: {
        sendMerchantId: [
          { required: true, message: '请选择调出公司', trigger: 'change' }
        ],
        getMerchantId: [
          { required: true, message: '请选择调入公司', trigger: 'change' }
        ]
      },
      tableData: [],
      normalizer(node) {
        return {
          id: node.groupId,
          label: node.groupName,
          children: node.children
        }
      }
    }
  },
  computed: {
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return queryNewAssetAllotList
    },
    modalTitle() {
      return this.modalType === 'new' ? '新增' : '编辑'
    },
    ...mapState({
      thisMerchantName: state => state.user.merchantName,
      thisUserName: state => state.user.userChname,
      thisReguserId: state => state.user.reguserId

    })
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
    },
    fileList: {
      handler(val) {
        this.addOption.images = this.fileList.map((item) => ({
          name: item.name,
          path: item.response.data.virtualImageUrl
        }))
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
      if (!this.assetSelected.length) {
        this.$message({ type: 'warning', message: '请选择需要调拨的资产' })
        return
      }

      this.$refs.assetForm.validate((validate) => {
        if (validate) {
          const params = {
            ...this.addOption,
            getUserId: this.thisReguserId
          }
          params.assetUuids = this.assetSelected.map(ele => ele.assetId).join(',')
          // console.log('params', params)
          this.$emit('submit-form', params, this.addOption.id)
        }
      })
    },
    // Fn: 改变资产选中
    changeAssetSelected(val) {
      this.assetSelected = val
    },
    // Fn: 调出公司变更
    sendMerchantIdChange(val) {
      // console.log('调出公司变更', val)
    },
    // Fn: 调入公司变更
    getMerchantIdChange(val) {
      // console.log('调出公司变更', val)
    },
    clearAllOptions() {
      this.addOption = {
        allotId: '',
        allotcode: '',
        dataStatus: 0,
        getMerchantId: null,
        getUserId: '',
        groupId: null,
        id: 1,
        memo: '',
        merchantId: '',
        operdatetime: '',
        reguserId: '',
        sendMerchantId: null,
        statusId: 0,
        assetUuids: []
      }
      this.assetSelected = []
      this.$refs.DialogSelectAsset.clearOptions()
    }
  }
}
</script>
