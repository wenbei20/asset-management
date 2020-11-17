<template>
  <el-dialog title="新增" :visible.sync="xjzyxxVisible" width="1200px" @close="handleCancel">
    <el-form ref="assetForm" :model="addOption" label-position="right">
      <el-row>
        <el-col :span="8">
          <el-form-item label="维修编号" :label-width="addOptionWidth" prop="id">
            <el-input v-model="addOption.id" placeholder="维修编号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="业务日期" :label-width="addOptionWidth" prop="repairdate">
            <el-date-picker
              v-model="addOption.repairdate"
              type="date"
              placeholder="请选择业务日期"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="处理人" :label-width="addOptionWidth" prop="repairPerson">
            <el-input v-model="addOption.repairPerson" placeholder="请输入处理人" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="维修花费" :label-width="addOptionWidth" prop="fee">
            <el-input v-model="addOption.fee" placeholder="请输入维修花费" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="状态" :label-width="addOptionWidth">
            <el-select v-model="addOption.repairCompany" placeholder="请选择状态" :style="{ width: '100%' }">
              <el-option label="公司一" value="1" />
              <el-option label="公司2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修人" :label-width="addOptionWidth" prop="userId">
            <el-select v-model="addOption.userId" placeholder="请选择报修人" :style="{ width: '100%' }">
              <el-option label="部门一" value="1" />
              <el-option label="部门2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="维修内容" :label-width="addOptionWidth" prop="content">
            <el-input v-model="addOption.content" placeholder="维修内容" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="23">
          <el-form-item label="说明" :label-width="addOptionWidth">
            <el-input v-model="addOption.repairMemo" type="textarea" placeholder="说明" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="23">
          <el-form-item label="上传照片" :label-width="addOptionWidth">
            <el-upload
              ref="upload"
              list-type="picture-card"
              :action="postUrl"
              :file-list="fileList"
              :headers="{'X-Token': token}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handlePictureCardRemove"
              :on-success="handlePictureCardSuccess"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogImageVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <!--选择资产-->
      <DialogSelectAsset
        :assetSelected="assetSelected"
        :queryAssetList="queryAssetList"
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
import { mapGetters } from 'vuex'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DialogSelectAsset
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    queryAssetList() { // 把'调用资产列表'的方法当成参数传给子组件
      return queryNewAssetRepairList
    }
  },
  data() {
    return {
      xjzyxxVisible: false,
      addOptionWidth: '100px',
      addOption: {
        id: '',
        repairPerson: '',
        repairdate: '', // 维修日期
        fee: '', // 维修话费
        repairCompany: '',
        repairDepartment: '',
        repairArea: '',
        repairPosition: '',
        repairHandler: 'admin',
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
      assetSelected: [] // 当前选中资产
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.xjzyxxVisible = val
      },
      immediate: true
    },
    assetSelected: {
      handler(val) {
        this.addOption.assetUuids = val.map((item) => item.assetId).join(',')
      },
      deep: true
    },
    fileList: {
      handler(val) {
        console.log('254 fileList', val)
        this.addOption.images = this.fileList.map((item) => ({
          name: item.name,
          path: item.response.data.virtualImageUrl
        }))
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
  },
  methods: {
    // Fn: 移除图片
    handlePictureCardRemove(file, fileList) {
      console.log('288 移除图片', file, fileList)
      this.fileList = fileList
    },
    // Fn: 上传图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    // Fn: 上创图片成功
    handlePictureCardSuccess(response, file, fileList) {
      console.log('304 上传图片成功', response, file, fileList)
      this.fileList = fileList
    },
    // Fn: 取消模态框
    handleCancel() {
      this.xjzyxxVisible = false
      this.$emit('update:visible', false)
    },
    // Fn: 确认
    handleConfirm() {
      this.$refs.assetForm.validate((validate) => {
        if (validate) {
          const params = {
            ...this.addOption,
            repairdate: dayjs(this.addOption.repairdate).format('YYYY-MM-DD')
          }
          console.log(21444444, params)
          this.$emit('submit-form', params, this.addOption.id)
        }
      })
    },
    // Fn: 改变资产选中
    changeAssetSelected(val) {
      console.log('233 改变资产选中', val)
      this.assetSelected = val
    }
  }
}
</script>
