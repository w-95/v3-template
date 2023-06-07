
export interface ConsoleWeekChartT {
    createTime: string,
    failedTotal: number,
    succeedTotal: number,
    totalCount: number
}

export interface ConsoleChartT {
    allOrderStatistics: number,
    allTimerTaskStatistics: number,
    appMemberCount: number,
    memberType: number,
    productCount: number,
    weekOrderStatistics: number,
    weekTimerTaskStatistics: number,
    deliveryOrderStatisticsByWeek: ConsoleWeekChartT[],
    timerTaskStatisticsByWeek: ConsoleWeekChartT[],
}