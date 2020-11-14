<template>
  <el-dialog
    v-el-drag-dialog
    :visible="innerVisible"
    width="830px"
    title="添加成员"
    class="settings_qiyongDialog"
    @close="close"
  >

    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="邮件邀请" name="email">
        <div class="tabscnt">
          <el-input v-model="addinfo.email" type="textarea" class="textarea" placeholder="通过邮箱添加新成员, 可输入多个邮箱, 空格或回车分隔" />

          <div class="yonghuzu">
            <span>并将以上成员加入用户组</span>
            <el-dropdown trigger="click" placement="bottom-start">
              <span class="el-dropdown-link">
                {{ selectedGroup }}<i class="el-icon-arrow-down el-icon--right" />
              </span>

              <el-dropdown-menu slot="dropdown" class="com_dropdownmenu">
                <div class="Search">
                  <el-input
                    v-model="searchgroup"
                    prefix-icon="el-icon-search"
                    size="small"
                  /></div>
                <el-checkbox-group v-model="addinfo.group">
                  <el-checkbox label="管理员" />
                  <el-checkbox label="普通成员" />
                  <el-checkbox label="用户组1" />
                  <el-checkbox label="普通用户组01" />
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="导入公司成员" name="putin">
        <div class="tabscnt">
          <el-input v-model="addinfo.putin" type="textarea" class="textarea" placeholder="请输入公司已有成员的昵称" />

          <div class="yonghuzu">
            <span class="putinAdd">
              <i class="el-icon-user-solid" />
              通过组织架构添加
            </span>

          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="从已有项目复制" name="copy">
        <div class="tabscnt">

          <div class="yonghuzu">
            <span>并将以上成员加入用户组</span>
            <el-dropdown trigger="click" placement="bottom-start">
              <span class="el-dropdown-link">
                {{ addinfo.copy }}<i class="el-icon-arrow-down el-icon--right" />
              </span>

              <el-dropdown-menu slot="dropdown" class="com_dropdownmenu">
                <div class="Search">
                  <el-input
                    v-model="searchgroup"
                    prefix-icon="el-icon-search"
                    size="small"
                  />
                </div>

                <el-dropdown-item>--空--</el-dropdown-item>
                <el-dropdown-item>轻量团队模板</el-dropdown-item>
                <el-dropdown-item>敏捷开发管理</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs> -->

    <div v-if="!showAddPersonTree" class="tabscnt">
      <el-input v-model="addinfo.putin" type="textarea" class="textarea" placeholder="请输入公司已有成员的昵称" />

      <div class="yonghuzu">
        <span class="putinAdd" @click="forAddpersonTree">
          <i class="el-icon-user-solid" />
          通过组织架构添加
        </span>

      </div>
    </div>
    <div v-else class="tabscnt">
      <el-row style="min-height:260px;">
        <el-tree :data="data" :props="defaultProps" show-checkbox />
      </el-row>

      <el-row style="text-align:right;">
        <el-button type="primary" @click="AddtreePerson">添加</el-button>
      </el-row>
    </div>

    <div v-if="!showAddPersonTree" slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="6" :offset="18" class="footer_btns">
          <el-button type="primary" @click="confirm">导入成员</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  directives: { elDragDialog },
  props: {
    dialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
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
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
  methods: {
    confirm() {
      this.$emit('update:dialogVisible', false)
      this.innerVisible = false
    },
    close() {
      this.$emit('update:dialogVisible', false)
      this.innerVisible = false
    },
    handleClick() {

    },
    forAddpersonTree() {
      this.showAddPersonTree = true
    },
    AddtreePerson() {
      this.showAddPersonTree = false
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
.tabscnt {
    .textarea {
        height: 212px;

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

</style>
<style  scoped>
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
</style>
