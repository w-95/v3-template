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

export interface prodtInfoPT {
    productId: string,
    memberId: number,
    id: string
}

export interface editProductT {
    id: string | number,
    productName: string,
    remindChargeValue: number,
    chargeValue: number,
    state: number,
    businessId: number,
    enabledState: number,
    elevatorIds: string
}