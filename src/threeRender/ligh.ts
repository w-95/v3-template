import * as THREE from "three";
import { FoxgloveThreeRendererT } from "./render"

export type ThreeLighT = {};

export class ThreeRenderLight implements ThreeLighT{
    private directionalLight: THREE.DirectionalLight;
    private hemiLight: THREE.HemisphereLight;

    constructor(scene: THREE.Scene) {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
        this.initSettingDirLight(scene);
    };

    private initSettingDirLight = (scene: THREE.Scene) => {
        this.directionalLight.position.set(1, 2, 1);
        this.directionalLight.castShadow = true;
        this.directionalLight.layers.enableAll();
    
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.bias = -0.00001;

        scene.add(this.directionalLight);
        scene.add(this.hemiLight)
    };
}