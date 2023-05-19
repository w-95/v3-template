<template>
  <el-container class="root-container-box">

    <!-- left -->
    <el-aside style="width:auto" class="root-left-aside">
      <LeftMenu></LeftMenu>
    </el-aside>

    <!-- 右侧contation -->
    <el-container>

      <el-header style="background-color: #545c64;">Header</el-header>

      <el-main class="root-right-container-main-box">
        <RouterView></RouterView>
      </el-main>

      <el-footer class="root-right-footer"></el-footer>

    </el-container>

  </el-container>
</template>

<script setup lang="ts">
import LeftMenu from '@/components/menuLeft/index.vue';

</script>

<style scoped lang="scss">
@import url("@/assets/style/index.scss");
</style>