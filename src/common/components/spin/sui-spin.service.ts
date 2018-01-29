import { Observable } from 'rxjs/Observable';
import { TopCommon } from './../../top-common/top-common';
import { Injectable } from '@angular/core';

/**
 * spin加载层
 * 包含: 提示框、询问框等
 */
@Injectable()
export class SuiSpinService extends TopCommon{
    
    constructor(
    ) {
        super();
     }

     /**
     * 获取加载层默认值
     * @returns ModalAlertOption 
     */
    getDefSpinOption(): any {
        return {
            title: "信息提示",
            message: "",
            colseHide: false,
            msgType: "info",
            width: 300,
            height: 200,
            okLabel: "确定",
            cancelLabel: "取消",
            isModal: true ,
            mode: 'confirm'
        }
    }

    /**
     * 获取spin 元素
     * 
     * @param {string} message 
     * @returns {HTMLDivElement}
     */
    getSpinElement(message: string): HTMLDivElement {
        message = message ? message : "" ;
        let newSpinDiv = document.createElement('div');
        //注意 .sui-spin 样式去掉会影响其它地方
        //.ant-spin-text 影响设置message
        let rootELClassName: string = "sui-spin" ;
        newSpinDiv.className = `ant-spin-nested-loading ${rootELClassName}` ;
        newSpinDiv.innerHTML = `
            <div>
                <div class="ant-spin ant-spin-spinning ant-spin-show-text">
                    <span class="ant-spin-dot"><i></i><i></i><i></i><i></i></span>
                    <div class="ant-spin-text">${message}</div>
                </div>
            </div>
        `;

        return newSpinDiv;
    }
 
    /**
     * 创建加载层 完成后使用 closeSpin关闭
     * @param {string=} message - 消息
     * @param {HTMLElement=body} rootElement 
     * @returns {spinElement: HTMLElement, timeoutTimer: any}
     * timeoutTimer: 定时器; 超过90秒,直接关闭
     */
    createSpin(message?: string, rootElement?: HTMLElement): {spinElement: HTMLElement, timeoutTimer: any} {
        if(message == null || typeof message === "undefined") {
            message = "";
        }
        
        let newSpinDiv: HTMLDivElement =  this.getSpinElement(message);
        if(rootElement) {
            rootElement.appendChild(newSpinDiv);
        } else {
            document.body.appendChild(newSpinDiv);

        }
        //超时定时器
        let timeoutTimer = setTimeout(() => {
                newSpinDiv.remove();
                console.debug(" timeout 90m ,auto close the spin...");
            }, 90*1000);
        return {spinElement: newSpinDiv, timeoutTimer: timeoutTimer};
    }

    closeSpin(spin :{spinElement: HTMLElement, timeoutTimer: any}) {
        if(spin.spinElement) {
            spin.spinElement.remove();
        }
        if(spin.timeoutTimer) {
            clearTimeout(spin.timeoutTimer);
            // console.debug(">>>>>>>>>>close the timeout timer");
        }
    }

}