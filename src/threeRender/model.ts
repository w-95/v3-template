import * as THREE from "three";
import { ElMessage } from 'element-plus/lib/components/index.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import * as TWEEN from '@tweenjs/tween.js';

export type ThreeWebGlT = {
    robotModuleGltf: GLTF | undefined;
    rotateModel: ( angle: number, onUpdate: (object: THREE.Euler, elapsed: number) => void) => void;
};

export class ThreeRenderModel implements ThreeWebGlT{
    public robotModuleGltf: GLTF | undefined;
    private msgInstance: any;

    constructor(object3D: THREE.Object3D) {

        this.loadModule('../src/assets/gltf/scene.gltf').then( (gltf: GLTF) => {
            this.robotModuleGltf = gltf;
            object3D.add(gltf.scene);
            if(this.msgInstance) this.msgInstance.close();
        })
    };

    private loadModule = ( modelSrc: string): Promise<GLTF> => {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load( modelSrc, ( gltf: GLTF ) => {
                this.robotModuleGltf = gltf;
                this.robotModuleGltf.scene.rotateX(THREE.MathUtils.degToRad(90));
                this.robotModuleGltf.scene.scale.set(0.5, 0.5, 0.5);
                resolve(gltf);
            }, () => {
                this.msgInstance = ElMessage({
                    type: 'warning',
                    message: "正在加载模型",
                    duration: 0
                })
            }, function ( error: any ) {
                console.error( '导入失败 -> ', error );
                reject(error)
            } );
        });
    };

    public rotateModel = ( angle: number, onUpdate: (object: THREE.Euler, elapsed: number) => void) => {
        if(this.robotModuleGltf) {
            
            new TWEEN.Tween(this.robotModuleGltf.scene.rotation)
            .to({ y: angle }, 500) // 设置动画目标值和过渡时间（1秒）
            .easing(TWEEN.Easing.Quadratic.Out) // 设置动画缓动函数
            .start() // 开始动画
            .onUpdate(onUpdate);
        };
    }
}