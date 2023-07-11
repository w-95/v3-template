import * as THREE from "three";
import { TopicMapT, transforms } from '@/interface/foxgloveThree';

import { getMapBase64 } from '@/utils/index';

export type ThreeMapT = {
    // mesh: THREE.Mesh | null
    // // 地图材质
    // mapMaterial: THREE.MeshBasicMaterial  | null
    // // 放地图的平面几何体
    // mapGeometry: THREE.PlaneGeometry | null
};

export class ThreeRenderMap implements ThreeMapT{
    private mesh: THREE.Mesh | null;
    private mapMaterial: THREE.MeshBasicMaterial  | null;
    private mapGeometry: THREE.PlaneGeometry | null;

    constructor(mapInfo: TopicMapT, mapObject3D: THREE.Object3D) {
        this.mapMaterial = null;
        this.mapGeometry = null;
        this.mesh = null;
        
        const { data, info } = mapInfo;
        const { width, height, resolution, origin } = info;
        const [mw, mh] = [width * resolution, height * resolution];

        const grayImageInfo = getMapBase64(data, width, height);

        // base64的纹理方式贴图
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            grayImageInfo?.base64Str ? grayImageInfo?.base64Str : '',
            (texture) => {
                // 纹理加载成功的回调函数
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
        
                // 创建材质，并将纹理贴图应用到材质的 map 属性上
                this.mapMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        
                // 创建平面几何体，并应用材质
                this.mapGeometry = new THREE.PlaneGeometry(mw, mh);
                // this.mapGeometry.computeBoundingSphere();
                this.mesh = new THREE.Mesh(this.mapGeometry, this.mapMaterial);
                this.mesh.castShadow = true;
                this.mesh.receiveShadow = true;

                // mapObject3D.position.set(-origin.position.x, -origin.orientation.y, -origin.position.z);
                // mapObject3D.quaternion.set(origin.orientation.x, origin.orientation.y, origin.orientation.z, origin.orientation.w);
                mapObject3D.add(this.mesh);
                mapObject3D.updateMatrixWorld();
            },
            undefined,
            (error) => {
              // 纹理加载失败的回调函数
              console.error('纹理加载失败', error);
            }
        );
    };

    updateMap(transforms: Map<string, transforms>) {
        this.dispose();
    };

    dispose() {
        this.mapGeometry?.dispose();
        this.mapMaterial?.dispose();
    }
}