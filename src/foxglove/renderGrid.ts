/**
 * 网格相关
 * @author Wang BoXin <w96_16888@163.com>
 * @timer 2023.07.03
 */

import { cameraFov } from './foxgloveThree';
import { FoxgloveThreeRenderer } from './foxgloveThree';
import { TopicMapT } from '@/interface/foxgloveThree';
import * as THREE from 'three';

/**
 * 根据图像比例更新网格
 * @param this FoxgloveThreeRenderer
 * @param message socket传递过来的信息  client接受的信息 /map
 * @param camera 当前相机
 */
export const updateGrid = function (
  this: FoxgloveThreeRenderer,
  message: TopicMapT,
  camera: THREE.Camera
) {
  const { info } = message;
  const { width, height, resolution } = info;
  const n = width > height ? height: width;
  this.grid = new THREE.GridHelper( n / 10, 10 );
  this.scene.add(this.grid); // 显示网格
};
