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

import { FoxgloveThreeRenderer, FoxgloveThreeRendererT } from "@/foxglove/foxgloveThree";
import * as THREE from "three";

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
            return;
            // 创建渲染器
            const webGLRender = new THREE.WebGLRenderer({antialias: true, canvas: canvas});

            // 创建场景
            const scene = new THREE.Scene()
            scene.add(new THREE.AxesHelper(5)); // 显示坐标轴
            const gridHelper = new THREE.GridHelper(5, 5); // 参数为网格的尺寸和每个网格的大小
            scene.add(gridHelper);


            // 创建相机 透视摄像机
            const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, .1, 500);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            camera.position.z = 5;

            // 创建立方体
            const geometry = new THREE.BoxGeometry(1, 1, 1); 

            // 设置立方体受灯光影响的材质
            // const material = new THREE.MeshPhongMaterial({ color: 0x44aa88, emissive: '', fog: true, specular: 'red' });
            // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88});

            // 添加网格
            // const cube = new THREE.Mesh(geometry, material);
            // scene.add( cube );

            const makeInstance = (geometry: THREE.BufferGeometry, colorOptions: THREE.MeshPhongMaterialParameters, x: number) => {
                // 创建受灯光影响的材质
                const material = new THREE.MeshPhongMaterial({...colorOptions});
        
                const cube = new THREE.Mesh(geometry, material);
                scene.add(cube);
            
                cube.position.x = x;
            
                return cube;
            };

            const cubes = [
                makeInstance(geometry, { color: 0x8844aa, emissive: '', fog: true, specular: 'green' }, -2),
                makeInstance(geometry, { color: 0x44aa88, emissive: '', fog: true, specular: 'red' },  0),
                makeInstance(geometry, { color: 0xaa8844, emissive: '', fog: true, specular: 'pink' },  2),
            ];

            // 创建平行光灯光
            const light = new THREE.DirectionalLight(0xFFFFFF, 1);
            light.position.set(-1, 2, 4);
            scene.add(light);

            webGLRender.setSize( canvas.clientWidth, canvas.clientHeight );

            const animate = () => {
                requestAnimationFrame( animate );
                // cube.rotation.x += 0.01;
                // cube.rotation.y += 0.01;
                // webGLRender.render( scene, camera );
    
                cubes.forEach((cube, ndx) => {
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                    
                });
                webGLRender.render( scene, camera );
            };

            // 渲染
            animate();
            }
    }, 0);
});

const initPlayer = () => {
    if( renderer.value ) {
        const { client } = useFoxgloveSocket(linkUrl, rosNumber, {
            mapDataChange: renderer.value.topicMapChage,
            scanDataChange: renderer.value.topicScanChange
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