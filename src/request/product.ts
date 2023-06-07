import axios from "./axios";

import { chartParamT } from "@/interface/apiParams";

// console page 获取产品类型列表
export const getProductTypeList = () => {
    return axios({
        url: "/product/type/list",
        method: "get"
    })
};

// console page 获取图表数据
export const getProductChartData = (params: chartParamT) => {
    return axios({
        url: "/product/getProductDataStatisticsByInternalDate",
        method: "post",
        data: params
    })
};

// console page 切换图表数据 7year 7week 7day
export const getOrderChartData = (params: { type: number }) => {
    return axios({
        url: "/product/getOrderDataStatisticsByInternalDate",
        method: "post",
        data: params
    })
}