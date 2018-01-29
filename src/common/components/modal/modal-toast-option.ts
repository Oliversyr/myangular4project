
/**
 * 消息提示接口;
 * 自动隐藏
 */
export interface ModalToastOption {
    /**
     * 显示消息
     */
    message: string;
    /**
     * 显示类型
     * 	info,warning,success,error,mail,time,null 
     */
    msgType?: string;
    height?: string|number;
    width?: string|number;
    /**
     * 显示位置:
     *  top-left, 
    	top-right, 
    	bottom-left, 
    	bottom-right
     * 
     */
    position?: string|number;
    autoClose?: boolean;
    /**
     * 延时关闭事件 毫秒
     * 默认 3000
     */
    delayTimes?: number;
}