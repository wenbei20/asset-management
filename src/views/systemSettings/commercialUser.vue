<template>
  <div class="app-container">
    <!-- <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog=true">新建</el-button>

    </el-row> -->
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
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column type="seq" width="60" title="序号" />
        <vxe-table-column field="merchantName" title="名称" />
        <vxe-table-column field="mobile" title="手机号" />
        <vxe-table-column field="email" title="邮箱" />
        <vxe-table-column field="createTime" title="创建时间" />
        <vxe-table-column title="操作">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="EditMerchant(scope.row)">编辑</el-link>
            <!-- | -->
            <!-- <el-link type="primary" :underline="false" @click="showDataPower(scope.row)">数据权限</el-link> -->
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
      <el-dialog :title=" isEditMerchant ? '编辑商户' : '添加成员'" :visible.sync="showAddDialog" width="600px" :close-on-click-modal="false">
        <el-form v-loading="addDialogLoading" :model="addUserInfo" label-position="right" :rules="EditRules">
          <el-form-item label="公司/机构名称" prop="merchantName" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.merchantName" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.email" />
          </el-form-item>
          <el-form-item label="联系电话" prop="mobile" :label-width="formLabelWidth">
            <el-input v-model="addUserInfo.mobile" />
          </el-form-item>
          <el-form-item label="当前管理员" :label-width="formLabelWidth">
            <el-avatar> {{ addUserInfo.chineseName | getFirstString }}</el-avatar>
            <span class="avatarSpan"> {{ addUserInfo.chineseName }}</span>
          </el-form-item>
          <el-form-item label="变更管理员" :label-width="formLabelWidth">
            <!-- <el-autocomplete
              v-model="addUserInfoSeleReguser"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <span> {{ item.chineseName }} </span>
              </template>
            </el-autocomplete> -->

            <el-select v-model="addUserInfo.reguserId" placeholder="请选择成员">
              <el-option v-for="(item , i) in EditAdminPersonList" :key="i" :label="item.chineseName" :value="item.reguserId" />
            </el-select>

          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddDialog=false">取 消</el-button>
          <el-button type="primary" @click="editChangeMerchant">确 定</el-button>
        </div>
      </el-dialog>
      <!-- <el-dialog title="数据权限" :visible.sync="showDataPowerDialog" width="600px" :close-on-click-modal="false">
        <el-form :model="addUserInfo" label-position="right" style="padding-right:20px;">
          <el-form-item label="用户账号" :label-width="formLabelWidth">
            {{ editingData.email }}
          </el-form-item>
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            {{ editingData.merchantName }}
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
          <el-form-item label="资产类别授权" :label-width="formLabelWidth">
            <el-select v-model="addUserInfo.status" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区域授权" :label-width="formLabelWidth">
            <el-select v-model="addUserInfo.status" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddDialog=false">取 消</el-button>
          <el-button type="primary" @click="showAddDialog=false">确 定</el-button>
        </div>
      </el-dialog> -->
    </el-row>
  </div>
</template>
<script>
import { getlistMerchant, getOrganizationGroup, getListRegUserByChineseName, updateMerchant, getMerchant, findUsersByMerchant } from '@/api/settings'
import { isMobileNumber } from '@/utils/validate'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  filters: {
    getFirstString(val) {
      return val ? val.substring(0, 1) : ''
    }
  },
  data() {
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
      EditAdminPersonList: [],
      addDialogLoading: false,
      isEditMerchant: false,
      showDataPowerDialog: false,
      showAddDialog: false,
      formLabelWidth: '120px',
      addUserInfo: {
        mobile: '',
        email: '',
        merchantName: '',
        chineseName: '',
        merchantId: '',
        reguserId: ''
      },
      addUserInfoSeleReguser: '',
      options: [],
      tableData: [],
      pageTotal: 0,
      pageQuery: {
        merchantName: '',
        pageNo: 1,
        pageSize: 10
      },
      tableLoading: false,
      editingData: {},
      checkedDepartment: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'zones',
        label: 'groupName',
        isLeaf: 'leaf'
      },
      EditRules: {
        merchantName: [
          { required: true, message: '请输入公司/机构', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur', required: true },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur', required: true }
        ]
      }
    }
  },
  computed: {
    checkedDepartTags() {
      return this.checkedDepartment.map(item => item.groupName).join(';')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    showDataPower(row) {
      console.log('row', row)
      this.editingData = { ...row }
      this.showDataPowerDialog = true
    },
    getList() {
      this.tableLoading = true
      getlistMerchant(this.pageQuery).then(res => {
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
    changeDialogDepartment(visible) {
      if (!visible) {
        const checkedArr = this.$refs.dialogTree.getCheckedNodes()
        this.checkedDepartment = [...checkedArr.map(item => { return { ...item } })]
      }
    },
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
    deleteMerchant(row) {
    },
    EditMerchant(row) {
      console.log('row', row)
      this.isEditMerchant = true
      this.addDialogLoading = true
      if (row.merchantId) {
        this.showAddDialog = true
        getMerchant(row.merchantId).then(res => {
          if (res.code === 0) {
            for (const key in this.addUserInfo) {
              this.addUserInfo[key] = res.data[key]
            }
          } else {
            this.$message({ type: 'warning', message: '获取商户信息失败，请稍后再试' })
            this.showAddDialog = false
          }
        }).catch(err => {
          console.log('err', err)
          this.$message({ type: 'warning', message: '获取商户信息失败，请稍后再试' })
          this.showAddDialog = false
        }).finally(() => {
          this.addDialogLoading = false
        })

        findUsersByMerchant().then(res => {
          if (res.data && res.data.length) {
            this.EditAdminPersonList = res.data
          }
        })
      } else {
        this.$message({ type: 'warning', message: '获取商户信息失败，请稍后再试' })
      }
    },
    editChangeMerchant() {
      updateMerchant(this.addUserInfo, this.addUserInfo.merchantId).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改商户成功'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '修改商户失败，请稍后再试'
          })
        }
        this.showAddDialog = false
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '修改商户失败，请稍后再试'
        })
        console.log('err', err)
        this.showAddDialog = false
      })
      this.addUserInfoSeleReguser = ''
    }
    // querySearchAsync(queryString, cb) {
    //   if (queryString) {
    //     getListRegUserByChineseName({ chineseName: queryString }).then(res => {
    //       if (res.code === 0) {
    //         return cb(res.data)
    //       }
    //     })
    //     cb([])
    //   } else {
    //     cb([])
    //   }
    // },
    // handleSelect(item) {
    //   // console.log('item', item)
    //   this.addUserInfo.reguserId = item.reguserId
    //   this.addUserInfoSeleReguser = item.chineseName
    // }
  }
}
</script>
<style scoped>
.dialogSelectIpt >>> .el-input__inner {
    border: none;
}
.avatarSpan {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
}
</style>
