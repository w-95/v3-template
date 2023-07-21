
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
    public modeObject3D: THREE.Object3D;

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
        this.modeObject3D = new THREE.Object3D();

        const mapAxes = new THREE.AxesHelper(1);
        const odomAxes = new THREE.AxesHelper(2);
        const baseFootprintAxes = new THREE.AxesHelper(1);
        const baseLinkAxes = new THREE.AxesHelper(1);
        const laserAxes = new THREE.AxesHelper(2);

        this.globalObject3D.add(new THREE.AxesHelper(2))
        this.mapObject3D.add(mapAxes);
        this.odomObject3D.add(odomAxes);
        this.baseFootprintObject3D.add(baseFootprintAxes);
        this.baseLinkObject3D.add(baseLinkAxes);
        this.laserObject3D.add(laserAxes);

        this.globalObject3D.add(this.mapObject3D);
        this.globalObject3D.add(this.odomObject3D);
        this.odomObject3D.add(this.baseFootprintObject3D);
        this.baseFootprintObject3D.add(this.baseLinkObject3D);
        this.baseLinkObject3D.add(this.laserObject3D);
        this.laserObject3D.add(this.modeObject3D);

        this.cameraInstance = new ThreeRenderCamera(width, height, this.scene);

        const camera = this.cameraInstance.getCamera(this.renderType);

        this.mapInstance = new ThreeRenderMap();
        this.gridInstance = new ThreeRenderGrid();
        this.pointInstance = new ThreeRenderGeometry();
        
        this.webGlInstance = new ThreeRenderWebgl(this.threeRenderDom, width, height);
        this.controlsInstance = new ThreeRenderControls(camera, this.webGlInstance.webGLRender);
        this.lightInstance = new ThreeRenderLight(this.scene);
        this.modelInstance = new ThreeRenderModel(this.laserObject3D);

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
        var position = new THREE.Vector3(-(threeOriginX / 2 + origin.position.x),  -threeOriginY / 2 - origin.position.y, 0);
        
        // 设置地图的起点
        this.mapObject3D.position.copy(position);
            
        // 初始化地图
        this.mapInstance.initMapMesh(message).then((mesh: THREE.Mesh) => {
            this.mapObject3D.add(mesh);
            this.mapObject3D.updateMatrixWorld();
        });

        // 设置辅助网格
        this.mapObject3D.add(this.gridInstance.initGrid(message));
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
        
        const { angle: mapAngle, x, y, childAngle: mapChildAngle, parentAngle: mapParentAngle} = this.robotInfo.map;
        const { angle: baseLinkAngle, childAngle: baseLinkChildAngle, parentAngle: baseLinkParentAngle } = this.robotInfo.base_link;
        const { angle: baseFootPrintAngle, childAngle: baseFootPrintChildAngle, parentAngle: baseFootPrintParentAngle } = this.robotInfo.base_footprint;
        const { angle: odomAngle, childAngle: odomChildAngle, parentAngle: odomParentAngle } = this.robotInfo.odom;
        // 更新地图 角度
        new TWEEN.Tween(this.globalObject3D.rotation)
        .to({ x: THREE.MathUtils.degToRad(-90), z: THREE.MathUtils.degToRad(-mapChildAngle)}, 500)
        // .to({ y:  -Math.round((Math.atan(tfOdomAngle) * 360) / Math.PI), x: THREE.MathUtils.degToRad(-90)}, 300)
        .easing(TWEEN.Easing.Quadratic.Out) // 设置动画缓动函数
        .onUpdate( () => {
            // const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(Math.round((Math.atan(-tfOdomAngle) * 360) / Math.PI)), THREE.MathUtils.degToRad(0));
            // this.mapObject3D.rotation.copy(initialRotation);
        })
        .start();

        if(!this.positionLine) {
            // 添加线 将机器人、map、odom连接起来
            this.createLineToMap_oDom();
        }else {
            this.updateLineToMap_oDom();
        };

        console.log("map角度 ---", mapAngle, mapParentAngle, mapChildAngle)
        console.log("odom角度 ---", odomAngle, odomParentAngle, odomChildAngle)
        console.log("footPrint角度 ---", baseFootPrintAngle, baseFootPrintParentAngle, baseFootPrintChildAngle)
        console.log("baselink角度 ---", baseLinkAngle, baseLinkParentAngle, baseLinkChildAngle)

        if(this.modelInstance?.robotModuleGltf) {
    
            // 更新连接机器人线的点位
            this.updateLineToMap_oDom();
    
            // 旋转机器人
            // this.modelInstance.robotModuleGltf.scene.rotateY(robotAngle);
            this.modelInstance.rotateModel(
                THREE.MathUtils.degToRad(-this.getAngle(180 - (mapParentAngle + odomParentAngle + baseFootPrintParentAngle))),
                (object: THREE.Euler, elapsed: number) => {
                // this.modelInstance?.robotModuleGltf && this.modelInstance.robotModuleGltf.scene.rotateY(angle);
            });

            // -Math.round((Math.atan(angle) * 360) / Math.PI)
            const xRotation = THREE.MathUtils.degToRad(0);
            const yRotation = THREE.MathUtils.degToRad(0);
            const zRotation = THREE.MathUtils.degToRad(-this.getAngle(180 - (mapParentAngle + odomParentAngle + baseFootPrintParentAngle + baseLinkParentAngle))); //转换为弧度

            this.modeObject3D.rotation.set(xRotation, yRotation, zRotation);
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
            this.modeObject3D.add(group);
            this.modeObject3D.updateMatrixWorld();
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
                
                const { point_type, point_id, point_name, poses} = point;
                const { x, y } = poses.position;
                this.lightningPoint(point_id, -x, -y, point_name, point_type, (index + 1) * 300);
            });
            this.globalObject3D.add(this.printerGroup);
        }
        
    };

    // 添加点位
    private lightningPoint = (id: number, x: number, y: number, name: string, point_type: number, timer:number) => {
        const scale2=0.2;
        const outterR=1.0;
        const heartH=2.0;
        const innerR=0.5;
        const heartShape = new THREE.Shape();
        heartShape.arc ( 0,0, outterR*scale2, 0, Math.PI, false );
        heartShape.lineTo(0, -heartH*scale2);
        heartShape.lineTo(outterR*scale2, 0);

        let bkColor = 0x2DCC6D;

        if(point_type === 0) {
            const shape_c1 = new THREE.Path();
            shape_c1.ellipse(0,0,innerR*scale2,innerR*scale2,0,Math.PI*2,true,0);
            heartShape.holes.push(shape_c1);
            bkColor = 0xff921c;
        }else if(point_type === 1) {
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
        };
        
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
        

        const heartMesh = new THREE.Mesh(heartGeometry, new THREE.MeshStandardMaterial({ color: bkColor}));//终点颜色
        heartMesh.rotateX(Math.PI /2);
        heartMesh.name='heart';

        const position = new THREE.Vector3(x, y, -.4);
        heartMesh.position.copy(position);
        heartMesh.scale.set(.0001, .0001, .0001);
        

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

        this.printerGroup.add(heartMesh);
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
            
            const { map, base_footprint, base_link, odom } = this.robotInfo;

            // odom -> map
            if(tfName === "odom" && map) {
                const position = new THREE.Vector3(
                    -map.transform.translation.x, 
                    -map.transform.translation.y, 
                    map.transform.translation.z
                );
                Object3D.position.copy(position);
                return
            };

            // base_footprint -> odom
            if(tfName === "base_footprint" && odom) {
                const position = new THREE.Vector3(
                    -(map.x - map.transform.translation.x),
                    map.y - -map.transform.translation.y,
                    map.transform.translation.z
                );
                Object3D.position.copy(position);
            };
            // base_link -> base_footprint
            if(tfName === "base_link" && base_footprint) {
                const position = new THREE.Vector3(
                    base_footprint.transform.translation.x * 2,
                    base_footprint.transform.translation.y * 2, 
                    base_footprint.transform.translation.z
                );
                Object3D.position.copy(position);
            };

            if(base_link) {
                const position = new THREE.Vector3(
                    base_link.transform.translation.x * 2, 
                    base_link.transform.translation.y * 2, 
                    base_link.transform.translation.z);
                this.laserObject3D.position.copy(position);
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
        const { map }= this.robotInfo;
        if(this.positionLine && map) {
            const positions = [
                new THREE.Vector3(-(map.x - map.transform.translation.x) + this.odomObject3D.position.x, map.y - -map.transform.translation.y + this.odomObject3D.position.y, map.transform.translation.z + .3),
                new THREE.Vector3(this.odomObject3D.position.x, this.odomObject3D.position.y, this.odomObject3D.position.z + .3),
                new THREE.Vector3(-this.globalObject3D.position.x, -this.globalObject3D.position.y, this.globalObject3D.position.z + .3)
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(positions);
            this.positionLine.setGeometry(geometry);
        };
    };

    // 创建机器人、map、odom坐标的线 将它们连起来
    private createLineToMap_oDom = () => {
        const { map }= this.robotInfo;
        if( this.modelInstance?.robotModuleGltf && map) {
            
            const positions = [
                new THREE.Vector3(-(map.x - map.transform.translation.x), map.y - -map.transform.translation.y, map.transform.translation.z+ .3),
                new THREE.Vector3(this.odomObject3D.position.x, this.odomObject3D.position.y, this.odomObject3D.position.z+ .3),
                new THREE.Vector3(-this.globalObject3D.position.x, -this.globalObject3D.position.y, this.globalObject3D.position.z+ .3)
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

    // +- 180
    private getAngle = (angle: number) => {
        angle %= 360;
        if (angle > 180) {
            angle -= 360;
        };
        return angle
    };

    // 为某个object3D 添加一个label
    private addLabel_object3D = (object: THREE.Object3D, labelName:string, color: string='#010112', position: any) => {
        // const QUAD_POINTS: [number, number][] = [
        //     [0, 0],
        //     [0, 1],
        //     [1, 0],
        //     [1, 0],
        //     [0, 1],
        //     [1, 1],
        // ];
        // const atlasTexture = new THREE.DataTexture(
        //     new Uint8ClampedArray(),
        //     5,
        //     3,
        //     THREE.RGBAFormat,
        //     THREE.UnsignedByteType,
        //     THREE.UVMapping,
        //     THREE.ClampToEdgeWrapping,
        //     THREE.ClampToEdgeWrapping,
        //     THREE.LinearFilter,
        //     THREE.LinearFilter,
        // );

        // const QUAD_POSITIONS = new THREE.BufferAttribute(new Float32Array(QUAD_POINTS.flat()), 2);
        // const QUAD_UVS = new THREE.BufferAttribute(
        //     new Float32Array(QUAD_POINTS.flatMap(([x, y]) => [x, 1 - y])),
        //     2,
        // );

        // const geometry = new THREE.InstancedBufferGeometry();

        // geometry.setAttribute("position", QUAD_POSITIONS);
        // geometry.setAttribute("uv", QUAD_UVS);

        // const instanceAttrData = new Float32Array();
        // const instanceAttrBuffer = new THREE.InstancedInterleavedBuffer(instanceAttrData, 10, 1);
        // const instanceBoxPosition = new THREE.InterleavedBufferAttribute(instanceAttrBuffer, 2, 0);
        // const instanceCharPosition = new THREE.InterleavedBufferAttribute(instanceAttrBuffer, 2, 2);
        // const instanceUv = new THREE.InterleavedBufferAttribute(instanceAttrBuffer, 2, 4);
        // const instanceBoxSize = new THREE.InterleavedBufferAttribute(instanceAttrBuffer, 2, 6);
        // const instanceCharSize = new THREE.InterleavedBufferAttribute(instanceAttrBuffer, 2, 8);
        // geometry.setAttribute("instanceBoxPosition", instanceBoxPosition);
        // geometry.setAttribute("instanceCharPosition", instanceCharPosition);
        // geometry.setAttribute("instanceUv", instanceUv);
        // geometry.setAttribute("instanceBoxSize", instanceBoxSize);
        // geometry.setAttribute("instanceCharSize", instanceCharSize);

        // const material = new LabelMaterial({ atlasTexture: atlasTexture });
        // const pickingMaterial = new LabelMaterial({ picking: true });

        // const mesh = new THREE.InstancedMesh(geometry, material, 0);
        // mesh.userData.pickingMaterial = pickingMaterial;

        // const tempVec2 = new THREE.Vector2();
        // mesh.onBeforeRender = () => {
        //     this.webGlInstance.webGLRender.getSize(tempVec2);
        //     material.uniforms.uCanvasSize!.value[0] = tempVec2.x;
        //     material.uniforms.uCanvasSize!.value[1] = tempVec2.y;
        //     pickingMaterial.uniforms.uCanvasSize!.value[0] = tempVec2.x;
        //     pickingMaterial.uniforms.uCanvasSize!.value[1] = tempVec2.y;
        // };
    };

}