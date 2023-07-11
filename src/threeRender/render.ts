
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { TopicMapT, OffsetWHT, TopicScanT, TopicTfT, transforms, transform } from "@/interface/foxgloveThree";

import { ThreeRenderMap } from "@/threeRender/map";
import { ThreeRenderGrid } from "@/threeRender/grid";
import { ThreeRenderGeometry } from "@/threeRender/geometry";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ElMessage } from 'element-plus/lib/components/index.js';


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

// 相机的视角（fov）
export const cameraFov = 45;
const UNIT_X = new THREE.Vector3(1, 0, 0);
const UNIT_Z = new THREE.Vector3(0, 0, 1);
const PI_2 = Math.PI / 2;

export class FoxgloveThreeRenderer implements FoxgloveThreeRendererT{

    // 可是区域的宽高
    public offsetWH: OffsetWHT;
    // 渲染的类型：2D || 3D
    public renderType: '2D' | '3D';
    // 当前/Map的信息
    public topicMapInfo:TopicMapT | null;
    // 当前/transform的信息
    public topicTfInfo: Map<string, transforms>;
    // 当前 /scan的信息
    public topicScanInfo: TopicScanT | null
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
    // 渲染地图类的实例
    private renderTopicMapClass: ThreeRenderMap | null;
    // 辅助网格类实例
    private renderGridClass: ThreeRenderGrid | null;
    // 渲染激光点云类的实例
    private renderPointClass: ThreeRenderGeometry | null;
    // 平行光
    private directionalLight: THREE.DirectionalLight;
    private hemiLight: THREE.HemisphereLight;

    public robotModuleGltf: GLTFLoader;

    // 坐标系
    public mapObject3D: THREE.Object3D;
    public odomObject3D: THREE.Object3D;
    public baseFootprintObject3D: THREE.Object3D;
    public baseLinkObject3D: THREE.Object3D;
    public laserObject3D: THREE.Object3D;

    constructor({ threeRenderDom, width, height }: any) {
        this.offsetWH = { width, height };

        this.renderType = "3D";

        this.topicMapInfo = null;
        this.topicTfInfo = new Map();
        this.topicScanInfo = null;

        this.threeRenderDom = threeRenderDom;

        this.webGLRender = new THREE.WebGLRenderer({
            canvas: threeRenderDom,
            alpha: true,
            antialias: true,
        });

        this.scene = new THREE.Scene();

        this.cameraGroup = new THREE.Group();
        this.cameraGroup.position.set(0, 0, 0)
        this.cameraGroup.lookAt(this.scene.position);
        this.cameraGroup.quaternion.set(0, 0, 0, 1);
        // this.perspectiveCamera = new THREE.PerspectiveCamera(45, width / height, 1, 500);
        this.perspectiveCamera = new THREE.PerspectiveCamera(75, width / height, .1, 500);
        this.orthographicCamera = new THREE.OrthographicCamera();
        this.cameraGroup.add(this.perspectiveCamera);

        // 创建灯光
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);

        // 创建轨道控制器
        this.controls = new OrbitControls(this.getCamera(), this.webGLRender.domElement);

        this.renderTopicMapClass = null;
        this.renderGridClass = null;
        this.renderPointClass = null;

        this.mapObject3D = new THREE.Object3D();
        this.odomObject3D = new THREE.Object3D();
        this.baseFootprintObject3D = new THREE.Object3D();
        this.baseLinkObject3D = new THREE.Object3D();
        this.laserObject3D = new THREE.Object3D();

        const mapAxes = new THREE.AxesHelper(5);
        const odomAxes = new THREE.AxesHelper(5);
        const baseFootprintAxes = new THREE.AxesHelper(5);
        const baseLinkAxes = new THREE.AxesHelper(5);
        const laserAxes = new THREE.AxesHelper(5);

        this.mapObject3D.add(mapAxes);
        this.odomObject3D.add(odomAxes);
        this.baseFootprintObject3D.add(baseFootprintAxes);
        this.baseLinkObject3D.add(baseLinkAxes);
        this.laserObject3D.add(laserAxes);

        this.mapObject3D.add(this.odomObject3D);
        this.odomObject3D.add(this.baseFootprintObject3D);
        this.baseFootprintObject3D.add(this.baseLinkObject3D);
        this.baseLinkObject3D.add(this.laserObject3D);

        /**
         * @TODO 
         * GridHelper是一个用于显示网格的辅助类，它的网格默认是基于X和Z轴的平面网格。它的网格线默认与Y轴对齐，而X和Z轴是水平平铺的。
         * 而PlaneGeometry是一个平面几何体，它的默认坐标系是基于X、Y和Z轴的。平面几何体的默认位置是位于XZ平面，其法线指向Y轴正方向。
         */
        const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(0), 0);
        // this.scene.rotation.copy(initialRotation);                                                                 
        
        this.scene.add(new THREE.AxesHelper(5)); // 显示坐标轴
        this.scene.add(this.cameraGroup);
        this.scene.add(this.mapObject3D);
        
        this.initSetting();
        
        this.render();
    };

    private getCamera = () => this.renderType === "3D" ? this.perspectiveCamera : this.orthographicCamera;

    public initSetting = () => {
        
        this.initSettingWebGl();
        this.initSettingCamera3D();
        this.initSetttingControls();
        this.initSettingDirLight();
    };

    /**
     * foxglove client /map event change id: 2
     * 灰度图像 ---- 地图
     * @param message TopicMapT client接受到的信息
     */
    public topicMapChage = (message: TopicMapT) => {
        this.topicMapInfo = message;

        const { origin, resolution, width, height } = message.info;

        // 实例地图
        if(!this.renderTopicMapClass) {
            const [threeOriginX, threeOriginY] = [width * resolution, height * resolution];
            var position = new THREE.Vector3(threeOriginX / 2 + origin.position.x,  -threeOriginY / 2 - origin.position.y, 0);
            const { x: rx, y: ry, z: rz, w: rw } = origin.orientation;
            var quaternion = new THREE.Quaternion(rx, ry, rz, rw);
            
            this.mapObject3D.position.copy(position);
            this.mapObject3D.quaternion.copy(quaternion);
            this.renderTopicMapClass = new ThreeRenderMap( message, this.mapObject3D);
            this.loadModule();

        }else {
            // 更换了地图？
            this.renderTopicMapClass = null;
            this.scene.clear();
            // this.renderTopicMapClass = new ThreeRenderMap( message, this.mapObject3D );
        };

        // 将模型设置到原点位置
        if(this.robotModuleGltf) {
            this.robotModuleGltf.scene.position.set(-origin.position.x, -origin.orientation.y, -origin.position.z);
        };

        // 实例辅助网格
        if(!this.renderGridClass) {
            this.renderGridClass = new ThreeRenderGrid(message, this.mapObject3D);
        };
    };

    /**
     * foxglove client /tf event change id: 4
     * 机器人当前位置  旋转等信息
     * @param message 
     */
    public topicTfChange = (message: TopicTfT) => {
        const { transforms } = message;
        console.log(message)
        
        transforms.forEach((item) => {
            this.topicTfInfo.set(item.header.frame_id, item)
            if(item.header.frame_id === 'map') {
                this.updateObject3D(item.transform, this.odomObject3D, this.mapObject3D);
            }else if(item.header.frame_id === 'odom') {
                // this.updateObject3D(item.transform, this.baseFootprintObject3D, this.odomObject3D);
            }else if(item.header.frame_id === 'base_footprint') {
                // this.updateObject3D(item.transform, this.baseLinkObject3D, this.baseFootprintObject3D)
            }else if(item.child_frame_id === 'base_link') {
                // this.updateObject3D(item.transform, this.laserObject3D, this.baseLinkObject3D);
            }else if(item.child_frame_id === 'laser') {
                // this.updateObject3D(item.transform, this.laserObject3D);
            }
        });

        
        const baseLinkInfo =  this.topicTfInfo.get("base_link");

        if(!this.renderPointClass && this.topicScanInfo && baseLinkInfo) {
            this.renderPointClass = new ThreeRenderGeometry(this.topicScanInfo, this.mapObject3D, baseLinkInfo);
            this.mapObject3D.updateMatrixWorld();
        };
        
        this.getRototPosition();
    };

    // 获取机器人当前位置
    private getRototPosition = () => {
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

            // mpa => odom 的角度
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

            // 旋转地图
            // THREE.MathUtils.degToRad(-Math.round((Math.atan(tfAngle) * 180) / Math.PI
            const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-Math.round((Math.atan(robotAngle) * 180) / Math.PI)));
            this.scene.rotation.copy(initialRotation);


            // 更新机器人位置
            const { x: map3Dx, y: map3Dy, z: map3Dz } = this.mapObject3D.position;
            if(this.robotModuleGltf) {
                this.robotModuleGltf.scene.position.set(-map3Dx + x, -map3Dy - y, map3Dz);
            };

            console.log('地图起点::', info.origin.position);
            console.log("robot x:", x, "robot y", y, 'robot angle:', robotAngle);
            return { x, y, robotAngle, mapAngle_TF };

        };
        return { x: 0, y: 0, robotAngle: 0, mapAngle_TF: 0 };
    };

    private addTopicName = (transformInfo: transform) => {

    };

    // 根据坐标系关系更新坐标和角度
    private updateObject3D = (transformInfo: transform, Object3D: THREE.Object3D, parentOvjec3D: THREE.Object3D) => {
        if(!this.topicMapInfo) return;

        const { x: tfx, y: tfy, z: tfz} = transformInfo.translation;
        // ElMessage(`${threeOriginX}, : ${threeOriginY}`)
        const { x: px, y: py, z: pz } = parentOvjec3D.position;
        const position = new THREE.Vector3(-px + tfx, -py - tfy, 0)
        // var quaternion = new THREE.Quaternion(-r.x, -r.y, -r.z, -r.w);
        // 将点云从ROS坐标系转换到Three.js坐标系
        // position.applyQuaternion(this.baseLinkObject3D.quaternion);
        // position.add(this.baseLinkObject3D.position);
        // quaternion.multiply(this.baseLinkObject3D.quaternion);
        
        Object3D.position.copy(position);
        // Object3D.quaternion.copy(quaternion);
    };

    /**
     * foxglove client /scan event change id: 1
     * @TODO 激光雷达 ---- 点云
     * @param message TopicScanT client接收到的信息
     */
    public topicScanChange = (message: TopicScanT) => {

        this.topicScanInfo = message;

        const baseLinkInfo = this.topicTfInfo.get('base_link')
        if(!this.renderPointClass && this.topicTfInfo && this.topicScanInfo && baseLinkInfo) {
            this.renderPointClass = new ThreeRenderGeometry(message, this.mapObject3D, baseLinkInfo);

            this.mapObject3D.updateMatrixWorld();
        };
    };

    // 渲染Threejs场景
    private render = () => {
        requestAnimationFrame(this.render);
        this.controls.update();
        
        this.webGLRender.render(this.scene, this.getCamera());
    };

    // 切换相机
    private checkRenderType = (mode: Extract<FoxgloveThreeRendererT, 'renderType'>) => {
        this.renderType = mode;
        mode === '2D'? this.initSettingCamera2D(): this.initSettingCamera3D();
    };

    // 加载模型
    private loadModule = () => {
        const loader = new GLTFLoader();
        loader.load( '../src/assets/gltf/scene.gltf', ( gltf: GLTFLoader ) => {
            this.robotModuleGltf = gltf;
            this.robotModuleGltf.scene.scale.set(0.2, 0.2, 0.2);
            
            const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0));
            this.robotModuleGltf.scene.rotation.copy(initialRotation);

            if(this.topicMapInfo && this.topicMapInfo?.info) {
                this.robotModuleGltf.scene.position.set(0, 0, 0);
            }else {
                this.robotModuleGltf.scene.position.set(0, 0, 0);
            }
            this.mapObject3D.add( this.robotModuleGltf.scene );
        }, function() {
            console.log("正在导入 ...")
        }, function ( error: any ) {
            console.error( '导入失败 -> ', error );
        } );
    };

    // 初始化设置webGl
    private initSettingWebGl = () => {
        // 普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果
        this.webGLRender.toneMapping = THREE.NoToneMapping;
        // 定义渲染器是否在渲染每一帧之前自动清除其输出。
        this.webGLRender.autoClear = false;
        // /// 自定义模式重置
        this.webGLRender.info.autoReset = false;
        // // 是否允许在场景中使用阴影贴图
        this.webGLRender.shadowMap.enabled = false;
        // 定义阴影贴图类型
        this.webGLRender.shadowMap.type = THREE.VSMShadowMap;
        // 渲染器是否应对对象进行排序。默认是true.
        this.webGLRender.sortObjects = true;
        // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
        this.webGLRender.setPixelRatio(window.devicePixelRatio);
        this.webGLRender.setSize(this.offsetWH.width, this.offsetWH.height);
    };

    // 初始化设置平行光
    private initSettingDirLight = () => {
        this.directionalLight.position.set(1, 2, 1);
        this.directionalLight.castShadow = true;
        this.directionalLight.layers.enableAll();
    
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.bias = -0.00001;

        this.scene.add(this.directionalLight);
        this.scene.add(this.hemiLight)
    };

    // 初始化设置轨道控制器
    private initSetttingControls = () => {
        this.controls.screenSpacePanning = false; // only allow panning in the XY plane
        this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        this.controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
        this.controls.touches.ONE = THREE.TOUCH.PAN;
        this.controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

        this.controls.keys = { LEFT: "KeyA", RIGHT: "KeyD", UP: "KeyW", BOTTOM: "KeyS" };
        this.controls.listenToKeyEvents(this.threeRenderDom);
        // this.controls.enableRotate = true;  // 允许旋转
        // this.controls.enableZoom = false;   // 禁用缩放
        // this.controls.enablePan = true;     // 允许平移
    };

    // 初始化设置3D相机
    private initSettingCamera3D = () => {
        const targetOffset = new THREE.Vector3();
        targetOffset.fromArray([0, 0, 0]);
        const tempSpherical = new THREE.Spherical();
        const phi = THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(this.controls.getPolarAngle()));
        const theta = -THREE.MathUtils.degToRad(THREE.MathUtils.radToDeg(-this.controls.getAzimuthalAngle()));
        tempSpherical.set(this.controls.getDistance(), phi, theta);
      
        this.perspectiveCamera.position.setFromSpherical(tempSpherical).applyAxisAngle(UNIT_X, PI_2);
        this.perspectiveCamera.position.add(targetOffset);
      
        this.perspectiveCamera.quaternion.setFromEuler(new THREE.Euler().set(phi, 0, theta, "ZYX"));
        this.perspectiveCamera.fov = cameraFov;
        this.perspectiveCamera.near = 0.5;
        this.perspectiveCamera.far = 5000;
        this.perspectiveCamera.aspect = this.offsetWH.width / this.offsetWH.height;
        this.perspectiveCamera.updateProjectionMatrix();
      
        this.controls.target.copy(targetOffset);
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;
      
        // 设置相机位置
        this.perspectiveCamera.position.set(13, 15, 10)
        this.perspectiveCamera.lookAt(this.scene.position);
    };
      
    // 初始化设置2D相机
    private initSettingCamera2D = () => {
        const targetOffset = new THREE.Vector3();
        targetOffset.fromArray([0, 0, 0]);
        const phi = THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(this.controls.getPolarAngle()));
        const theta = -THREE.MathUtils.degToRad( THREE.MathUtils.radToDeg(-this.controls.getAzimuthalAngle()));
        const curPolarAngle = THREE.MathUtils.degToRad(phi);
        this.controls.minPolarAngle = this.controls.maxPolarAngle = curPolarAngle;
      
        this.orthographicCamera.position.set(targetOffset.x, targetOffset.y, 5000 / 2);
        this.orthographicCamera.quaternion.setFromAxisAngle(UNIT_Z, theta);
        this.orthographicCamera.left = (-this.controls.getDistance() / 2) * (this.offsetWH.width / this.offsetWH.height);
        this.orthographicCamera.right = (this.controls.getDistance() / 2) * (this.offsetWH.width / this.offsetWH.height);
        this.orthographicCamera.top = this.controls.getDistance() / 2;
        this.orthographicCamera.bottom = -this.controls.getDistance() / 2;
        this.orthographicCamera.near = 0.5;
        this.orthographicCamera.far = 5000;
        this.orthographicCamera.updateProjectionMatrix();
    };
}