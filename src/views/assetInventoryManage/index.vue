<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新建</el-button>

      </el-col>
    </el-row>

    <div class="maintable">
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
        :sort-config="{remote:true}"
        @sort-change="sortChangeEvent"
      >
        <vxe-table-column title="生成任务文件" width="120" :resizable="false">
          <template #default="{row}">

            <el-button type="primary" size="mini" :loading="row.createTaskLoading" @click="createTask(row)">生成</el-button>
          </template>
        </vxe-table-column>
        <vxe-table-column width="32" class="meuntd" :resizable="false" :edit-render="{}">
          <template>
            <div class="moreOuter">
              <i class="el-icon-more" />

            </div>
          </template>
          <template slot="edit" slot-scope="scope">
            <i class="el-icon-more" style="position:relative;top:1px;left: -1px;" />

            <div class="editmenu">
              <div class="item">编辑</div>
              <div class="item create">删除</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="checkcode" title="盘点单号" sortable />
        <vxe-table-column field="checkname" title="盘点单名称" sortable />
        <!-- <vxe-table-column field="date" title="分配用户" sortable /> -->
        <vxe-table-column field="taskQty" title="资产数量" sortable />
        <vxe-table-column field="operdatetime" title="创建时间" sortable />

        <vxe-table-column field="checkStatus" title="状态" sortable>
          <template #default="{row}">
            <el-tag v-if="row.checkStatus === 0" type="warning">未完成</el-tag>
            <el-tag v-else type="success">已完成</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column field="title" title="状态修改">
          <template #default="{row}">
            <el-link type="primary" :underline="false" @click="allocationUser(row)">分配用户</el-link>
            |
            <el-link type="primary" :underline="false">详情</el-link>
            |
            <el-link type="primary" :underline="false">删除</el-link>
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
    </div>
    <!-- 模态框 -->

    <Dialog
      :visible.sync="showAddOrEdit"
      :title="showAddOrEditTitle"
    >
      <el-form :model="addOption" label-position="right" style="padding-right:40px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="盘点单名称" :label-width="addOptionWidth">
              <el-input placeholder="请输入盘点单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配用户" :label-width="addOptionWidth">
              <el-dropdown trigger="click" placement="bottom-start" style="width:100%">
                <el-input v-model="checkedUserTags" placeholder="请选择分配用户" />
                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <el-checkbox-group v-model="addOption.distributeUserId" class="UserCheckbox">
                    <el-checkbox label="用户1" />
                    <el-checkbox label="用户2" />
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="购入开始时间" :label-width="addOptionWidth">
              <el-date-picker
                v-model="addOption.buyStartdate"
                type="date"
                placeholder="请选择开始时间"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购入结束时间" :label-width="addOptionWidth">
              <el-date-picker
                v-model="addOption.buyEnddate"
                type="date"
                placeholder="请选择结束时间"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位" :label-width="addOptionWidth">
              <el-select v-model="addOption.checkMerchantId" placeholder="请选择单位" :style="{ width: '100%' }">
                <el-option label="区域一" value="1" />
                <el-option label="区域2" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="部门" :label-width="addOptionWidth">
              <el-input v-model="addOption.receivePosition" placeholder="请选择部门" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="资产分类" :label-width="addOptionWidth">

              <el-input v-model="addOption.assetkindId" placeholder="请选择资产分类" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="区域" :label-width="addOptionWidth">

              <el-input v-model="addOption.areaId" placeholder="说明" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" :label-width="addOptionWidth">
              <el-input v-model="addOption.memo" placeholder="说明" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </Dialog>
    <el-dialog title="分配用户" :visible.sync="showEditUserDialog" width="600px" :close-on-click-modal="false">
      <el-form ref="EditDialog" :model="DialogData" label-position="right" style="padding-right:20px;">
        <el-form-item label="分配用户" label-width="100px" prop="person">
          <el-dropdown trigger="click" placement="bottom-start" style="width:100%">
            <el-input v-model="checkedUserTags" />
            <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
              <el-checkbox-group v-model="DialogData.userList">
                <el-checkbox label="用户1" />
                <el-checkbox label="用户2" />
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getListCheck, createTaskTxt, checkBaseCode } from '@/api/assetManage'
import Dialog from '@/components/Dialog/index'
import Pagination from '@/components/Pagination'
export default {
  name: 'AssetInventoryManage',
  components: { Dialog, Pagination },
  data() {
    return {
      showEditUserDialog: false,
      DialogData: {
        userList: []
      },
      checkedUserTags: '',
      defaultProps: {
        children: 'children',
        label: 'groupName',
        isLeaf: 'leaf'
      },
      showAddOrEditTitle: '',
      showAddOrEdit: false,
      addOptionWidth: '160px',
      topnav: '',
      addOption: {

        areaId: [],
        assetkindId: [],
        buyEnddate: '',
        buyStartdate: '',
        checkMerchantId: [],
        checkname: '',
        distributeUserId: [],
        memo: ''
      },
      gjssVisible: false,
      settingVisible: false,
      tableData: [],
      formLabelWidth: '100px',
      pageQuery: {
        orderType: '',
        orderName: '',
        pageNo: 1,
        pageSize: 10
      },
      pageTotal: 0,
      tableLoading: false,
      MainSortData: {}
    }
  },
  created() {
    this.getList()
    checkBaseCode().then(res => {
      if (res.code === 0 && res.data) {
        for (const key in res.data) {
          this.$set(this.MainSortData, key, res.data[key])
        }
      }
    })
  },
  methods: {
    allocationUser(row) {
      this.showEditUserDialog = true
    },
    createTask(row) {
      if (!row.checkId) return
      row.createTaskLoading = true
      createTaskTxt(row.checkId).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '生成任务文件成功' })
        } else {
          this.$message({ type: 'error', message: '生成任务文件失败，请稍后再试' })
        }
        row.createTaskLoading = false
      }).catch(err => {
        console.log('err', err)
        row.createTaskLoading = false
        this.$message({ type: 'error', message: '生成任务文件失败，请稍后再试' })
      })
    },
    sortChangeEvent(column, property, order) {
      if (!column.order) {
        this.pageQuery.orderName = ''
        this.pageQuery.orderType = ''
        this.getList()
        return
      }
      this.pageQuery.pageNo = 1
      this.pageQuery.pageSize = 10
      this.pageQuery.orderName = column.property
      this.pageQuery.orderType = column.order.toUpperCase()
      this.getList()
    },
    getList(page) {
      if (page && page.limit) this.pageQuery.pageSize = page.limit
      this.tableLoading = true
      getListCheck(this.pageQuery).then(res => {
        if (res.code === 0 && res.data && res.data.items) {
          res.data.items.forEach(ele => { ele.createTaskLoading = false })
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addNew() {
      this.showAddOrEditTitle = '新增'
      this.showAddOrEdit = true
    },
    editClick(e) {
      if (e === 1) {
        this.showAddOrEditTitle = '编辑'
        this.showAddOrEdit = true
      }
    },
    handleAddNodeClick(item) {

    }
  }
}
</script>

<style  scoped>
.maintable {
  padding-top: 40px;
}
.UserCheckbox >>> .el-checkbox {
  display: block;
  padding: 4px 10px;
}
</style>
