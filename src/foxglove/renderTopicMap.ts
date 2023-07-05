/**
 * 渲染地图图像相关
 * @author Wang BoXin <w96_16888@163.com>
 * @timer 2023.07.03
 */

import * as THREE from 'three';

import { TopicMapT } from '@/interface/foxgloveThree';
import { getMapBase64 } from "@/utils/index"

// 染色器
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  float gray = color.r * 255.0; // 使用纹理中的红色通道作为灰度值

  vec4 finalColor;
  if (gray <= 126.0) {
    finalColor = vec4(114.0 / 255.0, 142.0 / 255.0, 189.0 / 255.0, 1.0);
  } else if (gray >= 130.0 && gray <= 255.0) {
    finalColor = vec4(235.0 / 255.0, 244.0 / 255.0, 254.0 / 255.0, 1.0);
  } else {
    finalColor = vec4(1.0, 1.0, 1.0, 1.0);
  }

  gl_FragColor = finalColor;
}
`;

/**
 * @class renderTopicMap
 */
export class renderTopicMap {
  // 自定义着色器
  private planeMaterial: THREE.ShaderMaterial | null | THREE.MeshBasicMaterial;
  private grayPlaneMesh: THREE.Mesh | null;
  // // 地图载体 平面几何体
  private grayPlaneGeometry: THREE.PlaneGeometry | null;

  constructor() {
    this.planeMaterial = null;

    this.grayPlaneMesh = null;
    this.grayPlaneGeometry = null;
  }

  public initMap = (
    scene: THREE.Scene,
    mapInfo: TopicMapT,
    object3D: THREE.Object3D
  ) => {
    if (!scene || !mapInfo) {
      throw new Error(`缺少scene、mapInfo参数.`);
    };

    const { data, info } = mapInfo;
    const width = info.width;
    const height = info.height;
    
    const grayImageInfo = getMapBase64(data, width, height);

    // base64的纹理方式贴图
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      grayImageInfo?.base64Str? grayImageInfo?.base64Str: '',
      (texture) => {
        // 纹理加载成功的回调函数
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    
        // 创建材质，并将纹理贴图应用到材质的 map 属性上
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    
        // 创建平面几何体，并应用材质
        const geometry = new THREE.PlaneGeometry(width / 100, height / 100);
        const mesh = new THREE.Mesh(geometry, material);

        object3D.add(mesh);
      },
      undefined,
      (error) => {
        // 纹理加载失败的回调函数
        console.error("纹理加载失败", error);
      }
    );
  };
}
