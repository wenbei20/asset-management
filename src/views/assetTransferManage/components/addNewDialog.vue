<template>
  <el-dialog :title="modalType === 'new' ? '新增' : '编辑'" :visible.sync="xjzyxxVisible" width="1200px" @close="closeThis">
    <el-form :model="xjzyxxForm" :rules="rules" ref="ruleForm" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="调出公司" prop="sendMerchantId" :label-width="formLabelWidth" required>
            <el-col :span="24">
              <treeselect
                v-model="xjzyxxForm.sendMerchantId"
                placeholder="请选择调出公司"
                :options="groupList"
                :value="xjzyxxForm.sendMerchantId || null"
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
                v-model="xjzyxxForm.getMerchantId"
                placeholder="请选择调入公司"
                :options="groupList"
                :value="xjzyxxForm.getMerchantId"
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
              <el-select v-model="xjzyxxForm.assetCoding" placeholder="请选择调入管理员" :style="{ width: '100%' }">
                <el-option label="公司1" value="1" />
                <el-option label="公司2" value="2" />
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-col :span="24">
              <el-input
                v-model="xjzyxxForm.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <div :style="{ margin: '10px 0' }">
        <el-button plain>选择资产</el-button>
        <el-button disabled>删除所选</el-button>
      </div>
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        class="vxetable"
        :v-loading="tableLoading"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="tableData"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="picture" title="照片" />
        <vxe-table-column field="assetCode" title="资产编码" />
        <vxe-table-column field="assetName" title="资产名称" />
        <vxe-table-column field="guizeNo" title="规格型号" />
        <vxe-table-column field="snNo" title="SN号" />
        <vxe-table-column field="company" title="所属公司" />
        <vxe-table-column field="storeArea" title="存放地点" />
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeThis">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { queryNewAssetList, saveAssetAllot, updateAssetAllot } from '@/api/assetManage'
export default {
  props: {
    modalType: {
      type: String,
      default: 'new'
    },
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    groupList: {
      type: Array,
      default: []
    }
  },
  components: {
    Treeselect
  },
  watch: {
    areaList(val) {
      console.log('监听 areaList', areaList);
    },
    groupList(val) {
      console.log('监听 groupList', groupList);
    }
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      xjzyxxVisible: false,
      formLabelWidth: '100px',
      xjzyxxForm: {
        allotId: "",
        allotcode: "",
        dataStatus: 0,
        getMerchantId: "",
        getUserId: "",
        groupId: null,
        id: 1,
        memo: "",
        merchantId: "",
        operdatetime: "",
        reguserId: "",
        sendMerchantId: "",
        statusId: 0
      },
      rules: {
        sendMerchantId: [
          { required: true, message: '请选择调出公司', trigger: 'change' }
        ],
        getMerchantId: [
          { required: true, message: '请选择调入公司', trigger: 'change' }
        ]
      },
      tableLoading: false,
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
  watch: {
    visible: {
      handler(val) {
        this.xjzyxxVisible = val
      },
      immediate: true
    },
    info: {
      handler(val) {
        console.log('178 info,', val)
        this.xjzyxxForm = { ...val }
      },
      deep: true
    }
  },
  mounted() {
    // this.getNewAssetList();
  },
  methods: {
    closeThis() {
      this.$emit('update:visible', false)
    },
    // 切换调出公司
    sendMerchantIdChange(params) {
      console.log(145, params)
      this.xjzyxxForm.sendMerchantId = params.groupId
      this.getNewAssetList(params.groupId)
    },
    // 切换调入公司
    getMerchantIdChange(params) {
      this.xjzyxxForm.getMerchantId = params.groupId
    },
    // 获取新增页面资产列表信息
    getNewAssetList(sendMerchantId) {
      const params = {
        useMerchantId: sendMerchantId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      queryNewAssetList(params).then((res) => {
        if (res.code === 0 && res.data && res.data.items) {
          this.assetList = res.data.items
        }
        this.tableLoading = false
      }).catch(err => {
        console.log('err', err)
        this.tableLoading = false
      })
    },
    // 表单确认
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSave(this.xjzyxxForm)
          .then((res) => {
            // if (res.code === 0) {
              this.$emit('update:visible', false)
              this.$parent.getList()
            // }
          })
          .catch((err) => { console.log('err', err) })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 确认保存接口
    confirmSave(params) {
      if (this.modalType === 'new') {
        return saveAssetAllot(params)
      } else if (this.modalType === 'edit') {
        return updateAssetAllot(params)
      }
    }
  }
}
</script>
