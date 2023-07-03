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
  const { width, height } = this.offsetWH;

  // 目标宽高 => px
  const targetWidthPx = info.width; 
  const targetHeightPx = info.height;

  const aspectRatio = width / height; // 窗口的宽高比

  const distance = Math.abs(camera.position.z); // 相机距离场景原点的距离
  const sceneWidth = 2 * distance * Math.tan(THREE.MathUtils.degToRad(cameraFov / 2)) * aspectRatio;
  const sceneHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(cameraFov / 2));

  const targetWidth = (targetWidthPx / width) * sceneWidth; // 目标宽度（场景单位）
  const targetHeight = (targetHeightPx / height) * sceneHeight; // 目标高度（场景单位）

  this.grid.scale.set(targetWidth, targetHeight, 1);
};
