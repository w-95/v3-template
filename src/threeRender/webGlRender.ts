import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';

export type ThreeWebGlT = {
    webGLRender: THREE.WebGLRenderer;
    render:  (scene: THREE.Scene, camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) => void
};

export class ThreeRenderWebgl implements ThreeWebGlT{
    public readonly webGLRender: THREE.WebGLRenderer;

    constructor(element: any, width: number, height: number ) {

        this.webGLRender = new THREE.WebGLRenderer({
            canvas: element,
            alpha: true,
            antialias: true,
        });

        this.initSettingWebGl(width, height);
    };

    public render = (scene: THREE.Scene, camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) => {
        requestAnimationFrame(this.render.bind(this, scene, camera));
        // this.controls.update();
        TWEEN.update(); // 更新Tween.js
        this.webGLRender.render(scene, camera);
    };
    
    // 初始化设置webGl
    private initSettingWebGl = ( width: number, height: number ) => {
        // 普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果
        this.webGLRender.toneMapping = THREE.NoToneMapping;
        // 定义渲染器是否在渲染每一帧之前自动清除其输出。
        this.webGLRender.autoClear = false;
        // /// 自定义模式重置
        this.webGLRender.info.autoReset = false;
        // // 是否允许在场景中使用阴影贴图
        this.webGLRender.shadowMap.enabled = false;
        // 定义阴影贴图类型
        this.webGLRender.shadowMap.type = THREE.VSMShadowMap;
        // 渲染器是否应对对象进行排序。默认是true.
        this.webGLRender.sortObjects = true;
        // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
        this.webGLRender.setPixelRatio(window.devicePixelRatio);
        this.webGLRender.setSize(width, height);
    };
}