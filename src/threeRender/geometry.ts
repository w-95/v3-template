import * as THREE from "three";

import { TopicScanT, NormalizedLaserScan, Time, Pose, transforms } from '@/interface/foxgloveThree';
import { robotInfoT } from "./render";

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
    drawPoint: (message: TopicScanT) => void;
    pointGroup: THREE.Group
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
    public pointGroup: THREE.Group;
    private pointCloud: THREE.Points | undefined;

    constructor() {
        this.positionsGeometry = new Float32Array();
        this.colorsGeometry = new Float32Array();
        this.pointGroup = new THREE.Group();
        this.pointCloudGeometry = new THREE.BufferGeometry();
        this.pointCloudMaterial = new THREE.PointsMaterial({
            size: 3, // 点的大小
            vertexColors: true, // 开启顶点颜色
            sizeAttenuation: false
            // color: 0xffffff,
        });

        this.pointCloudGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionsGeometry, 3));
        this.pointCloudGeometry.setAttribute('color', new THREE.BufferAttribute(this.colorsGeometry, 3));

        this.pointCloud = new THREE.Points(this.pointCloudGeometry, this.pointCloudMaterial);
        // const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(90));
        // this.pointCloud.rotation.copy(initialRotation)
        this.pointGroup.add(this.pointCloud);
    };

    public drawPoint = (message: TopicScanT): Promise<THREE.Group> => {
        return new Promise((resole, reject) => {
            const { angle_increment, angle_min, ranges } = message;
        
            this.positionsGeometry = new Float32Array(ranges.length * 3);
            this.colorsGeometry = new Float32Array(ranges.length * 3);
    
            let colors = new Float32Array(message.ranges.length * 3);

            if( ranges.length && this.pointCloud ) {
                ranges.forEach((range, index) => {
                    const angle = message.angle_min + index * message.angle_increment;
                    // const angle = THREE.MathUtils.degToRad(message.angle_min + index * message.angle_increment);

                    // 将极坐标转换为笛卡尔坐标
                    const x = range * Math.cos((angle)); // 计算 x 坐标
                    const y = range * Math.sin(angle); // 计算 y 坐标
                    let transformedPoint = new THREE.Vector3(x, y, 0);
                    
                    this.positionsGeometry[index * 3] = transformedPoint.x;
                    this.positionsGeometry[index * 3 + 1] = transformedPoint.y;
                    this.positionsGeometry[index * 3 + 2] = 0;
                
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
                resole(this.pointGroup)
            }
        })
        
    };
}