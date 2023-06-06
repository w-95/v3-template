<template>
    <div class="header-card-item-box">
        <img :src="avatar" />
        <div class="header-card-right">
            消毒任务总量
        </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps({
    avatar: {
        type: String,
        defalut: ""
    },
});

const { avatar } = props
</script>

<style scoped lang="scss">
.header-card-item-box{
    width: 100%;
    height: 100%;
    border: 1px solid red;
    display: flex;

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 1px solid red;
    }

    .header-card-right{
        flex: 1;
        height: 100%;

    }
}
</style>