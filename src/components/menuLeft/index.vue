<template>
    <el-menu default-active="2" :style="{ 'width': isCollapse ? 'auto' : '280px' }" class="el-menu-vertical-demo"
        :collapse="isCollapse" @open="handleOpen" @close="handleClose">
        <el-menu-item index="1" class="bottom-menu-item-first" @click="setIsCollapse">
            <el-icon>
                <img src="/src/assets/images/newlogo1.png" class="logo-img" />
            </el-icon>
            <!-- <template #title>
                <img src="/src/assets/images/logo-text.png" class="logo-text" />
            </template> -->
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>Navigator One</span>
            </template>

            <el-menu-item-group>
                <template #title><span>Group One</span></template>
                <el-menu-item index="2-1">item one</el-menu-item>
                <el-menu-item index="2-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
                <el-menu-item index="2-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3">
            <el-icon><icon-menu /></el-icon>
            <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="4" disabled>
            <el-icon>
                <document />
            </el-icon>
            <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="5">
            <el-icon>
                <setting />
            </el-icon>
            <template #title>Navigator Four</template>
        </el-menu-item>
        <el-menu-item index="6" class="bottom-menu-item-last" @click="setIsCollapse">
            <el-icon>
                <span class="icon iconfont zhankai-you zhy" v-show="isCollapse">&#xe635;</span>
            </el-icon>
            <el-icon>
                <span class="icon iconfont zhankai-zuo zhz" v-show="!isCollapse">&#xe636;</span>
            </el-icon>
        </el-menu-item>

        <el-menu-item index="7" @click="setIsCollapse" class="bottom-ment-item-7">
            <template #title>SETTINGS</template>
        </el-menu-item>

        <el-menu-item index="8" class="bottom-ment-item-8">
            <el-icon>
                <Setting />
            </el-icon>
            <template #title>Settings</template>
        </el-menu-item>

        <el-sub-menu index="9" class="bottom-ment-item-9">
            <template #title>
                <el-icon>
                    <Themes-icon />
                </el-icon>
                <span>Themes</span>
            </template>

            <el-menu-item-group class="bottom-ment-item-9-sub">
                <el-menu-item index="9-1">
                    <Colors :colors="THEME_DARK"></Colors>
                    <el-switch :value="themeType === theme.defaultTheme" class="mt-2" style="margin-left: 24px" inline-prompt :active-icon="Check"
                        :inactive-icon="Close" @change="themeChange(theme.defaultTheme)" />
                </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group class="bottom-ment-item-9-sub">
                <el-menu-item index="9-2">
                    <Colors :colors="THEME_DEFAULT"></Colors>
                    <el-switch :value="themeType === theme.dark" class="mt-2" style="margin-left: 24px" inline-prompt :active-icon="Check"
                        :inactive-icon="Close" @change="themeChange(theme.dark)" />
                </el-menu-item>
            </el-menu-item-group>

        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>

import { ref, onMounted, Ref } from "vue";
import { Check, Close } from '@element-plus/icons-vue';
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue';

import ThemesIcon from "@/components/themesIcon/index.vue";
import Colors from "@/components/colors/index.vue";

import { THEME_DARK, THEME_DEFAULT } from "@/data/themems";
import { themeVar } from "@/data/index";

import {theme} from "@/interface/enum";
import { useThemeStore } from "@/store/theme";

import themeObj from "@/utils/themes";

const store = useThemeStore();

const isCollapse = ref(false);
const themeType:Ref<theme> = ref(theme.defaultTheme);

// 初始化当前的主题
onMounted(() => {
    const storeTheme = store.getSystemTheme;
    themeType.value = storeTheme || theme.defaultTheme;
    const themeConfig = themeObj[themeType.value];

    Object.keys(themeConfig).map((item) => {
      document.documentElement.style.setProperty(item, (themeConfig as any)[item])
    })
});

// 更换主题
const themeChange = (value: theme) => {
    themeType.value = value;
    localStorage.setItem(themeVar, value);
    store.systemTheme = value;
    const themeConfig = themeObj[value];
    Object.keys(themeConfig).map((item) => {
      document.documentElement.style.setProperty(item, (themeConfig as any)[item])
    })
};

const handleOpen = () => {

};

const handleClose = () => {

};

const setIsCollapse = () => {
    isCollapse.value = !isCollapse.value;
};

</script>

<style scoped lang="scss">
.el-menu-vertical-demo {
    position: relative;
    height: 100%;
    transition: all .3s;
    border: none;
}

.zhy,
.zhz {
    font-size: 24px;
    color: black;
}

.bottom-menu-item-first {
    height: 60px;
}

.bottom-menu-item-last,
.bottom-ment-item-7,
.bottom-ment-item-8,
.bottom-ment-item-9 {
    position: absolute;
    bottom: 50px;
    width: 100%;
}

.bottom-ment-item-7 {
    bottom: 300px;
    font-weight: bold;
}

.bottom-ment-item-8 {
    bottom: 250px;
}

.bottom-ment-item-9 {
    bottom: 200px;
}

.logo-img {
    width: 40px;
    height: 40px;
}

.logo-text {
    width: 220px;
    margin-left: 10px;
}

.logo-text-end {
    color: #FFF;
    font-size: 18px;
    // z-index: 99;
}
</style>