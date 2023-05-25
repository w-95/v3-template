<template>
    <el-menu-item :index="index" :class="[`bottom-ment-item-${index}`]">
        <el-icon v-if="isShowIcon">
            <icon :path-name="title" />
        </el-icon>
        <template #title>{{ title }}</template>
    </el-menu-item>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import icon from "./icon.vue";

const props = defineProps({
    index: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ""
    },
    isShowIcon: {
        type: Boolean,
        default: true
    }
});

const { index, title } = props;

</script>

<style scoped lang="scss">

.bottom-ment-item-1{
    top: 0px;
    left: 0;
    width: 100%;
}
.bottom-ment-item-10{
    font-weight: bold;
    margin-top: 250px;
}
</style>