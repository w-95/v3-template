
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
    avatar: "/src/assets/images/index1.png"
},{
    topTitle: "配送订单总量",
    bottmTitle: "本周配送订单量",
    topCount: 0,
    bottomCount: 0,
    avatar: "/src/assets/images/index2.png"
},{
    topTitle: "机器人数量",
    topCount: 0,
    avatar: "/src/assets/images/index3.png"
},{
    topTitle: "用户数量",
    topCount: 0,
    avatar: "/src/assets/images/index4.png"
}]