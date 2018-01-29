
/**
 * 消息提示接口
 */
export interface ModalAlertOption {
    title: string ; 
    message: string ; 
    height?: string|number;
    width?: string|number;
    position?: string|number;
    msgType?: string;
    /**
     * 关闭按钮是否隐藏
     * true-隐藏
     * false-不隐藏 默认 false
     */
    colseHide?: boolean;
    /**
     * 确定按钮名称 
     * 默认确定
     */
    okLabel?: string ; 
    /**
     * 取消按钮名称
     * 默认 取消
     */
    cancelLabel?: string ; 

    /**
     * 模式 
     * alert-提示框(一个按钮)
     * confirm-确定框(有两个按钮) 默认
     */
    mode?: string;
    /**
     * 是否使用modal 
     * 默认 true
     */
    isModal?: boolean;

}