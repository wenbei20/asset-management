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
              <el-dropdown>
                <el-button type="primary" size="small">
                  <i class="el-icon-plus" /> 新建<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>下级部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-form ref="form" :model="form" label-width="80px" style="width: 500px; margin: 0 auto;">
            <el-form-item label="公司编码">
              <el-input v-model="form.code" size="small" />
            </el-form-item>
            <el-form-item label="公司名称">
              <el-input v-model="form.name" size="small" />
            </el-form-item>
            <el-form-item label="上级">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="form.parent" size="small" />
                </el-col>
                <el-col :span="5" :offset="1">
                  <el-button type="primary" size="small" style="width: 100%;">修改</el-button>
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
      }
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
