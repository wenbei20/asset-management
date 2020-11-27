<template>
  <el-dialog :visible.sync="innerVisible" :width="noFooter ? '50%' : '70%'" :fullscreen="isfullscreen" :class="{'fullscreen':isfullscreen}" :close-on-click-modal="false" @close="closeThis(false)">
    <div slot="title">
      {{ title }}
      <svg-icon :icon-class="isfullscreen | iconName" class-name="dialogIcon" @click="fullscreen" />
    </div>
    <slot />
    <div v-if="!noFooter" slot="footer" class="dialog-footer">
      <el-button :loading="commitLoading" @click="closeThis(false)">取 消</el-button>
      <el-button :loading="commitLoading" type="primary" @click="closeThis(true)">确 定</el-button>
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
    },
    commitLoading: {
      type: Boolean,
      default: false
    },
    noFooter: {
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
      bool ? null : this.$emit('update:visible', false)
      this.$emit('confirm', bool)
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
