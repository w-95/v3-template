
import * as THREE from "three";
import { CSG } from 'three-csg-ts';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';


import { TopicMapT, OffsetWHT, TopicScanT, TopicTfT, transforms, transform, wayPoint } from "@/interface/foxgloveThree";

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
    topicWayPointChange: (message: wayPoint) => void;
};

type transformAxis = { x: number, y: number, angle: number, parentAngle: number, childAngle: number }
export type robotInfoT = { [x:string]: transformAxis & transforms };

// 相机的视角（fov）
export const cameraFov = 45;
const loader = new GLTFLoader();
export class FoxgloveThreeRenderer implements FoxgloveThreeRendererT{

    // 可是区域的宽高
    public offsetWH: OffsetWHT;
    // 渲染的类型：2D || 3D
    public renderType: '2D' | '3D';

    // 当前/Map的信息 地图信息
    public topicMapInfo:TopicMapT | null;
    // 当前/tf的信息 坐标关系信息
    public topicTfInfo: Map<string, transforms>;
    // 当前 /scan的信息 激光雷达点云信息
    public topicScanInfo: TopicScanT | null;
    // 当前 /waypoint的信息 点位信息
    private wayPoints: wayPoint | null;
    // 存储当前点位的集合
    // private wayPointsArray: 

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
    // 存放点位模型
    private printerGroup: THREE.Group;
    // 地图是否变更
    private isMapChanged: Boolean;

    // 坐标线 机器人 - odom - map
    private positionLine: any;
    private robotInfo:  robotInfoT;

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
        this.wayPoints = null;

        this.threeRenderDom = threeRenderDom;

        this.scene = new THREE.Scene();

        this.globalObject3D = new THREE.Object3D();
        this.mapObject3D = new THREE.Object3D();
        this.odomObject3D = new THREE.Object3D();
        this.baseFootprintObject3D = new THREE.Object3D();
        this.baseLinkObject3D = new THREE.Object3D();
        this.laserObject3D = new THREE.Object3D();

        const mapAxes = new THREE.AxesHelper(2);
        const odomAxes = new THREE.AxesHelper(2);
        const baseFootprintAxes = new THREE.AxesHelper(2);
        const baseLinkAxes = new THREE.AxesHelper(2);
        const laserAxes = new THREE.AxesHelper(2);

        this.globalObject3D.add(new THREE.AxesHelper(10))
        this.mapObject3D.add(mapAxes);
        this.odomObject3D.add(odomAxes);
        this.baseFootprintObject3D.add(baseFootprintAxes);
        this.baseLinkObject3D.add(baseLinkAxes);
        this.laserObject3D.add(laserAxes)

        this.globalObject3D.add(this.mapObject3D);
        this.globalObject3D.add(this.odomObject3D);
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
        this.modelInstance = new ThreeRenderModel(this.globalObject3D);

        this.webGlInstance.render(this.scene, camera);
        
        this.printerGroup = new THREE.Group();
        this.isMapChanged = false;

        this.checkRenderType(this.renderType);

        /**
         * @TODO 
         * GridHelper是一个用于显示网格的辅助类，它的网格默认是基于X和Z轴的平面网格。它的网格线默认与Y轴对齐，而X和Z轴是水平平铺的。
         * 而PlaneGeometry是一个平面几何体，它的默认坐标系是基于X、Y和Z轴的。平面几何体的默认位置是位于XZ平面，其法线指向Y轴正方向。
         */
        // const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(180));
        // this.mapObject3D.rotation.copy(initialRotation);
        
        this.positionLine = null;

        this.robotInfo = {};
        
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
        this.mapObject3D.add(this.gridInstance.initGrid(message))
    };

    /**
     * foxglove client /tf event change id: 4
     * 机器人当前位置  旋转等信息
     * @param message 
     */
    public topicTfChange = (message: TopicTfT) => {
        const { transforms } = message;

        transforms.forEach((item) => {
            this.robotInfo[item.header.frame_id] = { ...item, ...this.getTfParentToChild_xy(item.header.frame_id, item.child_frame_id) };
            
            const { header, child_frame_id, transform } = item;

            this.topicTfInfo.set(header.frame_id, item);

            if(child_frame_id === 'base_footprint') {
                this.updateObject3D(item, this.odomObject3D, item.header.frame_id)
            }else if(child_frame_id === 'base_link') {
                this.updateObject3D(item, this.baseFootprintObject3D, item.header.frame_id);
            }else if(child_frame_id === 'laser') {
                this.updateObject3D(item, this.baseLinkObject3D, item.header.frame_id);
            }
        });
        
        
        const {angle: robotAngle, x, y, childAngle: odomAngle, parentAngle} = this.robotInfo.map;
        // 更新地图 角度
        new TWEEN.Tween(this.globalObject3D.rotation)
        .to({ x: THREE.MathUtils.degToRad(-90), z: THREE.MathUtils.degToRad(-odomAngle)}, 300)
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
            this.modelInstance.robotModuleGltf.scene.position.set(x, y, map3Dz + 0.1);

            // 更新连接机器人线的点位
            this.updateLineToMap_oDom();

            // 旋转机器人
            // this.modelInstance.robotModuleGltf.scene.rotateY(robotAngle);
            const angle = -Math.round((Math.atan(parentAngle + odomAngle) * 360) / Math.PI)
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

        if( !this.mapInstance.mesh || !this.robotInfo.base_link || !this.robotInfo.base_footprint){
            return;
        };

        // 更新点云
        this.pointInstance.drawPoint(message).then((group: THREE.Group) => {
            this.laserObject3D.add(group);
            this.laserObject3D.updateMatrixWorld();
        });
    };

    /**
     * foxglove client /wayPoint event change id: 4
     * @TODO 点位信息
     * @param message TopicwayPoint client收到的信息 
     */
    public topicWayPointChange = (message: wayPoint) => {
        this.wayPoints = message;

        if( !this.mapInstance.mesh ){
            return;
        };

        // 如果地图更新了
        if(this.isMapChanged) {
            this.printerGroup.clear();
        };
        
        if(this.isMapChanged || this.printerGroup.children.length === 0){

            message.points.forEach((point, index) => {
                const position = new THREE.Vector3(point.poses.position.x, -point.poses.position.y, -0.3);
                
                const { point_type, point_id, point_name, poses} = point;
                const { x, y } = poses.position;
                
                switch (point_type) {
                    case 0:
                        loader.load( '../src/assets/pointer/scene.gltf', ( gltf: GLTF ) => {
                            gltf.scene.rotateX(THREE.MathUtils.degToRad(90));
                            gltf.scene.scale.set(0.0001, 0.0001, 0.0001);
                            gltf.scene.position.copy(position);
                            this.printerGroup.add(gltf.scene);
                            new TWEEN.Tween(gltf.scene.position)
                            .to({ z: point.poses.position.z + 0.2 }, 1000) // 目标位置和动画时间
                            .easing(TWEEN.Easing.Bounce.Out) // 弹出效果的缓动函数
                            .delay((index + 1) * 300)
                            .start();

                            new TWEEN.Tween(gltf.scene.scale)
                            .to({ x: .1, y: .1, z: .1 }, 1000)
                            .easing(TWEEN.Easing.Elastic.Out)
                            .delay((index + 1) * 300) // 延迟一段时间再执行缩放动画
                            .start();
                        },
                        () => {},
                        ( error: any ) => {
                            console.error( '导入失败 -> ', error );
                        });
                        break;
                    case 1:
                        this.lightningPoint(point_id, x, -y, point_name, 1000);
                        break;
                    default:
                        break;
                };
            });
        }
        this.globalObject3D.add(this.printerGroup);
    };

    // 添加充电桩点位
    private lightningPoint = (id: number, x: number, y: number, name: string, timer:number) => {
        const scale2=0.2;
        const outterR=1.0;
        const heartH=2.0;
        const innerR=0.5;
        const heartShape = new THREE.Shape();
        heartShape.arc ( 0,0, outterR*scale2, 0, Math.PI, false );
        heartShape.lineTo(0, -heartH*scale2);
        heartShape.lineTo(outterR*scale2, 0);

        //内部闪电
        const shape_c2 = new THREE.Path();
        shape_c2.moveTo(-0.3*scale2,0.5*scale2) //左上角
        shape_c2.lineTo(0.3*scale2,0.5*scale2) //右上角
        shape_c2.lineTo(0.1*scale2,0.1*scale2);
        shape_c2.lineTo(0.3*scale2,-0.1*scale2);
        shape_c2.lineTo(-0.05*scale2,-0.9*scale2) //最下面的点
        shape_c2.lineTo(0*scale2,-0.3*scale2);
        shape_c2.lineTo(-0.3*scale2,0*scale2);
        shape_c2.lineTo(-0.3*scale2,0.5*scale2);
        heartShape.holes.push(shape_c2);

        const extrudeSettings2 = {
            amount:1,
            steps: 1,
            depth: 0.04,
            bevelSize:0.1,
            bevelThickness:0.1,
            bevelSegments:2,
            bevelEnabled:false,
        };

        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings2);
        var bkColor = 0x2DCC6D;

        const heartMesh = new THREE.Mesh(heartGeometry, new THREE.MeshStandardMaterial({ color: bkColor}));//终点颜色
        heartMesh.rotateX(Math.PI /2);
        heartMesh.name='heart';

        const position = new THREE.Vector3(x, y, -.4);
        heartMesh.position.copy(position);
        heartMesh.scale.set(.0001, .0001, .0001);

        this.globalObject3D.add(heartMesh);

        new TWEEN.Tween(heartMesh.position)
        .to({ z: .4 }, 1000) // 目标位置和动画时间
        .easing(TWEEN.Easing.Bounce.Out) // 弹出效果的缓动函数
        .delay(timer)
        .start();

        new TWEEN.Tween(heartMesh.scale)
        .to({ x: 1, y: 1, z: 1 }, 1000)
        .easing(TWEEN.Easing.Elastic.Out)
        .delay(timer) // 延迟一段时间再执行缩放动画
        .start();
    };

    /**
     * 获取某个tf坐标的父坐标轴
     * @param tfName 
     * @returns 
     */
    private get_tf_parent = ( tfName: string ) => {
        if( tfName === "odom" ) {
            return this.topicTfInfo.get("map");
        };

        if( tfName === "base_footprint" ){
            return this.topicTfInfo.get("odom");
        };

        if( tfName === "base_link" ){
            return this.topicTfInfo.get("base_footprint");
        };

        if( tfName === "laser" ){
            return this.topicTfInfo.get("base_link");
        };
        return undefined
    }

    // 更新坐标
    private updateObject3D = (transformInfo: transforms, Object3D: THREE.Object3D, tfName:string) => {
        if (!this.topicMapInfo ) return;

        const tfParent = this.get_tf_parent( tfName );
        const activePoint = this.robotInfo[tfName];

        if(tfParent && activePoint) {
            
            const { x: px, y: py, z: pz } = tfParent.transform.translation;
            const { map, base_footprint, base_link }= this.robotInfo;
            
            const footx = base_footprint?.x ? base_footprint.x : 0;
            const footy = base_footprint?.y ? base_footprint.y : 0;
            const linkx = base_link?.x ? base_link.x : 0;
            const linky = base_link?.y ? base_link.y : 0;

            // 原来是以地图中心点 将odomobject 加到globalobject3D后以一origin为准
            if(tfName === "odom" && map) {
                const position = new THREE.Vector3(activePoint.x + map.x - footx - linkx,  activePoint.y + map.y - footy - linky, pz);
                Object3D.position.copy(position);
                return
            };

            if(tfName === "base_footprint" || tfName === "base_link") {
                const position = new THREE.Vector3(activePoint.x,  activePoint.y, pz);
                Object3D.position.copy(position);
                return;
            };
        };
    };
    

    /**
     * 计算两个父子关系的坐标系的xy  相对于parent 漂了多少 !!这俩坐标系必须是父子级关系
     * @param parentName 父坐标轴的frame_id
     * @param childName 子坐标轴的frame_id
     * @returns 
     * x: x坐标
     * y: y坐标
     * angle: 真正的旋转角度
     * parentAngle: 父TF数据的旋转
     * childAngle: 子TF数据的旋转
     */
    private getTfParentToChild_xy = (parentName: string, childName: string): { x: number, y: number, angle: number, parentAngle: number, childAngle: number } => {
        const parent = this.topicTfInfo.get(parentName);
        const child = this.topicTfInfo.get(childName);
        let pointInfo = { x: 0, y: 0, angle: 0, parentAngle: 0, childAngle: 0 };

        if(parent && child) {
            const { x: parentX, y: parentY, z: parentZ, w: parentW } = parent.transform.rotation;
            const { x: chardX, y: chardY, z: chardZ, w: chardW } = child.transform.rotation; // odom -> basefootprint

            // 获取角度
            const parentAngle = 2 * Math.atan2(Math.sqrt(parentX* parentX + parentY * parentY + parentZ * parentZ), parentW) * (180 / Math.PI);
            const chidlAngle = 2 * Math.atan2(Math.sqrt(chardX * chardX + chardY * chardY + chardZ * chardZ), chardW) * (180 / Math.PI);

            const parentAngle_TF = Math.atan2(2 * (parentW * parentZ + parentX * parentY), 1 - 2 * (parentY * parentY + parentZ * parentZ)) * (180 / Math.PI);
            const childAngle_TF = Math.atan2(2 * (chardW * chardZ + chardX * chardY), 1 - 2 * (chardY * chardY + chardZ * chardZ)) * (180 / Math.PI);

            const angle = parentAngle - chidlAngle;

            // 计算sinθ
            const sin = Math.sin( parentAngle * (Math.PI / 180));

            // 计算cosθ
            const cos = Math.cos( parentAngle * (Math.PI / 180));

            const { x: childTX, y: chldTY } = child.transform.translation;
            const { x: parentTX, y: parentPY } = parent.transform.translation;

            const [ x2, y2 ] = [ childTX * (cos) - chldTY * (sin), childTX * (sin) + chldTY * (cos)];

            // const [x, y] = [x2 + parentTX, y2 + parentPY ];
            const [x, y] = [x2 + parentTX, -y2 - parentPY ];
            pointInfo = { x, y, angle, parentAngle: parentAngle_TF, childAngle: childAngle_TF };
            this.robotInfo[parent.header.frame_id] = { ...this.robotInfo[parent.header.frame_id], ...pointInfo };
        };

        return pointInfo;
    };
    

    // 切换相机
    private checkRenderType = (mode: '2D' | '3D') => {
        this.renderType = mode;
        this.cameraInstance.checkCamera(mode, this.controlsInstance.controls, this.scene, this.offsetWH.width, this.offsetWH.height)
    };

    // 更新线
    private updateLineToMap_oDom = () => {
        const { robotModuleGltf } = this.modelInstance;

        if(robotModuleGltf && this.positionLine) {
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
            this.globalObject3D.add(mesh);
        }
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

}