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

          <div class="header-right">
            <!-- 中英文切换 -->
            <div class="languages-box">
              <div :class="['lang-en', activeLang === 'en'? 'active-lang-en': '']" @click="checkLang('en')">A</div>
              <div :class="['lang-zh', activeLang === 'zh'? 'active-lang-zh': '']" @click="checkLang('zh')">文</div>
              <div :class="[activeLang === 'en'? 'text-bg-en': 'text-bg-zh']">
                <div class="speed-lang"></div>
              </div>
            </div>

            <!-- 头像 -->
            <el-popover placement="bottom" trigger="click" width="230">
              <template #reference>
                <Avatar :name="userInfo? userInfo.realName: ''" :phone="userInfo? userInfo.mobile: '18888888888'"  />
              </template>
              <div class="user-action-view">
                <Account></Account>
              </div>
            </el-popover>
          </div>
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
import { computed } from 'vue';
import LeftMenu from '@/components/menuLeft/index.vue';
import Avatar from "@/components/avatar/index.vue";
import Account from "@/components/account/index.vue";

import { useGlobalStore } from '@/store/global';
import { useLocaleStore } from '@/store/locales';

const globalStore = useGlobalStore();
const localStore = useLocaleStore();

const userInfo = globalStore.userInfo;

const checkLang = (lang: string) => {
  localStore.setLocale(lang);
};

const activeLang = computed(() => localStore.locale);

</script>

<style scoped lang="scss">
@import url("@/assets/style/index.scss");

</style>