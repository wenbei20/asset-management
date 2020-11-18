<template>
  <div class="app-container">
    <nav-tree
      ref="navtree"
      title="公司组织架构"
      class="navtree"
      @show="hidenavtree"
      @operation="navTreeOperation"
      @handleNodeClick="handleNodeClick"
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
          <vxe-table-column type="seq" title="序号" width="60" />
          <vxe-table-column field="reguserName" title="用户账号" />
          <vxe-table-column field="chineseName" title="姓名" />
          <vxe-table-column field="mobile" title="手机号" />
          <vxe-table-column field="email" title="邮箱" />
          <vxe-table-column title="操作">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="editSysUser(scope.row)">编辑</el-link>
              |
              <el-link type="primary" :underline="false" @click="showDataPower(scope.row)">数据权限</el-link>
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
      </el-row>
      <el-dialog :title="addDialogTitle" :visible.sync="showAddDialog" width="600px" :close-on-click-modal="false" @close="closeAddDialog">
        <el-form ref="addUserInfo" :model="addUserInfo" label-position="right" style="padding-right:20px;" :rules="addUserInfoRules">
          <el-form-item label="手机号" :label-width="formLabelWidth" :prop="addDialogTitle === '编辑成员' ? 'editMobile' : 'mobile'">
            <el-input v-model="addUserInfo.mobile" />
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="addUserInfo.email" />
          </el-form-item>
          <el-form-item label="账号" :label-width="formLabelWidth" :prop="addDialogTitle === '编辑成员' ? 'editReguserName' : 'reguserName'">
            <el-input v-model="addUserInfo.reguserName" />
          </el-form-item>
          <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="chineseName">
            <el-input v-model="addUserInfo.chineseName" />
          </el-form-item>
          <el-form-item v-if="addDialogTitle === '添加成员'" label="密码" prop="power" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.power" autocomplete="off" type="password" />
          </el-form-item>
          <el-form-item v-if="addDialogTitle === '添加成员'" label="确认密码" prop="rePower" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.rePower" autocomplete="off" type="password" />
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
              <el-radio :label="0">不允许</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog">取 消</el-button>
          <el-button type="primary" @click="createConfirm">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="editDialogTitle" :visible.sync="showEditDialog" width="600px" :close-on-click-modal="false" @close="editDialogClose">
        <el-form ref="EditDialog" v-loading="editUserLoading && editDialogTitle === '编辑成员'" :model="DialogData" label-position="right" style="padding-right:20px;" :rules="EditRules">
          <el-form-item v-if="editDialogStatus !== 'setPrincipal'" prop="name" :label="editDialogLabel" label-width="120px">
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
          <el-button :loading="addOrganizeBtnLoading" @click="editDialogClose">取 消</el-button>
          <el-button type="primary" :loading="addOrganizeBtnLoading" @click="editConfirm">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="数据权限" :visible.sync="showDataPowerDialog" width="600px" :close-on-click-modal="false">
        <el-form :model="userDataPower" label-position="right" style="padding-right:20px;">
          <el-form-item label="用户账号" :label-width="formLabelWidth">
            {{ editingData.reguserName }}
          </el-form-item>
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            {{ editingData.chineseName }}
          </el-form-item>
          <el-form-item label="公司部门授权" :label-width="formLabelWidth">
            <el-dropdown trigger="click" placement="bottom-start" style="width:100%" @visible-change="changeDialogDepartment">
              <el-input v-model="checkedDepartTags" />

              <el-dropdown-menu slot="dropdown" class="innerTreeForDepart">
                <el-tree
                  ref="dialogTree"
                  show-checkbox
                  node-key="groupId"
                  :props="defaultProps"
                  :load="loadNode"
                  :default-checked-keys="defaultCheckedKeys"
                  lazy
                />
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <!-- <el-form-item label="资产类别授权" :label-width="formLabelWidth">
            <el-select v-model="userDataPower.status" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区域授权" :label-width="formLabelWidth">
            <el-select v-model="userDataPower.status" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddDialog=false">取 消</el-button>
          <el-button type="primary" @click="showAddDialog=false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { saveOrganizationGroup, getOrganizationGroup, getSysUserList, deleteSysUserList, getListRegUserByChineseName, addSysUserList, updateGroup, deleteGroup, getRegUser, checkMobileExist, checkReguserNameExist, editSysUserList } from '@/api/settings'
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
        callback(new Error('请输入手机号码'))
      } else if (!isMobileNumber(value)) {
        callback(new Error('手机号码格式错误'))
      } else {
        checkMobileExist(value).then(res => {
          if (res.code === 0) {
            res.data ? callback(new Error('手机号码已存在')) : callback()
          } else {
            callback(new Error('检查手机号码失败'))
          }
        }).catch(err => {
          console.log('err', err)
          callback(new Error('检查手机号码失败'))
        })
      }
    }
    var validateEditMobile = (rule, value, callback) => {
      value = this.addUserInfo.mobile
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!isMobileNumber(value)) {
        callback(new Error('手机号码格式错误'))
      } else if (value === this.EditCopyInfo.mobile) {
        callback()
      } else {
        checkMobileExist(value).then(res => {
          if (res.code === 0) {
            res.data ? callback(new Error('手机号码已存在')) : callback()
          } else {
            callback(new Error('检查手机号码失败'))
          }
        }).catch(err => {
          console.log('err', err)
          callback(new Error('检查手机号码失败'))
        })
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addUserInfo.rePower !== '') {
          this.$refs.addUserInfo.validateField('rePower')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addUserInfo.power) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    var validateReguserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        checkReguserNameExist(value).then(res => {
          if (res.code === 0) {
            res.data ? callback(new Error('账号已存在')) : callback()
          } else {
            callback(new Error('检查账号失败'))
          }
        }).catch(err => {
          console.log('err', err)
          callback(new Error('检查账号失败'))
        })
      }
    }
    var validateEditReguserName = (rule, value, callback) => {
      value = this.addUserInfo.reguserName
      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (value === this.EditCopyInfo.reguserName) {
        callback()
      } else {
        checkReguserNameExist(value).then(res => {
          if (res.code === 0) {
            res.data ? callback(new Error('账号已存在')) : callback()
          } else {
            callback(new Error('检查账号失败'))
          }
        }).catch(err => {
          console.log('err', err)
          callback(new Error('检查账号失败'))
        })
      }
    }
    return {
      userDataPower: { },
      editUserLoading: false,
      addDialogTitle: '添加成员',
      addOrganizeBtnLoading: false,
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
        activeFlag: 1,
        groupId: '',
        addFiledsFlag: 0,
        power: '',
        rePower: ''
      },
      addUserInfoRules: {
        mobile: [
          { validator: validateMobile, trigger: 'blur', required: true }
        ],
        editMobile: [
          { validator: validateEditMobile, trigger: 'blur', required: true }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur', required: true },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        reguserName: [
          { validator: validateReguserName, trigger: 'blur', required: true }
        ],
        editReguserName: [
          { validator: validateEditReguserName, trigger: 'blur', required: true }
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
        ],
        power: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        rePower: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      },
      tableData: [],
      defaultProps: {
        children: 'children',
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
        groupId: '',
        userType: 2
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
      EditCopyInfo: {},
      checkedDepartTags: '',
      showDataPowerDialog: false,
      editingData: {}
    }
  },
  created() {
    this.getList()
    console.log('refs', this.$refs)
  },
  methods: {
    showDataPower(row) {
      console.log('row', row)
      this.editingData = { ...row }
      this.showDataPowerDialog = true
    },
    closeAddDialog() {
      this.showAddDialog = false
      this.checkedDepartTags = ''
      this.addUserInfo.groupId = ''
      this.thisOperationNode = ''
      this.$refs.addUserInfo.clearValidate()
    },
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
      this.addDialogTitle = '添加成员'
      this.checkedDepartTags = ''
      this.addUserInfo = {
        mobile: '',
        email: '',
        reguserName: '',
        chineseName: '',
        activeFlag: 1,
        groupId: '',
        addFiledsFlag: 0
      }
      this.showAddDialog = true
    },
    navTreeOperation(operate, data) {
      console.log('data', data)
      // this.checkedDepartment = []
      this.thisOperationNode = { ...data }
      if (operate !== 'addperson' && operate !== 'deletePart') {
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
            this.editDialogLabel = '新名称'
            break
          case 'addSonCompany':
            this.editDialogTitle = '添加子(分)公司'
            this.editDialogLabel = '子(分)公司名称'
            break
        }
      } else if (operate === 'addperson') {
        this.addDialogTitle = '添加成员'
        this.addUserInfo = {
          mobile: '',
          email: '',
          reguserName: '',
          chineseName: '',
          activeFlag: 1,
          groupId: '',
          addFiledsFlag: 0
        }
        this.showAddDialog = true
        // this.checkedDepartment = [{ ...data }]
        // this.defaultCheckedKeys = []
        // this.defaultCheckedKeys.push(data.groupId)
        this.checkedDepartTags = data.groupName
        this.addUserInfo.groupId = data.groupId
      } else if (operate === 'deletePart') {
        const departName = data.nodeType ? '部门' : '单位'
        this.$confirm(`此操作将永久删除该${departName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGroup(data.groupId).then(res => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: '删除成功!' })
              this.$nextTick(() => {
                this.$refs.navtree.deleteNode(data.groupId)
              })
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
      }
    },
    editConfirm() {
      this.$refs.EditDialog.validate(validate => {
        if (validate) {
          if (this.editDialogStatus === 'addSonDepartment' || this.editDialogStatus === 'addSonCompany') {
            this.addOrganizeBtnLoading = true
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
                  message: this.editDialogTitle + '添加成功'
                })
                this.$nextTick(() => {
                  this.$refs.navtree.updataNode('', obj.parentId)
                })
              } else {
                this.$message({
                  type: 'error',
                  message: this.editDialogTitle + '添加失败，请稍后再试'
                })
              }
              this.addOrganizeBtnLoading = false
              this.editDialogClose()
            }).catch(err => {
              this.$message({
                type: 'error',
                message: this.editDialogTitle + '添加失败，请稍后再试'
              })
              console.log('err', err)
              this.addOrganizeBtnLoading = false
              this.editDialogClose()
            })
          } else if (this.editDialogStatus === 'changeName') {
            const obj = {
              parentId: this.thisOperationNode.parentId,
              nodeType: this.thisOperationNode.nodeType,
              groupName: this.DialogData.name,
              groupId: this.thisOperationNode.groupId
            }
            console.log('updateGroup', obj)
            updateGroup(obj).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: this.editDialogTitle + '成功'
                })
                this.$nextTick(() => {
                  this.$refs.navtree.updataNode(obj.groupId, obj.parentId)
                })
              } else {
                this.$message({
                  type: 'error',
                  message: this.editDialogTitle + '失败，请稍后再试'
                })
              }
            }).catch(err => {
              this.$message({
                type: 'error',
                message: this.editDialogTitle + '失败，请稍后再试'
              })
              console.log('err', err)
            }).finally(() => {
              this.addOrganizeBtnLoading = false
              this.editDialogClose()
            })
          }
        }
      })
    },
    createConfirm() {
      this.$refs.addUserInfo.validate(validate => {
        if (validate) {
          this.addUserInfo.userType = 2
          if (this.addDialogTitle === '添加成员') {
            console.log('addUserInfo', this.addUserInfo)
            addSysUserList({ ...this.addUserInfo }).then(res => {
              if (res.code === 0) {
                this.$message({ type: 'success', message: this.addDialogTitle + '成功' })
                this.getList()
              } else {
                this.$message({ type: 'error', message: this.addDialogTitle + '失败，请稍后再试' })
              }
              this.showAddDialog = false
            }).catch(err => {
              console.log('err', err)
              this.$message({ type: 'error', message: this.addDialogTitle + '失败，请稍后再试' })
              this.showAddDialog = false
            })
          } else {
            editSysUserList({ ...this.addUserInfo }, this.addUserInfo.reguserId).then(res => {
              if (res.code === 0) {
                this.$message({ type: 'success', message: this.addDialogTitle + '成功' })
                this.getList()
              } else {
                this.$message({ type: 'error', message: this.addDialogTitle + '失败，请稍后再试' })
              }
              this.showAddDialog = false
            }).catch(err => {
              console.log('err', err)
              this.$message({ type: 'error', message: this.addDialogTitle + '失败，请稍后再试' })
              this.showAddDialog = false
            })
          }
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
      this.pageQuery.chineseName = ''
      this.pageQuery.reguserName = ''
      this.pageQuery.pageNo = 1
      this.getList()
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
      this.getList()
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
      const key = node.key ? node.key : ''
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
    handleNodeClick(data) {
      if (data.groupId) {
        // getListRegUserByGroupId({ groupId: data.groupId }).then(res => {
        //   console.log('res', res)
        // }).catch(err => {
        //   console.log('err', err)
        // })
        this.pageQuery.pageNo = 1
        this.pageQuery.pageSize = 10
        this.pageQuery.groupId = data.groupId
        this.getList()
      } else {
        this.tableData = []
      }
    },
    editSysUser(row) {
      this.addDialogTitle = '编辑成员'

      console.log('row', row)
      this.addUserInfo = { ...row }
      this.showAddDialog = true
      this.editUserLoading = true
      getRegUser(row.reguserId).then(res => {
        if (res.code === 0) {
          this.EditCopyInfo = { ...res.data }
          this.checkedDepartTags = res.data.groupName
          for (const key in this.addUserInfo) {
            this.addUserInfo[key] = res.data[key]
          }
        } else {
          this.$message({ type: 'warning', message: '获取用户信息失败，请稍后再试' })
          this.showAddDialog = false
        }
      }).catch(err => {
        this.showAddDialog = false
        console.log('err', err)
      }).finally(() => {
        this.editUserLoading = false
      })
    },
    deleteSysUser(row) {
      console.log('row', row)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        deleteSysUserList(row.reguserId).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '成功删除该用户' })
            const idx = this.tableData.findIndex(item => item.reguserId === row.reguserId)
            if (idx !== -1) this.tableData.splice(idx, 1)
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

