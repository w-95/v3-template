
import * as THREE from "three";

import { TopicMapT, OffsetWHT, TopicScanT, TopicTfT, transforms, transform } from "@/interface/foxgloveThree";

import { ThreeRenderMap } from "@/threeRender/map";
import { ThreeRenderGrid } from "@/threeRender/grid";
import { ThreeRenderGeometry } from "@/threeRender/geometry";
import { ThreeRenderCamera } from "./camera";
import { ThreeRenderControls } from "./controls";
import { ThreeRenderWebgl } from "./webGlRender";
import { ThreeRenderLight } from "./ligh";
import { ThreeRenderModel } from "./model";

import * as TWEEN from '@tweenjs/tween.js'

import meshLine from 'three.meshline';

export type FoxgloveThreeRendererT = {
    offsetWH: OffsetWHT;
    renderType: '2D' | '3D';
    topicMapInfo:TopicMapT | null;
    threeRenderDom: any;
    scene: THREE.Scene;
    topicMapChage: (message: TopicMapT) => void;
    topicScanChange: (message: TopicScanT) => void;
    topicTfChange: (message: TopicTfT) => void;
};

export type robotInfoT = { x: number, y: number, angle: number, tfMapAngle: number, tfOdomAngle: number, [x:string]: any };

// 相机的视角（fov）
export const cameraFov = 45;

export class FoxgloveThreeRenderer implements FoxgloveThreeRendererT{

    // 可是区域的宽高
    public offsetWH: OffsetWHT;
    // 渲染的类型：2D || 3D
    public renderType: '2D' | '3D';

    // 当前/Map的信息
    public topicMapInfo:TopicMapT | null;
    // 当前/tf的信息
    public topicTfInfo: Map<string, transforms>;
    // 当前 /scan的信息
    public topicScanInfo: TopicScanT | null

    // 当前渲染的canvas元素
    public readonly threeRenderDom: any;
    // 场景
    public scene: THREE.Scene;
    
    // 渲染地图类的实例
    private mapInstance: ThreeRenderMap;
    // 辅助网格类实例
    private gridInstance: ThreeRenderGrid;
    // 渲染激光点云类的实例
    private pointInstance: ThreeRenderGeometry;
    // 相机类实例
    private cameraInstance: ThreeRenderCamera;
    // 轨道控制器类
    private controlsInstance: ThreeRenderControls;
    // webGl渲染器类
    private webGlInstance: ThreeRenderWebgl;
    // 灯光实例
    private lightInstance: ThreeRenderLight;
    // 模型实例
    private modelInstance: ThreeRenderModel;

    // 坐标线 机器人 - odom - map
    private positionLine: any;
    private robotInfo: robotInfoT;

    // 坐标系
    public globalObject3D: THREE.Object3D;
    public mapObject3D: THREE.Object3D;
    public odomObject3D: THREE.Object3D;
    public baseFootprintObject3D: THREE.Object3D;
    public baseLinkObject3D: THREE.Object3D;
    public laserObject3D: THREE.Object3D;

    constructor({ threeRenderDom, width, height }: { threeRenderDom: any, width: number, height: number}) {
        this.offsetWH = { width, height };

        this.renderType = "3D";

        this.topicMapInfo = null;
        this.topicTfInfo = new Map();
        this.topicScanInfo = null;

        this.threeRenderDom = threeRenderDom;

        this.scene = new THREE.Scene();

        this.globalObject3D = new THREE.Object3D();
        this.mapObject3D = new THREE.Object3D();
        this.odomObject3D = new THREE.Object3D();
        this.baseFootprintObject3D = new THREE.Object3D();
        this.baseLinkObject3D = new THREE.Object3D();
        this.laserObject3D = new THREE.Object3D();

        const mapAxes = new THREE.AxesHelper(5);
        const odomAxes = new THREE.AxesHelper(5);
        const baseFootprintAxes = new THREE.AxesHelper(15);
        const baseLinkAxes = new THREE.AxesHelper(5);
        const laserAxes = new THREE.AxesHelper(5);

        this.globalObject3D.add(new THREE.AxesHelper(5))
        this.mapObject3D.add(mapAxes);
        this.odomObject3D.add(odomAxes);
        this.baseFootprintObject3D.add(baseFootprintAxes);
        this.baseLinkObject3D.add(baseLinkAxes);
        this.laserObject3D.add(laserAxes);

        
        this.globalObject3D.add(this.mapObject3D);
        this.mapObject3D.add(this.odomObject3D);
        this.odomObject3D.add(this.baseFootprintObject3D);
        this.baseFootprintObject3D.add(this.baseLinkObject3D);
        this.baseLinkObject3D.add(this.laserObject3D);

        this.cameraInstance = new ThreeRenderCamera(width, height, this.scene);

        const camera = this.cameraInstance.getCamera(this.renderType);

        this.mapInstance = new ThreeRenderMap();
        this.gridInstance = new ThreeRenderGrid();
        this.pointInstance = new ThreeRenderGeometry();
        
        this.webGlInstance = new ThreeRenderWebgl(this.threeRenderDom, width, height);
        this.controlsInstance = new ThreeRenderControls(camera, this.webGlInstance.webGLRender);
        this.lightInstance = new ThreeRenderLight(this.scene);
        this.modelInstance = new ThreeRenderModel(this.mapObject3D);

        this.webGlInstance.render(this.scene, camera)
        

        this.checkRenderType(this.renderType);

        /**
         * @TODO 
         * GridHelper是一个用于显示网格的辅助类，它的网格默认是基于X和Z轴的平面网格。它的网格线默认与Y轴对齐，而X和Z轴是水平平铺的。
         * 而PlaneGeometry是一个平面几何体，它的默认坐标系是基于X、Y和Z轴的。平面几何体的默认位置是位于XZ平面，其法线指向Y轴正方向。
         */
        // const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(180));
        // this.mapObject3D.rotation.copy(initialRotation);
        
        this.positionLine = null;

        this.robotInfo = {
            x: 0,
            y: 0,
            angle: 0,
            tfMapAngle: 0,
            tfOdomAngle: 0
        };
        
        // this.scene.add(new THREE.AxesHelper(5));
        this.scene.add(this.globalObject3D);
    };

    /**
     * foxglove client /map event change id: 2
     * 灰度图像 ---- 地图
     * @param message TopicMapT client接受到的信息
     */
    public topicMapChage = (message: TopicMapT) => {
        this.topicMapInfo = message;

        const { origin, resolution, width, height } = message.info;

        // 加载地图
        const [threeOriginX, threeOriginY] = [width * resolution, height * resolution];
        var position = new THREE.Vector3(threeOriginX / 2 + origin.position.x,  -threeOriginY / 2 - origin.position.y, 0);

        // 设置地图的起点
        this.mapObject3D.position.copy(position);
            
        // // 初始化地图
        this.mapInstance.initMapMesh(message).then((mesh: THREE.Mesh) => {
            this.mapObject3D.add(mesh);
            this.mapObject3D.updateMatrixWorld();
        });
            
        // 添加线 将机器人、map、odom连接起来
        this.createLineToMap_oDom();

        // 设置辅助网格
        // this.mapObject3D.add(this.gridInstance.initGrid(message))
    };

    /**
     * foxglove client /tf event change id: 4
     * 机器人当前位置  旋转等信息
     * @param message 
     */
    public topicTfChange = (message: TopicTfT) => {
        const { transforms } = message;
        
        transforms.forEach((item) => {
            this.topicTfInfo.set(item.header.frame_id, item)
            if(item.header.frame_id === 'map') {
                this.updateObject3D(item.transform, this.odomObject3D, this.mapObject3D);
            }else if(item.header.frame_id === 'odom') {
                this.updateObject3D(item.transform, this.baseFootprintObject3D, this.odomObject3D);
            }else if(item.header.frame_id === 'base_footprint') {
                this.updateObject3D(item.transform, this.baseLinkObject3D, this.baseFootprintObject3D)
            }else if(item.child_frame_id === 'base_link') {
                this.updateObject3D(item.transform, this.laserObject3D, this.baseLinkObject3D);
            }else if(item.child_frame_id === 'laser') {
                // this.updateObject3D(item.transform, this.laserObject3D);
            }
        });
        
        const {robotAngle, x, y, tfOdomAngle} = this.getRototPosition();

        // 更新地图 角度
        new TWEEN.Tween(this.globalObject3D.rotation)
        .to({ x: THREE.MathUtils.degToRad(-90)}, 300)
        // .to({ y:  -Math.round((Math.atan(tfOdomAngle) * 360) / Math.PI), x: THREE.MathUtils.degToRad(-90)}, 300)
        .easing(TWEEN.Easing.Quadratic.Out) // 设置动画缓动函数
        .onUpdate( () => {
            // const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(Math.round((Math.atan(-tfOdomAngle) * 360) / Math.PI)), THREE.MathUtils.degToRad(0));
            // this.mapObject3D.rotation.copy(initialRotation);
        })
        .start();
       
        if(this.modelInstance?.robotModuleGltf) {
            // 更新机器人位置
            const { x: map3Dx, y: map3Dy, z: map3Dz } = this.mapObject3D.position;
            this.modelInstance.robotModuleGltf.scene.position.set(-map3Dx + x, -map3Dy - y, map3Dz);

            // 更新连接机器人线的点位
            this.updateLineToMap_oDom();

            // 旋转机器人
            // this.modelInstance.robotModuleGltf.scene.rotateY(robotAngle);
            const angle = -Math.round((Math.atan(robotAngle) * 360) / Math.PI)
            this.modelInstance.rotateModel(angle, (object: THREE.Euler, elapsed: number) => {
                // this.modelInstance?.robotModuleGltf && this.modelInstance.robotModuleGltf.scene.rotateY(angle);
            })
        };
    };
    
    /**
     * foxglove client /scan event change id: 1
     * @TODO 激光雷达 ---- 点云
     * @param message TopicScanT client接收到的信息
     */
    public topicScanChange = (message: TopicScanT) => {
        this.topicScanInfo = message;

        // 更新点云
        this.pointInstance.drawPoint(message).then((group: THREE.Group) => {
            this.mapObject3D.add(group);
            this.mapObject3D.updateMatrixWorld();
        });
    };

    // 为某个object3D 添加一个label
    private addLabel_object3D = (object: THREE.Object3D, labelName:string, color: string='#010112', position: any) => {
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 50;
        labelCanvas.height = 50;
        labelCanvas.style.backgroundColor = "#FFF";
        const labelContext = labelCanvas.getContext('2d')!;
        labelContext.font = 'Bold 20px ';
        labelContext.fillStyle = color;
        labelContext.fillText(labelName, 0, 20);
        
        // 将Canvas转换为纹理
        var labelTexture = new THREE.Texture(labelCanvas);
        labelTexture.needsUpdate = true;
        
        // 创建Sprite以容纳标签
        var labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
        var labelSprite = new THREE.Sprite(labelMaterial);
        labelSprite.position.copy(position);
        labelSprite.scale.set(3, 3, 3); // 调整Sprite的大小
        
        // 将Sprite附加到Object3D上
        object.add(labelSprite);
    };

    // 根据坐标系关系更新坐标和角度
    private updateObject3D = (transformInfo: transform, Object3D: THREE.Object3D, parentOvjec3D: THREE.Object3D) => {
        if(!this.topicMapInfo) return;

        const { x: tfx, y: tfy, z: tfz} = transformInfo.translation;
        // ElMessage(`${threeOriginX}, : ${threeOriginY}`)
        const { x: px, y: py, z: pz } = parentOvjec3D.position;
        const position = new THREE.Vector3(-px + tfx, -py - tfy, pz + tfz)
        // var quaternion = new THREE.Quaternion(-r.x, -r.y, -r.z, -r.w);
        // 将点云从ROS坐标系转换到Three.js坐标系
        // position.applyQuaternion(this.baseLinkObject3D.quaternion);
        // position.add(this.baseLinkObject3D.position);
        // quaternion.multiply(this.baseLinkObject3D.quaternion);
        
        Object3D.position.copy(position);
        // Object3D.quaternion.copy(quaternion);
    };

    private updateLineToMap_oDom = () => {
        const { robotModuleGltf } = this.modelInstance;

        if(robotModuleGltf) {
            const positions = [
                new THREE.Vector3(robotModuleGltf.scene.position.x, robotModuleGltf.scene.position.y, robotModuleGltf.scene.position.z),
                new THREE.Vector3(this.odomObject3D.position.x, this.odomObject3D.position.y, this.odomObject3D.position.z),
                new THREE.Vector3(-this.mapObject3D.position.x, -this.mapObject3D.position.y, this.mapObject3D.position.z)
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(positions);
            this.positionLine.setGeometry(geometry);
        };
    };

    // 创建机器人、map、odom坐标的线 将它们连起来
    private createLineToMap_oDom = () => {
        if( this.modelInstance?.robotModuleGltf) {
            const { robotModuleGltf } = this.modelInstance;

            const positions = [
                new THREE.Vector3(robotModuleGltf.scene.position.x, robotModuleGltf.scene.position.y, robotModuleGltf.scene.position.z),
                new THREE.Vector3(this.odomObject3D.position.x, this.odomObject3D.position.y, this.odomObject3D.position.z),
                new THREE.Vector3(-this.mapObject3D.position.x, -this.mapObject3D.position.y, this.mapObject3D.position.z)
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(positions);
    
            // 创建线对象
            this.positionLine = new meshLine.MeshLine();
            this.positionLine.setGeometry(geometry);
    
            // 创建线段材质
            const material = new meshLine.MeshLineMaterial({
                color: new THREE.Color(0xffff00),
                lineWidth: .2, // 设置线宽
                dashRatio: 0.95,
                circles: true
            });
    
            // 创建线段网格
            const mesh = new THREE.Mesh(this.positionLine, material);
            // 将线对象添加到场景中
            this.mapObject3D.add(mesh);
        }
    };

    // 获取机器人当前位置
    private getRototPosition = (): { x: number, y: number, robotAngle: number, tfMapAngle: number, tfOdomAngle: number } => {
        const map = this.topicTfInfo.get('map');
        const odom = this.topicTfInfo.get("odom");
        const { info } = this.topicMapInfo!;

        if(odom && map && info) {
            // 获取四元数
            const { x: qx, y: qy, z: qz, w: qw } = odom.transform.rotation; // odom -> basefootprint
            const { x: mx, y: my, z: mz, w: mw } = map.transform.rotation; // map -> odom

            // 获取角度
            const odomAngle = 2 * Math.atan2(Math.sqrt(qx * qx + qy * qy + qz * qz), qw) * (180 / Math.PI);
            const mapAngle = 2 * Math.atan2(Math.sqrt(mx* mx + my * my + mz * mz), mw) * (180 / Math.PI);

            // map => odom 的角度
            const mapAngle_TF = Math.atan2(2 * (mw * mz + mx * my), 1 - 2 * (my * my + mz * mz)) * (180 / Math.PI);
            const odomAngle_TF = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz)) * (180 / Math.PI);

            // 计算机器人的角度
            const robotAngle = mapAngle - odomAngle;

            // TF 关系角度
            const tfAngle = odomAngle_TF + mapAngle_TF;

            // 计算sinθ
            const sin = Math.sin( mapAngle_TF * (Math.PI / 180));

            // 计算cosθ
            const cos = Math.cos( mapAngle_TF * (Math.PI / 180));

            const { x: x1, y: y1 } = odom.transform.translation;
            const { x: tx, y: ty } = map.transform.translation;

            const [ x2, y2 ] = [ x1 * (cos) - y1 * (sin), x1 * (sin) + y1 * (cos)];

            const [x, y] = [x2 + tx, y2 + ty ];

            this.robotInfo = { x, y, angle: robotAngle, tfMapAngle: mapAngle_TF, tfOdomAngle: odomAngle_TF };
            return { x, y, robotAngle, tfMapAngle: mapAngle_TF, tfOdomAngle: odomAngle_TF };
        };
        return { x: 0, y: 0, robotAngle: 0, tfMapAngle: 0, tfOdomAngle: 0 };
    };
    

    // 切换相机
    private checkRenderType = (mode: '2D' | '3D') => {
        this.renderType = mode;
        this.cameraInstance.checkCamera(mode, this.controlsInstance.controls, this.scene, this.offsetWH.width, this.offsetWH.height)
    };

}