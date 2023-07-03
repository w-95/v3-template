/**
 * 轨道控制器 相关
 * @author Wang BoXin <w96_16888@163.com>
 * @timer 2023.07.03
 */

import * as THREE from "three";
import { FoxgloveThreeRenderer } from './foxgloveThree';

/**
 * 初始化设置webGl渲染器
 * @param this 
 */
export const initWebGal = function (this: FoxgloveThreeRenderer) {
    console.log("初始化渲染器")
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
    this.webGLRender.setSize(this.offsetWH.width, this.offsetWH.height);
}