<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-form>
          <el-form-item label="使用公司/部门">
            <el-select v-model="companyValue" placeholder="请选择公司/部门">
              <el-option
                v-for="item in companyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col>
        <el-button type="primary" icon="el-icon-plus">新建</el-button>
        <el-dropdown>
          <el-button type="default" icon="el-icon-edit" plain>
            编辑<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col>
        <el-input
          width="200px"
          placeholder="搜索..."
          suffix-icon="el-icon-search"
          v-model="input1">
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssetInfoManage',
  data() {
    return {
      companyOptions: [
        { value: 'company1', label: '公司一' },
        { value: 'company2', label: '公司二' },
        { value: 'company3', label: '公司三' }
      ],
      companyValue: '',
      input1: ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
