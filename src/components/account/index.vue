<template>
    <div class="account-box">
        <div v-for="(item, index) in accounts" :key="index" class="account-item" @click="actionAccount(item)">
            <el-icon v-html="item.icon"></el-icon>

            <div class="account-title">{{ $t(item.titleKey) }}</div>


        </div>
    </div>
</template>

<script lang="ts" setup>
import { accounts } from '@/data';
import { useGlobalStore } from "@/store/global";

const glbalStore = useGlobalStore();

const actionAccount = (item: { type: string }) => {
    const { type } = item;
    switch (type) {
        case 'logOut':
            glbalStore.signOut();
            break;
    
        default:
            break;
    }
};

</script>

<style scoped lang="scss">
.account-item{
    width: 100%;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    box-sizing: border-box;
    background: #FFF;
    border-radius: 8px;
}

.account-item:hover {
    cursor: pointer;
    background: var(--el-menu-hover-bg-color);
    transition: all .3s;
}

.account-title{
    margin-left: 20px;
    font-size: 14px;
}
</style>