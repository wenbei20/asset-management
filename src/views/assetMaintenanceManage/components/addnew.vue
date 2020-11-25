<template>
  <el-dialog :title="modalTitle" :visible.sync="xjzyxxVisible" width="1200px" @close="handleCancel">
    <el-form ref="assetForm" :model="addOption" label-position="right" :rules="addDialogRoles">
      <el-row>
        <!-- <el-col :span="8">
          <el-form-item label="维修编号" :label-width="addOptionWidth" prop="id">
            <el-input v-model="addOption.id" placeholder="维修编号" disabled />
          </el-form-item>
        </el-col> -->
        <el-col :span="11">
          <el-form-item label="维修日期" :label-width="addOptionWidth" prop="repairdate">
            <el-date-picker
              v-model="addOption.repairdate"
              type="date"
              placeholder="请选择维修日期"
              :style="{ width: '100%' }"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理人" :label-width="addOptionWidth">
            <el-input :value="thisUserName" placeholder="请输入处理人" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="维修花费" :label-width="addOptionWidth" prop="fee">
            <el-input-number v-model="addOption.fee" controls-position="right" placeholder="请输入维修花费" style="width:100%" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="7">
          <el-form-item label="状态" :label-width="addOptionWidth">
            <el-select v-model="addOption.repairCompany" placeholder="请选择状态" :style="{ width: '100%' }">
              <el-option label="公司一" value="1" />
              <el-option label="公司2" value="2" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="报修人" :label-width="addOptionWidth" prop="userId">
            <el-select v-model="addOption.userId" placeholder="请选择报修人" :style="{ width: '100%' }">
              <el-option v-for="(ele,idx) in mainSortData.userList" :key="idx" :label="ele.chineseName" :value="ele.reguserId" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="23">
          <el-form-item label="维修内容" :label-width="addOptionWidth" prop="content">
            <el-input v-model="addOption.content" placeholder="维修内容" />
          </el-form-item>
        </el-col>
      </el-row>

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
import { queryNewAssetRepairList } from '@/api/assetManage'
import { mapGetters, mapState } from 'vuex'
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
      addOptionWidth: '100px',
      addOption: {
        repairdate: '', // 维修日期
        fee: '', // 维修话费
        content: '', // 维修内容
        memo: '', // 说明
        userId: '', // 报修人
        assetUuids: [],
        images: []
      },
      dialogImageUrl: '',
      dialogImageVisible: false,
      postUrl: '', // 上传文件url
      fileList: [],
      assetSelected: [], // 当前选中资产
      addDialogRoles: {
        fee: [
          { required: true, message: '请输入维修花费', trigger: 'blur' }
        ],
        repairdate: [
          { required: true, message: '请选择维修日期', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请选择报修人', trigger: 'change' }
        ]

      }
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return queryNewAssetRepairList
    },
    modalTitle() {
      return this.modalType === 'new' ? '新增' : '编辑'
    },
    ...mapState({
      thisUserName: state => state.user.userChname

    })
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
    // fileList: {
    //   handler(val) {
    //     this.addOption.images = this.fileList
    //   },
    //   deep: true
    // }
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
    // Fn: 移除图片
    handlePictureCardRemove(file, fileList) {
      this.fileList = fileList
      this.updateAddoptionImages()
    },
    // Fn: 上传图片
    handlePictureCardPreview(file) {
      console.log('file', file)
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    // Fn: 上传图片成功
    handlePictureCardSuccess(response, file, fileList) {
      this.fileList = fileList
      this.updateAddoptionImages()
    },
    // Fn: 取消模态框
    handleCancel() {
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

          const repairId = this.formOption ? (this.formOption.repairId ? this.formOption.repairId : '') : ''

          this.$emit('submit-form', params, repairId)
        }
      })
    },
    // Fn: 改变资产选中
    changeAssetSelected(val) {
      this.assetSelected = val
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
    },
    updateAddoptionImages() {
      this.addOption.images = this.fileList.map((item) => ({
        name: item.name,
        path: item.response.data.virtualImageUrl
      }))
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
