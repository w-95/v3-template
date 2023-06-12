// 主题枚举
export enum theme {
    defaultTheme='THEME_DEFAULT',
    dark='THEME_DARK'
}

// console page charId 枚举
export enum chartIdName {
    disinfectChartId='disinfect-chart',
    deliveryCharId='delivery-chart'
}

// 现有机器人的类型
export enum robotCode {
    '03'='服务机器人',
    '04'='消毒机器人',
    '05'='配送机器人',
    '06'='标准底盘'
}

export enum productTypeIdT {
    standardChassis=6,
    deliveryRobot=5,
    disinfectionRobot=4,
    serviceRobot=3
}

// 用户的身份
export enum roleCodeT {
    'USER'='USER',
    'ADMIN'='ADMIN'
}

// 机器人的连接主状态
export enum robotParentStatus {
    'onLine' = 0,   // 在线
    'operate'= 1,   // 操作
    'beBusy' = 2,   // 忙碌
    'charge' = 4,   // 充电
    'offline'= -1   // 离线
}

// 机器人的连接子状态
export enum robotSubStatus {
    'onLine'    = 0,    // 在线
    'delivery'  = 1,    // 配送
    'hPickUpD'  = 2,    // 帮取送
    'rToc'      = 3,    // 返回充电中
    'detaching' = 4,    // 脱离中
    'charging'  = 5,    // 充电中
    'lowBattery'= 6,    // 低电量
    'higBattery'= 7,    // 高电量
    'call'      = 8,    // 呼叫
    'lead'      = 9,    // 引领
    'explain'   = 10    // 讲解
}

// 产品编辑的tab
export enum tabName {
    attr='attr',
    control='control',
    propaganda='propaganda',
    bootAnimation='bootAnimation',
    propagandaVideo='propagandaVideo'
} 