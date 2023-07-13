import * as THREE from "three";
import { TopicMapT } from "@/interface/foxgloveThree";

const gridSize = 10;
const gridDivisions = 10;
type ThreeGridT = {
    initGrid: (message: TopicMapT)=> THREE.GridHelper
};

export class ThreeRenderGrid implements ThreeGridT{
    private grid:  THREE.GridHelper | undefined

    constructor() {

        /**
         * @TODO 
         * GridHelper是一个用于显示网格的辅助类，它的网格默认是基于X和Z轴的平面网格。它的网格线默认与Y轴对齐，而X和Z轴是水平平铺的。
         * 而PlaneGeometry是一个平面几何体，它的默认坐标系是基于X、Y和Z轴的。平面几何体的默认位置是位于XZ平面，其法线指向Y轴正方向。
         */
        // const initialRotation = new THREE.Euler(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(0), 0);
        // this.grid.rotation.copy(initialRotation);
        // object3D.add(this.grid);
    };

    public initGrid = (message: TopicMapT): THREE.GridHelper => {

        if(this.grid) {
            this.grid.clear()
        };
        
        const { info } = message;
        const { width, height } = info;
        const n = width > height ? height: width;
        this.grid = new THREE.GridHelper( n / gridSize, gridDivisions );
        return this.grid;
    }
}