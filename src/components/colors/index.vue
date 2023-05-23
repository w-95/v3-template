<template>
    <div class="colors-box">
        <div v-for="(color, index) in colors" :key="index" :style="{'background-color': `${color}`, 'left': index * 14 + 'px'}"></div>
    </div>
</template>

<script lang="ts">
export default({
    props: {
        colors: {
            require: true,
            type: Array,
            default: () => []
        }
    },

    setup({ colors}) {
        return {
            colors
        }
    }
})
</script>

<style scoped lang="scss">
.colors-box {
    width: 100%;
    height: 32px;
    position: relative;
    display: flex;
    align-items: center;

    div{
        top: 7px;
        position: absolute;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        border: 1px solid #22272b;
    }
}
</style>