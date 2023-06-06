<template>
    <el-sub-menu :index="index" class="bottom-ment-item-9">
        <template #title>
            <el-icon>
                <Themes-icon />
            </el-icon>
            <span>{{ $t('menuLeft.' + title) }}</span>
        </template>

        <el-menu-item-group class="bottom-ment-item-9-sub">
            <el-menu-item index="9-1">
                <Colors :colors="THEME_DEFAULT"></Colors>
                <el-switch :value="themeType === theme.defaultTheme" class="mt-2"
                    style="margin-left: 24px; max-width: 45px; min-width: 35px;" inline-prompt :active-icon="Check"
                    :inactive-icon="Close" @change="themeChange(theme.defaultTheme)" />
            </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group class="bottom-ment-item-9-sub">
            <el-menu-item index="9-2">
                <Colors :colors="THEME_DARK"></Colors>

                <el-switch :value="themeType === theme.dark" class="mt-2"
                    style="margin-left: 24px;max-width: 45px; min-width: 35px;" inline-prompt :active-icon="Check"
                    :inactive-icon="Close" @change="themeChange(theme.dark)" />
            </el-menu-item>
        </el-menu-item-group>
    </el-sub-menu>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';

import { Check, Close } from '@element-plus/icons-vue';

import { theme } from "@/interface/enum";
import { useThemeStore } from "@/store/theme";

import themeObj from "@/utils/themes";
import { themeVar } from "@/data/index";

import { THEME_DARK, THEME_DEFAULT } from "@/data/themems";

import ThemesIcon from "@/components/themesIcon/index.vue";
import Colors from "@/components/colors/index.vue";

const themeType: Ref<theme> = ref(theme.defaultTheme);
const store = useThemeStore();

const props = defineProps({
    index: {
        type: String,
        default: '0'
    },
    title: {
        type: String,
        default: ""
    },
})

onMounted(() => {
    initTheme();
});

// 初始化主题
const initTheme = () => {
    const storeTheme = store.getSystemTheme;
    themeType.value = storeTheme || theme.defaultTheme;
    const themeConfig = themeObj[themeType.value];

    Object.keys(themeConfig).map((item) => {
        document.documentElement.style.setProperty(item, (themeConfig as any)[item])
    });
}

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

const { index, title } = props;

</script>

<style scoped lang="scss">

.bottom-ment-item-7,
.bottom-ment-item-8,
.bottom-ment-item-9 {
    // position: absolute;
    // bottom: 50px;
    width: 100%;
}
</style>