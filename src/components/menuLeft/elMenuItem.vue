<template>
    <el-menu-item :index="index" :class="[`bottom-ment-item-${index}`]" @click="gotoChange">
        <el-icon v-if="isShowIcon">
            <Icon :path-name="iconName" />
        </el-icon>
        <template #title>{{ getTitle($t(`menuLeft.${title}`)) }}</template>
    </el-menu-item>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";
import { useI18n } from 'vue-i18n';

import Icon from "./icon.vue";

const props = defineProps({
    index: {
        type: String,
        default: '3'
    },
    iconName: {
        type: String,
        default: ""
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

const { tm } = useI18n();

const { index, title } = props;

const emits = defineEmits(['menuChange']);

const gotoChange = () => emits('menuChange', { name: '' });

const getTitle = ( lTitle: string ) => {
    const obj: any = tm('menuLeft');

    if(title && obj[title]) {
        return lTitle
    };
    return title;
};

</script>

<style scoped lang="scss">
.bottom-ment-item-1{
    top: 0px;
    left: 0;
    width: 100%;
}
.bottom-ment-item-100{
    font-weight: bold;
    margin-top: 250px;
}


</style>