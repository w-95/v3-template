import * as THREE from "three";
import { TopicMapT, transforms } from '@/interface/foxgloveThree';

import { getMapBase64 } from '@/utils/index';

type ThreeMapT = {
    mesh: THREE.Mesh | null;
    initMapMesh: (mapInfo: TopicMapT) => Promise<THREE.Mesh>
};

export class ThreeRenderMap implements ThreeMapT{
    public mesh: THREE.Mesh | null;
    private mapMaterial: THREE.MeshBasicMaterial  | null;
    private mapGeometry: THREE.PlaneGeometry | null;

    constructor() {
        this.mapMaterial = null;
        this.mapGeometry = null;
        this.mesh = null;
    };

    public initMapMesh = (mapInfo: TopicMapT):Promise<THREE.Mesh> => {
        return new Promise((resolve, reject) => {
            const { data, info } = mapInfo;
            const { width, height, resolution } = info;
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
                    this.mapGeometry = new THREE.PlaneGeometry(mw, mh, 10, 10);
                    this.mesh = new THREE.Mesh(this.mapGeometry, this.mapMaterial);
                    // this.mesh.rotateX(180)
                    this.mesh.castShadow = true;
                    this.mesh.receiveShadow = true;

                    resolve(this.mesh)
                },
                undefined,
                (error) => {
                  // 纹理加载失败的回调函数
                  console.error('纹理加载失败', error);
                  reject(error);
                }
            );
        })
        
    };

    dispose() {
        this.mapGeometry?.dispose();
        this.mapMaterial?.dispose();
    }
}