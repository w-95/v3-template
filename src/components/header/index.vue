<template>
    <div>
        <div class="header-nav-box">
            <NavHeader></NavHeader>
        </div>

        <div class="header-right">
            <!-- 中英文切换 -->
            <div class="languages-box">
                <div :class="['lang-en', activeLang === 'en' ? 'active-lang-en' : '']" @click="checkLang('en')">A</div>
                <div :class="['lang-zh', activeLang === 'zh' ? 'active-lang-zh' : '']" @click="checkLang('zh')">文</div>
                <div :class="[activeLang === 'en' ? 'text-bg-en' : 'text-bg-zh']">
                    <div class="speed-lang"></div>
                </div>
            </div>

            <!-- 头像 -->
            <el-popover placement="bottom" trigger="click" width="230">
                <template #reference>
                    <Avatar :name="userInfo ? userInfo.realName.replace('王', '') : ''" :phone="userInfo ? userInfo.mobile : '18888888888'" />
                </template>
                <div class="user-action-view">
                    <Account></Account>
                </div>
            </el-popover>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import Avatar from "@/components/avatar/index.vue";
import Account from "@/components/account/index.vue";
import NavHeader from "@/components/navHeader/index.vue";

import { useGlobalStore } from '@/store/global';
import { useLocaleStore } from '@/store/locales';

const globalStore = useGlobalStore();
const localStore = useLocaleStore();

const userInfo = globalStore.userInfo;

const checkLang = (lang: "zh" | "en") => {
  localStore.setLocale(lang);
};

const activeLang = computed(() => localStore.locale);
</script>

<style lang="scss" scoped>
@import url("@/assets/style/index.scss");
</style>
