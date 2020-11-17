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
          <el-form-item label="维修内容" :label-width="addOptionWidth">
            <el-input v-model="addOption.repairContent" placeholder="维修内容" />
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
              list-type="picture-card"
              ref="upload"
              :action="postUrl"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handlePictureCardRemove"
              :on-change="handlePictureCardChange"
              :on-success="handlePictureCardSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogImageVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <!--选择资产-->
      <div :style="{ margin: '10px 0' }">
        <el-button plain @click="selectAsset">选择资产</el-button>
        <el-button :disabled="!this.assetTableData.length" @click="deleteAsset">删除所选</el-button>
      </div>
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        class="vxetable"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="assetTableData"
        @checkbox-all="handleSelectionAll"
        @checkbox-change="handleSelectionChange"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="imageList" title="照片">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              v-for="image in scope.row.imageList"
              :key="image.url"
              :src="url"
              :fit="fit"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column field="assetcode" title="资产编码" />
        <vxe-table-column field="assetname" title="资产名称" />
        <vxe-table-column field="guizeNo" title="规格型号" />
        <vxe-table-column field="snNo" title="SN号" />
        <vxe-table-column field="groupName" title="所属公司" />
        <vxe-table-column field="posname" title="存放地点" />
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />

    </el-form>
    <!--第二个弹出框选择资产-->
    <el-dialog
      width="1200px"
      title="选择资产"
      :visible.sync="innerVisible"
      :destroy-on-close="true"
      append-to-body
    >
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        class="vxetable"
        row-id="assetId"
        :auto-resize="true"
        :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}"
        :data="innerTableData"
        :checkbox-config="{ checkRowKeys: this.innerTableSelectionKeys }"
        @checkbox-all="innerSelectionAll"
        @checkbox-change="innerSelectionChange"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column field="imageList" title="照片">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              v-for="image in scope.row.imageList"
              :key="image.url"
              :src="url"
              :fit="fit"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column field="assetcode" title="资产编码" />
        <vxe-table-column field="assetname" title="资产名称" />
        <vxe-table-column field="guizeNo" title="规格型号" />
        <vxe-table-column field="snNo" title="SN号" />
        <vxe-table-column field="groupName" title="所属公司" />
        <vxe-table-column field="posname" title="存放地点" />
      </vxe-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="innerPageTotal"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerCancel">取 消</el-button>
        <el-button @click="innerConfirm" type="primary">确定添加</el-button>
      </div>
    </el-dialog>
    <!--/第二个弹出框选择资产 over-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button @click="handleConfirm" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryNewAssetRepairList } from '@/api/assetManage'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      xjzyxxVisible: false,
      innerVisible: false,
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
      postUrl: '',
      fileList: [],
      // 外层选中资产列表
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      assetTableData: [],
      assetTableSelection: [],
      assetTableSelectionKeys: [],
      // 内层全部资产列表
      innerPageNo: 1,
      innerPageSize: 10,
      innerPageTotal: 0,
      innerTableData: [],
      innerTableSelection: [],
      innerTableSelectionKeys: []
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.xjzyxxVisible = val
      },
      immediate: true
    },
    assetTableSelectionKeys: {
      handler(val) {
        console.log('247 assetTableSelectionKeys', val)
        this.addOption.assetUuids = this.assetTableSelectionKeys
      },
      deep: true
    },
    fileList: {
      handler(val) {
        console.log('254 fileList', val)
        this.addOption.images = this.fileList
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
  mounted() {
    this.queryNewAssetRepairList()
  },
  methods: {
    // Fn: 获取新增页面资产列表
    queryNewAssetRepairList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryNewAssetRepairList(params).then((res) => {
        if(res.code === 0 && res.data && res.data.items) {
          this.innerTableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
      .catch((err) => { console.log('err', err) })
    },
    // Fn: 移除图片
    handlePictureCardRemove(file, fileList) {
      console.log('288 移除图片', file, fileList)
      this.fileList = fileList
    },
    // Fn: 上传图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageVisible = true;
    },
    // Fn: 上传图片变换
    handlePictureCardChange(file, fileList) {
      console.log('297 上传图片变化', file, fileList)
      this.fileList = fileList
    },
    // Fn: 上创图片成功
    handlePictureCardSuccess(response, file, fileList) {
      console.log('304 上传图片成功', response, file, fileList)
    },
    // Fn: 多选项转成id数组
    selection2keys(selection) {
      return selection.map((item) => item.assetId)
    },
    // Fn: 选择资产
    selectAsset() {
      this.innerVisible = true
    },
    // Fn: 删除资产
    deleteAsset() {
      if(!this.assetTableSelection.length) {
        this.$message({
          showClose: true,
          message: '请至少选择一项资源，才能进行删除！',
          type: 'warning'
        });
        return
      }
      const selectionKeys = this.assetTableSelection.map((item) => item.assetId)
      // 内层模态框table选中项
      this.innerTableSelection = this.assetTableData.filter((item) => !selectionKeys.includes(item.assetId))
      this.innerTableSelectionKeys = this.selection2keys(this.innerTableSelection)
      // 外层table剩余项
      this.assetTableData = this.assetTableData.filter((item) => !selectionKeys.includes(item.assetId))
    },
    // Fn: 取消模态框
    handleCancel() {
      this.xjzyxxVisible = false
      this.$emit('update:visible', false)
    },
    // Fn: 确认
    handleConfirm() {
      console.log('确认');
      this.$refs.assetForm.validate((validate) => {
        console.log(314, validate)
        if (validate) {
          this.$emit('submit-form', this.addOption, this.addOption.id)
        }
      })
    },
    // Fn: 多选
    handleSelectionChange(val) {
      this.assetTableSelection = val.selection
      this.assetTableSelectionKeys = this.selection2keys(this.assetTableSelection)
    },
    // Fn: 全选
    handleSelectionAll(val) {
      this.assetTableSelection = val.selection
      this.assetTableSelectionKeys = this.selection2keys(this.assetTableSelection)
    },
    // Fn: 取消模态框（内层模态框）
    innerCancel() {
      this.innerVisible = false
    },
    // Fn: 确认（内层模态框）
    innerConfirm() {
      this.assetTableData = [ ...this.innerTableSelection ]
      this.innerVisible = false
    },
    // Fn: 多选（内层模态框）
    innerSelectionChange(val) {
      this.innerTableSelection = val.selection
      this.innerTableSelectionKeys = this.selection2keys(this.innerTableSelection)
    },
    // Fn: 全选（内层模态框）
    innerSelectionAll(val) {
      this.innerTableSelection = val.selection
      this.innerTableSelectionKeys = this.selection2keys(this.innerTableSelection)
    }
  }
}
</script>
