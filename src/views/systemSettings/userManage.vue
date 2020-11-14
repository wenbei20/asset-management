<template>
  <div class="app-container">
    <nav-tree
      title="公司组织架构"
      class="navtree"
      @show="hidenavtree"
      @operation="navTreeOperation"
      @Add="Add"
    />
    <div :class="['container' , !navTreeShow ? 'hidetree' : '']">
      <el-row style="height:40px; margin-left:10px;padding-top:10px;">
        <el-select v-model="SearchType" placeholder="请选择搜索类型" style="padding:0 6px;width:160px;">
          <el-option label="用户名" value="reguserName" />
          <el-option label="姓名" value="chineseName" />
        </el-select>
        <div class="SearchBox">
          <el-input
            v-model="searchIpt"
            :style="{ width: '160px',marginRight:'10px' }"
            placeholder="搜索..."
            clearable
            @clear="clearSearchRes"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchList" />
          </el-input>
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="createSimplePerson">新建</el-button>
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
          <vxe-table-column type="checkbox" width="40" :resizable="false" />
          <vxe-table-column type="checkbox" width="40" :resizable="false" />
          <vxe-table-column type="seq" title="序号" width="60" />
          <vxe-table-column field="reguserName" title="用户名" />
          <vxe-table-column field="chineseName" title="姓名" />
          <vxe-table-column field="mobile" title="手机号" />
          <vxe-table-column field="email" title="邮箱" />
          <vxe-table-column title="操作">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="editSysUser(scope.row)">编辑</el-link>
              |
              <el-link type="primary" :underline="false" @click="deleteSysUser(scope.row)">删除</el-link>
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
          style="text-align:right;margin-top:20px;height:30px;"
          @pagination="getList"
        />
        <el-dialog title="添加成员" :visible.sync="showAddDialog" width="600px">
          <el-form ref="addUserInfo" :model="addUserInfo" label-position="right" style="padding-right:20px;" :rules="addUserInfoRules">
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="addUserInfo.mobile" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="addUserInfo.email" />
            </el-form-item>
            <el-form-item label="账号" :label-width="formLabelWidth" prop="reguserName">
              <el-input v-model="addUserInfo.reguserName" />
            </el-form-item>
            <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="chineseName">
              <el-input v-model="addUserInfo.chineseName" />
            </el-form-item>
            <el-form-item label="启用/停用" :label-width="formLabelWidth" prop="activeFlag">
              <el-radio-group v-model="addUserInfo.activeFlag">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="单位/部门" :label-width="formLabelWidth" prop="groupId">
              <el-dropdown trigger="click" placement="bottom-start" style="width:100%" @visible-change="changeDialogDepartment">
                <el-input v-model="checkedDepartTags" />

                <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                  <el-tree
                    ref="dialogTree"
                    node-key="groupId"
                    :props="defaultProps"
                    :load="loadNode"
                    :expand-on-click-node="false"
                    lazy
                    @node-click="handleAddNodeClick"
                  />
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="允许补充资产字段" :label-width="formLabelWidth" prop="addFiledsFlag">
              <el-radio-group v-model="addUserInfo.addFiledsFlag">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="2">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddDialog=false">取 消</el-button>
            <el-button type="primary" @click="createConfirm">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog :title="editDialogTitle" :visible.sync="showEditDialog" width="600px" @click="editDialogClose">
          <el-form ref="EditDialog" :model="DialogData" label-position="right" style="padding-right:20px;" :rules="EditRules">
            <el-form-item v-if="editDialogStatus !== 'setPrincipal'" prop="name" :label="editDialogLabel" label-width="120px" required>
              <el-input v-model="DialogData.name" />
            </el-form-item>
            <el-form-item v-else label="部门负责人" label-width="100px" prop="person">
              <el-autocomplete
                v-model="reguserName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                style="width:100%"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.chineseName }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogClose">取 消</el-button>
            <el-button type="primary" @click="editConfirm">确 定</el-button>
          </div>
        </el-dialog>

      </el-row>
    </div>
  </div>
</template>
<script>
import { saveOrganizationGroup, getOrganizationGroup, getSysUserList, deleteSysUserList, getListRegUserByChineseName, addSysUserList } from '@/api/settings'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'
import navTree from '@/components/leftTreeNav'
import { isMobileNumber } from '@/utils/validate'
export default {
  components: { navTree, Pagination },

  data() {
    var validate = (rule, value, callback) => {
      if (!this.reguserName) {
        callback(new Error('请输入负责人姓名'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!isMobileNumber(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      SearchType: '',
      navTreeShow: true,
      showAddDialog: false,
      pageTotal: 10,
      showEditDialog: false,
      editDialogTitle: '',
      editDialogLabel: '',
      editDialogStatus: '',
      DialogData: {
        name: ''
      },
      reguserName: '',
      timeout: null,
      formLabelWidth: '140px',
      addUserInfo: {
        mobile: '',
        email: '',
        reguserName: '',
        chineseName: '',
        activeFlag: '',
        groupId: '',
        merchantId: '',
        addFiledsFlag: ''
      },
      addUserInfoRules: {
        mobile: [
          { validator: validateMobile, trigger: 'blur', required: true }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur', required: true },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        reguserName: [
          { message: '请输入账号', trigger: 'blur', required: true }
        ],
        chineseName: [
          { message: '请输入真实姓名', trigger: 'blur', required: true }
        ],
        activeFlag: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '请选择单位/部门', trigger: 'blur' }
        ],
        addFiledsFlag: [
          { required: true, message: '请选择补充资产字段', trigger: 'change' }
        ]
      },
      tableData: [],
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'zones',
        label: 'groupName',
        isLeaf: 'leaf'
      },
      thisOperationNode: {},
      searchIpt: '',
      pageQuery: {
        chineseName: '',
        email: '',
        mobile: '',
        pageNo: 1,
        pageSize: 10,
        reguserName: '',
        groupId: ''
      },
      tableLoading: false,
      checkedDepartment: [],
      defaultCheckedKeys: [],
      EditRules: {
        name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        person: [
          { validator: validate, trigger: 'blur', required: true }
        ]
      },
      checkedDepartTags: ''
    }
  },
  computed: {
    ...mapState({
      merchantId: state => state.user.merchantId
    })
  },
  created() {
    this.getList()
  },
  methods: {
    handleAddNodeClick(item) {
      console.log('item', item)
      this.addUserInfo.groupId = item.groupId
      this.checkedDepartTags = item.groupName
    },
    getList() {
      this.tableLoading = true
      getSysUserList(this.pageQuery).then(res => {
        console.log('res', res)
        if (res.code === 0 && res.data && res.data.items) {
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
    getTreeData() {

    },
    hidenavtree(e) {
      this.navTreeShow = e
    },
    createSimplePerson() {
      // this.defaultCheckedKeys.forEach(element => {
      //   this.$refs.dialogTree.setChecked(element, false)
      // })
      // this.defaultCheckedKeys = []
      // this.checkedDepartment = []
      this.showAddDialog = true
    },
    navTreeOperation(operate, data) {
      console.log('data', data)
      // this.checkedDepartment = []
      this.thisOperationNode = { ...data }
      if (operate !== 'addperson') {
        this.DialogData.name = ''
        this.editDialogStatus = operate
        this.showEditDialog = true

        switch (operate) {
          case 'addSonDepartment' :
            this.editDialogTitle = '添加子部门'
            this.editDialogLabel = '部门'
            break
          case 'setPrincipal':
            this.editDialogTitle = '设置负责人'
            break
          case 'changeName':
            this.editDialogTitle = '修改名称'
            break
          case 'addSonCompany':
            this.editDialogTitle = '添加(子)分公司'
            this.editDialogLabel = '(子)分公司名称'
            break
        }
      } else {
        this.showAddDialog = true
        // this.checkedDepartment = [{ ...data }]
        // this.defaultCheckedKeys = []
        // this.defaultCheckedKeys.push(data.groupId)
      }
    },
    editConfirm() {
      this.$ref.EditDialog.validate(validate => {
        if (validate) {
          if (this.editDialogStatus === 'addSonDepartment' && this.editDialogStatus === 'addSonCompany') {
            const obj = {
              parentId: this.thisOperationNode.groupId,
              nodeType: this.editDialogStatus === 'addSonDepartment' ? 1 : 0,
              groupName: this.DialogData.name
            }
            saveOrganizationGroup(obj).then(res => {
              console.log('res', res)
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: this.editDialogTitle + '成功'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: this.editDialogTitle + '失败，请稍后再试'
                })
              }
              this.editDialogClose()
            }).catch(err => {
              this.$message({
                type: 'error',
                message: this.editDialogTitle + '失败，请稍后再试'
              })
              console.log('err', err)
              this.editDialogClose()
            })
          }
          // else if () {

          // }
        }
      })
    },
    createConfirm() {
      this.$refs.addUserInfo.validate(validate => {
        if (validate) {
          this.addUserInfo.merchantId = this.merchantId
          console.log('addUserInfo', this.addUserInfo)
          addSysUserList({ ...this.addUserInfo }).then(res => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: '添加用户成功' })
            } else {
              this.$message({ type: 'success', message: '添加用户失败，请稍后再试' })
            }
            this.showAddDialog = false
          }).catch(err => {
            console.log('err', err)
            this.$message({ type: 'success', message: '添加用户失败，请稍后再试' })
            this.showAddDialog = false
          })
        }
      })
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        getListRegUserByChineseName({ chineseName: queryString }).then(res => {
          if (res.code === 0) {
            return cb(res.data)
          }
        })
        cb([])
      } else {
        cb([])
      }
    },
    handleSelect(e) {
      this.DialogData.name = e.reguserId
      this.reguserName = e.chineseName
    },
    clearSearchRes() {

    },
    searchList() {
      if (!this.SearchType) {
        this.$message({ type: 'warning', message: '请选择搜索类型' })
        return
      }
      if (!this.searchIpt) {
        this.$message({ type: 'warning', message: '请输入搜索内容' })
        return
      }

      this.pageQuery[this.SearchType] = this.searchIpt
      this.pageQuery.pageNo = 1
    },

    // 新建成员树结构
    getTreeNodeData(id) {
      return new Promise(function(resolve, reject) {
        getOrganizationGroup({ parentId: id }).then(res => {
          // console.log('res', res)
          if (res.code === 0 && res.data && Array.isArray(res.data)) {
            resolve(res.data)
          } else {
            resolve([])
          }
        }).catch(err => {
          console.log('err', err)
          resolve([])
        })
      })
    },
    loadNode(node, resolve) {
      console.log('node', node)
      const key = node.key ? node.key : this.merchantId
      this.getTreeNodeData(key).then(arr => {
        console.log('arr', arr)
        resolve(arr)
      })
    },
    changeDialogDepartment(visible) {
      if (!visible) {
        const checkedArr = this.$refs.dialogTree.getCheckedNodes()
        console.log('checkedArr', checkedArr)
        this.checkedDepartment = [...checkedArr.map(item => { return { ...item } })]
      }
    },
    Add(data) {
      console.log('lala', data)
      if (data.groupId) {
        // getListRegUserByGroupId({ groupId: data.groupId }).then(res => {
        //   console.log('res', res)
        // }).catch(err => {
        //   console.log('err', err)
        // })
        this.pageQuery.groupId = data.groupId
        this.getList()
      } else {
        this.tableData = []
      }
    },
    editSysUser(row) {

    },
    deleteSysUser(row) {
      console.log('row', row)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        deleteSysUserList(row.reguserId).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '成功删除该用户' })
          }
        }).catch(err => {
          console.log('err', err)
          this.$message({ type: 'error', message: '删除用户失败，请稍后再试' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    editDialogClose() {
      this.showEditDialog = false
      this.$refs.EditDialog.clearValidate()
    }
  }
}
</script>
<style scoped>
.app-container {
    min-height:  calc(100vh - 50px);
}
.navtree {
  margin-left: 20px;
  height:calc(100vh - 90px);
}
.container {
    width: calc(100% - 275px);
    margin-left: 275px;
    box-shadow: 0 0 10px rgba(128, 145, 165, 0.2);
    box-sizing:border-box;
}
.container.hidetree {
  transition: all linear 0.2s;
  margin-left:20px;
  width: calc(100% - 20px);
}
.navtree >>> .deletePart {
  color: #999;
}
.SearchBox {
  /* float: right; */
  display: inline-block;
}
.SearchBox >span {
  display: inline-block;
  font-size: 14px;
  margin-right: 12px;
  color: #606266;
}
.innerTreeForDepart {
  padding: 10px 20px;
}
</style>

