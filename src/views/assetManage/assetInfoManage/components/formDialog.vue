<template>
  <el-dialog :title="title" :visible.sync="innerVisible" width="80%" class="xjzyxx_dialog" @close="closeThis">
    <div v-if="title === '新建副资产信息'" class="showFatherAssetCode"><span>父资产编码</span>{{ fatherAssetCode }}</div>
    <el-form ref="assetForm" :model="xjzyxxForm" label-position="right" :rules="addDialogRoles">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="资产类别" :label-width="formLabelWidth" prop="assetkindId">
            <el-select v-model="xjzyxxForm.assetkindId" size="small" placeholder="请选择资产类别" :style="{ width: '100%' }">
              <el-option label="资产类别" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标准型号" :label-width="formLabelWidth" prop="standardtypeId">
            <el-select v-model="xjzyxxForm.standardtypeId" size="small" placeholder="请选择标准型号" :style="{ width: '100%' }">
              <el-option label="标准型号" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产编码" :label-width="formLabelWidth" prop="assetcode">
            <el-input v-model="xjzyxxForm.assetcode" size="small" placeholder="请输入资产编码" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="资产名称" :label-width="formLabelWidth" prop="assetname">
            <el-input v-model="xjzyxxForm.assetname" size="small" placeholder="请输入资产名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号" :label-width="formLabelWidth" prop="norms">
            <el-input v-model="xjzyxxForm.norms" size="small" placeholder="请输入规格型号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计量单位" :label-width="formLabelWidth" prop="unitname">
            <el-input v-model="xjzyxxForm.unitname" size="small" placeholder="请输入计量单位" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购入日期" :label-width="formLabelWidth" prop="buydate">
            <el-date-picker
              v-model="xjzyxxForm.buydate"
              type="date"
              placeholder="请选择购入日期"
              :style="{ width: '100%' }"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属单位" :label-width="formLabelWidth" prop="merchantId">
            <el-select v-model="xjzyxxForm.merchantId" size="small" placeholder="请选择所属单位" :style="{ width: '100%' }">
              <el-option label="所属单位1" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金额" :label-width="formLabelWidth" prop="money">
            <el-input v-model="xjzyxxForm.money" size="small" placeholder="请输入金额" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="管理员" :label-width="formLabelWidth" prop="adminReguserId">
            <el-select v-model="xjzyxxForm.adminReguserId" size="small" placeholder="请选择管理员" :style="{ width: '100%' }">
              <el-option label="管理员1" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用人" :label-width="formLabelWidth" prop="userId">
            <el-select v-model="xjzyxxForm.userId" size="small" placeholder="请选择使用人" :style="{ width: '100%' }">
              <el-option label="使用人1" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用单位" :label-width="formLabelWidth" prop="useMerchantId">
            <el-select v-model="xjzyxxForm.useMerchantId" size="small" placeholder="请选择使用单位" :style="{ width: '100%' }">
              <el-option label="使用单位1" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用部门" :label-width="formLabelWidth" prop="useBranchMerchantId">
            <el-select v-model="xjzyxxForm.useBranchMerchantId" size="small" placeholder="请选择管理员" :style="{ width: '100%' }">
              <el-option label="管理员1" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用期限" :label-width="formLabelWidth" prop="limitdate">
            <el-date-picker
              v-model="xjzyxxForm.limitdate"
              type="date"
              placeholder="请选择使用期限"
              :style="{ width: '100%' }"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="区域" :label-width="formLabelWidth" prop="areaId">
            <el-select v-model="xjzyxxForm.areaId" size="small" placeholder="请选择区域" :style="{ width: '100%' }">
              <el-option label="区域1" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存放地点" :label-width="formLabelWidth" prop="posname">
            <el-input v-model="xjzyxxForm.posname" size="small" placeholder="请输入存放地点" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物资状态" :label-width="formLabelWidth" prop="statusId">
            <el-select v-model="xjzyxxForm.statusId" size="small" placeholder="请选择物资状态" :style="{ width: '100%' }">
              <el-option label="物资状态" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="rfid码" :label-width="formLabelWidth" prop="rfidCode">
            <el-input v-model="xjzyxxForm.rfidCode" size="small" placeholder="请输入rfid码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="备注" :label-width="formLabelWidth" prop="memo">
            <el-input
              v-model="xjzyxxForm.memo"
              type="textarea"
              :rows="1"
              placeholder="请输入内容"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div :style="{ background: '#e8ebf9', padding: '10px', margin: '10px 0' }">维保信息</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商" :label-width="formLabelWidth" prop="supplier">
            <el-input v-model="xjzyxxForm.supplier" size="small" placeholder="请输入供应商" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人" :label-width="formLabelWidth" prop="contact">
            <el-input v-model="xjzyxxForm.contact" size="small" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式" :label-width="formLabelWidth" prop="tel">
            <el-input v-model="xjzyxxForm.tel" size="small" placeholder="请输入联系方式" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">

          <el-col :span="12" style="padding-left:0px;">
            <el-form-item label="负责人" :label-width="formLabelWidth" prop="chargeman">
              <el-input v-model="xjzyxxForm.chargeman" size="small" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-right:0px;">
            <el-form-item label="维保时间" :label-width="formLabelWidth" prop="repairdate">
              <el-date-picker
                v-model="xjzyxxForm.repairdate"
                type="date"
                placeholder="请选择操作时间"
                :style="{ width: '100%' }"
                size="small"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24" style="padding:0px;">
            <el-form-item label="维保说明" :label-width="formLabelWidth" prop="repairinfo">
              <el-input
                v-model="xjzyxxForm.repairinfo"
                size="small"
                type="textarea"
                :rows="1"
                placeholder="请输入维保说明"
              />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="8">

          <el-form-item label="上传图片" :label-width="formLabelWidth" prop="images">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              list-type="picture-card"
              :action="postUrl"
              :auto-upload="true"
              :show-file-list="true"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon" />

              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-dialog :visible.sync="PerviewDialogVisible" append-to-body>
      <img width="100%" :src="PerviewDialogImageUrl" alt="">
    </el-dialog>
    <div slot="footer" class="dialog-footer">
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
      default: '新建资源信息'
    },
    fatherAssetCode: {
      type: String,
      default: ' '
    }
  },
  data() {
    return {
      innerVisible: false,
      postUrl: '',
      formLabelWidth: '100px',
      PerviewDialogVisible: false,
      PerviewDialogImageUrl: '',
      xjzyxxForm: {
        assetSn: '',
        images: [],
        parentAssetcode: '',
        // 配置项

        adminReguserId: '',
        areaId: '',
        assetcode: '',
        assetkindId: '',
        assetname: '',
        buydate: '',
        chargeman: '',
        contact: '',
        limitdate: '',
        memo: '',
        merchantId: '',
        money: '',
        norms: '',
        posname: '',
        repairdate: '',
        repairinfo: '',
        rfidCode: '',
        standardtypeId: '',
        statusId: '',
        supplier: '',
        tel: '',
        unitname: '',
        useBranchMerchantId: '',
        useMerchantId: '',
        userId: ''

      },
      addDialogRoles: {
        assetname: [
          { required: true, message: '请输入资产名称', trigger: 'blur' }
        ],
        assetkindId: [
          { required: true, message: '请选择资产类别', trigger: 'change' }
        ],
        assetcode: [
          { required: true, message: '请输入资产编码', trigger: 'blur' }
        ],
        statusId: [
          { required: true, message: '请选择物资状态', trigger: 'change' }
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
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.postUrl = '/dev-api/assets/uploadpic'
    } else {
      this.postUrl = '/assets/uploadpic'
    }
  },
  methods: {
    closeThis() {
      this.innerVisible = false
      this.$emit('update:visible', false)
      for (const key in this.xjzyxxForm) {
        this.xjzyxxForm[key] = ''
      }
      this.$refs.assetForm.clearValidate()
    },

    handleRemove(file) {
      this.$refs.upload.handleRemove(file)
    },
    handlePictureCardPreview(file) {
      this.PerviewDialogImageUrl = file.url
      this.PerviewDialogVisible = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      console.log('file', file)
      console.log('res', res)
      if (res.code === 0) {
        if (res.data && res.data.virtualImageUrl && file.name) {
          this.xjzyxxForm.images.push({ name: file.name, path: res.data.virtualImageUrl })
        }
      }
    },
    confirm() {
      this.$refs.assetForm.validate(validate => {
        if (validate) {
          this.$emit('confirm', this.xjzyxxForm)
        }
      })
    }
  }

}
</script>
<style scoped>
.xjzyxx_dialog >>> .el-form-item{
  margin-bottom: 10px;
}
.xjzyxx_dialog >>> .el-form-item__error {
  top:90%;
}
.xjzyxx_dialog >>> .el-dialog__body {
    position: relative;
}
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
.avatar {
  width: 79px;
  height: 79px;
  display: block;
}
.showFatherAssetCode {
    position: absolute;
    width: 100%;
    top: 0;
    left: 20px;
}
.showFatherAssetCode span {
    color: #606266;
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 12px;
    font-weight: bold;
}
</style>
