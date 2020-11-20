<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--left-tree-->
      <el-col :span="12">
        <el-card shadow="never" class="card-container">
          <div slot="header" class="clearfix">
            <el-dropdown @command="handleNewCommand">
              <el-button type="primary" size="small">
                <i class="el-icon-plus" /> 新建分类<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">分类a</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button plain size="small" style="margin-left: 10px;">
              <i class="el-icon-upload2" /> 导入
            </el-button>
            <el-tooltip class="item" effect="light" content="帮助说明..." placement="bottom-start">
              <el-link type="primary" :underline="false" style="margin-left: 10px;">
                <i class="el-icon-question" />
              </el-link>
            </el-tooltip>
          </div>
          <el-tree
            :data="treeData"
            :props="treeDefaultProps"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <!--right-content-->
      <el-col :span="12">
        <el-card shadow="never" class="tabsCard-container">
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!--基本信息-->
            <el-tab-pane label="基本信息" name="first">
              <el-form ref="form" :model="form" label-width="120px" style="width: 500px; margin: 0 auto;">
                <el-form-item label="分类编码">
                  <el-input v-model="form.code"/>
                </el-form-item>
                <el-form-item label="分类名称">
                  <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="上级分类">
                  <el-select v-model="form.parent" placeholder="请选择" style="width: 100%;">
                    <el-option
                      v-for="item in parentOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="使用期限(月)">
                  <el-input-number v-model="form.num" :step="1" />
                </el-form-item>
                <el-form-item label="">
                  <el-button plain>删除</el-button>
                  <el-button plain>禁用</el-button>
                  <el-button type="primary">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!--标准型号-->
            <el-tab-pane label="标准型号" name="second">
              <div class="clearfix" style="margin-bottom: 20px;">
                <el-button type="primary" size="small">
                  <i class="el-icon-plus" /> 新建
                </el-button>
                <el-button plain size="small" style="margin-left: 10px;">
                  <i class="el-icon-upload2" /> 导入
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
                :data="tableData"
                border
                style="width: 100%"
              >
                <el-table-column prop="images" label="照片" />
                <el-table-column prop="name" label="资产名称" />
                <el-table-column prop="no" label="规格型号" />
                <el-table-column prop="unit" label="计量单位" />
                <el-table-column prop="original" label="原值" />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="small" @click="handleDetails(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <!--新建-->
    <el-dialog
      title="新建"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">
      <el-form ref="dialogForm" :model="dialogForm" label-width="100px">
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="dialogForm.code" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="上级" prop="parent">
          <el-input v-model="dialogForm.parent" disabled />
        </el-form-item>
        <el-form-item label="部门负责人" prop="chargePerson">
          <el-row>
            <el-col :span="18">
              <el-input v-model="dialogForm.chargePerson" />
            </el-col>
            <el-col :span="5" :offset="1">
              <el-button type="primary" plain style="width: 100%;">修改</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DepartmentManage',
  data() {
    return {
      treeData: [
        { label: '01-土地/房屋及构筑物' },
        { label: '02-通用设备' },
        { label: '03-专用设备' },
        { label: '04-交通运输设备' },
        { label: '05-电气设备' },
        { label: '06-电子产品及通信设备' },
        { label: '07-仪器仪表、计量标准器具及量具、衡器' },
        { label: '08-文艺体育设备' },
        { label: '09-图书文图及陈列品' },
        { label: '10-家具用具及其他类' }
      ],
      treeDefaultProps: {
        children: 'children',
        label: 'label'
      },
      activeName: 'first',
      form: {
        code: '',
        name: '',
        parent: '',
        num: 48
      },
      parentOptions: [], // 上级分类
      tableData: [],
      dialogVisible: false,
      dialogForm: {
        code: '',
        name: '',
        parent: '',
        chargePerson: ''
      }
    }
  },
  methods: {
    // Fn: 新建分类
    handleNewCommand(command) {
      switch (command) {
        case 'a': // 分类a
          console.log('分类a', command)
          break
        default:
          console.log('点了个寂寞')
          break
      }
      this.dialogVisible = true
    },
    // Fn: 关闭
    handleClose() {
      this.dialogVisible = false
    },
    // Fn: TreeNode点击
    handleNodeClick(data) {
      console.log(data)
    },
    // Fn: Tabs切换
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    // Fn: 详情
    handleDetails(item) {
      console.log(item)
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
</style>
