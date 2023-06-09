
import { robotCode } from "./enum";

export interface robotsTCodeT {
    id: number,
    typeCode: keyof typeof robotCode,
    type: typeof robotCode[keyof typeof robotCode],
    typeDes: any
}