export type Time = {
  sec: number;
  nsec: number;
};

export type RosTime = Time;

export type ColorRGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Header = {
  frame_id: string;
  stamp: RosTime;
  seq?: number;
};

export type Point = {
  x: number;
  y: number;
  z: number;
};

// ts-prune-ignore-next
export type Orientation = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type Pose = {
  position: Point;
  orientation: Orientation;
};

export type MapMetaData = {
  map_load_time: RosTime;
  resolution: number;
  width: number;
  height: number;
  origin: Pose;
};

export interface TopicMapT {
  header: Header;
  info: MapMetaData;
  data: Uint8Array;
}

export interface OffsetWHT {
  width: number;
  height: number;
}

export interface TopicScanT {
  angle_increment: number;
  angle_max: number;
  angle_min: number;
  header?: Header;
  intensities: number[] | Uint32Array;
  range_max: number;
  range_min: number;
  ranges: number[] | Uint32Array;
  scan_time: number;
  time_increment: number;
}

export interface NormalizedLaserScan {
  timestamp: Time;
  frame_id: string;
  pose: Pose;
  start_angle: number;
  end_angle: number;
  range_min: number;
  range_max: number;
  ranges: Float32Array;
  intensities: Float32Array;
}

export type BaseSettings = {
  /** Visibility for any associated scene renderables and settings tree nodes. */
  visible: boolean;
  /** If true, always use `currentTime` for pose updates. This means objects in a coordinate frame
   * will move as the coordinate frame moves. */
  frameLocked?: boolean;
};

export interface ColorModeSettings {
  colorMode: 'flat' | 'gradient' | 'colormap' | 'rgb' | 'rgba' | 'rgba-fields';
  flatColor: string;
  colorField?: string;
  gradient: [string, string];
  colorMap: 'turbo' | 'rainbow';
  explicitAlpha: number;
  minValue?: number;
  maxValue?: number;
}

export type LayerSettingsPointExtension = BaseSettings &
  ColorModeSettings & {
    pointSize: number;
    pointShape: 'circle' | 'square';
    decayTime: number;
  };

export interface ColorModeSettings {
  colorMode: 'flat' | 'gradient' | 'colormap' | 'rgb' | 'rgba' | 'rgba-fields';
  flatColor: string;
  colorField?: string;
  gradient: [string, string];
  colorMap: 'turbo' | 'rainbow';
  explicitAlpha: number;
  minValue?: number;
  maxValue?: number;
}

export type LaserScan = {
  header: Header;
  angle_min: number;
  angle_max: number;
  angle_increment: number;
  time_increment: number;
  scan_time: number;
  range_min: number;
  range_max: number;
  ranges: Float32Array;
  intensities: Float32Array;
};