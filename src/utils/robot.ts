import { robotParentStatus, robotSubStatus } from '@/interface/enum';

// 机器人是否在线
export const isOnline = (robotStatusId: number) => {
  return robotStatusId == robotParentStatus.onLine;
};

// 机器人是否在操作中
export const isOperate = (robotStatusId: number) => {
  return robotStatusId == robotParentStatus.operate;
};

// 机器人是否在忙碌中
export const isBeBusy = (robotStatusId: number) => {
  return robotStatusId == robotParentStatus.beBusy;
};

// 机器人是否是离线
export const isOffline = (robotStatusId: number) => {
    return robotStatusId == robotParentStatus.offline;
  };

// 机器人是否在充电中
export const isCharge = (robotStatusId: number) => {
  return robotStatusId == robotParentStatus.charge;
};

// 机器人是否在配送中   robotSubStatus------- sub（子状态）
export const isDelivery = (robotStatusId: number) => {
  return robotStatusId == robotSubStatus.delivery;
};

// 机器人是否在帮取送中 robotSubStatus------- sub（子状态）
export const isHPickUpD = (robotStatusId: number) => {
  return robotStatusId == robotSubStatus.hPickUpD;
};

// 机器人是否在返回充电中   robotSubStatus------- sub（子状态）
export const isRToc = (robotStatusId: number) => {
  return robotStatusId == robotSubStatus.rToc;
};

// 机器人是否在脱离中   robotSubStatus------- sub（子状态）
export const isDetaching = (robotStatusId: number) => {
  return robotStatusId == robotSubStatus.detaching;
};

// 机器人是否在充电中   robotSubStatus------- sub（子状态）
export const isCharging = (robotStatusId: number) => {
  return robotStatusId == robotSubStatus.charging;
};

// 机器人是否是低电量状态   robotSubStatus------- sub（子状态）
export const isLowBattery = (robotStatusId: number) => {
    return robotStatusId == robotSubStatus.lowBattery;
};

// 机器人是否是高电量状态   robotSubStatus------- sub（子状态）
export const isHigBattery = (robotStatusId: number) => {
    return robotStatusId == robotSubStatus.higBattery;
};

// 机器人是否是呼叫状态 robotSubStatus------- sub（子状态）
export const isCall = (robotStatusId: number) => {
    return robotStatusId == robotSubStatus.call;
};

// 机器人是否是引领状态 robotSubStatus------- sub（子状态）
export const isLead = (robotStatusId: number) => {
    return robotStatusId == robotSubStatus.lead;
};

// 机器人是否是讲解状态 robotSubStatus------- sub（子状态）
export const isExplain = (robotStatusId: number) => {
    return robotStatusId == robotSubStatus.explain;
};