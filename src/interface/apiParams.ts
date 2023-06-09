export interface loginParamT {
    username: string,
    password: string
}

export interface chartParamT {
    memberId: number,
    startTime: string,
    endTime: string
}

export interface PordtListPT {
    productName: string,
    productCode: string,
    productTypeId: string,
    pageNum: number,
    pageSize: number
}