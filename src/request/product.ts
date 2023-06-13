import axios from "./axios";

import { chartParamT, PordtListPT, prodtInfoPT, editProductT } from "@/interface/apiParams";

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
};

// product List 获取产品的类型
export const getProductTypes = () => {
    return axios({
        url: "/product/type/list",
        method: "get"
    })
};

// product table 获取产品的机器人
export const getPordtList = ( params: PordtListPT) => {
    return axios({
        url: '/product/list2',
        method: "get",
        params
    })
};

// 获取产品信息
export const getProductInfo = ( params: prodtInfoPT) => {
    return axios({
        url: '/product/detail/' + params.id,
        method: 'get',
        params
    })
};

// 编辑产品信息
export const editProduct = ( { id, ...params}: editProductT ) => {
    return axios({
        url: 'product/edit/' + id,
        method: "post",
        data: params
    })
};

// 产品恢复出厂设置
export const factoryReset = ( params: { productId: string } ) => {
    return axios({
        url: 'member/delAllDataByProduct',
        method: 'post',
        data: params
    })
};

// 删除产品
export const removeProduct = ( params: { productId: string } ) => {
    return axios({
        url: '/member/deleteProduct',
        method: 'post',
        data: params
    })
}