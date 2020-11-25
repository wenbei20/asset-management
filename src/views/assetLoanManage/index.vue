<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
      <el-button :disabled="!tableSelection.length" icon="el-icon-printer" @click="showThisRelandDialog">归还</el-button>

    </el-row>
    <el-row style="padding-top:20px;">
      <vxe-table
        ref="xTree"
        resizable
        highlight-hover-row
        :auto-resize="true"
        stripe
        class="vxetable"
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionAll"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column width="32" class="meuntd" :resizable="false" :edit-render="{}">
          <template>
            <div class="moreOuter">
              <i class="el-icon-more" />

            </div>
          </template>
          <template slot="edit" slot-scope="scope">
            <i class="el-icon-more" style="position:relative;top:1px;left: -1px;" />

            <div class="editmenu">
              <div class="item" @click="handleEdit(scope.row)">修改</div>
              <div class="item" @click="handleDelete(scope.row)">删除</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="状态">
          <template #default="{row}">
            {{ row.status === 0 ? '已归还' : '借用中' }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="lendrecode" title="借还单号" />
        <vxe-table-column field="lendreUserId" title="借用人" />
        <vxe-table-column field="lenddate" title="借出时间" />
        <vxe-table-column field="planReturndate" title="预计归还时间" />
        <vxe-table-column field="returndate" title="归还时间" />
      </vxe-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        style="text-align:right;margin-top:20px;"
        :total="pageTotal"
      />
    </el-row>
    <!--新增/编辑-->
    <add-dialog
      v-if="showAddDialog"
      ref="AddDialog"
      :visible.sync="showAddDialog"
      :modal-type="modalType"
      :form-option="formOption"
      :main-sort-data="MainSortData"
      @submit-form="submitMethods"
    />
    <el-dialog title="归还" :visible.sync="showRelandDialog" width="700px">
      <el-form ref="assetForm" :model="relandOption" label-position="right" :rules="relandOptionRoles">
        <el-row>
          <el-col :span="23">
            <el-form-item label="实际归还时间" label-width="120px" prop="returndate">
              <el-date-picker
                v-model="relandOption.returndate"
                type="date"
                placeholder="请选择实际归还时间"
                :style="{ width: '100%' }"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="归还处理人" label-width="120px">
              <el-input :value="thisUserName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAssetLendreList, saveAssetLendre, returnAssetLendre, getAssetLendre, updateAssetLendre, deleteAssetLendre, getLendreBaseCode } from '@/api/assetManage'
import addDialog from './components/addnew'
import { mapState } from 'vuex'
export default {
  name: 'AssetLoanManage',
  components: { addDialog },
  data() {
    return {
      showAddDialog: false,
      modalType: 'new',
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      tableSelection: [],
      tableSelectionKeys: [],
      formOption: null,
      MainSortData: {},
      showRelandDialog: false,
      relandOption: {
        returndate: ''
      },
      relandOptionRoles: {
        returndate: [
          { required: true, message: '请选择预计归还时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      thisUserName: state => state.user.userChname
    })
  },
  mounted() {
    this.getList()
    this.getBaseCode()
  },
  methods: {
    getBaseCode() {
      getLendreBaseCode().then(res => {
        if (res.code === 0 && res.data) {
          for (const key in res.data) {
            this.$set(this.MainSortData, key, res.data[key])
          }
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // Fn: 初始化请求参数
    initSetting() {
      this.pageNo = 1
    },
    // Fn: 资源维修列表
    getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryAssetLendreList(params).then((res) => {
        if (res.code === 0 && res.data) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
        }
      })
        .catch((err) => { console.log('err', err) })
    },
    // Fn: 多选项转成id数组
    selection2keys(selection) {
      return selection.map((item) => item.lendreId)
    },
    // Fn: 多选
    handleSelectionChange(val) {
      this.tableSelection = val.selection
      this.tableSelectionKeys = this.selection2keys(this.tableSelection)
    },
    // Fn: 全选
    handleSelectionAll(val) {
      this.tableSelection = val.selection
      this.tableSelectionKeys = this.selection2keys(this.tableSelection)
    },
    // Fn: 新建
    handleNew() {
      this.modalType = 'new'
      this.showAddDialog = true
      this.$nextTick(() => {
        this.$refs.AddDialog && this.$refs.AddDialog.clearAllOptions()
      })
    },
    // Fn: 归还
    handleReturn() {

    },
    // Fn: 修改
    handleEdit(item) {
      getAssetLendre(item.lendreId).then((res) => {
        console.log('112 getAssetLendre', res)
        if (res.code === 0) {
          const { lendre, lendreAssetList, lendrePicList } = res.data
          this.modalType = 'edit'
          this.formOption = {
            formData: lendre,
            imagesList: lendrePicList.map((item) => ({
              name: item.picname,
              path: item.filepath,
              url: item.filepath
            })),
            assetList: lendreAssetList,
            lendreId: item.lendreId
          }
          this.showAddDialog = true
        }
      })
    },
    // Fn: 删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该资产借还, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAssetLendre(item.lendreId).then((res) => {
          if (res.code === 0) {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          }
        })
          .catch((err) => {
            console.log('err', err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitMethods(params, id) {
      const promise = this.modalType === 'new' ? saveAssetLendre(params) : updateAssetLendre(params, id)
      const msg = this.modalType === 'new' ? '新增' : '编辑'
      promise.then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: msg + '借还成功' })
          this.modalType === 'new' ? this.pageNo = 1 : null
          this.getList()
        } else {
          this.$message({ type: 'error', message: msg + '借还失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: msg + '借还失败，请稍后再试' })
      }).finally(() => {
        this.showAddDialog = false
      })
    },
    handleCancel() {
      this.showRelandDialog = false
      this.relandOption = {
        returndate: ''
      }
    },
    showThisRelandDialog() {
      this.relandOption = {
        returndate: ''
      }
      this.showRelandDialog = true
      this.$nextTick(() => {
        this.$refs.assetForm.clearValidate()
      })
    },
    handleConfirm() {
      this.$refs.assetForm.validate(validate => {
        if (validate) {
          const query = {
            lendreIds: this.tableSelectionKeys.join(','),
            returnDate: this.relandOption.returndate
          }
          returnAssetLendre(query).then((res) => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: '归还成功' })
              this.getList()
            } else {
              this.$message({ type: 'error', message: '归还失败，请稍后再试' })
            }
          }).catch(err => {
            console.log('err', err)
            this.$message({ type: 'error', message: '归还失败，请稍后再试' })
          }).finally(() => {
            this.showRelandDialog = false
          })
        }
      })
    }
  }
}
</script>

<style  scoped>
.vxetable >>> .vxe-table--body-wrapper {
  min-height: 350px;
}
</style>
