import { Menu } from "./menu";

export interface TabMenuInput {
    menus: Menu[],
    //菜单路由前缀
    menuRouterPrefix?: string
    //默认打开页签
    defaultOpenModuleId?: number
}