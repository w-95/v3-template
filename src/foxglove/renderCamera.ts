/**
 * 相机相关
 * @author Wang BoXin <w96_16888@163.com>
 * @timer 2023.07.03
 */

import { FoxgloveThreeRendererT, FoxgloveThreeRenderer } from './foxgloveThree';

import * as THREE from 'three';
import { cameraFov } from './foxgloveThree';

const UNIT_X = new THREE.Vector3(1, 0, 0);
const UNIT_Z = new THREE.Vector3(0, 0, 1);
const PI_2 = Math.PI / 2;

/**
 * 切换相机
 * @param this FoxgloveThreeRenderer
 * @param mode 3D or 2D
 */
export const checkRenderType = function (
  this: FoxgloveThreeRenderer,
  mode: Extract<FoxgloveThreeRendererT, 'renderType'>
) {
  this.renderType = mode;
  
  mode === '2D'? initCamera2D.call(this): initCamera3D.call(this);
};

/**
 * 获取相机3D相机 | 2D相机
 * @param this FoxgloveThreeRenderer
 * @returns 相机
 */
export const getCamera = function (this: FoxgloveThreeRenderer):
| THREE.PerspectiveCamera
| THREE.OrthographicCamera {
return this.renderType === '3D' ? this.perspectiveCamera : this.orthographicCamera;
};

/**
 * 初始化3D相机
 * @param this FoxgloveThreeRenderer
 */
export const initCamera3D = function (
  this: FoxgloveThreeRenderer
) {
  const targetOffset = new THREE.Vector3();
  targetOffset.fromArray([0, 0, 0]);
  const tempSpherical = new THREE.Spherical();
  const phi = THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(this.controls.getPolarAngle()));
  const theta = -THREE.MathUtils.degToRad(THREE.MathUtils.radToDeg(-this.controls.getAzimuthalAngle()));
  tempSpherical.set(this.controls.getDistance(), phi, theta);

  this.perspectiveCamera.position.setFromSpherical(tempSpherical).applyAxisAngle(UNIT_X, PI_2);
  this.perspectiveCamera.position.add(targetOffset);

  this.perspectiveCamera.quaternion.setFromEuler(new THREE.Euler().set(phi, 0, theta, "ZYX"));
  this.perspectiveCamera.fov = cameraFov;
  this.perspectiveCamera.near = 0.5;
  this.perspectiveCamera.far = 5000;
  this.perspectiveCamera.aspect = this.offsetWH.width / this.offsetWH.height;
  this.perspectiveCamera.updateProjectionMatrix();

  this.controls.target.copy(targetOffset);

  this.controls.minPolarAngle = 0;
  this.controls.maxPolarAngle = Math.PI;

  // 设置相机位置
  this.perspectiveCamera.position.set(13, 15, 10)
  this.perspectiveCamera.lookAt(this.scene.position);
};

/**
 * 初始化2D相机
 * @param this FoxgloveThreeRenderer
 */
export const initCamera2D = function (
  this: FoxgloveThreeRenderer
) {
  const targetOffset = new THREE.Vector3();
  targetOffset.fromArray([0, 0, 0]);
  const phi = THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(this.controls.getPolarAngle()));
  const theta = -THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(-this.controls.getAzimuthalAngle()));
  const curPolarAngle = THREE.MathUtils.degToRad(phi);
  this.controls.minPolarAngle = this.controls.maxPolarAngle = curPolarAngle;

  this.orthographicCamera.position.set(targetOffset.x, targetOffset.y, 5000 / 2);
  this.orthographicCamera.quaternion.setFromAxisAngle(UNIT_Z, theta);
  this.orthographicCamera.left = (-this.controls.getDistance() / 2) * (this.offsetWH.width / this.offsetWH.height);
  this.orthographicCamera.right = (this.controls.getDistance() / 2) * (this.offsetWH.width / this.offsetWH.height);
  this.orthographicCamera.top = this.controls.getDistance() / 2;
  this.orthographicCamera.bottom = -this.controls.getDistance() / 2;
  this.orthographicCamera.near = 0.5;
  this.orthographicCamera.far = 5000;
  this.orthographicCamera.updateProjectionMatrix();
};


