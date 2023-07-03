
export type Time = {
  sec: number;
  nsec: number;
};

export type RosTime = Time;

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
  width: number,
  height: number
}
