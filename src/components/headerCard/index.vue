<template>
    <div class="header-card-item-box">
        <img :src="avatar" />
        <div></div>
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
}
</style>