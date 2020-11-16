<template>
  <el-dialog
    :title="title"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    @close="closeThis"
  >
    <el-form ref="assetForm" :model="cardInfo" label-position="right" :rules="cardInfoRules" style="padding-right:20px">
      <el-form-item label="资产编号" label-width="160px">
        {{ assetInfo.assetcode }}
      </el-form-item>
      <el-form-item label="资产名称" label-width="160px">
        {{ assetInfo.assetname }}
      </el-form-item>
      <el-form-item label="rfid码" label-width="160px" prop="rfid">
        <el-input v-model="cardInfo.rfid" placeholder="请输入rfid码" :disabled="AutoOrManual" />
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
          assetId: ''
        }
      }
    }

  },
  data() {
    return {
      innerVisible: false,
      AutoOrManual: true,
      theAutoRFID: '1234567',
      cardInfo: {
        rfid: '1234567'
      },
      cardInfoRules: {
        rfid: [
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
    }
  },
  methods: {
    closeThis() {
      this.innerVisible = false
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.assetForm.validate(validate => {
        if (validate) {
          this.cardInfo.assetId = this.assetInfo.assetId
          this.$emit('confirm', this.cardInfo)
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
