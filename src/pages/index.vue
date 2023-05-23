<template>
  <el-container class="root-container-box">

    <!-- left -->
    <el-aside style="width:auto" class="root-left-aside">
      <LeftMenu></LeftMenu>
    </el-aside>

    <!-- 右侧contation -->
    <el-container class="root-right-container">

      <el-header class="root-el-header">
        <span class="header-logo-text">机器人管理</span>

        <view>
          <Avatar name="伯鑫" :phone="15311339974"  />
        </view>
      </el-header>

      <el-main class="root-right-container-main-box">
        <RouterView></RouterView>
      </el-main>

      <el-footer class="root-right-footer"></el-footer>

    </el-container>

  </el-container>
</template>

<script setup lang="ts">
import LeftMenu from '@/components/menuLeft/index.vue';
import Avatar from "@/components/avatar/index.vue";

</script>

<style scoped lang="scss">
@import url("@/assets/style/index.scss");

</style>