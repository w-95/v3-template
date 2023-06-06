<template>
    <el-sub-menu :index="index" :class="[`bottom-ment-item-${index}`]">
        <template #title>
            <el-icon>
                <icon :path-name="title" />
            </el-icon>
            <span>{{ $t(`menuLeft.${lang}.name`) }}</span>
        </template>

        <el-menu-item-group v-for="(sub, idx) in subMenuChild" :key="sub.name" :class="[`bottom-ment-item-${index}-sub`]">
            <el-menu-item :index="index + '-' + (idx + 1)">
                <span>{{ $t(`menuLeft.${lang}.child.${sub.lang}`) }}</span>
            </el-menu-item>
        </el-menu-item-group>
    </el-sub-menu>
</template>

<script lang="ts" setup>
import { PropType, defineProps } from 'vue';
import { MenuT } from '@/interface/menu';

import icon from "./icon.vue";

const props = defineProps({
    index: {
        type: String,
        default: '1'
    },
    title: {
        type: String,
        default: ""
    },
    subMenuChild: {
        type: Array as PropType<MenuT[]>,
        default: () => []
    },
    lang: {
        type: String,
        default: ""
    }
});

const { index, title, subMenuChild } = props;

</script>

<style scoped lang="scss"></style>