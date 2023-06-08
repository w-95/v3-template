import { reactive, onMounted, ref } from "vue";

import * as echarts from 'echarts';
import { ECharts } from "echarts";

import { consoleHeaderCard, deliveryReportTime } from "@/data";

import { ConsoleWeekChartT } from "@/interface/chart.ts";
import { chartIdName } from '@/interface/enum';

import { getProductChartData, getOrderChartData } from "@/request/product.ts";

import { getDelivery_echarts, getDisinfect_echarts } from './echartsConfig.ts';

import { useResizeObserver } from '@vueuse/core';

type paramT= { memberId: number, disinfectId: chartIdName, deliveryId: chartIdName };
export type resetWeekT = { timersX: string[], totalCounts: number[], successs: number[], percentage: number[] };

export const useChartData = ({ memberId, disinfectId, deliveryId }: paramT) => {

    const cards = reactive(consoleHeaderCard);
    const exportDateRange = ref([
        new Date(new Date().setDate(new Date().getDate() - 6)),
        new Date()
    ]);
    const showTool = ref(false);

    onMounted( async () => {
        // chart data
        const { status: chartStatus, data: chartData } = await getProductChartData(
            {
                startTime: exportDateRange.value[0].Format("yyyy-MM-dd"),
                endTime: exportDateRange.value[1].Format("yyyy-MM-dd"),
                memberId: memberId
            }
        );

        // init card 4
        if (chartStatus === 0 && chartData) 
        {
            const { 
                allTimerTaskStatistics, 
                weekTimerTaskStatistics, 
                allOrderStatistics, 
                weekOrderStatistics, 
                productCount, 
                appMemberCount,
                timerTaskStatisticsByWeek,
                deliveryOrderStatisticsByWeek
            } = chartData;
    
            // 初始化头部 4 个card
            cards[0].topCount = allTimerTaskStatistics;
            cards[0].bottomCount = weekTimerTaskStatistics;
    
            cards[1].topCount = allOrderStatistics;
            cards[1].bottomCount = weekOrderStatistics;
    
            cards[2].topCount = productCount;
    
            cards[3].topCount = appMemberCount;

            // 初始化消毒
            initChartData(timerTaskStatisticsByWeek, disinfectId, getDisinfect_echarts);
            // 初始化配送
            initChartData(deliveryOrderStatisticsByWeek, deliveryId, getDelivery_echarts);
        };
        
    });

    /**
     * 初始化图表
     * @param deliveryOrderStatisticsByWeek weekData
     * @param id idname
     */
    const initChartData = (deliveryOrderStatisticsByWeek: ConsoleWeekChartT[], id: string, config: Function) => 
    {
        const { El, CHART } = getEl_echarts(id);

        if(id === chartIdName.deliveryCharId) CHART.on('rendered', () => (showTool.value = true));

        const {timersX, totalCounts, successs, percentage} = resetWeekInfo(deliveryOrderStatisticsByWeek);

        const options = config({ timersX, totalCounts, successs, percentage});
        CHART.setOption(options);
        resizeChange(El, CHART);
    };

    /**
     * 将week信息重置成echarts需要的数据
     * @param weekList weekData
     * @returns resetWeekT
     */
    const resetWeekInfo = ( weekList: ConsoleWeekChartT[]): resetWeekT =>
    {
        const timersX = weekList.map((week) => week['createTime'].substring(5).replace(/-/g, '/'));
        const totalCounts = weekList.map((week) => week['totalCount']);
        const successs = weekList.map((week) => week['succeedTotal']);
        const percentage = successs.map((item, index) => {
            if (totalCounts[index] && totalCounts[index] >= item) {
              return Math.round(item / totalCounts[index] * 100)
            };
            return 0
        });
        return { timersX, totalCounts, successs, percentage }
    };

    /**
     * 下拉框change 7day 7week 7year
     * @param seleValue 
     */
    const seleChange = async ( seleValue: number) => 
    {
        const checkDay = deliveryReportTime.filter((item) => item.value === seleValue)[0].day;

        exportDateRange.value = [
            new Date(new Date().setDate(new Date().getDate() - (checkDay -1))), 
            new Date()
        ];

        const { status, data } = await getOrderChartData({ type: seleValue });
        
        if(status === 0 && data) {
            initChartData(data, chartIdName.deliveryCharId, getDelivery_echarts)
        }
    };

    /**
     * 监听某个元素的长宽变化
     * @param el 要监听的dom元素
     * @param echartEl echars的实例
     */
    const resizeChange = (el: HTMLElement, echartEl: ECharts) => 
    {
        useResizeObserver(el, () => echartEl.resize())
    };

    /**
     * 获取echars的实例和某个dom元素
     * @param id 元素id
     * @returns Object
     */
    const getEl_echarts = (id: string): { El: HTMLElement, CHART: ECharts } => 
    {
        const El = document.getElementById(id)!;
        return {
            El,
            CHART: echarts.init(El)
        }
    };

    return {
        cards,
        showTool,
        seleChange,
        exportDateRange
    }

}

