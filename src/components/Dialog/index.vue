<template>
  <el-dialog :visible.sync="innerVisible" width="70%" :fullscreen="isfullscreen" :class="{'fullscreen':isfullscreen}" @close="closeThis">
    <div slot="title">
      {{ title }}
      <svg-icon :icon-class="isfullscreen | iconName" class-name="dialogIcon" @click="fullscreen" />
    </div>
    <slot />
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeThis(false)">取 消</el-button>
      <el-button type="primary" @click="closeThis(true)">确 定</el-button>
    </div>
  </el-dialog>

</template>
<script>
export default {
  filters: {
    iconName(val) {
      return val ? 'shouqiquanping' : 'quanping'
    }
  },
  props: {
    title: {
      type: String,
      default: '新建'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerVisible: false,
      innerWidth: '70%',
      isfullscreen: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.innerVisible = val
      },
      immediate: true
    }
  },
  methods: {
    closeThis(bool) {
      // if (bool) this.$emit('confirm')
      this.innerVisible = false
      this.$emit('update:visible', false)
    },
    fullscreen() {
      this.isfullscreen = !this.isfullscreen
    }
  }
}
</script>
<style scoped>
.dialogIcon {
    float: right;
    margin-right: 30px;
    cursor: pointer;
}
.fullscreen >>> .el-dialog {
    height: 100%;
    margin-top: 0 !important;
}
.fullscreen >>> .el-dialog__body{
    height: calc(100% - 124px);
    overflow-y: auto;
}
</style>
