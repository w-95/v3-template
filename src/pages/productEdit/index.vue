<template>
    <div class="prot-edit-box">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane v-for="tab in productEditTabs" :key="tab.id" :label="tab.label" :name="tab.name">
                
                <attrTab v-if="activeName===tabName.attr"></attrTab>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import attrTab from './attrTab.vue';

import { productEditTabs } from '@/data';

import { tabName } from "@/interface/enum";

const route = useRoute();

const activeName = ref(productEditTabs[0].name);
const handleClick = () => {

}

onMounted(() => {
    
    const query = route.query;

    // 如果有设置默认值就选中tab
    if(query.defalutTab) {
        activeName.value = productEditTabs[query.defalutTab - 1].name
    }
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
</style>