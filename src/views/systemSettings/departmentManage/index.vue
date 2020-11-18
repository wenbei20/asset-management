<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--left-tree-->
      <el-col :span="12">
        <el-card shadow="never" class="card-container">
          <div slot="header" class="clearfix">
            <h4 class="title">组织架构</h4>
            <el-dropdown>
              <el-button plain size="small" style="margin-left: 30px;">
                同步/导入<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>同步/导入</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        <el-card shadow="never" class="card-container">
          <div slot="header" class="clearfix">
            <h4 class="title">01-测试公司</h4>
            <div style="float: right;">
              <el-dropdown @command="handleNewCommand">
                <el-button type="primary" size="small">
                  <i class="el-icon-plus" /> 新建<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="subDepartment">下级部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-form ref="form" :model="form" label-width="80px" style="width: 500px; margin: 0 auto;">
            <el-form-item label="公司编码">
              <el-input v-model="form.code"/>
            </el-form-item>
            <el-form-item label="公司名称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="上级">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="form.parent" />
                </el-col>
                <el-col :span="5" :offset="1">
                  <el-button type="primary" plain style="width: 100%;">修改</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="">
              <el-button plain>删除</el-button>
              <el-button plain>禁用</el-button>
              <el-button type="primary">保存</el-button>
            </el-form-item>
          </el-form>
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
        {
          label: '01-测试公司',
          children: [
            { label: '01-测试公司0001' }
          ]
        },
        {
          label: '02-测试公司',
          children: [
            { label: '02-测试公司00002' }
          ]
        }
      ],
      treeDefaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        code: '',
        name: '',
        parent: ''
      },
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
    handleNewCommand(command) {
      switch (command) {
        case 'subDepartment': // 下级部门
          console.log('下级部门', command)
          break
        default:
          console.log('点了个寂寞')
          break
      }
      this.dialogVisible = true
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
</style>
