<template>
    <div class="header-card-item-box">
        <img :src="avatar" />
        <div class="header-card-right">
            <div class="top-title">{{ topTitle }}</div>
            <countTo class="total-count" :startVal="0" :endVal="newTopCount" :duration='2'></countTo>
            <div class="btm-title" v-if="bottmTitle">{{ bottmTitle }}</div>
            <countTo v-if="bottomCount" :style="{color: btmCountColor}" class="total-count" :startVal="0" :endVal='newBottomCount' :duration='2'></countTo>
        </div>
    </div>
</template>

<script lang="ts" setup>
import countTo from "vue-countup-v3";

import { computedEager } from '@vueuse/core';

const props = defineProps({
    avatar: {
        type: String,
        defalut: ""
    },
    topTitle: {
        type: String,
        default: ""
    },
    topCount: {
        type: Number,
        default: 0
    },
    bottmTitle: String || undefined,
    bottomCount: Number || undefined,
    btmCountColor: String || undefined
});


const { avatar } = props;

const newTopCount = computedEager(() => props.topCount);

const newBottomCount = computedEager(() => props.bottomCount || 0);

// watch(() => props.topCount, (newVal, oldVal) => {
//     console.log("newVal", newVal, 'oldVal', oldVal)
// })
</script>

<style scoped lang="scss">
.header-card-item-box {
    width: 100%;
    height: 100%;
    display: flex;

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .header-card-right {
        flex: 1;
        height: 100%;
        margin-left: 24px;
    }
}

.header-card-right{
    .top-title, .btm-title {
        color: #5A687B;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
    }
    .total-count{
        font-size: 40px;
        height: 50px;
        line-height: 50px;
        color: #293A4D;
        font-weight: bold;
    }

    .btm-title{
        margin-top: 40px;
    }
}
</style>