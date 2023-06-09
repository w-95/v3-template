import { roleCodeT } from './enum';
export interface UserInfoT {
    applicationId: number,
    createBy: number,
    createTime: string,
    id: number,
    isValid: number,
    memberType: number,
    mobile: string,
    nickName: string,
    realName: string,
    registerTime: string,
    roleCode: keyof typeof roleCodeT,
    sceneFlag: boolean,
    updateBy: number,
    updateTime: string,
    [x: string]: any
}