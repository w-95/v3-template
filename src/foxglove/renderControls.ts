/**
 * 轨道控制器 相关
 * @author Wang BoXin <w96_16888@163.com>
 * @timer 2023.07.03
 */

import * as THREE from "three";
import { FoxgloveThreeRenderer } from './foxgloveThree';

/**
 * 初始化轨道控制器
 * @TODO 如有特殊需要请创建自定义controls
 * @param this FoxgloveThreeRenderer
 */
export const initControls = function (this: FoxgloveThreeRenderer) {
    this.controls.screenSpacePanning = false; // only allow panning in the XY plane
    this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    this.controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    this.controls.touches.ONE = THREE.TOUCH.PAN;
    this.controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

    this.controls.keys = { LEFT: "KeyA", RIGHT: "KeyD", UP: "KeyW", BOTTOM: "KeyS" };
    this.controls.listenToKeyEvents(this.threeRenderDom);

    // this.controls.enableRotate = true;  // 允许旋转
    // this.controls.enableZoom = false;   // 禁用缩放
    // this.controls.enablePan = true;     // 允许平移
};

/**
 * 轨道控制器change事件
 */
export const controlsChange = function (){
    console.log("轨道控制器 change 事件！！！")
};

export const handleCameraMove = function () {

}