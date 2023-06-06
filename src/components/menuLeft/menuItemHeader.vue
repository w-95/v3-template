<template>
    <el-menu-item :index="index" :class="[`bottom-ment-item-${index}`]">
        <el-icon class="menu-header-icon">
            <Icon path-name="headerIcon" />
        </el-icon>
        <template #title class="test">{{ $t(`systemName`) }}</template>
    </el-menu-item>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import Icon from "./icon.vue";

const props = defineProps({
    index: {
        type: String,
        default: '1'
    }
});

const { index } = props;

</script>

<style scoped lang="scss">

.menu-header-icon{
    margin-right: 15px;
}
.menu-header{
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
}

.bottom-ment-item-1 {
    font-weight: bold;
    font-size: 18px;
}
</style>