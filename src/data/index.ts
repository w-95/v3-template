import { getDateTime } from "@/utils";
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