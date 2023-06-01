<script setup lang="ts">

</script>

<template>
  <div id="app-root">
    <router-view v-slot="{ Component, route }">
      <transition
        :duration="500"
        :enter-active-class="route.meta.transition"
        :leave-active-class="route.meta.transitionOut">
        <component :is="Component" />
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

.user-ipt .el-input__wrapper, .pwd-ipt .el-input__wrapper{
    background-color: rgba(255, 255, 255, 0.07);
    border: none;
    box-shadow: 0 0 0 0px var(--el-input-border-color,var(--el-border-color)) inset;
}

.user-ipt .el-input__inner, .pwd-ipt .el-input__inner{
  color: #FFF;
}

.user-ipt .el-input__inner::placeholder, .pwd-ipt .el-input__inner::placeholder {
  color: #FFF;
}

.root-right-container-main-box .animate__animated{
    animation-duration: 0s
}
</style>
