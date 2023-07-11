<template>
    <div class="tab-3-box" id="tab-3-box">
        <canvas id='canvas-box' style="background-color: black;"></canvas>
    </div>
</template>

<script lang="ts" setup>
// import moment from 'moment';
import { ref, Ref, nextTick } from 'vue';
import { useFoxgloveSocket } from '@/hooks/useFoxgloveSocket';

import { rosNumber } from "@/data/foxgloveConfig";

// import { FoxgloveThreeRenderer, FoxgloveThreeRendererT } from "@/foxglove/foxgloveThree";
import { FoxgloveThreeRenderer, FoxgloveThreeRendererT } from "@/threeRender/render";

const linkUrl = `${import.meta.env.VITE_API_FOXGLOVE_SOCKET}?rosNumber=${encodeURIComponent(rosNumber)}`;

// const startConnectTime = moment().format('YYYY-MM-DD HH:mm:ss');
let renderer: Ref<FoxgloveThreeRendererT | null> =  ref(null);
const foxgloveClient:any = ref(null);

nextTick(() => {
    setTimeout(() => {
        const canvas: any = document.getElementById('canvas-box');
        const canvasParent: any = document.getElementById('tab-3-box');

        
        if(canvas && canvasParent && canvasParent.offsetWidth && !foxgloveClient.value) {
            const width = canvasParent.offsetWidth;
            const height = canvasParent.offsetHeight;

            canvas.width = width;
            canvas.height = height;
            renderer.value = new FoxgloveThreeRenderer({threeRenderDom: canvas, width, height});

            initPlayer();
        }
    }, 0);
});

const initPlayer = () => {
    if( renderer.value ) {
        const { client } = useFoxgloveSocket(linkUrl, rosNumber, {
            mapDataChange: renderer.value.topicMapChage,
            scanDataChange: renderer.value.topicScanChange,
            topicTfChange: renderer.value.topicTfChange
        });
        foxgloveClient.value = client;
    }
};

</script>

<style scoped lang="scss">
.tab-3-box {
    width: 100%;
    height: 100%;
}
</style>