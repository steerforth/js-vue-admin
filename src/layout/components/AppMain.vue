<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- TODO <keep-alive>会进行组件缓存,可配合页面的 tabs-view 标签导航使用 -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    //只要保证 key唯一性,在如增加，编辑页面共用组件时，保证路由切换时都会重新渲染触发钩子了
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
