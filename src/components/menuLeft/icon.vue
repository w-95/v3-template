<template>
    <HomeFilled v-if="pathName === '产品管理'" />
    <Document  v-if="pathName === '消毒机器人'" />
    <Van v-if="pathName === '配送机器人'" />
    <IconMenu v-if="pathName === '版本管理'" />
    <StarFilled v-if="pathName === '客户管理'" />
    <UserFilled v-if="pathName === '用户中心'" />
    <Setting v-if="pathName === 'Settings'" />
    <div v-if="pathName === 'Themes'"> 123</div>
    <img src="/src/assets/images/newlogo1.png" class="logo-img" v-if="pathName === ''" />
</template>

<script setup lang="ts">
import { defineProps } from "vue";


import {
    Document,
    Van,
    Setting,
    HomeFilled,
    UserFilled,
    Menu as IconMenu,
    StarFilled,
} from '@element-plus/icons-vue';

const props = defineProps({
    pathName: {
        type: String,
        default: ""
    }
});

const { pathName } = props;
</script>
