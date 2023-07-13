import * as THREE from "three";
import { TopicMapT, transforms } from '@/interface/foxgloveThree';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { FoxgloveThreeRendererT } from "./render"
import { render } from "vue";

export type ThreeCameraT = {
    // mesh: THREE.Mesh | null
    // // 地图材质
    // mapMaterial: THREE.MeshBasicMaterial  | null
    // // 放地图的平面几何体
    // mapGeometry: THREE.PlaneGeometry | null
    getCamera: (renderType: "3D" | "2D") => THREE.PerspectiveCamera | THREE.OrthographicCamera
};

export const cameraFov = 45;
const UNIT_X = new THREE.Vector3(1, 0, 0);
const UNIT_Z = new THREE.Vector3(0, 0, 1);
const PI_2 = Math.PI / 2;

export class ThreeRenderCamera implements ThreeCameraT{
    private perspectiveCamera: THREE.PerspectiveCamera;
    private orthographicCamera: THREE.OrthographicCamera;
    private cameraGroup: THREE.Group;

    constructor(cameraWidth: number, cameraHeight: number, scene: THREE.Scene) {

        // this.perspectiveCamera = new THREE.PerspectiveCamera(45, width / height, 1, 500);
        this.perspectiveCamera = new THREE.PerspectiveCamera(75, cameraWidth / cameraHeight, .1, 500);
        this.orthographicCamera = new THREE.OrthographicCamera();
        this.cameraGroup = new THREE.Group();
        this.cameraGroup.position.set(0, 0, 0)
        this.cameraGroup.lookAt(scene.position);
        this.cameraGroup.quaternion.set(0, 0, 0, 1);

        this.cameraGroup.add(this.perspectiveCamera);

        scene.add(this.cameraGroup);
    };

    // 获取当前使用的相机
    public getCamera = (renderType: "3D" | "2D") :THREE.PerspectiveCamera | THREE.OrthographicCamera => renderType === "3D" ? this.perspectiveCamera : this.orthographicCamera;

    // 切换相机
    public checkCamera = (renderType: "3D" | "2D", controls: OrbitControls, scene: THREE.Scene, width: number, height: number) :THREE.PerspectiveCamera | THREE.OrthographicCamera => {
        renderType === '2D'? this.initSettingCamera2D(controls, width, height): this.initSettingCamera3D(controls, scene, width, height);
        return this.getCamera(renderType);
    };

    // 初始化设置3D相机
    private initSettingCamera3D = ( controls: OrbitControls, scene: THREE.Scene, width: number, height: number ) => {
        const targetOffset = new THREE.Vector3();
        targetOffset.fromArray([0, 0, 0]);
        const tempSpherical = new THREE.Spherical();
        const phi = THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(controls.getPolarAngle()));
        const theta = -THREE.MathUtils.degToRad(THREE.MathUtils.radToDeg(-controls.getAzimuthalAngle()));
        tempSpherical.set(controls.getDistance(), phi, theta);
      
        this.perspectiveCamera.position.setFromSpherical(tempSpherical).applyAxisAngle(UNIT_X, PI_2);
        this.perspectiveCamera.position.add(targetOffset);
      
        this.perspectiveCamera.quaternion.setFromEuler(new THREE.Euler().set(phi, 0, theta, "ZYX"));
        this.perspectiveCamera.fov = cameraFov;
        this.perspectiveCamera.near = 0.5;
        this.perspectiveCamera.far = 5000;
        this.perspectiveCamera.aspect = width / height;
        this.perspectiveCamera.updateProjectionMatrix();
      
        controls.target.copy(targetOffset);
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;
      
        // 设置相机位置
        this.perspectiveCamera.position.set(13, 15, 10)
        this.perspectiveCamera.lookAt(scene.position);
    };
      
    // 初始化设置2D相机
    private initSettingCamera2D = ( controls: OrbitControls, width: number, height: number ) => {
        const targetOffset = new THREE.Vector3();
        targetOffset.fromArray([0, 0, 0]);
        const phi = THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(controls.getPolarAngle()));
        const theta = -THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(-controls.getAzimuthalAngle()));
        const curPolarAngle = THREE.MathUtils.degToRad(phi);
        controls.minPolarAngle = controls.maxPolarAngle = curPolarAngle;
      
        this.orthographicCamera.position.set(targetOffset.x, targetOffset.y, 5000 / 2);
        this.orthographicCamera.quaternion.setFromAxisAngle(UNIT_Z, theta);
        this.orthographicCamera.left = (-controls.getDistance() / 2) * (width / height);
        this.orthographicCamera.right = (controls.getDistance() / 2) * (width / height);
        this.orthographicCamera.top = controls.getDistance() / 2;
        this.orthographicCamera.bottom = -controls.getDistance() / 2;
        this.orthographicCamera.near = 0.5;
        this.orthographicCamera.far = 5000;
        this.orthographicCamera.updateProjectionMatrix();
    };
}