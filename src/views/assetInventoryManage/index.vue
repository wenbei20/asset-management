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
        class="vxetable outvxetable"
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
              <div class="item" @click="editInventory(scope.row)">编辑</div>
              <div class="item create" @click="deteleInventory(scope.row)">删除</div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="checkcode" title="盘点单号" />
        <vxe-table-column field="checkname" title="盘点单名称" />
        <!-- <vxe-table-column field="date" title="分配用户" sortable /> -->
        <vxe-table-column field="taskQty" title="资产数量" sortable />
        <vxe-table-column field="operdatetime" title="创建时间" sortable />

        <vxe-table-column field="checkStatus" title="状态" sortable>
          <template #default="{row}">
            <el-tag v-if="row.checkStatus === 0" type="warning">未完成</el-tag>
            <el-tag v-else type="success">已完成</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="状态修改">
          <template #default="{row}">
            <el-switch
              :value="row.checkStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="changeCheckStatus($event,row)"
            />
            <i v-if="row.statusLoading" class="el-icon-loading" style="margin-left:10px;position:relative;top:2px;" />
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template #default="{row}">
            <el-link type="primary" :underline="false" @click="lookDetailCheck(row)">详情</el-link>
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
      :no-footer="lookDetailInfo"
      @confirm="createConfirm"
    >
      <el-form ref="addOption" v-loading="editCheckInfoLoading" :model="addOption" label-position="right" style="padding-right:40px;" :rules="addOptionsRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="盘点单名称" :label-width="addOptionWidth" prop="checkname">
              <el-input v-if="!lookDetailInfo" v-model="addOption.checkname" placeholder="请输入盘点单名称" />
              <span v-else class="lookDetailInfo">{{ addOption.checkname }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配用户" :label-width="addOptionWidth" prop="distributeUserId">
              <el-dropdown v-if="!lookDetailInfo" trigger="click" placement="bottom-start" style="width:100%">
                <el-input v-model="checkedUserTags" placeholder="请选择分配用户" />
                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <el-checkbox-group v-model="addOption.distributeUserId" class="UserCheckbox" @change="userSelectChange">
                    <el-checkbox v-for="(ele , i ) in MainSortData.userList" :key="i" :label="ele.reguserId">{{ ele.chineseName }}</el-checkbox>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else class="lookDetailInfo">{{ checkedUserTags }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="购入开始时间" :label-width="addOptionWidth">
              <el-date-picker
                v-if="!lookDetailInfo"
                v-model="addOption.buyStartdate"
                type="date"
                placeholder="请选择开始时间"
                style="width:100%;"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
              <span v-else class="lookDetailInfo">{{ addOption.buyStartdate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购入结束时间" :label-width="addOptionWidth">
              <el-date-picker
                v-if="!lookDetailInfo"
                v-model="addOption.buyEnddate"
                type="date"
                placeholder="请选择结束时间"
                style="width:100%;"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              />
              <span v-else class="lookDetailInfo">{{ addOption.buyEnddate }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位" :label-width="addOptionWidth">

              <el-dropdown v-if="!lookDetailInfo" trigger="click" placement="bottom-start" style="width:100%">
                <el-input v-model="checkedMerchantName" placeholder="请选择单位" />

                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <el-tree
                    ref="MerchantDialogTree"
                    show-checkbox
                    node-key="groupId"
                    :props="defaultProps"
                    :data="MainSortData.groupList"
                    :default-checked-keys="defaultCheckedKeys"
                    :expand-on-click-node="false"
                    :default-expand-all="true"
                    @check="MerchantTreeClick"
                  />
                </el-dropdown-menu>

              </el-dropdown>
              <span v-else class="lookDetailInfo">{{ checkedMerchantName }}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="部门" :label-width="addOptionWidth">
              <el-input v-model="addOption.receivePosition" placeholder="请选择部门" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="资产分类" :label-width="addOptionWidth">

              <el-dropdown v-if="!lookDetailInfo" trigger="click" placement="bottom-start" style="width:100%">
                <el-input v-model="checkedAssetkindName" placeholder="请选择资产分类" />

                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <el-tree
                    ref="MerchantDialogTree"
                    show-checkbox
                    node-key="assetkindId"
                    :props="assetkindProps"
                    :data="MainSortData.assetkindList"
                    :default-checked-keys="defaultAssetkindCheckedKeys"
                    :expand-on-click-node="false"
                    :default-expand-all="true"
                    @check="AssetkindTreeClick"
                  />
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else class="lookDetailInfo">{{ checkedAssetkindName }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="区域" :label-width="addOptionWidth">
              <el-dropdown v-if="!lookDetailInfo" trigger="click" placement="bottom-start" style="width:100%">
                <el-input v-model="checkedAreaTags" placeholder="请选择区域" />
                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <el-checkbox-group v-model="addOption.areaId" class="UserCheckbox" @change="userAreaChange">
                    <el-checkbox v-for="(ele , i ) in MainSortData.areaList" :key="i" :label="ele.area_id">{{ ele.area_name }}</el-checkbox>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else class="lookDetailInfo">{{ checkedAreaTags }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" :label-width="addOptionWidth">
              <el-input v-if="!lookDetailInfo" v-model="addOption.memo" placeholder="说明" />
              <span v-else class="lookDetailInfo">{{ checkedAreaTags }}</span>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </Dialog>
    <!-- <el-dialog title="分配用户" :visible.sync="showEditUserDialog" width="600px" :close-on-click-modal="false">
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
    </el-dialog> -->

  </div>
</template>

<script>
import { getListCheck, createTaskTxt, checkBaseCode, deleteCheck, saveCheck, updateCheckStatus, getCheckInfo, updateCheck } from '@/api/assetManage'
import Dialog from '@/components/Dialog/index'
import Pagination from '@/components/Pagination'
export default {
  name: 'AssetInventoryManage',
  components: { Dialog, Pagination },
  data() {
    return {
      lookDetailInfo: false,
      editCheckInfoLoading: false,
      addOptionsRules: {
        checkname: [
          { required: true, message: '请输入盘点单名称', trigger: 'blur' }
        ],
        distributeUserId: [
          { required: true, message: '请选择分配用户', trigger: 'change' }
        ]
      },
      checkedAreaTags: '',
      checkedAssetkindName: '',
      defaultAssetkindCheckedKeys: [],
      defaultCheckedKeys: [],
      checkedMerchantName: '',
      showEditUserDialog: false,
      DialogData: {},
      checkedUserTags: '',
      defaultProps: {
        children: 'children',
        label: 'groupName',
        isLeaf: 'leaf'
      },
      assetkindProps: {
        children: 'children',
        label: 'assetkindName'
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
    lookDetailCheck(row) {
      this.lookDetailInfo = true
      this.editInventory(row, true)
    },
    editInventory(row, bool) {
      this.showAddOrEdit = true
      this.showAddOrEditTitle = bool ? '查看领用详细' : '编辑领用'
      this.editCheckInfoLoading = true
      getCheckInfo(row.checkId).then(res => {
        if (res.code === 0) {
          const data = res.data

          this.addOption.checkId = row.checkId

          for (const key in this.addOption) {
            if (Array.isArray(this.addOption[key])) {
              this.addOption[key] = data[key] ? data[key].split(',') : []
            } else {
              this.addOption[key] = data[key]
            }
          }

          if (data.distributeUserId) {
            this.MainSortData.userList.forEach(ele => {
              if (this.addOption.distributeUserId.findIndex(item => item === ele.reguserId) !== -1) {
                this.checkedUserTags += ele.chineseName
                this.checkedUserTags += ' ; '
              }
            })
          }

          if (data.distributeUserId) {
            this.MainSortData.areaList.forEach(ele => {
              if (this.addOption.areaId.findIndex(item => item === ele.area_id) !== -1) {
                this.checkedAreaTags += ele.area_name
                this.checkedAreaTags += ' ; '
              }
            })
          }

          if (data.assetkindId) {
            this.defaultAssetkindCheckedKeys = data.assetkindId.split(',')
            this.checkedAssetkindName = this.getAllCheckedItem(this.MainSortData.assetkindList, this.defaultAssetkindCheckedKeys, 'assetkindId', 'assetkindName')
          }

          if (data.checkMerchantId) {
            this.defaultCheckedKeys = data.checkMerchantId.split(',')
            this.checkedMerchantName = this.getAllCheckedItem(this.MainSortData.groupList, this.defaultCheckedKeys, 'groupId', 'groupName')
          }

          this.editCheckInfoLoading = false
        } else {
          this.$message({ type: 'error', message: '获取详细失败,请稍后再试' })
          this.showAddOrEdit = false
        }
        this.editCheckInfoLoading = false
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '获取详细失败,请稍后再试' })
        this.editCheckInfoLoading = false
        this.showAddOrEdit = false
      })
    },
    getAllCheckedItem(arr, ids, idStr, nameStr) {
      let str = ''
      arr.forEach(item => {
        const index = ids.findIndex(ele => ele === item[idStr])
        if (index !== -1) {
          str += item[nameStr]
          str += ' ; '
        }
        if (item.children && item.children.length) {
          const childstr = this.getAllCheckedItem(item.children, ids, idStr, nameStr)
          str += childstr
        }
      })
      return str
    },
    changeCheckStatus(val, row) {
      console.log('val', val)
      console.log('row', row)
      row.statusLoading = true
      updateCheckStatus({ checkId: row.checkId, checkStatus: val }).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '修改盘点状态成功' })
          row.checkStatus = val
        } else {
          this.$message({ type: 'error', message: '修改盘点状态失败,请稍后再试' })
        }
        row.statusLoading = false
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '修改盘点状态失败,请稍后再试' })
        row.statusLoading = false
      })
    },
    userSelectChange(val) {
      console.log('val', val)
      let str = ''
      val.forEach(item => {
        const idx = this.MainSortData.userList.findIndex(ele => ele.reguserId === item)
        if (idx !== -1) {
          str += this.MainSortData.userList[idx].chineseName
          str += ' ; '
        }
      })

      this.checkedUserTags = str

      // this.checkedUserTags = val.map(ele => ele.chineseName).join(' ; ')
    },
    userAreaChange(val) {
      console.log('val', val)

      let str = ''
      val.forEach(item => {
        const idx = this.MainSortData.areaList.findIndex(ele => ele.area_id === item)
        if (idx !== -1) {
          str += this.MainSortData.areaList[idx].area_name
          str += ' ; '
        }
      })

      this.checkedAreaTags = str
    },

    AssetkindTreeClick(item, { checkedKeys, checkedNodes }) {
      console.log('item', item)

      let checkedAssetkindName = ''
      const arr = []
      checkedNodes.forEach((ele, idx) => {
        const backstr = idx === (checkedNodes.length - 1) ? '' : ' ; '
        checkedAssetkindName += ele.assetkindName + backstr
        arr.push(ele.assetkindId)
      })
      this.checkedAssetkindName = checkedAssetkindName
      this.addOption.assetkindId = arr
    },
    MerchantTreeClick(item, { checkedKeys, checkedNodes }) {
      console.log('item', item)

      let checkedMerchantName = ''
      const arr = []
      checkedNodes.forEach((ele, idx) => {
        const backstr = idx === (checkedNodes.length - 1) ? '' : ' ; '
        checkedMerchantName += ele.groupName + backstr
        arr.push(ele.groupId)
      })
      this.checkedMerchantName = checkedMerchantName
      this.addOption.checkMerchantId = arr
    },
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
      } else {
        switch (column.property) {
          case 'taskQty' :
            this.pageQuery.orderName = 'task_qty'
            break
          case 'checkStatus':
            this.pageQuery.orderName = 'check_status'
            break
          default:
            this.pageQuery.orderName = column.property
        }
      }
      this.pageQuery.pageNo = 1
      this.pageQuery.pageSize = 10
      this.pageQuery.orderType = column.order.toUpperCase()
      this.getList()
    },
    getList(page) {
      if (page && page.limit) this.pageQuery.pageSize = page.limit
      this.tableLoading = true
      getListCheck(this.pageQuery).then(res => {
        if (res.code === 0 && res.data && res.data.items) {
          res.data.items.forEach(ele => {
            ele.createTaskLoading = false
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
      this.clearCreateStatus()
      this.showAddOrEditTitle = '新增领用'
      this.showAddOrEdit = true
    },
    deteleInventory(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCheck(row.checkId).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getList()
          } else {
            this.$message({ type: 'error', message: '删除失败，请稍后再试' })
          }
        }).catch(err => {
          this.$message({ type: 'error', message: '删除失败，请稍后再试' })
          console.log('err', err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    createConfirm(bool) {
      if (!bool) {
        this.clearCreateStatus()
        return
      }
      this.$refs.addOption.validate(validate => {
        if (validate) {
          const query = {
            ...this.addOption
          }
          query.areaId = query.areaId.join(',')
          query.checkMerchantId = query.checkMerchantId.join(',')
          query.distributeUserId = query.distributeUserId.join(',')
          query.assetkindId = query.assetkindId.join(',')
          console.log('query', query)

          if (this.showAddOrEditTitle === '编辑领用') {
            this.commitEditCheck(query)
            return
          }

          if (query.checkId) {
            delete query.checkId
          }

          saveCheck(query).then(res => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: '添加资产盘点成功' })
              this.clearCreateStatus()
              this.getList()
            } else {
              this.showAddOrEdit = false
              this.$message({ type: 'error', message: '添加资产盘点失败,请稍后再试' })
            }
          }).catch(err => {
            console.log('err', err)
            this.$message({ type: 'error', message: '添加资产盘点失败,请稍后再试' })
            this.showAddOrEdit = false
          })
        }
      })
    },
    commitEditCheck(query) {
      updateCheck(query).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '修改盘点成功' })
          this.clearCreateStatus()
          this.getList()
        } else {
          this.showAddOrEdit = false
          this.$message({ type: 'error', message: '修改盘点失败,请稍后再试' })
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '修改盘点失败,请稍后再试' })
        this.showAddOrEdit = false
      })
    },
    clearCreateStatus() {
      this.showAddOrEdit = false
      this.lookDetailInfo = false
      this.addOption = {
        areaId: [],
        assetkindId: [],
        buyEnddate: '',
        buyStartdate: '',
        checkMerchantId: [],
        checkname: '',
        distributeUserId: [],
        memo: ''
      }
      this.checkedUserTags = ''
      this.checkedMerchantName = ''
      this.checkedAssetkindName = ''
      this.checkedAreaTags = ''
      this.defaultAssetkindCheckedKeys = []
      this.defaultCheckedKeys = []
      this.$nextTick(() => {
        this.$refs.addOption.clearValidate()
      })
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
.innerTreeForDepart {
  min-width: 200px;
}
.outvxetable >>> .vxe-table--body-wrapper {
      min-height: 350px;
}
</style>
