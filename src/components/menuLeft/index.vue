<template>
    <el-menu default-active="2" :style="{'width': isCollapse ? 'auto': '300px'}" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
        @close="handleClose">
        <el-menu-item index="0" class="bottom-menu-item-first" @click="setIsCollapse">
            LOGO
        </el-menu-item>
        <el-sub-menu index="1">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>Navigator One</span>
            </template>
            
            <el-menu-item-group>
                <template #title><span>Group One</span></template>
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="3" disabled>
            <el-icon>
                <document />
            </el-icon>
            <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <template #title>Navigator Four</template>
        </el-menu-item>
        <el-menu-item index="5" class="bottom-menu-item-last" @click="setIsCollapse">
            <el-icon>
            <span class="icon iconfont zhankai-you zhy" v-show="isCollapse">&#xe635;</span>
            </el-icon>
            <el-icon>
            <span class="icon iconfont zhankai-zuo zhz" v-show="!isCollapse">&#xe636;</span>
            </el-icon>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>

import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue';


const isCollapse = ref(false);

const handleOpen = () => {

};

const handleClose = () => {

};

const setIsCollapse = () => {
    isCollapse.value = !isCollapse.value;
};

</script>

<style scoped lang="scss">
.el-menu-vertical-demo{
    position: relative;
    width: 100%;
    height: 100%;
    transition: all .3s;
}

.zhy, .zhz{
    font-size: 24px;
    color: black;
}

.bottom-menu-item-first{
    height: 60px;
    background: #545c64;
}
.bottom-menu-item-last{
    position: absolute;
    bottom: 50px;
    width: 100%;
}
</style>