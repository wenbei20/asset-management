<template>
  <div class="settings">
    <div class="yonghuzu">
      <div class="tit">用户组</div>
      <ul v-loading="addGroupLoading" class="yonghuGroup">
        <li v-for="(item,i) in groupList" :key="i" class="normal" :class="{'active' : item.roleId === activeGroupName}" @click.stop="activeThisGroup(item)">
          <div v-if="!item.editing" class="icon">
            <i class="el-icon-s-custom" />
          </div>
          <div v-if="!item.editing">

            <div class="cnt">{{ item.roleName }}</div>
            <i class="el-icon-more" @click.stop="item.showMenu = true" />
            <div v-if="item.showMenu" class="menu">
              <div @click.stop="reNameGoup(item)">重命名</div>
              <div @click.stop="removeGoup(item)">删除</div>
            </div>
            <div v-if="item.showMenu" class="dialogmenu" @click.stop="item.showMenu = false" />
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
          <b>用户组成员</b>
          <span>{{ groupUserList.length ? '· ' + groupUserList.length : '' }}</span>
          <span v-if="activeGroupName" class="settings_add Link_disabled_click" @click="addMember">
            <i class="el-icon-plus" />
            <!-- showAddPerson=true -->
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
        <el-tree
          ref="rightsTree"
          v-loading="rightTreeLoading"
          :props="props"
          node-key="rightkeyId"
          show-checkbox
          :data="rightsList"
          :default-expand-all="true"
          :default-checked-keys="defaultCheckedList"
        />
        <div v-if="rightsList.length" class="confirm">
          <el-button type="primary" :loading="saveBtnLoading" @click="saveGroupRights">保存</el-button>
        </div>
      </div>
    </div>
    <add-person
      ref="addperson"
      :dialog-visible.sync="showAddPerson"
      :no-structure="true"
      type="sysUser"
      @confirmData="confirmData"
    />
  </div>
</template>

<script>
import { getlistRole, saveRole, updateRole, deleteRole, getlistRegUserByRoleId, getListRightsByRoleId, saveRoleRights, saveRoleUser } from '@/api/settings'
import addPerson from '@/components/Dialog/addPerson'
export default {
  components: { addPerson },
  filters: {
    getFirstString(val) {
      return val ? val.substring(0, 1) : ''
    }
  },
  data() {
    return {
      saveBtnLoading: false,
      editGroupName: '',
      rightTreeLoading: false,
      groupUserLoading: false,
      showAddPerson: false,
      isAddingGroup: false,
      addGroupLoading: false,
      addGroupName: '',
      activeGroupName: '',
      groupList: [],
      chengyuannum: 1,
      // checkgroup1: [],
      // checkgroup2: [],
      // checkgroup3: [],
      allCheck: false,
      props: {
        label: 'rightkeyName',
        children: 'children'

      },
      groupUserList: [],
      rightsList: [],
      defaultCheckedList: [],
      roleKind: 0

    }
  },

  created() {
    this.getRoleList()
  },
  methods: {
    confirmData(iptData, treeData) {
      console.log('iptData', iptData)
      if (this.roleKind !== 2) {
        if (iptData && iptData.length) {
          const query = {
            roleId: this.activeGroupName,
            userIds: iptData.map(item => item.reguserId).join(',')
          }
          saveRoleUser(query).then(res => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: '添加成员成功！' })
              this.getGroupAllUser(this.activeGroupName)
            } else {
              this.$message({ type: 'error', message: '添加成员失败，请稍后再试！' })
            }
            this.$refs.addperson.cancalLoading()
            this.showAddPerson = false
          }).catch(err => {
            console.log('err', err)
            this.$message({ type: 'error', message: '添加成员失败，请稍后再试！' })
            this.$refs.addperson.cancalLoading()
            this.showAddPerson = false
          })
        } else {
          this.$message({ type: 'warning', message: '请选择要添加的成员' })
        }
      }
    },
    removeGoup(item) {
      item.editing = false
      this.$confirm('此操作将永久删除该用户组, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        deleteRole({ roleId: item.roleId }, item.roleId).then(res => {
          if (res.code === 0) {
            this.$message({ type: 'success', message: '删除成功' })

            if (this.activeGroupName === item.roleId) {
              this.groupUserList = []
              this.rightsList = []
            }
          } else {
            this.$message({ type: 'error', message: '删除失败，请稍后再试' })
          }
          item.showMenu = false

          this.getRoleList()
        }).catch(err => {
          console.log('err', err)
          this.$message({ type: 'error', message: '删除失败，请稍后再试' })
          item.showMenu = false
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
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
      getlistRole({ roleKind: this.roleKind }).then(res => {
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
    getRightCheckedKey(arr) {
      arr.forEach(item => {
        if (item.checked) {
          this.defaultCheckedList.push(item.rightkeyId)
        }
        if (Array.isArray(item.children)) {
          this.getRightCheckedKey(item.children)
        }
      })
    },
    activeThisGroup(row) {
      if (this.activeGroupName === row.roleId) return

      this.activeGroupName = row.roleId
      if (row.roleId) {
        this.getGroupAllUser(row.roleId)
        this.getListRights(row.roleId)
      }
    },
    getGroupAllUser(roleId) {
      this.groupUserLoading = true
      getlistRegUserByRoleId({ roleId }).then(res => {
        if (res.code === 0) {
          console.log('res', res)
          this.groupUserList = res.data
        }
        this.groupUserLoading = false
      }).catch(err => {
        this.groupUserLoading = false
        console.log('err', err)
      })
    },
    getListRights(roleId) {
      this.rightTreeLoading = true
      this.defaultCheckedList = []
      getListRightsByRoleId({ roleId, rightkeyKind: 0 }).then(res => {
        if (res.code === 0 && Array.isArray(res.data)) {
          console.log('res', res)
          this.getRightCheckedKey(res.data)
          this.rightsList = res.data
        }
        this.rightTreeLoading = false
      }).catch(err => {
        this.rightTreeLoading = false
        console.log('err', err)
      })
    },
    configAdd(bool) {
      if (bool) {
        if (!this.addGroupName) {
          this.$message({ type: 'warning', message: '请输入用户组名称' })
          return
        }
        saveRole({ roleKind: this.roleKind, roleName: this.addGroupName }).then(res => {
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
    saveGroupRights() {
      const checkedList = this.$refs.rightsTree.getCheckedNodes().map(ele => ele.rightkeyId).join(',')
      console.log('checkedList', checkedList)
      this.saveBtnLoading = true
      saveRoleRights({ rightkeyIds: checkedList, roleId: this.activeGroupName }).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: '修改权限成功！' })
        } else {
          this.$message({ type: 'error', message: '修改权限失败，请稍后再试！' })
        }
        this.getListRights(this.activeGroupName)
        this.saveBtnLoading = false
      }).catch(err => {
        console.log('err', err)
        this.$message({ type: 'error', message: '修改权限失败，请稍后再试！' })
        this.getListRights(this.activeGroupName)
        this.saveBtnLoading = false
      })
    },
    addMember() {
      if (this.activeGroupName) {
        this.showAddPerson = true
      } else {
        this.$message({ type: 'info', message: '请先选择用户组' })
      }
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
        min-height: calc(100vh - 50px);
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

.checkouter >>> .el-tree-node__content {
  height: auto;
  padding-bottom: 6px;
  padding-top: 6px;

}
</style>
