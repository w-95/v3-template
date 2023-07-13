import * as THREE from "three";

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export type ThreeControlsT = {
};

export class ThreeRenderControls implements ThreeControlsT{
    public controls: OrbitControls;
    private isCtrlPressed: boolean;

    constructor( camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, webGl: THREE.WebGLRenderer) {
        this.controls = new OrbitControls(camera, webGl.domElement);
        this.isCtrlPressed = false;
        this.initSetttingControls(webGl.domElement);

        
    };
    
    // 初始化设置轨道控制器
    private initSetttingControls = (threeRenderDom: HTMLCanvasElement) => {
        this.controls.screenSpacePanning = false; // only allow panning in the XY plane
        this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        this.controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
        this.controls.touches.ONE = THREE.TOUCH.PAN;
        this.controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

        // this.controls.keys = { LEFT: "KeyA", RIGHT: "KeyD", UP: "KeyW", BOTTOM: "KeyS" };
        this.controls.listenToKeyEvents(threeRenderDom);
        // this.controls.enableRotate = false;  // 允许旋转
        this.controls.enableZoom = true;   // 禁用缩放
        // this.controls.enablePan = false;     // 允许平移
        // this.controls.enablePan = false; // 禁用鼠标拖动平移

        // 监听键盘按下事件
        threeRenderDom.addEventListener('keydown', (event) => {
            if (event.keyCode === 17) { // 17代表Ctrl键的键码
                this.isCtrlPressed = true;
                this.controls.enableRotate = false; // 禁用控制器
            }
        });
        
        // 监听键盘释放事件
        threeRenderDom.addEventListener('keyup', (event) => {
            if (event.keyCode === 17) {
                this.isCtrlPressed = false;
                this.controls.enableRotate = true; // 启用控制器
            }
        });
    };
}