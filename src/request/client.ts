/**
 * 客户相关
 */
import axios from "./axios";

// 获取客户名称列表
export const getBusinessAll = ( params: { memberId: number } ) => {
    return axios({
        url: "/product/type/list",
        method: "post",
        data: params
    })
}