<template>
    <div>
        <div class="avatar-box animate__animated animate__fadeIn" :style="style">{{ userName }}</div>
        <!-- <el-avatar v-else shape="square" :size="100" :fit="fit" :src="src" /> -->
    </div>
</template>

<script lang="ts">

import { onMounted, ref } from "vue";
import { stringToColor, getContrastingColor } from "@/utils/index";
import { px2vw } from "@/utils/index";

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

        let style = `
            background: ${bgColor.value}; 
            color: ${fontColor.value}; 
            width: ${px2vw(props.width)}; 
            height: ${px2vw(props.height)} 
        `;

        return {
            style,
            userName
        }
    }
})




</script>

<style scoped lang="scss">
.avatar-box {
    font-size: 18px;
    border-radius: 8px;
    text-align: center;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}
.avatar-box:hover {
    cursor: pointer;
}

</style>