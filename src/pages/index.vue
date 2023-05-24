<template>
  <el-container class="root-container-box">

    <!-- left -->
    <el-aside style="width:auto" class="root-left-aside">
      <LeftMenu></LeftMenu>
    </el-aside>

    <!-- 右侧contation -->
    <el-container class="root-right-container">

      <el-header class="root-el-header">
        <div>
          <span class="header-logo-text">机器人管理</span>
          <el-popover placement="bottom" trigger="click">
            <template #reference>
              <Avatar :name="userInfo? userInfo.realName: ''" :phone="userInfo? userInfo.mobile: 15311339974"  />
            </template>
            <div class="user-action-view">

            </div>

          </el-popover>
        </div>
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
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();

const userInfo = globalStore.userInfo;

</script>

<style scoped lang="scss">
@import url("@/assets/style/index.scss");

</style>