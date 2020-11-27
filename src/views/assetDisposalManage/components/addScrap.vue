<template>
  <el-dialog :title="modalTitle" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form ref="assetForm" :model="addOption" label-position="right" :rules="addDialogRoles">
      <el-row>
        <el-col :span="11">
          <el-form-item label="清理日期" :label-width="addOptionWidth" prop="discarddate">
            <el-date-picker
              v-model="addOption.discarddate"
              type="date"
              placeholder="请选择清理日期"
              value-format="yyyy-MM-dd"
              style="width:100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="业务所属单位" :label-width="addOptionWidth" prop="merchantId">
            <el-dropdown ref="statusInnerDrop" trigger="click" placement="bottom-start" style="width:100%">
              <el-input v-model="checkeduseMerchantId" size="small" placeholder="请选择业务所属单位" />

              <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                <el-tree
                  ref="statusTree"
                  node-key="groupId"
                  :props="{ children: 'children', label: 'groupName' }"
                  :data="mainSortData.groupList"
                  :default-expand-all="true"
                  :expand-on-click-node="false"
                  @node-click="useMerchantIdClick"
                />
              </el-dropdown-menu>
            </el-dropdown></el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="清理人" :label-width="addOptionWidth">
            <el-input :value="thisUserName" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="说明" :label-width="addOptionWidth">
            <el-input v-model="addOption.memo" type="textarea" :rows="1" placeholder="说明" />
          </el-form-item>
        </el-col>

      </el-row>
      <DialogSelectAsset
        ref="DialogSelectAsset"
        :asset-selected="assetSelected"
        :query-asset-list="queryAssetList"
        :merchant-id="addOption.merchantId"
        is-selected-to-r-efresh="业务所属单位"

        @changeAssetSelected="changeAssetSelected"
      />

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeThis">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import DialogSelectAsset from '@/components/Dialog/selectAsset'
import { mapState } from 'vuex'
import { findAssetInfo } from '@/api/assetManage'

export default {
  components: {
    DialogSelectAsset
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mainSortData: {
      type: Object,
      default: () => {
        return {
          groupList: [],
          areaList: []
        }
      }
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
        merchantId: '',
        assetUuids: '',
        discarddate: '',
        memo: ''
      },
      assetSelected: [],
      checkeduseMerchantId: '',
      addDialogRoles: {
        merchantId: [
          { required: true, message: '请选择业务所属单位', trigger: 'change' }
        ],
        discarddate: [
          { required: true, message: '请选择清理日期', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return findAssetInfo
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
        if (val && this.formOption) {
          this.addOption = { ...this.formOption.formData }
          this.assetSelected = [...this.formOption.assetList]

          const { merchantId } = this.formOption.formData

          if (merchantId && this.mainSortData.groupList.length) {
            this.checkeduseMerchantId = this.getGroupName(this.mainSortData.groupList, merchantId)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    getGroupName(arr, id) {
      let findID = ''
      arr.forEach(item => {
        if (id === item.groupId) {
          findID = item.groupName
        }

        if (!findID && item.children && item.children.length) {
          findID = this.getGroupName(item.children, id)
        }
      })

      return findID
    },
    closeThis() {
      this.xjzyxxVisible = false
      this.$emit('update:visible', false)
    },
    useMerchantIdClick(item) {
      if (this.addOption.merchantId === item.groupId) {
        this.$refs.statusInnerDrop.hide()
        return
      }

      this.assetSelected = []
      this.$refs.DialogSelectAsset.clearOptions()

      this.addOption.merchantId = item.groupId
      this.checkeduseMerchantId = item.groupName
      this.$refs.statusInnerDrop.hide()
    },
    clearAllOptions() {
      this.addOption = {
        merchantId: '',
        assetUuids: '',
        discardUserId: '',
        discarddate: '',
        memo: ''
      }
      this.assetSelected = []
      this.checkeduseMerchantId = ''
      this.$nextTick(() => {
        this.$refs.assetForm.clearValidate()
      })
      this.$refs.DialogSelectAsset.clearOptions()
    },
    handleConfirm() {
      if (!this.assetSelected.length) {
        this.$message({ type: 'warning', message: '请选择资产' })
        return
      }

      this.$refs.assetForm.validate((validate) => {
        if (validate) {
          const params = {
            ...this.addOption,
            discardUserId: this.thisReguserId
          }
          params.assetUuids = this.assetSelected.map(ele => ele.assetId).join(',')

          const backId = this.formOption ? (this.formOption.discardId ? this.formOption.discardId : '') : ''
          this.$emit('submit-form', params, backId)
        }
      })
    },
    changeAssetSelected(val) {
      this.assetSelected = val
    }
  }
}
</script>
