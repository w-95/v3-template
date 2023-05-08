import axios from "./axios";

import { loginParamT } from "@/interface/apiParams.ts";

// 登录
export const singin = (params: loginParamT ) => {
    return axios({
        url: "/member/login",
        method: "post",
        data: params
    })
};

// 获取用户信息
export const getUserInfo = () => {
    return axios({
        url: "/member/info",
        method: "get",
        data: {}
    })
};

// 获取当前用户的侧边栏
export const getMenuRoute = () => {
    return axios({
        url: "/sys/menu/route",
        method: "get",
        data: {}
    })
}