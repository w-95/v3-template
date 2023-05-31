export interface MenuT {
    icon?: string,
    name?: string,
    path?: string,
    lang?: string,
    [x: string]: any
}

export interface MenuListT extends MenuT {
    child?: MenuT[]
}