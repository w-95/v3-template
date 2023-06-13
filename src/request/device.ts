/**
 * 设备相关
 */
import axios from "./axios";

// 获取设备列表
export const getDeviceList = () => {
    return axios({
        url: '/product/device/list',
        method: 'get'
    })
}