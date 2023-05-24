export interface MenuT {
    icon?: string,
    name?: string,
    path?: string,
}

export interface MenuListT extends MenuT {
    child?: MenuT[]
}