<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--left-tree-->
      <el-col :span="12">
        <el-card
          v-loading="treeLoading"
          shadow="never"
          class="card-container"
        >
          <div slot="header" class="clearfix">
            <el-dropdown @command="handleNewCommand">
              <el-button type="primary" size="small">
                <i class="el-icon-plus" /> 新建分类<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sibling">新建同级</el-dropdown-item>
                <el-dropdown-item command="child">新建下级</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree
            ref="treeClassification"
            :data="treeData"
            :props="treeDefaultProps"
            :check-on-click-node="true"
            node-key="id"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ data }" class="custom-tree-node">
              <span>{{ data.assetkindId }}-{{ data.assetkindName }}</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <!--right-content-->
      <el-col :span="12">
        <el-card shadow="never" class="tabsCard-container">
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!--基本信息-->
            <el-tab-pane label="基本信息" name="first">
              <template v-if="currentNode.uuid">
                <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 500px; margin: 0 auto;">
                  <el-form-item label="分类编码" prop="assetkindId">
                    <el-input v-model="form.assetkindId" />
                  </el-form-item>
                  <el-form-item label="分类名称" prop="assetkindName">
                    <el-input v-model="form.assetkindName" />
                  </el-form-item>
                  <el-form-item label="上级分类">
                    <el-select v-model="form.parentAssetcode" placeholder="请选择" style="width: 100%;">
                      <el-option
                        v-for="item in parentOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="">
                    <el-button plain @click="deleteAssetKind">删除</el-button>
                    <el-button plain @click="updateAssetKindStatus">
                      {{ form.status === 1 ? '禁用' : '启用' }}
                    </el-button>
                    <el-button type="primary" @click="submitForm">保存</el-button>
                  </el-form-item>
                </el-form>
              </template>
              <template v-else>
                <el-alert title="请点击左侧分类，查看基本信息" type="info" />
              </template>
            </el-tab-pane>
            <!--标准型号-->
            <el-tab-pane label="标准型号" name="second">
              <template v-if="currentNode.uuid">
                <div class="clearfix" style="margin-bottom: 20px;">
                  <el-button type="primary" size="small" @click="handleNewStandardType">
                    <i class="el-icon-plus" /> 新建
                  </el-button>
                  <el-button size="small" plain :disabled="!tableSelection.length" @click="handleStandardTypeItemBatchDelete">
                    批量删除
                  </el-button>
                  <div style="float: right;">
                    <el-tooltip class="item" effect="light" content="帮助说明..." placement="bottom-start">
                      <el-link type="primary" :underline="false" style="margin-left: 10px;">
                        <i class="el-icon-question" /> 什么是标准资产型号
                      </el-link>
                    </el-tooltip>
                  </div>
                </div>
                <el-table
                  v-loading="tableLoading"
                  :data="tableData"
                  style="width: 100%; border: #eee solid 1px;"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="assetName" label="资产名称" />
                  <el-table-column prop="standardtypeName" label="规格型号" />
                  <el-table-column prop="unit" label="计量单位" />
                  <el-table-column prop="original" label="原值" />
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" style="transform: rotate(90deg)" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="handleStandardTypeItemEdit(scope.row)">编辑</el-dropdown-item>
                          <el-dropdown-item @click.native="handleStandardTypeItemDelete(scope.row)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template v-else>
                <el-alert title="请点击左侧分类，查看标准型号" type="info" />
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <!--新建分类-->
    <AddDialogClassification
      :type="newClassificationType"
      :visible="newClassificationVisible"
      :current-node="currentNode"
      @changeNewClassificationVisible="changeNewClassificationVisible"
      @saveClassificationSuccess="saveClassificationSuccess"
    />
    <!--新建标准型号-->
    <AddDialogStandardType
      ref="addDialogStandardType"
      :visible="newStandardTypeVisible"
      :current-node="currentNode"
      :new-standard-type="newStandardType"
      @changeNewStandardTypeVisible="changeNewStandardTypeVisible"
      @saveStandardTypeSuccess="saveStandardTypeSuccess"
    />
  </div>
</template>

<script>
import { queryAssetKindList, getAssetKind, checkAssetKindByAssetKindIdExist, deleteAssetKind, updateAssetKindStatus, saveAssetKind, getStandardTypeList, getStandardType, deleteStandardType, batchDeleteStandardType } from '@/api/settings'
import AddDialogClassification from './components/addDialogClassification'
import AddDialogStandardType from './components/addDialogStandardType'
export default {
  name: 'DepartmentManage',
  components: {
    AddDialogClassification,
    AddDialogStandardType
  },
  data() {
    // 验证：分类编码
    const validateAssetkindId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('必填'))
      } else {
        const params = {
          assetKindId: value,
          uuid: this.currentNode.uuid
        }
        checkAssetKindByAssetKindIdExist(params).then((res) => {
          // console.log(157, res)
          if (res.code !== 0) {
            callback(new Error('已经存在，不能重复'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      newClassificationType: '', // 新建分类（同级: sibling，下级: child）
      newClassificationVisible: false, // 新建分类（弹出框状态）
      newStandardType: '', // 新建/修改标准型号
      newStandardTypeVisible: false, // 新建标准规格（弹出框状态）
      treeLoading: false,
      treeData: [],
      treeDefaultProps: {
        children: 'children',
        label: 'assetkindName'
      },
      currentNode: {},
      activeName: 'first', // 右侧tab页签
      form: {
        assetkindId: '',
        assetkindName: '',
        parentAssetcode: ''
      },
      formRules: {
        assetkindId: [
          { required: true, validator: validateAssetkindId, trigger: 'blur' }
        ]
      },
      parentOptions: [], // 上级分类
      tableLoading: false,
      tableData: [], // 标准型号列表
      tableSelection: [], // 标准型号列表多选项
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // Fn: 资产类型列表
    getList() {
      this.treeLoading = true
      queryAssetKindList().then((res) => {
        if (res.code === 0) {
          this.treeData = res.data
        }
        this.treeLoading = false
      }).catch((err) => {
        this.treeLoading = false
        console.log('err', err)
      })
    },

    // Fn: 新建分类
    handleNewCommand(command) {
      if (!this.currentNode.uuid) { // 如果没有选中，请先选择一个节点
        this.$message({
          type: 'warning',
          message: '请先选中一个分类，再进行新建操作！',
          showClose: true
        })
        return
      }
      switch (command) {
        case 'sibling': // 同级
        case 'child': // 下级
          this.newClassificationType = command
          this.changeNewClassificationVisible(true)
          console.log('command: ', command)
          break
        default:
          console.log('点了个寂寞')
          break
      }
    },

    // Fn: 新建分类保存成功
    saveClassificationSuccess() {
      this.changeNewClassificationVisible(false)
      this.getList()
    },

    // Fn: 显示/隐藏（新建分类 弹出框）
    changeNewClassificationVisible(visible) {
      this.newClassificationVisible = visible
    },

    // Fn: 点击TreeNode节点
    handleNodeClick(data) {
      this.currentNode = data
      // 查询分类基本信息
      getAssetKind(data.uuid).then((res) => {
        if (res.code === 0) {
          this.form = res.data
        }
      }).catch((err) => { console.log('err', err) })
      // 查询标准型号
      this.getStandardTypeList(data)
    },

    // Fn: Tabs切换
    handleTabClick(tab, event) {
      console.log(tab, event)
    },

    // Fn: 详情
    handleDetails(item) {
      console.log(item)
    },

    // Fn: 删除
    deleteAssetKind() {
      deleteAssetKind({ uuid: this.form.uuid }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功！',
            showClose: true
          })
          this.getList()
        }
      }).catch((err) => { console.log('err', err) })
    },

    // Fn: 禁用/启用
    updateAssetKindStatus() {
      const params = {
        uuid: this.currentNode.uuid,
        status: this.currentNode.uuid
      }
      updateAssetKindStatus(params).then((res) => {
        console.log(253, res)
      }).catch((err) => { console.log('err', err) })
    },

    // Fn: 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveAssetKind()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // Fn: 保存
    saveAssetKind() {
      const { assetkindId, assetkindName, depth, parentAssetcode } = this.form
      const params = {
        assetkindId,
        assetkindName,
        depth,
        parentAssetcode
      }
      saveAssetKind(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功！',
            showClose: true
          })
          this.getList()
        }
      }).catch((err) => { console.log('err', err) })
    },

    // Fn: 查询规格标准列表
    getStandardTypeList(data) {
      this.tableLoading = true
      const params = {
        assetkindId: data.assetkindId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      getStandardTypeList(params).then((res) => {
        this.tableLoading = false
        if (res.code === 0) {
          this.tableData = res.data.items
          this.pageTotal = res.data.total
          this.pageNo = res.data.page
          this.pageSize = res.data.limit
        }
      }).catch((err) => {
        this.tableLoading = false
      })
    },

    // Fn: 新建标准规格
    handleNewStandardType() {
      this.newStandardType = 'new'
      this.changeNewStandardTypeVisible(true)
    },

    // Fn: 编辑（标准规则型号）
    handleStandardTypeItemEdit(item) {
      getStandardType(item.uuid).then((res) => {
        if (res.code === 0 && res.data) {
          this.newStandardType = 'edit'
          this.$refs.addDialogStandardType.changeDialogForm(res.data)
          this.changeNewStandardTypeVisible(true)
        }
      }).catch((err) => { console.log('err', err) })
    },

    // Fn: 删除（标准规则型号）
    handleStandardTypeItemDelete(item) {
      deleteStandardType(item.uuid).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功！',
            showClose: true
          })
          this.getStandardTypeList(this.currentNode)
        }
      }).catch((err) => { console.log('err', err) })
    },

    // Fn: 多选
    handleSelectionChange(val) {
      this.tableSelection = val
    },

    // Fn: 批量删除（标准规则型号）
    handleStandardTypeItemBatchDelete() {
      const params = this.tableSelection.map((item) => item.uuid)
      batchDeleteStandardType(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '批量删除成功！',
            showClose: true
          })
          this.getStandardTypeList(this.currentNode)
        }
      }).catch((err) => { console.log('err', err) })
    },

    // Fn: 显示/隐藏（新建标准规格 弹出框）
    changeNewStandardTypeVisible(visible) {
      this.newStandardTypeVisible = visible
    },

    // Fn: 新建标准规格保存成功
    saveStandardTypeSuccess() {
      this.changeNewStandardTypeVisible(false)
      this.getStandardTypeList(this.currentNode)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container{ height: calc(100vh - 50px - 20px * 2);
  ::v-deep{
    .el-card__header{ padding: 15px 20px; height: 65px;
      .title{ display: inline-block; line-height: 30px; vertical-align: middle; margin: 0; font-size: 16px;}
    }
    .el-card__body{ height: calc(100% - 65px); overflow-y: auto;}
  }
  .el-form-item{ margin-bottom: 15px;}
}
.tabsCard-container{ height: calc(100vh - 50px - 20px * 2);
  ::v-deep{
    .el-card__body{ height: 100%; overflow-y: auto; padding: 0;}
  }
  .el-tabs{ height: 100%;
    ::v-deep{
      .el-tabs__header{ height: 65px; margin: 0;}
      .el-tabs__nav-wrap{ padding: 0 20px;
        &::after{ height: 1px; background-color: #ebeef4;}
      }
      .el-tabs__item{ height: 65px; line-height: 65px;}
      .el-tabs__content{ height: calc(100% - 65px);}
      .el-tab-pane{ height: 100%; padding: 20px; overflow-y: auto;}
    }
  }
}
.el-tree{
  ::v-deep{
    .el-tree-node{
      &.is-current{ background-color: #ebeffb; color: #324aa5; font-weight: 600;}
    }
  }
  .custom-tree-node{ font-size: 14px;}
}
</style>
