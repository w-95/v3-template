import { getDateTime } from "@/utils";
import { tabName } from "@/interface/enum.ts";
// 主题存储在本地的key
export const themeVar = "THEME";

// 用户信息存储在本地的key
export const userInfoVar = "USERINFO";

// 侧边栏导航表存储在本地的key
export const leftMenuRoutersVar = "MENU_ROUTERS";

// token存储在本地的key
export const loginTokenVar = "loginToken";

// 系统语言存储在本地的key
export const localeVar = "LOCALE";

// 设计稿得宽度
export const widthUi = 1920;

// console页的导出报表
export const exportConsole = '/web_fe_api/product/getOrderDataStatisticsByInternalDateExport';

// 点击头像的操作列表项
export const accounts = [{
    icon: `<span class="icon iconfont micon-tuichu">&#xe60d;</span>`,
    isDisplay: false,
    titleKey: 'logOut',
    type: "logOut"
}];

// console page header card
export const consoleHeaderCard = [{
    topTitle: "消毒任务总量",
    bottmTitle: "本周消毒量",
    topCount: 0,
    bottomCount: 0,
    btmCountColor: '#289EED',
    avatar: "/src/assets/images/index1.png"
},{
    topTitle: "配送订单总量",
    bottmTitle: "本周配送订单量",
    topCount: 0,
    bottomCount: 0,
    btmCountColor: '#6160F4',
    avatar: "/src/assets/images/index2.png"
},{
    topTitle: "机器人数量",
    topCount: 0,
    avatar: "/src/assets/images/index3.png"
},{
    topTitle: "用户数量",
    topCount: 0,
    avatar: "/src/assets/images/index4.png"
}];

// console export report 
export const deliveryReportTime = [{
    label: "近7天",
    day: 7,
    value: 1
}, {
    label: "近7周",
    day: 49,
    value: 2
}, {
    label: "近7月",
    value: 3,
    day: Math.round(getDateTime(7, 'month').temp)
}];

type productEditTabT = { label: string, name: tabName, id: number };
// 产品编辑 productEdit tabs
export const productEditTabs:productEditTabT[] = [{
    label: "基本属性",
    name: tabName.attr,
    id: 1
}, {
    label: '远程控制',
    name: tabName.control,
    id: 2
}, {
    label: "宣传图片",
    name: tabName.propaganda,
    id: 3
}, {
    label: "背景音乐",
    name: tabName.propagandaVideo,
    id: 4
}, {
    label: "开机动画",
    name: tabName.bootAnimation,
    id: 5
}];

// 提醒电量值 --- 配送机器人
export const batteryTipsT_5 = [{
    label: 5,
    value: 5,
    name: '5%'
},{
    label: 10,
    value: 10,
    name: '10%'
},{
    label: 15,
    value: 15,
    name: '15%'
},{
    label: 20,
    value: 20,
    name: '20%'
}];

// 提醒电量值 --- 其它机器人
export const batteryTips = [{
    label: 10,
    value: 10,
    name: '10%'
},{
    label: 20,
    value: 20,
    name: '20%'
},{
    label: 25,
    value: 25,
    name: '25%'
},{
    label: 30,
    value: 30,
    name: '30%'
}];

// 回充电量值  --- 配送机器人
export const rechargeValueT_5 = [{
    label: 5,
    value: 5,
    name: '5%'
},{
    label: 10,
    value: 10,
    name: '10%'
},{
    label: 15,
    value: 15,
    name: '15%'
},{
    label: 20,
    value: 20,
    name: '20%'
}];

// 回充电量值  --- 其它机器人
export const rechargeValue = [{
    label: 10,
    value: 10,
    name: '10%'
},{
    label: 20,
    value: 20,
    name: '20%'
},{
    label: 25,
    value: 25,
    name: '25%'
},{
    label: 30,
    value: 30,
    name: '30%'
}];

// 控制类型
export const controlType = [{
    label: 1,
    value: 1,
    name: '远程取日志'
},{
    label: 2,
    value: 2,
    name: '自定义脚本'
},{
    label: 3,
    value: 3,
    name: '网络adb'
},{
    label: 4,
    value: 4,
    name: '截屏'
},{
    label: 5,
    value: 5,
    name: '远程取文件'
},{
    label: 6,
    value: 6,
    name: '查询版本'
},{
    label: 7,
    value: 7,
    name: '电机锁轴'
},{
    label: 8,
    value: 8,
    name: 'Android恢复出厂'
},{
    label: 9,
    value: 9,
    name: '重启ROS'
}];