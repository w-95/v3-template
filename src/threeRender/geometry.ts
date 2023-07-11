import * as THREE from "three";

import { TopicScanT, NormalizedLaserScan, Time, Pose, transforms } from '@/interface/foxgloveThree';

const tempColor = { r: 0, g: 0, b: 0, a: 0 };
const v4 = new THREE.Vector4();
const v2 = new THREE.Vector2();
const kRedVec4 = new THREE.Vector4(0.13572138, 4.6153926, -42.66032258, 132.13108234);
const kGreenVec4 = new THREE.Vector4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
const kBlueVec4 = new THREE.Vector4(0.1066733, 12.64194608, -60.58204836, 110.36276771);
const kRedVec2 = new THREE.Vector2(-152.94239396, 59.28637943);
const kGreenVec2 = new THREE.Vector2(4.27729857, 2.82956604);
const kBlueVec2 = new THREE.Vector2(-89.90310912, 27.34824973);
const startColor = new THREE.Color(0xff0000); // 绿色
const middleColor = new THREE.Color(0x00ff2e)
const endColor = new THREE.Color(0xffa500); // 橙色

const normalizeRosLaserScan = (message: TopicScanT): NormalizedLaserScan => {
    return {
        timestamp: normalizeTime(message.header?.stamp),
        frame_id: message.header?.frame_id ?? '',
        pose: emptyPose(),
        start_angle: message.angle_min ?? 0,
        end_angle: message.angle_max ?? 0,
        range_min: message.range_min ?? -Infinity,
        range_max: message.range_max ?? Infinity,
        ranges: normalizeFloat32Array(message.ranges),
        intensities: normalizeFloat32Array(message.intensities),
    };
};

const normalizeTime = (time: Partial<Time> | undefined): Time => {
    if (!time) {
        return { sec: 0, nsec: 0 };
    }
    return { sec: time.sec ?? 0, nsec: time.nsec ?? 0 };
};
  
const emptyPose = (): Pose => {
    return { position: { x: 0, y: 0, z: 0 }, orientation: { x: 0, y: 0, z: 0, w: 1 } };
};
  
const normalizeFloat32Array = (array: unknown): Float32Array => {
    if (array == undefined) {
        return new Float32Array(0);
    } else if (array instanceof Float32Array) {
        return array;
    } else if (
        Array.isArray(array) ||
        array instanceof ArrayBuffer ||
        array instanceof Float64Array
    ) {
        return new Float32Array(array);
    } else {
        return new Float32Array(0);
    }
};
  
const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
};
  
const SRGBToLinear = (c: number): number => {
    return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
};

type ThreeGeometryT = {
    // positionsGeometry: Float32Array | [];
    // colorsGeometry: Float32Array | [];
    // pointCloudGeometry: THREE.BufferGeometry;
    // pointCloudMaterial: THREE.PointsMaterial;
    // pointGroup: THREE.Group;
    // pointCloud: THREE.Points;
};

export class ThreeRenderGeometry implements ThreeGeometryT{

    // 每个点有3个坐标（x, y, z）
    private positionsGeometry: Float32Array; 
    // 创建颜色缓冲区  每个点有4个颜色通道（r, g, b, a）
    private colorsGeometry: Float32Array; 
    // 点云几何体
    private pointCloudGeometry: THREE.BufferGeometry;
    // 点云材质
    private pointCloudMaterial: THREE.PointsMaterial;
    private pointGroup: THREE.Group;
    private pointCloud: THREE.Points | undefined;

    constructor( message: TopicScanT, laserObject3D: THREE.Object3D, topicTfTransforms: transforms ) {
        const laserScan = normalizeRosLaserScan(message);
        const { angle_increment, angle_min, ranges } = message;

        this.positionsGeometry = new Float32Array(ranges.length * 3);
        this.colorsGeometry = new Float32Array(ranges.length * 3);
        this.pointCloudGeometry = new THREE.BufferGeometry();
        this.pointCloudMaterial = new THREE.PointsMaterial({
            size: 2, // 点的大小
            vertexColors: true, // 开启顶点颜色
            sizeAttenuation: false
            // color: 0xffffff,
        });

        this.pointCloudGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionsGeometry, 3));
        this.pointCloudGeometry.setAttribute('color', new THREE.BufferAttribute(this.colorsGeometry, 3));

        this.pointGroup = new THREE.Group();

        let colors = new Float32Array(message.ranges.length * 3);
        if( topicTfTransforms.transform ) {
            ranges.forEach((range, index) => {
                const angle = message.angle_min + index * message.angle_increment;
    
                // 将极坐标转换为笛卡尔坐标
                const x = range * Math.cos(angle); // 计算 x 坐标
                const y = range * Math.sin(angle); // 计算 y 坐标
                const z = 0; // 在 "map" 坐标系中，激光传感器的高度为 0
    
                let transformedPoint = new THREE.Vector3(x, y, z);
                let rotation = new THREE.Quaternion(
                    topicTfTransforms.transform.rotation.x,
                    topicTfTransforms.transform.rotation.y,
                    topicTfTransforms.transform.rotation.z,
                    topicTfTransforms.transform.rotation.w
                );
                transformedPoint.applyQuaternion(rotation);

                transformedPoint.add(new THREE.Vector3(
                    topicTfTransforms.transform.translation.x,
                    topicTfTransforms.transform.translation.y,
                    topicTfTransforms.transform.translation.z
                )); // 应用平移
            
                this.positionsGeometry[index * 3] = transformedPoint.x;
                this.positionsGeometry[index * 3 + 1] = transformedPoint.y;
                this.positionsGeometry[index * 3 + 2] = transformedPoint.z;
            
                // 计算颜色的插值
                var t = (range - message.range_min) / (message.range_max - message.range_min); // 范围插值参数
                var color;
            
                if (t < 0.5) {
                    // 在前半段范围内，从红色到绿色渐变
                    color = new THREE.Color().lerpColors(startColor, middleColor, t * 2);
                } else {
                    // 在后半段范围内，从绿色到橙色渐变
                    color = new THREE.Color().lerpColors(middleColor, endColor, (t - 0.5) * 2);
                };
            
                // 更新颜色
                //  colorAttribute.setXYZW(range, color.r, color.g, color.b, 1);
                colors[index * 3] = color.r;
                colors[index * 3 + 1] = color.g;
                colors[index * 3 + 2] = color.b;
                // colors[index * 3 + 3] = 1;
              });
            //   this.pointCloudGeometry.computeBoundingSphere();
              this.pointCloudGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionsGeometry, 3));
              this.pointCloudGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
              this.pointCloud = new THREE.Points(this.pointCloudGeometry, this.pointCloudMaterial);
              this.pointGroup.add(this.pointCloud);
              laserObject3D.add(this.pointGroup);
        }
    }
}