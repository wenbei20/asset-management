<template>
  <el-dialog
    v-el-drag-dialog
    :visible="innerVisible"
    :width="showAddPersonTree ? '70%' : '830px' "
    title="添加成员"
    class="settings_qiyongDialog"
    :close-on-click-modal="false"
    @close="close"
  >

    <div v-if="!showAddPersonTree" class="tabscnt">
      <!-- <div class="inputOuter" :class="{noStructure:noStructure}" @click="$refs.autocomplete.focus()"> -->
      <div class="inputOuter" @click="$refs.autocomplete.focus()">
        <span v-for="(ele , i) in selectedPersons" :key="i" class="selectedPersons">
          {{ ele.chineseName }}
          <i class="el-icon-close" @click.stop="delectThisPserson(ele)" />
        </span>

        <el-autocomplete
          ref="autocomplete"
          v-model="addUserInfoSeleReguser"
          class="textarea"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <span> {{ item.chineseName }} </span>
          </template>
        </el-autocomplete>
      </div>

      <!-- <div v-if="!noStructure" class="yonghuzu"> -->
      <div class="yonghuzu">
        <span class="putinAdd" @click="forAddpersonTree">
          <i class="el-icon-user-solid" />
          {{ type === 'regUser' ? '通过组织架构添加' : '通过用户列表添加' }}
        </span>
      </div>

    </div>
    <div v-else class="tabscnt">
      <el-row v-if="type === 'regUser'" v-loading="treeLoading" style="min-height:260px;">
        <el-col :span="6" :gutter="20">

          <el-tree
            :props="defaultProps"
            node-key="groupId"
            :load="loadNode"
            :expand-on-click-node="false"
            lazy
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-col>
        <el-col v-loading="checkboxLoading" :span="18" style="min-height:260px;" class="treeCheckList">
          <!-- <el-checkbox-group v-model="treeCheckList">
            <el-checkbox v-for="(ele ,i ) in orgAllPerson" :key="i" :label="ele.reguserId">{{ ele.chineseName }}</el-checkbox>
          </el-checkbox-group> -->
          <searchList
            v-if="ActiveUserGroupid && tableData.length"
            ref="searchList"
            :nav-search-options="navSearchOptions"
            :table-data="tableData"
            :table-show-props="tableShowProps"
            :selected-persons="selectedPersons"
            @getpageTableData="getTableList"
          />
          <div v-if="!ActiveUserGroupid" class="treeCheckboxTips">请选择组织</div>
          <div v-if="ActiveUserGroupid && !checkboxLoading && !tableData.length" class="treeCheckboxTips">暂无成员</div>
        </el-col>
      </el-row>
      <el-row v-else v-loading="checkboxLoading" style="min-height:260px;">
        <searchList
          ref="listNotRegUser"
          :nav-search-options="navSearchOptions"
          :table-data="tableData"
          :table-show-props="tableShowProps"
          :selected-persons="selectedPersons"
          @getpageTableData="getTableList"
        />
      </el-row>

      <el-row style="text-align:right;">
        <el-button type="primary" @click="AddtreePerson">添加</el-button>
      </el-row>
    </div>

    <div v-if="!showAddPersonTree" slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="6" :offset="18" class="footer_btns">
          <el-button type="primary" :loading="confirmLoading" @click="confirm">导入成员</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { getListRegUserByChineseName, getOrganizationGroup, getListRegUserByGroupId, getListSysUserByChineseName, getSysUserList } from '@/api/settings'
import elDragDialog from '@/directive/el-drag-dialog'
import searchList from '@/views/systemSettings/power/components/searchList'
export default {
  directives: { elDragDialog },
  components: { searchList },
  props: {
    dialogVisible: {
      type: Boolean
    },
    noStructure: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'sysUser'
    }
  },
  data() {
    return {
      activeGroupId: '',
      treeLoading: true,
      checkboxLoading: false,
      addUserInfoSeleReguser: '',
      selectedPersons: [],
      activeName: 'email',
      innerVisible: false,
      searchgroup: '',
      addinfo: {
        email: '',
        group: [],
        putin: '',
        copy: '',
        joinGroup: []
      },
      showAddPersonTree: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'groupName',
        isLeaf: 'leaf'
      },
      confirmLoading: false,
      treeCheckList: [],
      orgAllPerson: [],
      allOrgAllPerson: {
        allperson: [],
        alreadyGroupId: []
      },
      tableShowProps: [
        { title: '用户名', key: 'reguserName' },
        { title: '姓名', key: 'chineseName' },
        { title: '手机号', key: 'mobile' },
        { title: '邮箱', key: 'email' }
      ],
      navSearchOptions: [
        { value: 'reguserName', label: '用户名' },
        { value: 'chineseName', label: '姓名' }
      ],
      tableData: [],
      ActiveUserGroupid: ''
    }
  },
  computed: {
    selectedGroup() {
      return this.addinfo.group.join(';')
    },
    selectedJoinGroup() {
      return this.addinfo.joinGroup.join(';')
    }
  },
  watch: {
    dialogVisible() {
      this.innerVisible = this.dialogVisible
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    getTableList(data) {
      // if (this.type === 'regUser') {
      //   this.getReguserList(data)
      // } else if (this.type === 'commercial') {
      //   this.getCommercial(data)
      // }
      let userType = 0
      switch (this.type) {
        case 'regUser' :
          userType = 2
          break
        case 'commercial' :
          userType = 1
          break
        default :
          userType = 0
      }

      const refStr = this.type === 'regUser' ? 'searchList' : 'listNotRegUser'

      getSysUserList({ ...data, userType }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.items
          this.$refs[refStr].setPageTotal(res.data.total)
        }
      })
    },
    // getCommercial(data) {
    //   if (!data) data = { pageSize: 10, pageNp: 1 }
    //   getlistMerchant(data).then(res => {
    //     if (res.code === 0) {
    //       this.tableData = res.data.items
    //       this.$refs.searchList.setPageTotal(res.data.total)
    //     }
    //   })
    // },
    // getReguserList(data) {
    //   getSysUserList({ ...data, userType: 2 }).then(res => {
    //     if (res.code === 0) {
    //       this.tableData = res.data.items
    //       this.$refs.searchList.setPageTotal(res.data.total)
    //     }
    //   })
    // },

    confirm() {
      // this.$emit('update:dialogVisible', false)
      this.confirmLoading = true
      this.$emit('confirmData', this.selectedPersons)
      // this.innerVisible = false
    },
    cancalLoading() {
      this.confirmLoading = false
      this.selectedPersons = []
    },
    close() {
      this.$emit('update:dialogVisible', false)
      this.innerVisible = false
    },
    handleClick() {

    },
    forAddpersonTree() {
      this.showAddPersonTree = true
      // this.$emit('refreshTableData')
      if (this.type !== 'regUser') {
        this.checkboxLoading = true
        const query = {
          pageNo: 1,
          pageSize: 10,
          userType: this.type === 'sysUser' ? 0 : 1
        }
        getSysUserList(query).then(res => {
          if (res.code === 0) {
            this.tableData = res.data.items
            console.log('this.tableData', this.tableData)
            this.$nextTick(() => {
              this.$refs.listNotRegUser.setPageTotal(res.data.total)
            })
          }
        }).catch(err => {
          this.tableData = []
          console.log('err', err)
        }).finally(() => {
          this.checkboxLoading = false
        })
      }
    },
    handleNodeClick(item) {
      console.log('handleNodeClick', item)
      this.activeGroupId = item.groupId
      this.checkboxLoading = true
      this.ActiveUserGroupid = item.groupId
      // getListRegUserByGroupId({ groupId: item.groupId }).then(res => {
      //   if (res.code === 0 && res.data.length) {
      //     this.orgAllPerson = res.data
      //     if (this.allOrgAllPerson.alreadyGroupId.findIndex(ele => ele === item.groupId) === -1) {
      //       this.allOrgAllPerson.alreadyGroupId.push(item.groupId)
      //       this.allOrgAllPerson.allperson = this.allOrgAllPerson.allperson.concat(res.data)
      //     }
      //   } else {
      //     this.orgAllPerson = []
      //   }
      // }).catch(err => {
      //   this.orgAllPerson = []
      //   console.log('err', err)
      // }).finally(() => {
      //   this.checkboxLoading = false
      // })
      getSysUserList({ groupId: item.groupId, pageNo: 1, pageSize: 10, userType: 2 }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.items
          console.log('this.tableData', this.tableData)
          this.$nextTick(() => {
            this.$refs.searchList.setPageTotal(res.data.total)
          })
        }
      }).catch(err => {
        this.tableData = []
        console.log('err', err)
      }).finally(() => {
        this.checkboxLoading = false
      })
    },
    loadNode(node, resolve) {
      const key = node.key ? node.key : ''
      this.getTreeNodeData(key).then(arr => {
        console.log('arr', arr)
        if (!key) {
          this.treeLoading = false
        }
        resolve(arr)
      })
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
    AddtreePerson() {
      // console.log('treeCheckList', this.treeCheckList)
      // console.log('allOrgAllPerson', this.allOrgAllPerson)
      // this.treeCheckList.forEach(ele => {
      //   const idx = this.allOrgAllPerson.allperson.findIndex(item => item.reguserId === ele)
      //   if (idx !== -1) {
      //     this.selectedPersons.push({ ...this.allOrgAllPerson.allperson[idx] })
      //   }
      // })
      // console.log('selectedPersons', this.selectedPersons)
      const refStr = this.type === 'regUser' ? 'searchList' : 'listNotRegUser'

      console.log('refStr', refStr)
      this.$nextTick(() => {
        const seleData = this.$refs[refStr].selectedTableData
        if (seleData && Object.keys(seleData).length) {
          for (const key in seleData) {
            this.selectedPersons.push({ ...seleData[key] })
          }
        }
      })
      this.showAddPersonTree = false
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        if (this.type === 'sysUser') {
          getListSysUserByChineseName({ chineseName: queryString }).then(res => {
            if (res.code === 0) {
              return cb(res.data)
            }
          })
        } else {
          getListRegUserByChineseName({ chineseName: queryString }).then(res => {
            if (res.code === 0) {
              return cb(res.data)
            }
          })
        }
        // cb([])
      } else {
        cb([])
      }
    },
    handleSelect(item) {
      const ishave = this.selectedPersons.some(ele => { return ele.chineseName === item.chineseName })
      if (!ishave) {
        this.selectedPersons.push(item)
      }
    },
    delectThisPserson(item) {
      const index = this.selectedPersons.findIndex(ele => ele.reguserId === item.reguserId)
      if (index !== -1) {
        this.selectedPersons.splice(index, 1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.settings_tips {
  line-height: 20px;
  font-size: 13px;
}
.settings_add {
  line-height: 40px;
  font-size: 13px;
}
.tags {
  margin-top: 0px;
  i {
    display: inline-block;
    height: 24px;
    padding: 0 5px;
    line-height: 24px;
    color: #c7254e;
    vertical-align: bottom;
    margin-right: 6px;
    border: 1px solid #e1e1e8;
    margin-bottom: 5px;
    white-space: nowrap;
    word-break: break-all;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-style: normal;
    font-size: 13px;
  }
}

.settings_qiyongDialog {
  .tit {
    font-weight: bold;
    margin: 30px 0 12px 0 ;
    font-size: 14px;
  }
  .el-checkbox {
    margin-bottom: 10px;
    width: 25%;
    margin-right: 0;
  }
}

.dialogleft {
  border-right:1px solid #E6E6E6;
  margin-top: -12px;
  padding-top: 12px;
}
.ul {
  margin-top: 30px;
  padding-right: 18px;
  max-height: 500px;
  overflow-y: auto;
  >div {
    overflow: hidden;
    padding: 8px 5px;
    i {
      display: block;
      float: right;
    }
  }
}

::-webkit-scrollbar {
    width: 9px;
    height: 9px;
}
::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgba(0,0,0,0.1);
    -webkit-box-shadow: -2px 0 0 #fff inset, 1px 0 0 #fff inset, 0 -1px 0 rgba(255,255,255,0.9) inset, 0 1px 0 rgba(255,255,255,0.9) inset;
}
::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: rgba(0,0,0,0);
}
.inputOuter {
  height: 212px;
  border: 1px solid #e5e5e5;
  padding: 10px;
  cursor: text;
  &.noStructure {
    height: 300px;
  }
}
.tabscnt {
    .textarea {
      width: 180px;

    }
}
.yonghuzu {
    padding: 20px 0;
    .putinAdd {
        color: #3582fb;
        cursor: pointer;
    }
}

.el-dropdown-link {
    display: inline-block;
    height: 30px;
    width: 240px;
    border: 1px solid #b0bac5;
    padding: 3px 20px 3px 6px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    margin-left: 12px;
    i {
        position: absolute;
        right: 12px;
        top: 6px
    }
}
.el-dropdown-link.w200 {
    width: 180px;
}
.com_dropdownmenu {
    .Search {
        .el-input {
            padding:  0 16px 12px 16px;
        }
    }
}
.dialog-footer {
    .footer_info {
        font-size: 14px;
        padding-top: 6px;
        text-align: left;
        .a {
            display: inline-block;
            margin: 0 6px;
            color: #3582fb;
            cursor: pointer;
        }
    }
    .footer_btns {
        text-align: right;
        .el-button {
            border-radius: 2px;
        }
    }
}

.selectedPersons {
  display: inline-block;
  color: #6a8df9;
  background-color: #e3f2fd;
  padding: 5px 10px;
  margin-right: 10px;
  i {
    cursor: pointer;
  }
}

</style>
<style  scoped>
.inputOuter >>> .el-input__inner {
  border: none;
}
.Search >>> .el-input__inner {
            border: none;
            border-bottom: 1px solid #DCDFE6;
}
.Search >>> .el-input__prefix {
    left: 10px;
    top: -5px;
}

.textarea >>> .el-textarea__inner {
        resize: none;
        height: 212px !important;
        border-radius: 0;
}

.settings_qiyongDialog  >>> .el-dialog__header {
    border-bottom: none;
    background-color: #f9f9f9;
    height: auto;
}
.settings_qiyongDialog  >>> .el-dialog__title {
    display: block;
    font-size: 27px;
    line-height: 27px;
    /* padding-top: 35px; */
    text-align: center;
    color: #67707b;
    background-color: #f9f9f9;

}
.settings_qiyongDialog  >>> .el-dialog__body {
    padding: 20px ;
    min-height: 340px;
}
.settings_qiyongDialog  >>> .el-tabs__header {
    background-color: #f9f9f9;

}
.settings_qiyongDialog  >>> .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #e6e6e6;
}
.settings_qiyongDialog  >>> .el-tabs__content {
    padding: 0 20px;
}
.settings_qiyongDialog  >>> .el-dialog__footer {
    border-top: 1px solid #e6e6e6;
    background-color: #f9f9f9;
    padding-top: 20px;
}
.settings_qiyongDialog  >>> .el-tabs__nav-scroll {
    width: 452px;
    margin: 0 auto;
    padding-top: 20px;
    padding-left: 20px;
}

.settings_qiyongDialog  >>> .el-tabs__item::after{
    content: '';
    display: inline-block;
    width: 20px;
    height: 10px;
}
.settings_qiyongDialog  >>> .el-tabs__item::before{
    content: '';
    display: inline-block;
    width: 20px;
    height: 10px;
}
.treeCheckboxTips {
  line-height: 220px;
  text-align: left;
  color: #67707b;
  font-size: 16px;
  text-align: center;
}
.treeCheckList {
  padding: 20px;
  padding-left: 40px;
}
.treeCheckList >>> .el-checkbox {
  width: 33%;
}
</style>
