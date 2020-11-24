<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form ref="assetForm" :model="addOption" label-position="right" :rules="addDialogRoles">
      <el-row>
        <el-col :span="11">
          <el-form-item label="退库处理人" :label-width="addOptionWidth" prop="backUserId">
            <el-input :value="thisUserName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际退库时间" :label-width="addOptionWidth" prop="backdate">
            <el-date-picker
              v-model="addOption.backdate"
              type="date"
              placeholder="请选择实际退库时间"
              style="width:100%"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="业务所属公司" :label-width="addOptionWidth">
            <el-input :value="thisMerchantName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退库后使用公司" :label-width="addOptionWidth" prop="useMerchantId">
            <el-dropdown ref="statusInnerDrop" trigger="click" placement="bottom-start" style="width:100%">
              <el-input v-model="checkeduseMerchantId" size="small" placeholder="请选择退库后使用公司" />

              <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                <el-tree
                  ref="statusTree"
                  node-key="groupId"
                  :props="CompanyProps"
                  :data="mainSortData.groupList"
                  :default-expand-all="true"
                  :expand-on-click-node="false"
                  @node-click="useMerchantIdClick"
                />
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="退库后区域" :label-width="addOptionWidth" prop="areaId">
            <el-select v-model="addOption.areaId" placeholder="请选择区域" :style="{ width: '100%' }">
              <el-option v-for="(ele , i ) in mainSortData.areaList" :key="i" :value="ele.area_id" :label="ele.area_name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退库后存放地点" :label-width="addOptionWidth" prop="posname">
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
        ref="DialogSelectAsset"
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
import { mapState } from 'vuex'
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
        backUserId: '',
        backdate: '',
        useMerchantId: '',
        areaId: '',
        posname: '',
        memo: '',
        assetUuids: []
      },
      assetSelected: [], // 当前选中资产
      CompanyProps: {
        children: 'children',
        label: 'groupName'
      },
      checkeduseMerchantId: '',
      addDialogRoles: {
        backdate: [
          { required: true, message: '请选择实际退库时间', trigger: 'change' }
        ],
        useMerchantId: [
          { required: true, message: '请选择退库后使用公司', trigger: 'change' }
        ],
        areaId: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        posname: [
          { required: true, message: '请输入存放地点', trigger: 'blur' }

        ]

      }
    }
  },
  computed: {
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return queryNewAssetBackList
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

          const { useMerchantId } = this.formOption.formData

          if (useMerchantId && this.mainSortData.groupList.length) {
            this.checkeduseMerchantId = this.getGroupName(this.mainSortData.groupList, useMerchantId)
          }
        }
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
    },
    useMerchantIdClick(item) {
      this.addOption.useMerchantId = item.groupId
      this.checkeduseMerchantId = item.groupName
      this.$refs.statusInnerDrop.hide()
    },
    changeAssetSelected(val) {
      this.assetSelected = val
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
            backUserId: this.thisReguserId
          }
          params.assetUuids = this.assetSelected.map(ele => ele.assetId).join(',')

          const backId = this.formOption ? (this.formOption.backId ? this.formOption.backId : '') : ''
          this.$emit('submit-form', params, backId)
        }
      })
    },
    handleCancel() {
      this.xjzyxxVisible = false
      this.$emit('update:visible', false)
    },
    clearAllOptions() {
      this.addOption = {
        backUserId: '',
        backdate: '',
        useMerchantId: '',
        areaId: '',
        posname: '',
        memo: '',
        assetUuids: []
      }
      this.assetSelected = []
      this.checkeduseMerchantId = ''
      this.$nextTick(() => {
        this.$refs.assetForm.clearValidate()
      })
      this.$refs.DialogSelectAsset.clearOptions()
    }
  }
}
</script>
