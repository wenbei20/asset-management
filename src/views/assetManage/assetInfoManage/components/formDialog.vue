<template>
  <el-dialog :visible.sync="innerVisible" width="80%" class="xjzyxx_dialog" :close-on-click-modal="false" :fullscreen="fullscreen" @close="closeThis">
    <div slot="title">
      {{ title }}
      <svg-icon :icon-class="fullscreen | iconName" class-name="dialogIcon" @click="changeFullscreen" />
    </div>
    <div v-if="title === '新建副资产信息'" class="showFatherAssetCode"><span>父资产编码</span>{{ fatherAssetCode }}</div>
    <el-form ref="assetForm" v-loading="editAssetDialogLoading" :model="xjzyxxForm" label-position="right" :rules="addDialogRoles">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="资产类别" :label-width="formLabelWidth" prop="assetkindId">
            <el-dropdown ref="statusInnerDrop" trigger="click" placement="bottom-start" style="width:100%">
              <el-input v-model="checkedAssetkindId" size="small" placeholder="请选择资产类别" />

              <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                <el-tree
                  ref="statusTree"
                  node-key="assetkindId"
                  :props="defaultProps"
                  :data="mainSortData.assetkindList"
                  :default-expand-all="true"
                  :expand-on-click-node="false"
                  @node-click="assetkindTreeClick"
                />
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-loading="standardtypeLoading" label="标准型号" :label-width="formLabelWidth" prop="standardtypeId">
            <el-select v-model="xjzyxxForm.standardtypeId" :disabled="!checkedAssetkindId" size="small" placeholder="选择资产类别后,请选择标准型号" :style="{ width: '100%' }">
              <el-option v-for="(item,i) in standardtypeList" :key="i" :label="item.standardtypeName" :value="item.standardtypeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产编号" :label-width="formLabelWidth" prop="assetcode">
            <el-input v-model="xjzyxxForm.assetcode" size="small" placeholder="请输入资产编码" :disabled="title === '编辑资源信息'" />
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
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属单位" :label-width="formLabelWidth" prop="merchantId">
            <el-input v-model="thisMerchantName" size="small" placeholder="请输入所属单位" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金额" :label-width="formLabelWidth" prop="money">
            <el-input v-model="xjzyxxForm.money" size="small" placeholder="请输入金额" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="管理员" :label-width="formLabelWidth" prop="adminReguserId">
            <el-input :value="thisUserName" size="small" placeholder="管理员" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="使用单位" :label-width="formLabelWidth" prop="useMerchantId">
            <el-dropdown ref="mechartDrop" trigger="click" placement="bottom-start" style="width:100%">
              <el-input v-model="checkedMerchartName" size="small" placeholder="请选择使用单位" />

              <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">

                <el-tree
                  ref="mechartTree"
                  node-key="groupId"
                  :props="mechartProps"
                  :data="mainSortData.groupList"
                  :default-expand-all="true"
                  :expand-on-click-node="false"
                  @node-click="mechartTreeNodeClick"
                />
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用人" :label-width="formLabelWidth" prop="userId">
            <el-select v-model="xjzyxxForm.userId" v-loading="allMechartUser.loading" size="small" placeholder="选择使用单位后，请选择使用人" :style="{ width: '100%' }" :disabled="!xjzyxxForm.useMerchantId">
              <el-option v-for="(ele , i ) in allMechartUser.list" :key="i" :value="ele.reguserId" :label="ele.chineseName" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="使用部门" :label-width="formLabelWidth" prop="">
            <el-select v-model="xjzyxxForm." size="small" placeholder="请选择管理员" :style="{ width: '100%' }">
              <el-option label="管理员1" value="1" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="使用期限" :label-width="formLabelWidth" prop="limitdate">
            <el-date-picker
              v-model="xjzyxxForm.limitdate"
              type="date"
              placeholder="请选择使用期限"
              :style="{ width: '100%' }"
              size="small"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="区域" :label-width="formLabelWidth" prop="areaId">
            <el-select v-model="xjzyxxForm.areaId" size="small" placeholder="请选择区域" :style="{ width: '100%' }">
              <el-option v-for="(ele , i ) in mainSortData.areaList" :key="i" :value="ele.area_id" :label="ele.area_name" />
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
            <el-select v-model="xjzyxxForm.statusId" size="small" placeholder="请选择资产类别" :style="{ width: '100%' }">
              <el-option v-for="(ele , i) in mainSortData.statusList" :key="i" :label="ele.status_name" :value="ele.status_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="rfid码" :label-width="formLabelWidth" prop="rfidCode">
            <el-input v-model="xjzyxxForm.rfidCode" size="small" placeholder="请输入rfid码" />
          </el-form-item>
        </el-col> -->
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
      <!-- <el-row :gutter="20">
        <el-col :span="16" />
      </el-row> -->
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
                value-format="yyyy-MM-dd"
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
              :headers="{'X-Token':XToken}"
              :before-upload="beforeAvatarUpload"
              :limit="5"
              :file-list="checkedImages"
            >
              <i class="el-icon-plus avatar-uploader-icon" />

              <template slot="file" slot-scope="{file}">
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
              </template>
            </el-upload>

          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-dialog :visible.sync="PerviewDialogVisible" append-to-body>
      <img width="100%" :src="PerviewDialogImageUrl" alt="">
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="commitEditLoading" @click="closeThis">取 消</el-button>
      <el-button type="primary" :loading="commitEditLoading" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getAllMechartUser, standardtype } from '@/api/assetManage'
import { mapState } from 'vuex'
export default {
  filters: {
    iconName(val) {
      return val ? 'shouqiquanping' : 'quanping'
    }
  },
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
      default: ''
    },
    mainSortData: {
      type: Object,
      default: () => {
        return {
          areaList: [],
          assetkindList: [],
          groupList: [],
          standardtypeList: [],
          statusList: []
        }
      }
    },
    editAssetDialogLoading: {
      type: Boolean,
      default: false
    },
    editAssetData: {
      type: Object,
      default: () => {}
    },
    commitEditLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedImages: [],
      defaultProps: {
        children: 'children',
        label: 'assetkindName',
        isLeaf: 'leaf'
      },
      mechartProps: {
        children: 'children',
        label: 'groupName'
      },
      checkedMerchartName: '',
      checkedAssetkindId: '',
      innerVisible: false,
      fullscreen: false,
      postUrl: '',
      formLabelWidth: '100px',
      PerviewDialogVisible: false,
      PerviewDialogImageUrl: '',
      xjzyxxForm: {
        images: [],
        parentAssetcode: '',
        // 配置项

        areaId: '',
        assetcode: '',
        assetkindId: '',
        assetname: '',
        buydate: '',
        chargeman: '',
        contact: '',
        limitdate: '',
        memo: '',
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

      },
      allMechartUser: {
        loading: false,
        list: []
      },
      standardtypeLoading: false,
      standardtypeList: []

    }
  },
  computed: {
    ...mapState({
      XToken: state => state.user.token,
      thisMerchantName: state => state.user.merchantName,
      thisUserName: state => state.user.userChname

    })
  },
  watch: {
    visible: {
      handler(val) {
        this.innerVisible = val
        if (val) {
          this.$nextTick(() => {
            this.$refs.assetForm.clearValidate()
          })
        }
      },
      immediate: true
    },
    'editAssetData.assetId': {
      handler(val) {
        if (Object.keys(this.editAssetData).length) {
          this.copyEditData()
        }
      }
    }
  },
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.postUrl = '/dev-api/sys/assets/uploadpic'
    } else {
      this.postUrl = '/sys/assets/uploadpic'
    }
    console.log('mainSortData', this.mainSortData)

    if (this.title === '新建资源信息') {
      this.xjzyxxForm.statusId = '01'
    }
  },
  methods: {

    copyEditData() {
      const obj = this.editAssetData
      for (const key in this.xjzyxxForm) {
        if (key === 'images') {
          this.checkedImages = Array.isArray(obj.images) ? obj.images.map(item => { return { name: item.name, url: item.fullPath, path: item.path } }) : []
          this.xjzyxxForm.images = []
        } else {
          this.xjzyxxForm[key] = obj[key]
        }
      }

      this.checkedAssetkindId = obj.assetkindName
      this.checkedMerchartName = obj.useMerchantName

      if (obj.userId && obj.userName) {
        this.allMechartUser.list.push({ reguserId: obj.userId, chineseName: obj.userName })
      }
    },
    assetkindTreeClick(item) {
      console.log('item', item)
      if (item.children && item.children.length) return
      this.xjzyxxForm.assetkindId = item.assetkindId
      this.checkedAssetkindId = item.assetkindName
      this.$nextTick(() => {
        this.$refs.statusInnerDrop.hide()
      })

      standardtype({ assetkindId: item.assetkindId }).then(res => {
        if (res.code === 0) {
          this.standardtypeList = res.data
        }
      }).finally(() => {
        this.standardtypeLoading = false
      })
    },
    mechartTreeNodeClick(item) {
      this.xjzyxxForm.useMerchantId = item.groupId
      this.checkedMerchartName = item.groupName
      this.$nextTick(() => {
        this.$refs.mechartDrop.hide()
      })

      this.allMechartUser.loading = true
      getAllMechartUser({ groupId: item.groupId }).then(res => {
        if (res.code === 0) {
          this.allMechartUser.list = res.data
        }
      }).finally(() => {
        this.allMechartUser.loading = false
      })
    },
    changeFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    closeThis() {
      this.innerVisible = false
      this.checkedImages = []
      this.$emit('update:visible', false)
      this.$emit('clearEditAssetData')
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
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
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
          this.xjzyxxForm.parentAssetcode = this.fatherAssetCode

          console.log('this.checkedImages', this.checkedImages)
          const oldImages = this.checkedImages.map(item => { return { name: item.name, path: item.path } })

          this.xjzyxxForm.images = [...this.xjzyxxForm.images, ...oldImages]
          console.log('this.xjzyxxForm.images', this.xjzyxxForm.images)

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
.dialogIcon {
    float: right;
    margin-right: 30px;
    cursor: pointer;
}
</style>
