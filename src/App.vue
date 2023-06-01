

<template>
  <div id="app-root">

    <GlobalLoading></GlobalLoading>

    <router-view v-slot="{ Component, route }" class="test">
      <transition
        :duration="0"
        :mode="route.meta.mode"
        :enter-active-class="route.meta.transition"
        :leave-active-class="route.meta.transitionOut">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<script setup lang="ts">
import GlobalLoading from "@/components/globalLoading/index.vue";
</script>

<style lang="scss">
@import url("@/assets/style/global.scss");
</style>
