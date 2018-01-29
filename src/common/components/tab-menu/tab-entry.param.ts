import { ATTR } from "../../../common/top-common/attr";

/**
 * @author liurong
 * @date 2017-08-17
 * @notes 调用页签入口参数接口
 */
export interface TabEntryParam  {
    
    /**
     * 动作 TAB_ACTIVE
     */
    active: TAB_ACTIVE | string;
    /**
     * 模块号
     */
    moduleId: number;
    /**
     * 操作类型 string | ATTR
     */
    attr: string | ATTR ;
    /**
     * 动作的参数
     */
    param?: any;
}


/**
 * 页签动作
 */
export enum TAB_ACTIVE {
    /**
     * 打开页签
     */
    OPEN,
    /**
     * 显示
     */
    SHOW,
    /**
     * 关闭页签
     */
    CLOSE,
    /**
     *  获取页面参数
     */
    GET_PARAM  
}