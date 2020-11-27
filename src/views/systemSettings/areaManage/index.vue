<template>
  <div class="app-container">
    <el-row>
      <el-input
        v-model="pageQuery.areaName"
        :style="{ width: '260px',marginRight:'20px' }"
        placeholder="请输入区域名称"
        clearable
        @clear="getList"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>

    </el-row>
    <el-row style="padding-top:20px;">
      <vxe-table
        ref="xTree"
        v-loading="tableLoading"
        resizable
        highlight-hover-row
        :auto-resize="true"
        stripe
        class="vxetable"
        :edit-config="{trigger: 'click', mode: 'cell',showIcon:false}"
        :data="tableData"
      >
        <vxe-table-column field="areaId" width="160" title="区域编码" />
        <vxe-table-column field="areaName" title="区域名称" />
        <vxe-table-column field="status" width="160" title="状态">
          <template #default="{ row }" width="160">

            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="状态修改" width="160">
          <template #default="{row}">
            <el-switch
              :value="row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="changeCheckStatus($event,row)"
            />
            <i v-if="row.statusLoading" class="el-icon-loading" style="margin-left:10px;position:relative;top:2px;" />
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="160">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="EditArea(scope.row)">编辑</el-link>
            |
            <el-link type="primary" :underline="false" @click="deleteArea(scope.row)">删除</el-link>
          </template>
        </vxe-table-column>

      </vxe-table>
      <pagination
        v-show="pageTotal>0"
        background
        :total="pageTotal"
        layout="prev, pager, next, jumper"
        :page.sync="pageQuery.pageNo"
        :limit.sync="pageQuery.pageSize"
        style="text-align:right;margin-top:20px;"
        @pagination="getList"
      />
    </el-row>
    <el-dialog :title="createDialogTitle" :visible.sync="showCreateDailog" width="600px" :close-on-click-modal="false">
      <el-form ref="createArea" :model="createAreaOption" label-position="right" style="padding-right:20px;" :rules="AreaOptionRules">
        <el-form-item label="区域编码" :label-width="formLabelWidth" prop="areaId">
          <el-input v-model="createAreaOption.areaId" placeholder="请输入区域编码" />
        </el-form-item>
        <el-form-item label="区域名称" :label-width="formLabelWidth" prop="areaName">
          <el-input v-model="createAreaOption.areaName" placeholder="请输入区域名称" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalCreate">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getlistArea, saveAreaInfo, updateAreaStatus, deleteArea, updateArea, checkAreaByAreaIdExist, checkAreaByAreaNameExist } from '@/api/settings'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    const validateEditCode = (rule, value, callback) => {
      value = this.createAreaOption.areaId
      if (value === '') {
        callback(new Error('请输入区域编码'))
      } else {
        const query = { areaId: value }
        if (this.editingAreaUuid) query.uuid = this.editingAreaUuid
        checkAreaByAreaIdExist(query).then(res => {
          if (res.code === 0) {
            res.data ? callback(new Error('区域编码已存在')) : callback()
          } else {
            callback(new Error('检查区域编码失败'))
          }
        }).catch(err => {
          console.log('err', err)
          callback(new Error('检查区域编码失败'))
        })
      }
    }

    const validateEditName = (rule, value, callback) => {
      value = this.createAreaOption.areaName
      if (value === '') {
        callback(new Error('请输入区域名称'))
      } else {
        const query = { areaName: value }
        if (this.editingAreaUuid) query.uuid = this.editingAreaUuid
        checkAreaByAreaNameExist(query).then(res => {
          if (res.code === 0) {
            res.data ? callback(new Error('区域名称已存在')) : callback()
          } else {
            callback(new Error('检查区域名称失败'))
          }
        }).catch(err => {
          console.log('err', err)
          callback(new Error('检查区域名称失败'))
        })
      }
    }
    return {
      showCreateDailog: false,
      createDialogTitle: '',
      tableData: [],
      pageTotal: 0,
      pageQuery: {
        pageNo: 1,
        pageSize: 10,
        areaName: ''
      },
      tableLoading: false,
      createAreaOption: {
        areaId: '',
        areaName: ''
      },
      AreaOptionRules: {
        areaId: [
          { required: true, validator: validateEditCode, trigger: 'blur' }
        ],
        areaName: [
          { required: true, validator: validateEditName, trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      editingAreaUuid: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      getlistArea(this.pageQuery).then(res => {
        console.log('res', res)
        if (res.code === 0 && res.data && res.data.items) {
          res.data.items.forEach(ele => {
            ele.statusLoading = false
          })
          this.tableData = res.data.items
          this.pageTotal = res.data.total
          this.pageQuery.pageSize = res.data.limit
          this.pageQuery.pageNo = res.data.page
        }

        this.tableLoading = false
      }).catch(err => {
        console.log('err', err)
        this.tableLoading = false
      })
    },
    EditArea(row) {
      this.createDialogTitle = '编辑区域'
      this.editCopyAreaData = {
        areaId: row.areaId,
        areaName: row.areaName
      }
      this.createAreaOption.areaId = row.areaId
      this.createAreaOption.areaName = row.areaName
      this.editingAreaUuid = row.uuid
      this.showCreateDailog = true
      this.$nextTick(() => {
        this.$refs.createArea.clearValidate()
      })
    },
    deleteArea(row) {
      this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        deleteArea(row.uuid).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '删除成功' })
          }
        }).catch(err => {
          console.log('err', err)
          this.$message({ type: 'error', message: '删除区域失败，请稍后再试' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    handleNew() {
      this.createDialogTitle = '新增区域'
      this.editingAreaUuid = ''
      this.createAreaOption = {
        areaId: '',
        areaName: ''
      }
      this.showCreateDailog = true
      this.$nextTick(() => {
        this.$refs.createArea.clearValidate()
      })
    },
    handleEditArea() {
      const query = {
        ...this.createAreaOption,
        uuid: this.editingAreaUuid
      }
      updateArea(query).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '编辑区域成功' })
          this.getList()
        } else {
          this.$message({ type: 'error', message: '编辑区域失败，请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '编辑区域失败，请稍后再试' })
      }).finally(() => {
        this.showCreateDailog = false
        this.createAreaOption = { areaId: '', areaName: '' }
      })
    },
    handleConfirm() {
      this.$refs.createArea.validate(validate => {
        if (validate) {
          if (this.createDialogTitle === '编辑区域') {
            this.handleEditArea()
            return
          }

          saveAreaInfo(this.createAreaOption).then(res => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: '新增区域成功' })
              this.pageQuery = { pageNo: 1,
                pageSize: 10,
                areaName: ''
              }
              this.getList()
            } else {
              this.$message({ type: 'error', message: '新增区域失败，请稍后再试' })
            }
          }).catch(err => {
            console.log('err', err)
            this.$message({ type: 'error', message: '新增区域失败，请稍后再试' })
          }).finally(() => {
            this.showCreateDailog = false
            this.createAreaOption = { areaId: '', areaName: '' }
          })
        }
      })
    },
    searchList() {
      if (!this.pageQuery.areaName) {
        this.$message({ type: 'warning', message: '请输入搜索单号' })
        return
      }
      this.getList()
    },
    changeCheckStatus(val, row) {
      console.log('val', val)
      console.log('row', row)
      row.statusLoading = true
      updateAreaStatus({ status: val }, row.uuid).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '修改区域状态成功' })
          row.status = val
        } else {
          this.$message({ type: 'error', message: '修改区域状态失败,请稍后再试' })
        }
        row.statusLoading = false
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '修改区域状态失败,请稍后再试' })
        row.statusLoading = false
      })
    },
    cancalCreate() {
      this.createAreaOption = {
        areaId: '',
        areaName: ''
      }
      this.showCreateDailog = false
    }
  }
}
</script>
