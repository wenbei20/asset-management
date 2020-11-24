<template>
  <div>

    <el-row>
      <el-select v-model="SearchType" placeholder="请选择搜索类别" style="padding:0 6px 0 0 ;width: 160px;">
        <el-option v-for="(ele , i ) in navSearchOptions" :key="i" :value="ele.value" :label="ele.label" />
      </el-select>

      <el-input
        v-model="searchIpt"
        :style="{ width: '160px',marginRight:'20px' }"
        placeholder="搜索..."
        clearable
        @clear="clearSearchRes"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchList" />
      </el-input>
    </el-row>
    <div class="maintable" style="padding-top:20px;">
      <vxe-table
        ref="xTree"
        v-loading="tableLoading"
        resizable
        highlight-hover-row
        row-class-name="VxeTable_Row"
        :auto-resize="true"
        row-id="reguserId"
        stripe
        class="vxetable"
        :data="tableData"
        :checkbox-config="{checkRowKeys: defaultSelecteRows}"
        @checkbox-change="innerTreeCheckChange"
      >
        <vxe-table-column type="checkbox" width="40" :resizable="false" />
        <vxe-table-column v-for="(item,idx) in tableShowProps" :key="idx" :field="item.key" :title="item.title" min-width="100" />
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
    </div>

  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {
    navSearchOptions: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableShowProps: {
      type: Array,
      default: () => []
    },
    selectedPersons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      SearchType: '',
      searchIpt: '',
      tableLoading: false,
      pageTotal: 0,
      pageQuery: {
        pageNo: 1,
        pageSize: 10
      },
      defaultSelecteRows: [],
      selectedTableData: {}
    }
  },
  created() {
    // console.log('created',)
    this.getDefaultRows()
  },
  methods: {
    innerTreeCheckChange({ checked, row }) {
      const idx = this.defaultSelecteRows.findIndex(ele => ele === row.reguserId)
      if (checked) {
        if (idx === -1) {
          this.defaultSelecteRows.push(row.reguserId)
        }
        this.selectedTableData[row.reguserId] = { ...row }
      } else {
        if (this.selectedTableData[row.reguserId]) {
          delete this.selectedTableData[row.reguserId]
        }
        if (idx !== -1) {
          this.defaultSelecteRows.splice(idx, 1)
        }
      }
    },
    clearSearchRes() {
      this.pageQuery = {
        pageNo: 1,
        pageSize: 10
      }
      this.getList()
    },
    searchList() {
      if (!this.searchIpt.trim()) {
        this.$message({ type: 'warning', message: '请输入搜索内容' })
        return
      }
      if (!this.SearchType) {
        this.$message({ type: 'warning', message: '请选择搜索类型' })
        return
      }

      this.pageQuery = {
        pageNo: 1,
        pageSize: 10
      }

      //   this.pageQuery
      this.pageQuery[this.SearchType] = this.searchIpt
      this.getList()
    },
    getList() {
      this.$emit('getpageTableData', this.pageQuery)
    },
    setPageTotal(total) {
      this.pageTotal = total
      this.getDefaultRows()
      this.$refs.xTree.reloadData(this.tableData)
    },
    getDefaultRows() {
      if (this.selectedPersons.length) {
        this.defaultSelecteRows = this.selectedPersons.map(item => item.reguserId)
      }
    }
  }
}
</script>
