/**
 * 点云几何体相关
 * @TODO 直接渲染到threejs中将非常吃性能  使用BufferGeometry 缓存进行渲染
 * @author Wang BoXin <w96_16888@163.com>
 * @timer 2023.07.03
 */
import * as THREE from 'three';
import { TopicScanT, NormalizedLaserScan, Time, Pose, ColorRGBA, LayerSettingsPointExtension, ColorModeSettings, LaserScan } from '@/interface/foxgloveThree';

import { FoxgloveThreeRenderer } from './foxgloveThree';
import tinycolor from "tinycolor2";

const tempColor = { r: 0, g: 0, b: 0, a: 0 };
const v4 = new THREE.Vector4();
const v2 = new THREE.Vector2();
const kRedVec4 = new THREE.Vector4(0.13572138, 4.6153926, -42.66032258, 132.13108234);
const kGreenVec4 = new THREE.Vector4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
const kBlueVec4 = new THREE.Vector4(0.1066733, 12.64194608, -60.58204836, 110.36276771);
const kRedVec2 = new THREE.Vector2(-152.94239396, 59.28637943);
const kGreenVec2 = new THREE.Vector2(4.27729857, 2.82956604);
const kBlueVec2 = new THREE.Vector2(-89.90310912, 27.34824973);

export const updatePointCloud = function (this: FoxgloveThreeRenderer, message: TopicScanT) {
  let laserScan = normalizeRosLaserScan(message);
  // laserScan.newData = normalizeByteArray(message.ranges)
  // const { intensities, ranges: rRanges } = laserScan;
  const { angle_increment, angle_min, ranges } = message;
  const positionAttribute = this.pointCloudGeometry.getAttribute('position');
  const colorAttribute = this.pointCloudGeometry.getAttribute('color');
  // positionAttribute.needsUpdate = true;
  // 创建顶点位置缓冲区
  let positionsGeometry = new Float32Array(ranges.length * 3); // 每个点有3个坐标（x, y, z）
  // 创建颜色缓冲区
  let colorsGeometry = new Float32Array(ranges.length * 3); // 每个点有4个颜色通道（r, g, b, a）

  if(this.ranges === 0) {
    
    this.pointCloudGeometry.setAttribute('position', new THREE.BufferAttribute(positionsGeometry, 3));

    this.pointCloudGeometry.setAttribute('color', new THREE.BufferAttribute(colorsGeometry, 4));
  };

  var startColor = new THREE.Color(0xff0000); // 绿色
  var middleColor = new THREE.Color(0x00ff2e)
  var endColor = new THREE.Color(0xffa500); // 橙色
  let colors = new Float32Array(message.ranges.length * 3)
  
  ranges.forEach((range, index) => {
    var range = message.ranges[index];
    let increment = (laserScan.end_angle - laserScan.start_angle) / (laserScan.ranges.length - 1);
    var angle = message.angle_min + (index * increment);
    // const angle = message.angle_min + index * message.angle_increment;
    const x = range * Math.cos(angle); // 计算 x 坐标
    const y = range * Math.sin(angle); // 计算 y 坐标

    positionsGeometry[index * 3] = x;
    positionsGeometry[index * 3 + 1] = y;
    positionsGeometry[index * 3 + 2] = 0;

    // 计算颜色的插值
    var t = (range - message.range_min) / (message.range_max - message.range_min); // 范围插值参数
    var color;

    if (t < 0.5) {
        // 在前半段范围内，从红色到绿色渐变
        color = new THREE.Color().lerpColors(startColor, middleColor, t * 2);
    } else {
        // 在后半段范围内，从绿色到橙色渐变
        color = new THREE.Color().lerpColors(middleColor, endColor, (t - 0.5) * 2);
    }

    // 更新顶点位置
  //  positionAttribute.setXYZ(range, x, y, 0);

   // 更新颜色
  //  colorAttribute.setXYZW(range, color.r, color.g, color.b, 1);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
    colors[index * 3 + 3] = 1;
  });
  this.pointCloudGeometry.computeBoundingSphere();
  this.pointCloudGeometry.setAttribute('position', new THREE.BufferAttribute(positionsGeometry, 3));
  this.pointCloudGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  this.pointGroup.add(this.pointCloud);
  this.object3DParent.add(this.pointGroup)
};



export function stringToRgba(output: ColorRGBA, colorStr: string): ColorRGBA {
  const color = tinycolor(colorStr);
  if (!color.isValid()) {
    output.r = output.g = output.b = output.a = 1;
    return output;
  }
  const rgb = color.toRgb();
  output.r = rgb.r / 255;
  output.g = rgb.g / 255;
  output.b = rgb.b / 255;
  output.a = rgb.a;
  return output;
}

export function colorHasTransparency<Settings extends ColorModeSettings>(
  settings: Settings,
): boolean {
  switch (settings.colorMode) {
    case "flat":
      return stringToRgba(tempColor, settings.flatColor).a < 1.0;
    case "gradient":
      return (
        stringToRgba(tempColor, settings.gradient[0]).a < 1.0 ||
        stringToRgba(tempColor, settings.gradient[1]).a < 1.0
      );
    case "colormap":
    case "rgb":
      return settings.explicitAlpha < 1.0;
    case "rgba":
    case "rgba-fields":
      // It's too expensive to check the alpha value of each color. Just assume it's transparent
      return true;
  }
}

export class LaserScanMaterial extends THREE.RawShaderMaterial {
  private static MIN_PICKING_POINT_SIZE = 8;

  public constructor({ picking = false }: { picking?: boolean } = {}) {
    super({
      vertexShader: /*glsl*/ `\
        #version 300 es
        precision highp float;
        precision highp int;
        uniform mat4 projectionMatrix, modelViewMatrix;

        uniform float pointSize;
        uniform float pixelRatio;
        uniform float angleMin, angleIncrement;
        uniform float rangeMin, rangeMax;
        in float position; // range, but must be named position in order for three.js to render anything
        in mediump vec4 color;
        out mediump vec4 vColor;
        void main() {
          if (position < rangeMin || position > rangeMax) {
            gl_PointSize = 0.0;
            return;
          }
          vColor = color;
          float angle = angleMin + angleIncrement * float(gl_VertexID);
          vec4 pos = vec4(position * cos(angle), position * sin(angle), 0, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * pos;
          ${
            picking
              ? /* glsl */ `gl_PointSize = pixelRatio * max(pointSize, ${LaserScanMaterial.MIN_PICKING_POINT_SIZE.toFixed(
                  1,
                )});`
              : "gl_PointSize = pixelRatio * pointSize;"
          }

        }
      `,
      fragmentShader: `\
        #version 300 es
        #ifdef GL_FRAGMENT_PRECISION_HIGH
          precision highp float;
        #else
          precision mediump float;
        #endif
        uniform bool isCircle;
        ${picking ? "uniform vec4 objectId;" : "in mediump vec4 vColor;"}
        out vec4 outColor;

        ${THREE.ShaderChunk.encodings_pars_fragment /* for LinearTosRGB() */}

        void main() {
          if (isCircle) {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            if (dot(cxy, cxy) > 1.0) { discard; }
          }
          ${picking ? "outColor = objectId;" : "outColor = LinearTosRGB(vColor);"}
        }
      `,
    });
    this.uniforms = {
      isCircle: { value: false },
      pointSize: { value: 1 },
      pixelRatio: { value: 1 },
      angleMin: { value: NaN },
      angleIncrement: { value: NaN },
      rangeMin: { value: NaN },
      rangeMax: { value: NaN },
    };
    if (picking) {
      this.uniforms.objectId = { value: [NaN, NaN, NaN, NaN] };
    }
  }

  public update(settings: LayerSettingsPointExtension, laserScan: NormalizedLaserScan): void {
    this.uniforms.isCircle!.value = settings.pointShape === "circle";
    this.uniforms.pointSize!.value = settings.pointSize;
    this.uniforms.angleMin!.value = laserScan.start_angle;
    this.uniforms.angleIncrement!.value =
      (laserScan.end_angle - laserScan.start_angle) / (laserScan.ranges.length - 1);
    this.uniforms.rangeMin!.value = laserScan.range_min;
    this.uniforms.rangeMax!.value = laserScan.range_max;
    this.uniformsNeedUpdate = true;

    const transparent = colorHasTransparency(settings);
    if (transparent !== this.transparent) {
      this.transparent = transparent;
      this.depthWrite = !this.transparent;
      this.needsUpdate = true;
    }
  }
}

class LaserScanInstancePickingMaterial extends THREE.RawShaderMaterial {
  private static MIN_PICKING_POINT_SIZE = 8;

  public constructor() {
    const minPointSize = LaserScanInstancePickingMaterial.MIN_PICKING_POINT_SIZE.toFixed(1);
    super({
      vertexShader: /* glsl */ `\
        #version 300 es
        precision highp float;
        precision highp int;
        uniform mat4 projectionMatrix, modelViewMatrix;

        uniform float pointSize;
        uniform float pixelRatio;
        uniform float angleMin, angleIncrement;
        uniform float rangeMin, rangeMax;
        in float position; // range, but must be named position in order for three.js to render anything
        varying vec4 objectId;
        void main() {
          if (position < rangeMin || position > rangeMax) {
            gl_PointSize = 0.0;
            return;
          }
          objectId = vec4(
            float((gl_VertexID >> 24) & 255) / 255.0,
            float((gl_VertexID >> 16) & 255) / 255.0,
            float((gl_VertexID >> 8) & 255) / 255.0,
            float(gl_VertexID & 255) / 255.0);
          float angle = angleMin + angleIncrement * float(gl_VertexID);
          vec4 pos = vec4(position * cos(angle), position * sin(angle), 0, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * pos;
          gl_PointSize = pixelRatio * max(pointSize, ${minPointSize});
        }
      `,
      fragmentShader: /* glsl */ `\
        #version 300 es
        #ifdef GL_FRAGMENT_PRECISION_HIGH
          precision highp float;
        #else
          precision mediump float;
        #endif
        uniform bool isCircle;
        varying vec4 objectId;
        out vec4 outColor;

        void main() {
          if (isCircle) {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            if (dot(cxy, cxy) > 1.0) { discard; }
          }
          outColor = objectId;
        }
      `,
    });
    this.uniforms = {
      isCircle: { value: false },
      pointSize: { value: 1 },
      pixelRatio: { value: 1 },
      angleMin: { value: NaN },
      angleIncrement: { value: NaN },
      rangeMin: { value: NaN },
      rangeMax: { value: NaN },
    };
  }

  public update(settings: LayerSettingsPointExtension, laserScan: LaserScan): void {
    this.uniforms.isCircle!.value = settings.pointShape === "circle";
    this.uniforms.pointSize!.value = settings.pointSize;
    this.uniforms.angleMin!.value = laserScan.angle_min;
    this.uniforms.angleIncrement!.value = laserScan.angle_increment;
    this.uniforms.rangeMin!.value = laserScan.range_min;
    this.uniforms.rangeMax!.value = laserScan.range_max;
    this.uniformsNeedUpdate = true;
  }
}

function normalizeRosLaserScan(message: TopicScanT): NormalizedLaserScan {
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
}

export function normalizeTime(time: Partial<Time> | undefined): Time {
  if (!time) {
    return { sec: 0, nsec: 0 };
  }
  return { sec: time.sec ?? 0, nsec: time.nsec ?? 0 };
}

export function emptyPose(): Pose {
  return { position: { x: 0, y: 0, z: 0 }, orientation: { x: 0, y: 0, z: 0, w: 1 } };
}

export function normalizeFloat32Array(array: unknown): Float32Array {
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

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}


export function SRGBToLinear(c: number): number {
  return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
}

function turboLinear(output: ColorRGBA, pct: number): void {
  // Clamp the input between [0.0, 1.0], then scale to the range [0.01, 1.0]
  const x = clamp(pct, 0.0, 1.0) * 0.99 + 0.01;
  v4.set(1, x, x * x, x * x * x);
  v2.set(v4.z, v4.w);
  v2.multiplyScalar(v4.z);
  output.r = SRGBToLinear(clamp(v4.dot(kRedVec4) + v2.dot(kRedVec2), 0, 1));
  output.g = SRGBToLinear(clamp(v4.dot(kGreenVec4) + v2.dot(kGreenVec2), 0, 1));
  output.b = SRGBToLinear(clamp(v4.dot(kBlueVec4) + v2.dot(kBlueVec2), 0, 1));
  output.a = 1;
}

const TURBO_LOOKUP_SIZE = 65535;

function turboLinearCached(output: ColorRGBA, pct: number): void {
  let TurboLookup = new Float32Array(TURBO_LOOKUP_SIZE * 3);
    const tempColor = { r: 0, g: 0, b: 0, a: 0 };
    for (let i = 0; i < TURBO_LOOKUP_SIZE; i++) {
      turboLinear(tempColor, i / (TURBO_LOOKUP_SIZE - 1));
      const offset = i * 3;
      TurboLookup[offset + 0] = tempColor.r;
      TurboLookup[offset + 1] = tempColor.g;
      TurboLookup[offset + 2] = tempColor.b;
    }

  const offset = Math.trunc(pct * (TURBO_LOOKUP_SIZE - 1)) * 3;
  output.r = TurboLookup[offset + 0]!;
  output.g = TurboLookup[offset + 1]!;
  output.b = TurboLookup[offset + 2]!;
  output.a = 1;
}

export function normalizeByteArray(byteArray: unknown): Uint8Array {
  if (byteArray == undefined) {
    return new Uint8Array(0);
  } else if (byteArray instanceof Uint8Array) {
    return byteArray;
  } else if (Array.isArray(byteArray) || byteArray instanceof ArrayBuffer) {
    return new Uint8Array(byteArray);
  } else {
    return new Uint8Array(0);
  }
}