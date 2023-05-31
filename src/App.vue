<script setup lang="ts">

</script>

<template>
  <div id="app-root">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'">
        <component :is="Component" class="animate__animated animate__fadeIn" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss">
.test-color {
  color: $test-color;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.bottom-ment-item-9 > .el-sub-menu__title,
.bottom-ment-item-3 > .el-sub-menu__title,
.bottom-ment-item-2 > .el-sub-menu__title,
.bottom-ment-item-4 > .el-sub-menu__title,
.bottom-ment-item-5 > .el-sub-menu__title,
.bottom-ment-item-6 > .el-sub-menu__title{
  background: var(--el-sub-menu-bg);
}
.bottom-ment-item-9-sub > .el-menu-item-group__title,
.bottom-ment-item-2-sub > .el-menu-item-group__title,
.bottom-ment-item-3-sub > .el-menu-item-group__title,
.bottom-ment-item-4-sub > .el-menu-item-group__title,
.bottom-ment-item-5-sub > .el-menu-item-group__title,
.bottom-ment-item-6-sub > .el-menu-item-group__title{
  padding: 0 !important;
}

.micon-tuichu{
  font-size: 16px;
}
</style>
