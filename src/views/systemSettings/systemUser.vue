<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="SearchType" placeholder="请选择搜索类型" style="padding:0 6px;width:160px;">
        <el-option label="用户名" value="reguserName" />
        <el-option label="姓名" value="chineseName" />
        <el-option label="手机号" value="mobile" />
        <el-option label="邮箱" value="email" />
      </el-select>
      <el-input
        v-model="searchIpt"
        :style="{ width: '160px',marginRight:'20px'}"
        placeholder="搜索..."
        clearable
        @clear="clearSearchRes"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" @click="addNewUser">新建</el-button>

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
        <vxe-table-column field="reguserName" title="用户名" />
        <vxe-table-column field="chineseName" title="姓名" />
        <vxe-table-column field="mobile" title="手机号" />
        <vxe-table-column field="email" title="邮箱" />
        <!-- <vxe-table-column field="status" title="停用状态" /> -->

        <!-- <vxe-table-column field="title" title="所属部门" /> -->
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
        style="text-align:right;margin-top:20px;"
        @pagination="getList"
      />
      <el-dialog :title="addDialogTitle" :visible.sync="showAddDialog" width="600px" :close-on-click-modal="false" @close="cancalAddUser">
        <el-form ref="addUser" v-loading="addDialogLoading" :rules="addFormRules" :model="addUserInfo" status-icon label-position="right">
          <el-form-item label="用户名" prop="reguserName" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.reguserName" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="chineseName" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.chineseName" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.email" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.mobile" />
          </el-form-item>
          <el-form-item v-if="addDialogTitle === '添加成员'" label="密码" prop="power" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.power" autocomplete="off" type="password" />
          </el-form-item>
          <el-form-item v-if="addDialogTitle === '添加成员'" label="确认密码" prop="rePower" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.rePower" autocomplete="off" type="password" />
          </el-form-item>
          <!-- <el-form-item label="启用/停用" :label-width="formLabelWidth">
            <el-radio-group v-model="addUserInfo.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancalAddUser">取 消</el-button>
          <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import { getSysUserList, addSysUserList, deleteSysUserList, editSysUserList, getRegUser, checkReguserNameExist, checkMobileExist } from '@/api/settings'
import { isMobileNumber } from '@/utils/validate'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addUserInfo.rePower !== '') {
          this.$refs.addUser.validateField('rePower')
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
    var validateReguserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        checkReguserNameExist(value).then(res => {
          if (res.code === 0) {
            res.data ? callback(new Error('用户名已存在')) : callback()
          } else {
            callback(new Error('检查用户名失败'))
          }
        }).catch(err => {
          console.log('err', err)
          callback(new Error('检查用户名失败'))
        })
      }
    }
    return {
      addFormRules: {
        power: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        rePower: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur', required: true }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur', required: true },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        chineseName: [
          { message: '请输入姓名', trigger: 'blur', required: true }
        ],
        reguserName: [
          { validator: validateReguserName, trigger: 'blur', required: true }
        ]

      },
      showAddDialog: false,
      SearchType: '',
      searchIpt: '',
      formLabelWidth: '100px',
      addUserInfo: {
        reguserName: '',
        chineseName: '',
        email: '',
        mobile: '',
        power: '',
        rePower: '',
        userType: 0
      },
      tableLoading: true,
      tableData: [],
      pageTotal: 0,
      pagerCount: 0,
      pageQuery: {
        chineseName: '',
        email: '',
        mobile: '',
        pageNo: 1,
        pageSize: 10,
        reguserName: '',
        userType: 0
      },
      addDialogTitle: '添加成员',
      EditUserData: {},
      addDialogLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    cancalAddUser() {
      this.$refs.addUser.clearValidate()
      this.addUserInfo = { reguserName: '', chineseName: '', email: '', mobile: '', power: '', rePower: '', userType: 0 }
      this.showAddDialog = false
    },
    confirmAdd() {
      this.$refs.addUser.validate(valid => {
        if (valid && this.addDialogTitle === '添加成员') {
          const obj = { ...this.addUserInfo }
          obj.userType = 0
          obj.addFiledsFlag = 0
          addSysUserList(obj).then(res => { // 添加用户
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加系统用户成功'
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: '添加系统用户失败，请稍后再试'
              })
            }
            this.showAddDialog = false
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '添加系统用户失败，请稍后再试'
            })
            console.log('err', err)
            this.showAddDialog = false
          })
        } else if (valid && this.addDialogTitle === '编辑成员') { // 修改用户
          const keyArr = ['activeFlag', 'reguserId', 'addFiledsFlag', 'groupId']
          const otherQuery = {}
          keyArr.forEach(ele => {
            otherQuery[ele] = this.EditUserData[ele]
          })
          const query = {
            ...this.addUserInfo,
            ...otherQuery
          }
          console.log('query', query)

          editSysUserList(query, query.reguserId).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改用户成功'
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: '修改用户失败，请稍后再试'
              })
            }
            this.showAddDialog = false
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '修改用户失败，请稍后再试'
            })
            console.log('err', err)
            this.showAddDialog = false
          })
        }
      })
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

      this.pageQuery = { chineseName: '', email: '', mobile: '', pageNo: 1, pageSize: 10, reguserName: '', userType: 0 }
      this.pageQuery[this.SearchType] = this.searchIpt
      this.getList()
    },
    clearSearchRes() {
      this.pageQuery = { chineseName: '', email: '', mobile: '', pageNo: 1, pageSize: 10, reguserName: '', userType: 0 }
      this.getList()
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
    editSysUser(row) {
      this.addDialogTitle = '编辑成员'
      this.showAddDialog = true
      this.addDialogLoading = true
      getRegUser(row.reguserId).then(res => {
        if (res.code === 0) {
          this.EditUserData = res.data
          for (const key in this.addUserInfo) {
            this.addUserInfo[key] = res.data[key]
          }
        } else {
          this.$message({ type: 'warning', message: '获取用户信息失败，请稍后再试' })
          this.showAddDialog = false
        }
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'warning', message: '获取用户信息失败，请稍后再试' })
        this.showAddDialog = false
      }).finally(() => {
        this.addDialogLoading = false
      })
    },
    addNewUser() {
      this.addDialogTitle = '添加成员'
      this.showAddDialog = true
    }
  }
}
</script>
