<template>
  <div class="settings">
    <div class="yonghuzu">
      <div class="tit">用户组</div>
      <ul v-loading="addGroupLoading" class="yonghuGroup">
        <li v-for="(item,i) in groupList" :key="i" class="normal" :class="{'active' : item.roleName === activeGroupName}" @click="activeThisGroup(item)">
          <div v-if="!item.editing" class="icon">
            <i class="el-icon-s-custom" />
          </div>
          <div v-if="!item.editing">

            <div class="cnt">{{ item.roleName }}</div>
            <i class="el-icon-more" @click="item.showMenu = true" />
            <div v-if="item.showMenu" class="menu">
              <div @click="reNameGoup(item)">重命名</div>
              <div @click="removeGoup(item)">删除</div>
            </div>
            <div v-if="item.showMenu" class="dialogmenu" @click="item.showMenu = false" />
          </div>
          <div v-else class="addGroupBox" style="padding:0 20px 0 0;">
            <el-input ref="addGroupipt" v-model="editGroupName" type="text" placeholder="输入用户组名称" />
            <el-button type="primary" size="mini" @click="configEdit(true ,item)">确定</el-button>
            <el-button size="mini" @click="configEdit(false ,item)">取消</el-button>
          </div>
        </li>
      </ul>
      <div style="padding:10px;" :class="{'adding_group':isAddingGroup}">
        <el-link v-if="!isAddingGroup" type="primary" :underline="false" @click="isAddingGroup = true">
          <i class="el-icon-plus" />添加用户组
        </el-link>
        <div v-else class="addGroupBox">
          <el-input ref="addGroupipt" v-model="addGroupName" type="text" placeholder="输入用户组名称" />
          <el-button type="primary" size="mini" @click="configAdd(true)">确定</el-button>
          <el-button size="mini" @click="configAdd(false)">取消</el-button>
        </div>
      </div>
    </div>
    <div class="other">
      <div class="chengyuan">
        <div class="tit">
          <b>用户组成员· </b>
          <span>{{ chengyuannum }}</span>
          <span class="settings_add Link_disabled_click" @click="showAddPerson=true">
            <i class="el-icon-plus" />
            添加成员
          </span>
        </div>
      </div>
      <div v-loading="groupUserLoading" class="imgbox">
        <div v-for="(item ,i) in groupUserList" :key="i">
          <i>{{ item.chinese_name | getFirstString }}</i>
          <span>{{ item.chinese_name }}</span>
        </div>
        <div v-if="groupUserList.length === 0" class="nores">
          暂无成员，快来添加成员吧
        </div>
      </div>

      <div class="checkouter">
        <div class="toptit">用户组2</div>
        <!-- <table cellspacing="0">
          <colgroup>
            <col style="width: 10%;">
            <col style="width: 85%;">
            <col style="width: 5%;">

          </colgroup>
          <thead>
            <tr>
              <th>操作对象</th>
              <th>权限</th>
              <th>全选</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="tit">
                <div>公司管理</div>
              </td>
              <td class="group">
                <span v-for="(item,i) in checkgroup1" :key="i" class="checkitem">
                  <el-checkbox v-model="item.checked" :label="item.name" />
                </span>
              </td>
              <td class="allselect">
                <el-checkbox v-model="allCheck" />
              </td>
            </tr>
            <tr>
              <td class="tit">
                <div>项目设置</div>
              </td>
              <td class="group">
                <span v-for="(item,i) in checkgroup2" :key="i" class="checkitem">
                  <el-checkbox v-model="item.checked" :label="item.name" />
                </span>
              </td>
              <td class="allselect">
                <el-checkbox v-model="allCheck" />
              </td>
            </tr>
            <tr>
              <td class="tit">
                <div>安全与集成</div>
              </td>
              <td class="group">
                <span v-for="(item,i) in checkgroup3" :key="i" class="checkitem">
                  <el-checkbox v-model="item.checked" :label="item.name" />
                </span>
              </td>
              <td class="allselect">
                <el-checkbox v-model="allCheck" />
              </td>
            </tr>
          </tbody>
        </table> -->
        <el-tree
          :props="props"
          :load="loadNode"
          node-key="id"
          lazy
          show-checkbox
        />
        <div class="confirm">
          <el-button type="primary">保存</el-button>
        </div>
      </div>
    </div>
    <add-person :dialog-visible.sync="showAddPerson" />
  </div>
</template>

<script>
import { getlistRole, saveRole, updateRole, deleteRole, getlistRegUserByRoleId } from '@/api/settings'
import addPerson from '@/components/Dialog/addPerson'
import { mapState } from 'vuex'
export default {
  components: { addPerson },
  filters: {
    getFirstString(val) {
      return val ? val.substring(0, 1) : ''
    }
  },
  data() {
    return {
      editGroupName: '',
      groupUserLoading: false,
      showAddPerson: false,
      isAddingGroup: false,
      addGroupLoading: false,
      addGroupName: '',
      activeGroupName: '',
      groupList: [
        { name: 'test001', showMenu: false },
        { name: '用户组1', showMenu: false },
        { name: '用户组2', showMenu: false },
        { name: '用户组3', showMenu: false },
        { name: '用户组4', showMenu: false }
      ],
      chengyuannum: 1,
      checkgroup1: [
        { name: '保密需求', checked: false },
        { name: '删除需求', checked: false },
        { name: '复制需求', checked: false },
        { name: '导入需求', checked: false },
        { name: '导出需求', checked: false },
        { name: '移动需求', checked: false },
        { name: '需求分类管理', checked: false },
        { name: '创建需求', checked: false },
        { name: '编辑需求', checked: false },
        { name: '附件上传/关联', checked: false },
        { name: '附件下载/预览', checked: false },
        { name: '附件删除/解除关联', checked: false },
        { name: '需求批量流转', checked: false }
      ],
      checkgroup2: [
        { name: '创建迭代', checked: false },
        { name: '编辑迭代', checked: false },
        { name: '删除迭代', checked: false },
        { name: '导出迭代', checked: false },
        { name: '规划迭代', checked: false },
        { name: '工作分配', checked: false },
        { name: '迭代转发布', checked: false },
        { name: '迭代开启/关闭', checked: false }
      ],
      checkgroup3: [
        { name: '创建任务', checked: false },
        { name: '编辑任务', checked: false },
        { name: '导入任务', checked: false },
        { name: '导出任务', checked: false },
        { name: '删除任务', checked: false },
        { name: '任务状态流转', checked: false },
        { name: '附件上传/关联', checked: false },
        { name: '附件下载/预览', checked: false },
        { name: '附件删除/解除关联', checked: false }
      ],
      allCheck: false,
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      groupUserList: []

    }
  },
  computed: {
    ...mapState({
      merchantId: state => state.user.merchantId
    })
  },

  created() {
    this.getRoleList()
  },
  methods: {
    removeGoup(item) {
      deleteRole({ roleId: item.roleId }, item.roleId).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '删除成功' })
        } else {
          this.$message({ type: 'error', message: '删除失败，请稍后再试' })
        }
        item.editing = false
        item.showMenu = false

        this.getRoleList()
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '删除失败，请稍后再试' })
        item.editing = false
        item.showMenu = false
      })
    },
    reNameGoup(item) {
      this.editGroupName = item.roleName
      item.editing = true
    },
    configEdit(bool, item) {
      console.log('item', item)
      if (!bool) {
        item.editing = false
        item.showMenu = false
        return
      }

      if (!this.editGroupName) {
        this.$message({ type: 'error', message: '请输入名称' })
        item.editing = false
        item.showMenu = false
        return
      }
      const obj = {
        readme: item.readme,
        roleId: item.roleId,
        roleKind: item.roleKind,
        roleName: this.editGroupName
      }

      updateRole(obj, obj.roleId).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '修改成功' })
        } else {
          this.$message({ type: 'error', message: '修改失败，请稍后再试' })
        }
        item.editing = false
        item.showMenu = false

        this.getRoleList()
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '修改失败，请稍后再试' })
        item.editing = false
        item.showMenu = false
      })
    },
    getRoleList() {
      getlistRole({ roleKind: 0 }).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          res.data.forEach(item => {
            item.showMenu = false
            item.editing = false
          })

          this.groupList = res.data
        }
      })
    },
    activeThisGroup(row) {
      console.log('row', row)
      this.activeGroupName = row.roleName
      if (row.roleId) {
        this.groupUserLoading = true
        getlistRegUserByRoleId({ roleId: row.roleId }).then(res => {
          if (res.code === 0) {
            console.log('res', res)
            this.groupUserList = res.data
          }
          this.groupUserLoading = false
        }).catch(err => {
          this.groupUserLoading = false
          console.log('err', err)
        })
      }
    },
    configAdd(bool) {
      if (bool) {
        if (!this.addGroupName) {
          this.$message({ type: 'warning', message: '请输入用户组名称' })
          return
        }
        saveRole({ roleKind: 0, roleName: this.addGroupName }).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '保存用户组成功' })
            this.getRoleList()
          } else {
            this.$message({ type: 'error', message: '保存用户组失败，请稍后再试' })
          }
          this.isAddingGroup = false
        }).catch(err => {
          console.log('err', err)
          this.$message({ type: 'error', message: '保存用户组失败，请稍后再试' })
          this.isAddingGroup = false
        })
      } else {
        this.isAddingGroup = false
      }
    },
    loadNode(node, resolve) {
      // console.log('node', node)
      if (node.level === 0) {
        return resolve([{ name: 'region', id: '11111', test: '52465456' }])
      }
      if (node.level > 1) return resolve([])

      setTimeout(() => {
        const data = [{
          name: 'leaf',
          id: '22222'
        }, {
          name: 'zone',
          id: '212322'

        }]

        resolve(data)
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>

.hasTagsView .app-main .settings-container .yonghuzu {
    height: calc(100vh - 134px);;
}
.app-main .settings-container .yonghuzu {
    height: calc(100vh - 100px);
}
.noNavbar {
  padding-top: 0;
}
.settings {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    .settings_add {
        margin-left: 20px;
        font-size: 13px;
        cursor: pointer;
    }
    .yonghuzu {
        width: 200px;
        border-right: #E5E5E5 1px solid;
        background-color: #F9F9F9;
        // margin-left: -25px;
        border-top:#E5E5E5 1px solid;
        font-size: 14px;
        .tit {
            height: 56px;
            line-height: 56px;
            padding-left: 15px;
            color: #999;
        }
        ul {
            padding: 0;
            margin: 0;
        }
        li {
            // height: 56px;
            padding-bottom: 15px;
            list-style: none;
            padding-left: 15px;
            display: flex;
            border-top: #E5E5E5 1px solid;
            padding-top: 12px;
            cursor: pointer;
            position: relative;
            .cnt {
                // line-height: 56px;
                color: #666;
            }
            .cnt ~ span {
                font-size: 12px;
                color: #aaa;
            }
            .icon {
                width: 20px;
                .el-icon-s-custom {
                    color: #ccc;
                    font-size: 16px;
                }
            }
        }
        li:hover {
            background-color: #fff;

            .el-icon-more {
                display: block;
            }
        }
        li.active {
            background-color: #fff;
            .cnt {
                color: #3278dd;
            }
            .icon {
                .el-icon-s-custom{
                    color: #3278dd;
                }
            }
        }
        .normal {
            .icon {
                margin-top: 7px;
            }
            .cnt  {
                line-height: 32px;
            }
            .menu {
                padding: 5px 0;
                width: 100px;
                position: absolute;
                right: -30px;
                box-shadow: 0 0 6px rgba(0,0,0,0.3);
                background-color: #fff;
                z-index: 1003;
                color: #3f4a56;
                >div {
                    padding: 0 15px;
                    line-height: 28px;
                    height: 28px;
                }
                >div:hover {
                    color: #5d9bfc;
                    background: #eaf2ff;
                }
            }
            .dialogmenu {
                position: fixed;
                bottom: 0;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1002;
            }

            .el-icon-more {
                    display: none;
                    transform: rotateZ(90deg);
                    // display: block;
                    position: absolute;
                    right: 10px;
                    top: 22px;
                }
        }
    }
    .other {
        border-top:#E5E5E5 1px solid;
        flex-grow: 1;
        padding:20px 15px;
        width: calc(100% - 230px);
        .chengyuan {
            font-size: 14px;
        }
        .imgbox {
            padding: 20px 15px;
            background: #f8f8f8;
            overflow: hidden;
            .nores {
              width: 100%;
              text-align: center;
              color: #3f4a56;
              font-size: 14px;
            }
            >div {
                width: 140px;
                margin-bottom: 15px;
                margin-right: 15px;
                display: inline-block;
                i {
                    display: inline-block;
                    height: 24px;
                    width: 24px;
                    text-align: center;
                    line-height: 24px;
                    background: #b9cdef;
                    border-radius: 12px;
                    color: #fff;
                    padding: 0 4px;
                    font-size: 10px;
                    font-style: normal;
                    margin-right: 6px;
                }
                span {
                  display: inline-block;
                  position: relative;
                  top: 2px;;
                }
            }
        }
    }
}

.checkouter {
    font-size: 14px;
    table {
        width: 100%;
    }
    .toptit {
        font-weight: bold;
        margin-top: 20px;
    }
    th {
        height: 40px;
        font-weight: normal;
        text-align: left;
        border-bottom: 1px solid #dfe6ee;
        color:#999;
    }
    td {
        overflow: hidden;
        .checkitem {
            // display: inline-block;
            display: block;
            float: left;
            width: 220px;
            height: 30px;
            line-height: 30px;
        }
    }
    .group {
        padding: 10px 0;
    }
    tbody {
        tr:hover {
            background-color: #efefef;
        }
        td {
            border-bottom: 1px solid #dfe6ee;
        }
    }
    .confirm {
        margin-top: 20px;
    }
}
.adding_group {
  background-color: #fff;
}
</style>
<style scoped>
.addGroupBox >>> .el-input__inner {
  border-radius: 2px;
  margin-bottom: 16px;
}
</style>
