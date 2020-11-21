<template>
  <div class="app-container">
    <div class="heading">
      标签模版：
      <!-- <el-radio-group v-model="radioValue">
        <el-radio-button :label="1">条形码</el-radio-button>
        <el-radio-button :label="2">二维码</el-radio-button>
      </el-radio-group> -->
    </div>
    <!--list-->
    <div class="list">
      <div
        v-for="item in txmList"
        :key="item.uuid"
        :class="['labelTemplate', item.defaultinfo === 1 ? 'active' : null]"
      >
        <table width="100%">
          <tr
            v-for="tr in JSON.parse(item.content)"
            :key="tr"
          >
            <td width="40%">{{ tr }}</td>
            <td width="60%">xxxxxx</td>
          </tr>
          <tr>
            <td colspan="2"><img :src="txm" width="100%" /></td>
          </tr>
        </table>
        <div class="bottom">
          <!-- <el-button size="small" @click="handleTxmEdit(item)">编辑</el-button> -->
          <template v-if="item.defaultinfo === 1">
            <el-button type="primary" size="small">已选中</el-button>
          </template>
          <template v-else>
            <el-button size="small" @click="handleTxmSelect(item)">选择</el-button>
          </template>
        </div>
      </div>
    </div>
    <!--dialog-->
    <el-dialog
      title="选择标签字段"
      :visible.sync="dislogTxmVisible"
      width="650px"
    >
      <el-transfer
        v-model="txmTransferValue"
        :data="txmFieldsSource"
        :titles="['可选字段', '已选字段']"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogTxm">取 消</el-button>
        <el-button type="primary" @click="confirmDialogTxm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryRfidList, /* saveRfid, */ setRfidDefault } from '@/api/settings'
import txm from '@/assets/setting/txm.png'

export default {
  name: 'LabelTemplateManage',
  data() {
    return {
      radioValue: 1, // 1 条形码, 2 二维码
      txm,
      txmActive: '', // 选中的条形码
      txmCurrentEditing: '', // 当前正在编辑的条形码
      txmList: [], // 条形码列表
      // txmList: [ // 条形码列表
      //   {
      //     id: '1',
      //     fields: [
      //       { label: '资产名称', key: 'assetName' },
      //       { label: '购入日期', key: 'purchaseDate' }
      //     ]
      //   },
      //   {
      //     id: '2',
      //     fields: [
      //       { label: '购入日期', key: 'purchaseDate' },
      //       { label: '所属公司', key: 'company' },
      //       { label: '购入公司', key: 'purchaseCompany' }
      //     ]
      //   },
      //   {
      //     id: '3',
      //     fields: [
      //       { label: '使用公司', key: 'useCompany' },
      //       { label: '使用部门', key: 'useDepartment' }
      //     ]
      //   }
      // ],
      txmFieldsSource: [ // 所有条形码字段
        { label: '资产名称', key: 'assetName' },
        { label: '规格型号', key: 'specificationModel' },
        { label: '购入日期', key: 'purchaseDate' },
        { label: '所属公司', key: 'company' },
        { label: '购入公司', key: 'purchaseCompany' },
        { label: '使用公司', key: 'useCompany' },
        { label: '使用部门', key: 'useDepartment' },
        { label: '存放区域', key: 'storageArea' }
      ],
      txmTransferValue: [],
      dislogTxmVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      queryRfidList({ formtypeId: this.radioValue }).then((res) => {
        console.log('20 res', res)
        if (res.code === 0) {
          this.txmList = res.data
        }
      }).catch((err) => { console.log('err', err) })
    },
    // 编辑(条形码)
    handleTxmEdit(item) {
      console.log(item)
      this.txmTransferValue = item.fields.map((item) => item.key)
      this.dislogTxmVisible = true
      this.txmCurrentEditing = item.id
    },
    // 选中(条形码)
    handleTxmSelect(item) {
      const { uuid, formtypeId } = item
      console.log(133, item)
      setRfidDefault({ uuid, formtypeId }).then((res) => {
        if (res.code === 0) {
          this.getList()
          this.$message({
            showClose: true,
            message: '选中标签模版成功！',
            type: 'success'
          })
        }
      }).catch((err) => { console.log('err', err) })
    },
    // 关闭(条形码)弹出框
    closeDialogTxm() {
      this.dislogTxmVisible = false
      this.txmTransferValue = []
      this.txmCurrentEditing = ''
    },
    // 确认(条形码)弹出框
    confirmDialogTxm() {
      this.txmList.forEach((item) => {
        if (item.id === this.txmCurrentEditing) {
          const currentFields = this.txmFieldsSource.filter((item) => this.txmTransferValue.includes(item.key))
          Object.assign(item, { fields: currentFields })
        }
      })
      console.log(146, this.txmList)
      this.closeDialogTxm()
    },
    // 编辑(二维码)
    handleQrcodeEdit(item) {
      console.log(item)
    },
    // 选中(二维码)
    handleQrcodeSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped>
$label-template-border-color: #333;
.list{ margin-top: 15px;
  .labelTemplate{ display: inline-block; width: 300px; vertical-align: top; padding: 20px; border: #eee solid 1px; border-radius: 5px; box-shadow: 0 0 0 rgba(0, 0, 0, 0); transition: all .1s linear; margin: 0 20px 20px 0;
    table{ border-spacing: 0; font-size: 14px; border-top: $label-template-border-color solid 1px; border-left: $label-template-border-color solid 1px;
      tr{
        td{ padding: 3px; border-bottom: $label-template-border-color solid 1px; border-right: $label-template-border-color solid 1px;}
      }
    }
    &:hover{ box-shadow: 0 7px 10px rgba(0, 0, 0, .15);}
    &.active{ border: #324aa5 solid 3px;}
    .bottom{ text-align: center; margin-top: 10px;}
  }
}
</style>
