<template>
    <div>
        <div class="avatar-box animate__animated animate__fadeIn" :style="{ 'background': bgColor, 'color': fontColor, 'width': width + 'px', 'height': height + 'px' }">{{ userName }}</div>
        <!-- <el-avatar v-else shape="square" :size="100" :fit="fit" :src="src" /> -->
    </div>
</template>

<script lang="ts">

import { onMounted, ref } from "vue";
import { stringToColor, getContrastingColor } from "@/utils/index";

export default ({
    props: {
        shape: {
            type: String,
            default: "square"
        },
        size: {
            type: Number || String,
            default: 'default'
        },
        fit: {
            type: String,
            default: 'cover'
        },
        src: {
            type: String,
            required: false,
            default: ""
        },
        name: {
            type: String,
            required: true,
            default: "D"
        },
        phone: {
            type: String,
            required: true,
            default: '18888888888'
        },
        width: {
            type: Number,
            default: 40
        },
        height: {
            type: Number,
            default: 40
        }
    },

    setup(props) {
        let bgColor = ref(stringToColor(''));
        let fontColor = ref(getContrastingColor(bgColor.value));
        let userName = ref("");

        onMounted(() => {
            if (props.name) {
                let name = props.name;
                bgColor.value = stringToColor(name as string);
                fontColor.value = getContrastingColor(bgColor.value);
                userName.value = (name as string).charAt(0);
                console.log(userName)
            };
        });

        return {
            bgColor,
            fontColor,
            userName,
            width: props.width,
            height: props.height
        }
    }
})




</script>

<style scoped lang="scss">
.avatar-box {
    font-size: var(--el-avatar-text-size);
    border-radius: 8px;
    text-align: center;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}
</style>