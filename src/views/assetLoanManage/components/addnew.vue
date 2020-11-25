<template>
  <el-dialog :title="modalTitle" :visible.sync="xjzyxxVisible" width="1200px" @close="handleCancel">
    <el-form ref="assetForm" :model="addOption" label-position="right" :rules="addDialogRoles">
      <el-row>
        <el-col :span="11">
          <el-form-item label="借用人" :label-width="addOptionWidth" prop="userId">
            <el-select v-model="addOption.userId" placeholder="请选择借用人" :style="{ width: '100%' }">
              <el-option v-for="(ele,idx) in mainSortData.userList" :key="idx" :label="ele.chineseName" :value="ele.reguserId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="借出时间" :label-width="addOptionWidth" prop="lenddate">
            <el-date-picker
              v-model="addOption.lenddate"
              type="date"
              placeholder="请选择借出时间"
              style="width:100%"
              value-format="yyyy-MM-dd"
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
              style="width:100%"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="借出处理人" :label-width="addOptionWidth">
            <el-input :value="thisUserName" disabled />
          </el-form-item>
        </el-col>

      </el-row>
      <!-- <el-row>
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

      </el-row> -->

      <el-row>
        <el-col :span="23">
          <el-form-item label="说明" :label-width="addOptionWidth">
            <el-input v-model="addOption.memo" type="textarea" placeholder="说明" :rows="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="上传照片" :label-width="addOptionWidth">
            <el-upload
              ref="upload"
              list-type="picture-card"
              class="avatar-uploader"
              :action="postUrl"
              :file-list="fileList"
              :headers="{'X-Token': token}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handlePictureCardRemove"
              :on-success="handlePictureCardSuccess"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogImageVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
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
import dayjs from 'dayjs'
import DialogSelectAsset from '@/components/Dialog/selectAsset'
import { queryNewAssetLendreList } from '@/api/assetManage'
import { mapState, mapGetters } from 'vuex'
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
    },
    mainSortData: {
      type: Object,
      default: () => {
        return {
          userList: []
        }
      }
    }
  },
  data() {
    return {
      xjzyxxVisible: false,
      addOptionWidth: '110px',
      addOption: {
        userId: '', // 借用人
        returnUserId: '', // 归还处理人
        lendUserId: '', // 借出处理人
        lenddate: '', // 借出时间
        returndate: '', // 实际归还日期
        planReturndate: '', // 预计归还日期
        memo: '',
        assetUuids: [],
        images: []
      },
      assetSelected: [], // 当前选中资产
      assetUuids: [],
      fileList: [],
      postUrl: '',
      dialogImageVisible: false,
      dialogImageUrl: '',
      addDialogRoles: {
        planReturndate: [
          { required: true, message: '请选择预计归还时间', trigger: 'change' }
        ],
        lenddate: [
          { required: true, message: '请选择借出时间', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请选择借用人', trigger: 'change' }
        ]

      }

    }
  },
  computed: {
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return queryNewAssetLendreList
    },
    modalTitle() {
      return this.modalType === 'new' ? '新增' : '编辑'
    },
    ...mapState({
      thisUserName: state => state.user.userChname,
      thisReguserId: state => state.user.reguserId

    }),
    ...mapGetters([
      'token'
    ])
  },
  watch: {
    visible: {
      handler(val) {
        this.xjzyxxVisible = val
        if (val && this.formOption) {
          this.addOption = { ...this.formOption.formData }
          this.assetSelected = [...this.formOption.assetList]
          this.fileList = [...this.formOption.imagesList]
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
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.postUrl = '/dev-api/sys/repair/uploadpic'
    } else {
      this.postUrl = '/sys/repair/uploadpic'
    }
    if (this.formOption) { // 当编辑，传入有数据时
      this.addOption = { ...this.formOption.formData }
      this.assetSelected = [...this.formOption.assetList]
      this.fileList = [...this.formOption.imagesList]
    }
  },
  methods: {
    // Fn: 取消模态框
    handleCancel() {
      // this.clearAllOptions()
      this.fileList = []
      this.addOption.images = []
      this.xjzyxxVisible = false
      this.$emit('update:visible', false)
    },
    // Fn: 确认
    handleConfirm() {
      if (!this.assetSelected.length) {
        this.$message({ type: 'warning', message: '请选择资产' })
        return
      }
      this.$refs.assetForm.validate((validate) => {
        if (validate) {
          const params = {
            ...this.addOption
          }

          params.assetUuids = this.assetSelected.map(ele => ele.assetId).join(',')
          const lendreId = this.formOption ? (this.formOption.lendreId ? this.formOption.lendreId : '') : ''

          this.$emit('submit-form', params, lendreId)
        }
      })
    },
    // Fn: 改变资产选中
    changeAssetSelected(val) {
      this.assetSelected = val
    },
    // Fn: 上传图片
    handlePictureCardPreview(file) {
      console.log('file', file)
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    // Fn: 移除图片
    handlePictureCardRemove(file, fileList) {
      this.fileList = fileList
      this.updateAddoptionImages()
    },
    // Fn: 上传图片成功
    handlePictureCardSuccess(response, file, fileList) {
      this.fileList = fileList
      this.updateAddoptionImages()
    },
    updateAddoptionImages() {
      this.addOption.images = this.fileList.map((item) => ({
        name: item.name,
        path: item.response.data.virtualImageUrl
      }))
    },
    clearAllOptions() {
      this.addOption = {
        userId: '', // 借用人
        returnUserId: '', // 归还处理人
        lendUserId: '', // 借出处理人
        lenddate: '', // 借出时间
        returndate: '', // 实际归还日期
        planReturndate: '', // 预计归还日期
        memo: '',
        assetUuids: [],
        images: []
      }
      this.assetSelected = []
      this.fileList = []
      this.checkeduseMerchantId = ''
      this.$nextTick(() => {
        this.$refs.assetForm.clearValidate()
      })
      this.$refs.DialogSelectAsset.clearOptions()
    }
  }
}
</script>
<style  scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader >>> .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 79px;
  height: 79px;
  line-height: 79px;
  text-align: center;
}
.avatar-uploader >>> .el-upload--picture-card {
  width: 79px;
  height: 79px;
  line-height: 79px;
}
.avatar-uploader >>> .el-upload-list--picture-card .el-upload-list__item {
      width: 79px;
    height: 79px;
}
</style>
