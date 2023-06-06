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
    console.log(params)
    return axios({
        url: "/product/getProductDataStatisticsByInternalDate",
        method: "post",
        data: params
    })
}