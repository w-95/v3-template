import * as echarts from 'echarts';

type paramT = { timersX: string[], totalCounts: number[], successs: number[], percentage: number[] };
import { resetWeekT } from './initChartData';

export const getDisinfect_echarts = function ({ timersX, totalCounts, successs, percentage }: resetWeekT) {
    return {
        title: { text: "消毒任务统计", itemGap:20, },  // 图表左上方的标题
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: "#999"
                }
            },
            formatter: (params: any[]) => {
                let str = "";
                params.forEach((item, index) => {
                    let color = item.seriesName === "消毒任务量/次" ? '#CDCDCD' : item.seriesName === "成功任务量/次" ? "#289EED" : "#FFB84E"
                    let markerSpan = `<span style=display:inline-block;margin-right:10px;border-radius:10px;width:20px;height:8px;background-color:${color}></span>`
                    let markerSpan_1 = `<span style=display:inline-block;margin-right:10px;width:20px;height:8px;>
                <span style=display:inline-block;border-radius:10px;width:20px;height:2px;background-color:${color};position:relative;top:-2px>
                  <span style=width:8px;height:8px;border-radius:50%;display:inline-block;background-color:${color};position:absolute;top:-3px;left:6px></span>
                </span>
              </span>`
                    let unit = item.seriesType === 'line' ? '%' : '';
                    let template = item.seriesType === 'line' ? markerSpan_1 : markerSpan;
                    str += template + item.value + unit + "</br>"
                });
                return str
            }
        },
        xAxis: {
            type: 'category',
            data: timersX,
            nameTextStyle: {
                fontSize: 10,
                color: 'red'
            },
            axisLabel: {
                interval: 0,
                fontSize: set_xAxis(timersX.length),
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [{
            type: 'value',
            name: '消毒任务量',
            min: 0,
            max: Math.max.apply(null,totalCounts),
            interval: Math.max.apply(null,totalCounts) / 5,
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: (value: number) => {
                    return Math.round(value)
                }
            },
        }, {
            type: 'value',
            name: '成功率',
            positon: 'right',
            alignTicks: true,
            // 一般情况下百分比从0到100
            min: 0,
            max: 100,
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value}%' //设置右边显示为xx%
            },
            show: true
        }],
        legend: {
            right: 0,
            top: 0,
            data: [{
                name: '消毒任务量/次',
                itemStyle: {
                    color: '#CDCDCD'
                }
            }, {
                name: '成功任务量/次',
                itemStyle: {
                    color: '#289EED'
                }
            }, {
                name: '成功率',
                itemStyle: {
                    color: "#FFB84E"
                }
            }],
        },
        grid: {
            top: '26%',
            left: '3%',
            right: '4%',
            bottom: '0%',
            containLabel: true
        },
        series: [
            {
                name: '消毒任务量/次',
                type: 'bar',
                data: totalCounts,
                barGap: '-100%',
                silent: true,//务必同时设置静默属性，以使背景柱不响应任何操作
                barWidth: setBarWidth(totalCounts.length),
                barMinHeight: 2,
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 10
                    },
                    normal: {
                        color: '#CDCDCD',
                        //柱形图圆角设置，初始化效果
                        barBorderRadius: [10, 10, 10, 10]
                    }
                }
            },
            {
                name: '成功任务量/次',
                type: 'bar',
                // colorBy: "red",
                data: successs,
                barWidth: setBarWidth(successs.length),
                barMinHeight: 2,
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 10
                    },
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#289EED'
                        }, {
                            offset: 1,
                            color: '#AADAFA'
                        }]),
                        zlevel: 9,
                        //柱形图圆角设置，初始化效果
                        barBorderRadius: [10, 10, 10, 10]
                    }
                }
            },
            {
                name: '成功率',
                type: 'line',
                stack: 'all',
                // barMinHeight: 20,
                // smooth: true,
                yAxisIndex: 1,
                symbolRepeat: true,
                animationEasing: 'elasticOut',
                // data: this.percentage([30, 356, 300, 800, 999, 1200], [200, 400, 600, 800, 1000, 1200]),
                data: percentage,
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 10
                    },
                    normal: {
                        color: '#FFB84E',
                        //柱形图圆角设置，初始化效果
                        barBorderRadius: [10, 10, 10, 10]
                    }
                }
            }
        ]
    }
};

export const getDelivery_echarts = function ({ timersX, totalCounts, successs, percentage }: paramT) {
    return {
        title: { text: "配送订单统计" },  // 图表左上方的标题
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: "#999"
                }
            },
            formatter: (params: any[]) => {
                let str = "";
                params.forEach((item, index) => {
                    let color = item.seriesName === "配送任务量/次" ? '#CDCDCD' : item.seriesName === "成功任务量/次" ? "#6160F4" : "#FFB84E"
                    let markerSpan = `<span style=display:inline-block;margin-right:10px;border-radius:10px;width:20px;height:8px;background-color:${color}></span>`
                    let markerSpan_1 = `<span style=display:inline-block;margin-right:10px;width:20px;height:8px;>
                <span style=display:inline-block;border-radius:10px;width:20px;height:2px;background-color:${color};position:relative;top:-2px>
                  <span style=width:8px;height:8px;border-radius:50%;display:inline-block;background-color:${color};position:absolute;top:-3px;left:6px></span>
                </span>
              </span>`
                    let unit = item.seriesType === 'line' ? '%' : '';
                    let template = item.seriesType === 'line' ? markerSpan_1 : markerSpan;
                    str += template + item.value + unit + "</br>"
                });
                return str
            }
        },
        xAxis: {
            type: 'category',
            data: timersX,
            nameTextStyle: {
                fontSize: 10,
                color: 'red'
            },
            axisLabel: {
                interval: 0,
                fontSize: set_xAxis(timersX.length),
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [{
            type: 'value',
            name: '配送任务量',
            min: 0,
            max: Math.max.apply(null,totalCounts),
            interval: Math.max.apply(null,totalCounts) / 5,
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: (value: number) => {
                    return Math.round(value)
                }
            },
            splitLine: {
                show: false,
            }
        }, {
            type: 'value',
            name: '成功率',
            positon: 'right',
            // 一般情况下百分比从0到100
            min: 0,
            // max: Math.max.apply(null,percentage),
            max: 100,
            // interval: Math.round(Math.max.apply(null,percentage) / 6),
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value}%' //设置右边显示为xx%
            },
            show: true
        }],
        legend: {
            right: 0,
            top: 0,
            data: [{
                name: '配送任务量/次',
                itemStyle: {
                    color: '#CDCDCD'
                }
            }, {
                name: '成功任务量/次',
                itemStyle: {
                    color: '#6160F4'
                }
            }, {
                name: '成功率',
                itemStyle: {
                    color: "#FFB84E"
                }
            }],
        },
        grid: {
            top: '26%',
            left: '3%',
            right: '4%',
            bottom: '0%',
            containLabel: true
        },
        series: [
            {
                name: '配送任务量/次',
                type: 'bar',
                data: totalCounts,
                barGap: '-100%',
                silent: true,//务必同时设置静默属性，以使背景柱不响应任何操作
                barWidth: setBarWidth(totalCounts.length),
                barMinHeight: 2,
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 10
                    },
                    normal: {
                        color: '#CDCDCD',
                        //柱形图圆角设置，初始化效果
                        barBorderRadius: [10, 10, 10, 10]
                    }
                }
            },
            {
                name: '成功任务量/次',
                type: 'bar',
                // colorBy: "red",
                data: successs,
                barWidth: setBarWidth(successs.length),
                barMinHeight: 2,
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 10
                    },
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#6160F4'
                        }, {
                            offset: 1,
                            color: '#CFCEFF'
                        }]),
                        zlevel: 9,
                        //柱形图圆角设置，初始化效果
                        barBorderRadius: [10, 10, 10, 10]
                    }
                }
            },
            {
                name: '成功率',
                type: 'line',
                stack: 'all',
                yAxisIndex: 1,
                symbolRepeat: true,
                animationEasing: 'elasticOut',
                data: percentage,
                tooltip: {
                    valueFormatter: function (value: number) {
                        return value / 10 + '%'; // 单位后缀 百分比
                    }
                },
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 10
                    },
                    normal: {
                        color: '#FFB84E',
                        //柱形图圆角设置，初始化效果
                        barBorderRadius: [10, 10, 10, 10]
                    }
                }
            }
        ]
    }
};

// 设置柱状图宽度
const setBarWidth = ( length: number ) => {
    if(length <= 10) {
        return 20
    }else if(length > 10 && length <= 17) {
        return 15
    }else if(length > 18 && length <= 25) {
        return 10
    }else {
        return 8
    }
};

// 设置x轴的文字大小
const set_xAxis = (length: number) => {
    if(length <= 10) {
        return 12
    }else if(length > 10 && length <= 17) {
        return 10
    }else if(length > 18 && length <= 25) {
        return 8
    }else {
        return 6
    }
}
