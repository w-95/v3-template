
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { TopicMapT, OffsetWHT, TopicScanT, TopicTfT } from "@/interface/foxgloveThree";

import {renderTopicMap} from "@/foxglove/renderTopicMap";

import { getCamera, initCamera3D, initCamera2D } from "./renderCamera";
import { initControls} from "./renderControls";
import { initWebGal } from "./renderWebGl";
import { initDirLight, initHemiLight } from "./renderLight";
import { updateGrid } from "./renderGrid";
import { updatePointCloud } from "./renderGeometry";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export type FoxgloveThreeRendererT = {
    offsetWH: OffsetWHT;
    renderType: '2D' | '3D';
    topicMapInfo:TopicMapT | null;
    threeRenderDom: HTMLCanvasElement;
    webGLRender: THREE.WebGLRenderer;
    topicMapChage: (message: TopicMapT) => void;
    topicScanChange: (message: TopicScanT) => void;
    topicTfChange: (message: TopicTfT) => void;
};

const positions: number | Iterable<number> | ArrayLike<number> | ArrayBuffer = []; // 顶点坐标数组
const colors: number | Iterable<number> | ArrayLike<number> | ArrayBuffer = []; // 颜色数组

// 相机的视角（fov）
export const cameraFov = 45;

export class FoxgloveThreeRenderer implements FoxgloveThreeRendererT{

    // 可是区域的宽高
    public offsetWH: OffsetWHT;
    // 渲染的类型：2D || 3D
    public renderType: '2D' | '3D';
    // 当前灰度图像的信息
    public topicMapInfo:TopicMapT | null;
    // 当前渲染的canvas元素
    public readonly threeRenderDom: HTMLCanvasElement;
    // 渲染器
    public readonly webGLRender: THREE.WebGLRenderer;
    // 场景
    public scene: THREE.Scene;
    // 相机
    public perspectiveCamera: THREE.PerspectiveCamera;
    public orthographicCamera: THREE.OrthographicCamera;
    // 相机组
    public cameraGroup: THREE.Group;
    // 轨道控制器
    public controls: any;
    // renderTOpicMap calss类的实例
    public renderTopicMapClass: renderTopicMap | null;
    // 平行光
    public directionalLight: THREE.DirectionalLight;
    public hemiLight: THREE.HemisphereLight;

    public pickingTarget: THREE.WebGLRenderTarget;

    // 网格
    public grid: THREE.GridHelper;

    // 点云几何体
    public pointCloudGeometry: THREE.BufferGeometry;
    // 点云材质
    public pointCloudMaterial: THREE.PointsMaterial;
    // 创建点云对象
    public pointCloud: THREE.Points;
    public ranges: number;

    // 包含点云和地图的parent
    public object3DParent: THREE.Object3D;

    // 机器人当前位置
    public robotPosition: THREE.Vector3;
    // 机器人旋转角度
    public robotRotation: THREE.Quaternion;
    // 机器人模型
    public robotModuleGltf: GLTFLoader;

    constructor({ threeRenderDom, width, height }: any) {
        this.ranges = 0;
        // canvas的宽高和parent的宽高一样 保存起来
        this.offsetWH = { width, height };

        this.renderType = "3D";
        this.topicMapInfo = null;

        this.threeRenderDom = threeRenderDom;
        // 创建webGl渲染器
        this.webGLRender = new THREE.WebGLRenderer({
            canvas: threeRenderDom,
            alpha: true,
            antialias: true,
        });

        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AxesHelper(10)); // 显示坐标轴

        this.grid = new THREE.GridHelper( 10, 10 )
        this.scene.add(this.grid); // 显示网格

        // 创建相机
        this.perspectiveCamera = new THREE.PerspectiveCamera(45, width / height, 1, 500);
        // this.perspectiveCamera = new THREE.PerspectiveCamera(75, width / height, .1, 500);
        this.orthographicCamera = new THREE.OrthographicCamera();

        this.cameraGroup = new THREE.Group();

        this.cameraGroup.add(this.perspectiveCamera);
        // this.cameraGroup.add(this.orthographicCamera);
        this.scene.add(this.cameraGroup)

        this.cameraGroup.position.set(0, 0, 0)
        this.cameraGroup.lookAt(this.scene.position);

        this.cameraGroup.quaternion.set(0, 0, 0, 1);

        // 创建灯光
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);

        // 创建轨道控制器
        this.controls = new OrbitControls(getCamera.call(this), this.webGLRender.domElement);

        // 初始化点云
        // 创建点云的几何体 点云材质
        this.pointCloudGeometry = new THREE.BufferGeometry();
        this.pointCloudMaterial = new THREE.PointsMaterial({
            size: 2, // 点的大小
            vertexColors: true, // 开启顶点颜色
            sizeAttenuation: false
            // color: 0xffffff,
        });
        
        this.pointCloud = new THREE.Points(this.pointCloudGeometry, this.pointCloudMaterial);
        this.object3DParent = new THREE.Object3D();

        this.robotPosition = new THREE.Vector3();
        this.robotRotation = new THREE.Quaternion();

        // 计算平移向量
        const translationVector = new THREE.Vector3().subVectors(this.robotPosition, this.object3DParent.position);
        this.object3DParent.position.add(translationVector);
        // 将点云添加到Ovject3D中
        this.object3DParent.add(this.pointCloud);

        // 旋转
        const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(0), 0);
        this.object3DParent.rotation.copy(initialRotation);

        this.scene.add(this.object3DParent);

        
        this.pickingTarget = new THREE.WebGLRenderTarget(this.offsetWH.width, this.offsetWH.height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat, // stores objectIds as uint32
            // encoding: THREE.LinearEncoding,
            generateMipmaps: false,
        });

        

        // class 实例
        this.renderTopicMapClass = null;
        
        // 初始化设置
        this.initThree();
        this.loadModule();
        
        // 渲染
        this.render();
    };

    private initThree = () => {
        // 初始化webGl
        initWebGal.call(this);

        // 初始化灯光
        initDirLight.call(this);
        // initHemiLight.call(this);

        //初始化轨道控制器
        initControls.call(this);

        // 初始化相机
        initCamera3D.call(this);

        this.scene.add(this.directionalLight);
        this.scene.add(this.hemiLight);
    };

    /**
     * foxglove client /map event change id: 2
     * 灰度图像 ---- 地图
     * @param message TopicMapT client接受到的信息
     */
    public topicMapChage = (message: TopicMapT) => {
        this.topicMapInfo = message;
        // 更新网格
        updateGrid.call(this, message, getCamera.call(this));

        // 更新地图渲染
        this.renderTopicMapClass = new renderTopicMap();
        this.renderTopicMapClass.initMap(this.scene, this.topicMapInfo, this.object3DParent);
    };

    /**
     * foxglove client /tf event change id: 4
     * 机器人当前位置  旋转等信息
     * @param message 
     */
    public topicTfChange = (message: TopicTfT) => {
        const { transforms } = message;
        // 机器人当前位置
        this.robotPosition.x = transforms[1].transform.translation.x;
        this.robotPosition.y = transforms[1].transform.translation.y;
        this.robotPosition.z = transforms[1].transform.translation.z;
        // 机器人旋转角度
        this.robotRotation.x = transforms[1].transform.rotation.x;
        this.robotRotation.y = transforms[1].transform.rotation.y;
        this.robotRotation.z = transforms[1].transform.rotation.z;
        this.robotRotation.w = transforms[1].transform.rotation.w;

        // this.robotModuleGltf.scene.position.set(this.robotPosition);
        this.robotModuleGltf.quaternion.copy(this.robotRotation);
    };

    /**
     * foxglove client /scan event change id: 1
     * @TODO 激光雷达 ---- 点云
     * @param message TopicScanT client接收到的信息
     */
    public topicScanChange = (message: TopicScanT) => {
        updatePointCloud.call(this, message);
    };

    // 渲染Threejs场景
    private render = () => {
        requestAnimationFrame(this.render);
        this.controls.update();
        
        this.webGLRender.render(this.scene, getCamera.call(this));
    };

    // 加载模型
    private loadModule = () => {
        const loader = new GLTFLoader();
        loader.load( '../src/assets/gltf/scene.gltf', ( gltf: GLTFLoader ) => {
            this.robotModuleGltf = gltf;
            this.robotModuleGltf.scene.scale.set(0.08, 0.08, 0.08);
            this.robotModuleGltf.scene.position.set(0, 0, 0);
            this.scene.add( this.robotModuleGltf.scene );
        }, function() {
            console.log("正在导入 ...")
        }, function ( error: any ) {

            console.error( '导入失败 -> ', error );

        } );
    }
}