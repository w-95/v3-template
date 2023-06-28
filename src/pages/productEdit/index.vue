<template>
    <div class="prot-edit-box">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane v-for="tab in productEditTabs" :key="tab.id" :label="tab.label" :name="tab.name">
                
                <div v-if="activeName === tab.name && tab.name === tabName.attr">
                    <attrTab :memberId="memberId" ></attrTab>
                </div>

                <div v-if="activeName === tab.name && tab.name === tabName.control">
                    <controlTab :memberId="memberId" ></controlTab>
                </div>

                <div v-if="activeName === tab.name && tab.name === tabName.propaganda">
                    <foxglove :memberId="memberId" ></foxglove>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { tabName } from "@/interface/enum";

import { useGlobalStore } from '@/store/global';

import { productEditTabs } from '@/data';

import attrTab from './attrTab.vue';
import controlTab from './controlTab.vue';
import foxglove from "@/components/foxglove/index.vue";
import { TabsPaneContext } from "element-plus/lib/components/tabs/src/constants"

const route = useRoute();
const globalStore = useGlobalStore();
const memberId = globalStore.userInfo?.id;

const activeName = ref('');
const handleClick = (tab: TabsPaneContext) => {
    activeName.value = tab.props.name as tabName;
}

onMounted(() => {
    
    const query = route.query;

    // 如果有设置默认值就选中tab
    activeName.value = query.defalutTab? productEditTabs[query.defalutTab - 1].name: productEditTabs[0].name;
})
</script>


<style lang="scss" scoped>
.prot-edit-box {
    width: 100%;
    height: 100%;
    background-color: #FFF;
    border-radius: 16px;
    padding: 20px 20px;
    box-sizing: border-box;
    overflow-y: scroll;
}

.demo-tabs{
    height: 100%;
    display: flex;
    flex-direction: column;
    :deep(.el-tabs__content) {
        border: 1px solid pink;
        flex: 1;
        overflow-y: scroll;
    }

    :deep(.el-tabs__content > div:nth-of-type(3)) {
        height: 100%;
    }

    :deep(.el-tabs__content > div:nth-of-type(3) > div) {
        height: 100%;
    }

    ::-webkit-scrollbar {
        width: 0;
        height: 10px;
    }
}
</style>