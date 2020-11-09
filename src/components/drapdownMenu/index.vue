<template>
  <div>
    <div v-if="showMenu" class="drapdown_menu" :style="{left:left+'px',right:right+'px',width:width+'px'}">
      <slot />
    </div>
    <div v-if="showMenu" class="drapdown_dialog" @click="close" />

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
