<template>
  <div class="navTree" :class="{'hide':!show}">
    <div class="title">{{ title }}</div>
    <!-- <el-menu
      v-if="TreeData.length === 0"
      default-active="1-1"
      :default-openeds="['1']"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-submenu index="1">
        <template slot="title">
          <span>所有的</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">未分类<span class="num">274</span></el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-2">
          <template slot="title">产品需求<span class="num">105</span></template>
          <el-menu-item index="1-2-1">新功能<span class="num">75</span></el-menu-item>
          <el-menu-item index="1-2-2">优化需求<span class="num">14</span></el-menu-item>
        </el-submenu>
        <el-menu-item-group>
          <el-menu-item index="1-3">技术需求<span class="num">3</span></el-menu-item>
        </el-menu-item-group>

      </el-submenu>

    </el-menu> -->

    <el-tree
      v-if="show"
      :data="TreeData"
      :props="defaultProps"
      node-key="id"
      :default-expanded-keys="['1-1']"
      :default-expand-all="true"
      @node-click="handleNodeClick"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <i :class="['custom-icon', data.icon]" />
        <span>{{ data.label }}</span>
        <span class="selfNum">{{ data.num }}</span>
        <span class="selfIcon el-icon-more" @click="moreClick(data)" />

        <drapDown :show.sync="data.showTopMenu" :width="106">
          <div v-for="(item , idx ) in dropDownData[data.position]" :key="idx" :class="item.className">{{ item.name }}</div>
        </drapDown>
      </div>
    </el-tree>

    <div v-if="isAbleClose" class="hideBtn" @click="hidemenu">
      <i :class="{'el-icon-arrow-left':!show ,'el-icon-arrow-right':show }" />
    </div>

  </div>
</template>
<script>

import drapDown from '@/components/drapdownMenu'

export default {
  components: { drapDown },
  props: {
    title: {
      type: String
    },
    TreeData: {
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
              position: 'third',
              showTopMenu: false,
              children: [
                {
                  label: '新功能',
                  num: '3',
                  position: 'third',
                  showTopMenu: false,
                  children: []
                },
                {
                  label: '优化需求',
                  num: '4',
                  position: 'third',
                  showTopMenu: false,
                  children: []
                }
              ]
            },
            {
              label: '技术需求',
              num: '',
              position: 'third',
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
          top: [{ name: '创建子分类', className: '' }],
          sub: [{ name: '创建需求', className: '' }],
          third: [{ name: '创建需求', className: 'border_bottom' }, { name: '创建子分类', className: '' }, { name: '修改分类', className: '' }, { name: '删除分类', className: '' }]
        }
      }
    }
  },
  data() {
    return {
      show: true,
      defaultProps: {
        children: 'children',
        label: 'label',
        icon: 'icon'
      },
      showTopMenu: true
    }
  },
  methods: {
    handleOpen() {

    },
    handleClose() {

    },
    hidemenu() {
      this.show = !this.show
      this.$emit('show', this.show)
    },
    handleNodeClick() {

    },
    moreClick(data) {
      console.log('wqewqe', data)
    //   data.showTopMenu = true
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
        float: left;
        background-color: #fff;
        margin-right: 15px;
        border: none;
        box-shadow: 0 0 10px rgba(128,145,165,0.2);
        border-radius: 2px;
        position: relative;
        .title {
                padding: 20px 20px 5px;
                font-size: 16px;
                color: #3f4a56;
                font-weight: normal;
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
      &__expand-icon{ display: none;}
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
