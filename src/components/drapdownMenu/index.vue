<template>
  <div>
    <div v-if="showMenu" class="drapdown_menu" :style="{left:left+'px',right:right+'px',width:width+'px'}">
      <slot />
    </div>
    <div v-if="showMenu" class="drapdown_dialog" @click.stop="close" />

  </div>

</template>
<script>
export default {
  props: {
    show: {
      type: Boolean
    },
    left: {
      type: Number,
      default: 0
    },
    right: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      showMenu: false
    }
  },
  watch: {
    show() {
      this.showMenu = this.show
    }
  },
  methods: {
    close() {
      this.showMenu = false
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang="scss"  scoped>
.drapdown_menu {
    position: absolute;
    padding: 5px 0 ;
    background-color: #fff;
    box-shadow: 0 0 6px rgba(0,0,0,0.3);
    z-index: 9999;
    >div{
            padding: 0 15px;
            line-height: 2.4;
            color: #3f4a56;
            text-align: left;
            text-decoration: none;
            white-space: nowrap;
            font-size: 13px;
            cursor: pointer;
            font-weight: normal;
    }
    >div:not(.noHighLight):hover {
        color: #3582fb;
        background: #d7e6fe;
    }
    .noHighLight {
        line-height: 22px;
    }
    ~ .drapdown_dialog {
        position: fixed;
        background-color: transparent;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        z-index: 1010;
    }
}
</style>
