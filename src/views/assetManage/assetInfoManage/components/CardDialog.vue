<template>
  <el-dialog
    :title="title"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    @close="closeThis"
  >

    <el-form ref="assetForm" v-loading="buttonLoading" :model="cardInfo" label-position="right" :rules="cardInfoRules" style="padding-right:20px">
      <el-form-item label="资产编号" label-width="160px">
        {{ assetInfo.assetcode }}
      </el-form-item>
      <el-form-item label="资产名称" label-width="160px">
        {{ assetInfo.assetname }}
      </el-form-item>
      <el-form-item label="rfid码" label-width="160px" prop="rfidCode">
        <el-input v-model="cardInfo.rfidCode" placeholder="请输入rfid码" :disabled="AutoOrManual" />
      </el-form-item>
      <el-form-item label="" label-width="160px">
        <el-switch
          v-model="AutoOrManual"
          active-text="自动码"
          inactive-text="手动码"
          @change="changeSwitch"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeThis">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { sendCard, changeCard } from '@/api/assetManage'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '发卡'
    },
    assetInfo: {
      type: Object,
      default: () => {
        return {
          assetcode: '',
          assetname: '',
          assetId: '',
          RFID: ''
        }
      }
    }

  },
  data() {
    return {
      innerVisible: false,
      AutoOrManual: true,
      theAutoRFID: '1234567',
      buttonLoading: false,
      cardInfo: {
        rfidCode: '1234567'
      },
      cardInfoRules: {
        rfidCode: [
          { required: true, message: '请输入rfid码', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.innerVisible = val
      },
      immediate: true
    },
    'assetInfo.RFID': {
      handler(val) {
        this.theAutoRFID = val
        if (this.AutoOrManual) {
          this.cardInfo.rfidCode = val
        }
      },
      immediate: true
    }
  },
  methods: {
    closeThis() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    },
    confirm() {
      if (this.buttonLoading) return
      this.$refs.assetForm.validate(validate => {
        if (validate && this.title === '发卡') {
          this.buttonLoading = true
          this.cardInfo.assetsIds = this.assetInfo.assetId
          sendCard(this.cardInfo).then(res => {
            this.buttonLoading = false
            if (res.code === 0) {
              this.$message({ type: 'success', message: '资产发卡成功' })
              this.$emit('refreshNode')
            } else {
              this.$message({ type: 'error', message: '资产发卡失败，请稍后再试' })
            }
          }).catch(err => {
            this.buttonLoading = false
            console.log('err', err)
            this.$message({ type: 'error', message: '资产发卡失败，请稍后再试' })
          }).finally(() => {
            this.closeThis()
          })
        } else if (validate && this.title === '换卡') {
          this.buttonLoading = true
          this.cardInfo.assetsId = this.assetInfo.assetId
          changeCard(this.cardInfo).then(res => {
            this.buttonLoading = false
            if (res.code === 0) {
              this.$message({ type: 'success', message: '资产换卡成功' })
              this.$emit('refreshNode')
            } else {
              this.$message({ type: 'error', message: '资产换卡失败，请稍后再试' })
            }
          }).catch(err => {
            this.buttonLoading = false
            console.log('err', err)
            this.$message({ type: 'error', message: '资产换卡失败，请稍后再试' })
          }).finally(() => {
            this.closeThis()
          })
        }
      })
    },
    changeSwitch(val) {
      if (val) {
        this.cardInfo.rfid = this.theAutoRFID
      }
    }
  }
}
</script>
