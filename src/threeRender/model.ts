import * as THREE from "three";
import { ElMessage } from 'element-plus/lib/components/index.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import URDFLoader, { URDFRobot } from 'urdf-loader'

import * as TWEEN from '@tweenjs/tween.js';

export type ThreeWebGlT = {
    robotModuleGltf: GLTF | undefined;
    robotModuleUrdf: URDFRobot | undefined;
    rotateModel: ( angle: number, onUpdate: (object: THREE.Euler, elapsed: number) => void) => void;
};

export class ThreeRenderModel implements ThreeWebGlT{
    public robotModuleGltf: GLTF | undefined;
    public robotModuleUrdf: URDFRobot | undefined;
    private msgInstance: any;

    constructor(object3D: THREE.Object3D) {

        this.loadModule('../src/assets/gltf/scene.gltf').then( (gltf: GLTF) => {
            this.robotModuleGltf = gltf;
            object3D.add(gltf.scene);
            if(this.msgInstance) this.msgInstance.close();
        })
    };
    

    private loadUrdfModule = ( modelSrc: string): Promise<URDFRobot> => {
        const manager = new THREE.LoadingManager();
        const loader = new URDFLoader( manager );
        return new Promise((resolve, reject) => {
            loader.load(
                'https://x.droid.ac.cn/devtest/robot2.urdf',                    // The path to the URDF within the package OR absolute
                urdf => {
                    this.robotModuleUrdf = urdf;
                    this.robotModuleUrdf.rotateX(THREE.MathUtils.degToRad(90));
                    this.robotModuleUrdf.scale.set(0.2, 0.2, 0.2);
                    resolve(urdf);
                }
              );
        });
    };

    private loadModule = ( modelSrc: string): Promise<GLTF> => {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load( modelSrc, ( gltf: GLTF ) => {
                this.robotModuleGltf = gltf;
                this.robotModuleGltf.scene.rotateX(THREE.MathUtils.degToRad(90));
                this.robotModuleGltf.scene.scale.set(0.2, 0.2, 0.2);
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
            .to({ y: angle }, 1500) // 设置动画目标值和过渡时间（1秒）
            .easing(TWEEN.Easing.Quadratic.Out) // 设置动画缓动函数
            .start() // 开始动画
            .onUpdate(onUpdate);

            return;
        };

        if(this.robotModuleUrdf) {
            new TWEEN.Tween(this.robotModuleUrdf.rotation)
            .to({ y: angle }, 1500) // 设置动画目标值和过渡时间（1秒）
            .easing(TWEEN.Easing.Quadratic.Out) // 设置动画缓动函数
            .start() // 开始动画
            .onUpdate(onUpdate);
        }
    }
}