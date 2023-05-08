import axios from "./axios";

interface singinParan {
    userName: "",
    password: ""
};

export const singin = (params: singinParan ) => {
    return axios({
        url: "/member/login",
        method: "post",
        data: params
    })
}