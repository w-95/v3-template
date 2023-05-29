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
          <span class="header-logo-text">{{ $t(`systemTitle`) }}</span>

          <el-dropdown>
            <span class="el-dropdown-link">
              Language
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in languages" :key="index">
                  <span @click="checkLang(item)">{{ item.title }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-popover placement="bottom" trigger="click">
            <template #reference>
              <Avatar :name="userInfo? userInfo.realName: ''" :phone="userInfo? userInfo.mobile: '18888888888'"  />
            </template>
            <div class="user-action-view"></div>
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
import { useLocaleStore } from '@/store/locales';
import { langs } from "@/locales/index";
// import { langs } from '@/locales';

const globalStore = useGlobalStore();
const localStore = useLocaleStore();

const languages = langs;
const userInfo = globalStore.userInfo;

const checkLang = (lang: { key: string, title: string}) => {
  localStore.setLocale(lang.key);
}

</script>

<style scoped lang="scss">
@import url("@/assets/style/index.scss");

</style>