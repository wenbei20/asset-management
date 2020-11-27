<template>
  <div class="navTree" :class="{'hide':!show}">
    <div v-if="show" class="companyName">{{ merchantName }}</div>
    <div v-if="show" class="title">{{ title }}</div>
    <!-- :data="treeData" -->
    <el-tree
      v-if="show"
      ref="leftNavTree"
      :props="defaultProps"
      node-key="groupId"
      :load="loadNode"
      :expand-on-click-node="false"
      lazy
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ data.groupName }}</span>
        <span class="selfIcon el-icon-more" @click.stop="moreClick(data)" />

        <drapDown v-if="data.position" :show.sync="data.showTopMenu" :width="116" :left="222">
          <div v-for="(item , idx ) in dropDownData[data.position]" :key="idx" :class="item.className" @click.stop="operationNode(item, data)">{{ item.name }}</div>
        </drapDown>
      </span>
    </el-tree>

    <div v-if="isAbleClose" class="hideBtn" @click="hidemenu">
      <i :class="[show ? 'el-icon-arrow-left': 'el-icon-arrow-right' ]" />
    </div>

  </div>
</template>
<script>

import drapDown from '@/components/drapdownMenu'
import { getOrganizationGroup } from '@/api/settings'
import { mapState } from 'vuex'
export default {
  components: { drapDown },
  props: {
    title: {
      type: String,
      default: '公司组织架构'
    },
    treeData: {
      type: Array,
      default: () => [
        { label: '所有的',
          num: '',
          position: 'top',
          showTopMenu: false,
          children: [
            {
              label: '未分类',
              num: '27',
              position: 'sub',
              showTopMenu: false,
              children: []
            },
            {
              label: '产品需求',
              num: '7',
              position: 'sub',
              showTopMenu: false,
              children: [
                {
                  label: '新功能',
                  num: '3',
                  position: 'sub',
                  showTopMenu: false,
                  children: []
                },
                {
                  label: '优化需求',
                  num: '4',
                  position: 'sub',
                  showTopMenu: false,
                  children: []
                }
              ]
            },
            {
              label: '技术需求',
              num: '',
              position: 'sub',
              showTopMenu: false,
              children: []
            }
          ]
        }
      ]
    },
    isAbleClose: {
      type: Boolean,
      default: true
    },
    dropDownData: {
      type: Object,
      default: () => {
        return {
          top: [
            { name: '添加成员', className: '', operate: 'addperson' },
            { name: '添加(子)分公司', className: '', operate: 'addSonCompany' },
            { name: '添加子部门', className: '', operate: 'addSonDepartment' }],
          sub: [
            { name: '添加成员', className: '', operate: 'addperson' },
            { name: '添加(子)分公司', className: '', operate: 'addSonCompany' },
            { name: '添加子部门', className: '', operate: 'addSonDepartment' },
            { name: '修改名称', className: '', operate: 'changeName' },
            { name: '删除部门', className: 'deletePart', operate: 'deletePart' }
          ],
          department: [
            { name: '添加成员', className: '', operate: 'addperson' },
            { name: '添加子部门', className: '', operate: 'addSonDepartment' },
            { name: '修改名称', className: '', operate: 'changeName' },
            { name: '删除部门', className: 'deletePart', operate: 'deletePart' }
          ]
        }
      }
    }
  },

  data() {
    return {
      show: true,
      defaultProps: {
        label: 'groupName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      showTopMenu: true
    }
  },
  computed: {
    ...mapState({
      merchantName: state => state.user.merchantName
    })
  },
  created() {
    // this.getTreeNodeData(0)
  },
  methods: {
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
    loadNode(node, resolve) {
      const key = node.key ? node.key : ''
      this.getTreeNodeData(key).then(arr => {
        arr.forEach(item => {
          item.showTopMenu = false
          if (node.level === 0) {
            item.position = 'top'
          } else {
            item.position = item.nodeType === 1 ? 'department' : 'sub'
          }
        })
        resolve(arr)
      })
    },
    handleOpen() {

    },
    handleClose() {

    },
    hidemenu() {
      this.show = !this.show
      this.$emit('show', this.show)
    },
    handleNodeClick(data) {
      this.$emit('handleNodeClick', data)
    },
    moreClick(data) {
      data.showTopMenu = true
    },
    operationNode(e, data) {
      if (e.operate) {
        this.$emit('operation', e.operate, data)
      }
      data.showTopMenu = false
    },
    updataNode(id, parentId) {
      this.getTreeNodeData(parentId).then(res => {
        // const idx = res.findIndex(ele => ele.groupId === id)

        // if (idx !== -1) {
        //   this.$refs.leftNavTree.updateKeyChildren(id, res[idx])
        // }
        res.forEach(item => {
          item.showTopMenu = false
          item.position = item.nodeType === 1 ? 'department' : 'sub'
        })
        this.$refs.leftNavTree.updateKeyChildren(parentId, res)
      })
    },
    deleteNode(id) {
      this.$refs.leftNavTree.remove(id)
    }
  }
}
</script>
<style lang="scss" scoped>

    .selfIcon {
        transform: rotateZ(90deg);
        float:right;
        margin-right:10px;
        margin-top: 8px;
        color: #b0bac5;
        opacity: 0;
    }
    .selfNum {
      display: inline-block;
      margin-left: 10px;
    }

    .custom-tree-node {
      font-size: 14px;
      width: 100%;
    }
    .custom-tree-node:hover .selfIcon {
      opacity: 1;
    }

    .navTree {
        height: 100%;
        width: 240px;
        // max-width: 300px;
        // min-width: 240px;
        float: left;
        background-color: #fff;
        margin-right: 15px;
        border: none;
        box-shadow: 0 0 10px rgba(128,145,165,0.2);
        border-radius: 2px;
        position: relative;
        .title {
                padding: 5px 10px;
                font-size: 16px;
                color: #3f4a56;
                font-weight: normal;
        }
        .companyName {
                padding: 10px 5px 0 5px;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
        }
        .el-menu-vertical {
            border-right: none;
            .num {
                color: #999 ;
                font-size: 14px;
                margin-left: 6px;
                font-weight: normal;
            }
        }
        .hideBtn {
            position: absolute;
            right: -12px;
            top: calc(50% - 25px);
            height: 50px;
            width: 10px;
            border-radius:  0 10px 10px 0;
            background: #acb7c1;
            cursor: pointer;
            line-height: 50px;
            text-align: center;
            color:#fff;
            font-size: 14px;
            i {
                width: 10px;
                position: relative;
                left: -2px;
            }
        }
    }
    .navTree.hide {
        width: 0;
        margin-left: 0;
        .el-menu{
            display:none;
        }
        .title {
            display: none;
        }
    }

.el-tree{
  ::v-deep{
    .el-tree-node{ font-size: 14px; color: #333; font-weight: 600;
      &__content{ height: 30px; line-height: 30px;}
      &__children{
        .el-tree-node{ font-weight: 400;}
      }
      &.is-current{
        > .el-tree-node__content{ color: #1890ff;}
      }
    }
  }
  .custom-icon{ margin: 0 5px;}
}
.companyName {

}
</style>
<style scoped>
.el-menu-vertical >>> .el-menu-item-group__title {
    padding: 0;
}
.el-menu-vertical >>> .el-submenu .el-menu-item {
    height: 26px;
    line-height: 26px;
}
#app .navTree .el-menu-vertical >>> .el-submenu__title {
    height: 26px;
    line-height: 26px;
    padding-left: 20px !important;
}
.el-menu-vertical >>> .el-menu-item:hover, .el-menu-item:focus {
    background-color: #fff;
}
.el-menu-vertical >>>  .el-submenu__title:hover, .el-submenu__title:focus{
    background-color: #fff;
}
.el-menu-item.is-active {
    font-weight: bold;
}

#app .navTree .el-menu-vertical >>> .el-submenu__title .el-submenu__icon-arrow {
  display: block;
}

</style>
