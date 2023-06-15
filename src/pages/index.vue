<template>
  <el-container class="root-container-box">

    <!-- left -->
    <el-aside style="width:auto" class="root-left-aside">
      <LeftMenu></LeftMenu>
    </el-aside>

    <!-- 右侧contation -->
    <el-container class="root-right-container">

      <el-header class="root-el-header">
        <Header></Header>
      </el-header>

      <el-main class="root-right-container-main-box">
        <!-- <RouterView ></RouterView> -->
        <router-view v-slot="{ Component, route }" class="test">
          <transition
            :duration="0"
            :mode="route.meta.mode"
            :enter-active-class="route.meta.transition"
            :leave-active-class="route.meta.transitionOut">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <el-footer class="root-right-footer"></el-footer>

    </el-container>

  </el-container>
</template>

<script setup lang="ts">

import Header from "@/components/header/index.vue";
import LeftMenu from '@/components/menuLeft/index.vue';

</script>

<style scoped lang="scss">
@import url("@/assets/style/index.scss");

</style>