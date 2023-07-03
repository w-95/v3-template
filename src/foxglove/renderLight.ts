/**
 * 灯光相关
 * @author Wang BoXin <w96_16888@163.com>
 * @timer 2023.07.03
 */

import * as THREE from "three";
import { FoxgloveThreeRenderer } from './foxgloveThree';

/**
 * 初始胡平行光
 * @param this FoxgloveThreeRenderer
 */
export const initDirLight = function (this: FoxgloveThreeRenderer) {
    this.directionalLight.position.set(1, 1, 1);
    this.directionalLight.castShadow = true;
    this.directionalLight.layers.enableAll();

    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 500;
    this.directionalLight.shadow.bias = -0.00001;
};

export const initHemiLight = function(this: FoxgloveThreeRenderer) {
    this.hemiLight.layers.enableAll();
}