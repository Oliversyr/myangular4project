import { GlobalService } from './../../global/global.service';
import { KEYBOARD_VALUE } from './../../directives/keyboard/keyboard-value';
import { HOTKEYS } from './../../directives/keyboard/hotkeys';
import { Observable } from 'rxjs/Observable';
import { jqxNotificationComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxnotification';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { ModalAlertOption } from './modal-alert-option';
import { ModalToastOption } from './modal-toast-option';
import { TopCommon } from './../../top-common/top-common';
import { Injectable } from '@angular/core';
/**
 * 弹出框服务类
 * 包含: 提示框、询问框等
 */
@Injectable()
export class ModalService extends TopCommon {

    constructor(
        private globalService: GlobalService
    ) {
        super();
        this.globalService.modalService = this;
    }

    /**
    * 获取弹出框默认值
    * @returns ModalAlertOption 
    */
    getDefModalAlertOption(): ModalAlertOption {
        return {
            title: "信息提示",
            message: "",
            colseHide: false,
            msgType: "info",
            width: 300,
            height: 200,
            okLabel: "确定",
            cancelLabel: "取消",
            isModal: true,
            mode: 'confirm'
        }
    }

    /**
     * 提示框
     * msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {string} message 显示消息
     * @param {string} title 标题
     * @param {string=info} msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {string=确定} okLabel  确定按钮名称
     * @returns Observable<retCode> retCode: OK-确定按钮
     */
    modalAlert(message: string, title?: string, msgType?: string, callBackFun?: () => void, okLabel?: string): Observable<any> {
        let msgOption: ModalAlertOption = {
            message: message,
            title: title,
            mode: "alert"
        }
        if (msgType) {
            msgOption.msgType = msgType;
        }
        if (okLabel) {
            msgOption.okLabel = okLabel;
        }
        return this.modalAlertAdvance(msgOption);
    }

    /**
     * 确认框
     * 1. msgType  消息类型: info,warning,success,error,mail,time,null 
     * 2. callBackFun 点击确定按钮回调函数; retCode: OK-确定按钮, CANCEL-取消按钮
     * 3. 消息类型: info,warning,success,error,mail,time,null 
     * @param {string} message 显示消息
     * @param {string} title 标题
     * @param {string=info} msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {string=确定} okLabel  确定按钮名称
     * @param {string=取消} cancelLabel  取消按钮名称
     * @returns Observable<retCode> retCode: OK-确定按钮, CANCEL-取消按钮, NONE-关闭按钮
     */
    modalConfirm(message: string, title?: string, msgType?: string, okLabel?: string, cancelLabel?: string): Observable<any> {
        let msgOption: ModalAlertOption = {
            message: message,
            title: title,
            mode: "confirm"
        }
        if (msgType) {
            msgOption.msgType = msgType;
        }
        if (okLabel) {
            msgOption.okLabel = okLabel;
        }
        if (cancelLabel) {
            msgOption.cancelLabel = cancelLabel;
        }
        return this.modalAlertAdvance(msgOption);

    }

    /**
     * 
     * @param {ModalAlertOption} option 
     * @returns Observable<retCode> retCode: OK-确定按钮, CANCEL-取消按钮, NONE-关闭按钮
     */
    modalAlertAdvance(option: ModalAlertOption): Observable<string> {

        //如果某些属性没有设置,则取默认值
        let defOption: ModalAlertOption = this.getDefModalAlertOption();
        for (let key in defOption) {
            //不存在 则使用 默认属性
            if (!option[key]) {
                option[key] = defOption[key];
            }
        }

        return new Observable<any>(observable => {

            if (option.mode === "alert") {
                //只有一个提示框
                option.cancelLabel = null;
            }

            let newWindow = document.createElement('div');
            let currentWindowID = 'modal_alert_' + Math.random().toString(36).substr(2, 8);
            newWindow.id = currentWindowID;
            let cancelDisplay = option.cancelLabel ? "inline-block" : "none";
            let img: string = "";
            //设置提示图标
            if (option.msgType) {
                img = `<img src="assets/imgs/modal/${option.msgType}.png" />`;
            }
            newWindow.innerHTML =
                `<div class="alert-title">${img}${option.title}</div> 
                <div class="alert-box">
                   <div class="alert-content">${option.message}</div>
                   <div class="alert-foot">
                      <button title="热键:ENTER" class="sui-btn sui-btn-primary mr-xsmall" id="ok_${currentWindowID}" active="OK"> ${option.okLabel}(ENTER)</button>
                      <button title="热键:ESC" class="sui-btn sui-btn-gray mr-xsmall" id="cancel_${currentWindowID}" active="CANCEL" style="display:${cancelDisplay}" >${option.cancelLabel}(ESC)</button>
                  </div>
                </div>
               `;
            document.body.appendChild(newWindow);
            let jqxWin: jqxWindowComponent = jqwidgets.createInstance('#' + currentWindowID, 'jqxWindow', {
                height: option.height,
                width: option.width,
                showCloseButton: option.colseHide,
                okButton: "#ok_" + currentWindowID,
                cancelButton: "#cancel_" + currentWindowID,
                isModal: true
            });
            jqxWin.focus();
            let okElement: Element;
            jqxWin.host.on('keydown', (event) => {
                if (event.keyCode == KEYBOARD_VALUE[HOTKEYS.ENTER]) {
                    event.stopPropagation();
                    event.preventDefault();
                    if (!okElement) {
                        okElement = newWindow.querySelector("#ok_" + currentWindowID);
                    }
                    let _event = new Event('click');
                    okElement.dispatchEvent(_event);

                }
            });
            jqxWin.host.on('close', (event: any) => {
                let retCode: string;
                if (!option.cancelLabel) {
                    //无关闭按钮
                    retCode = 'OK';
                } else {
                    if (event.args.dialogResult.OK) {
                        retCode = 'OK';
                    } else if (event.args.dialogResult.Cancel) {
                        retCode = 'CANCEL';
                    } else {
                        retCode = 'NONE';
                    }
                }


                observable.next(retCode);
                observable.complete();
                this.globalService.focusInCurrentPage();
            });

        });
    }

    /**
      * 获取提示框默认值
      * @returns ModalToastOption 
      */
    getDefModalToastOption(): ModalToastOption {
        return {
            message: "",
            autoClose: true,
            delayTimes: 3000,
            msgType: "info",
            position: "top-right",
            width: 'auto',
            height: 'auto'
        }
    }

    /**
      * 显示提示框
      * msgType  消息类型: info,warning,success,error,mail,time,null 
      * @param {string} message 显示消息
      * @param {string=info} msgType  消息类型: info,warning,success,error,mail,time,null 
      * @param {number=3000} delayTimes 提示框显示时间(毫秒)
      */
    modalToast(message: string, msgType?: string, delayTimes?: number) {
        //获取默认值
        let msgOption: ModalToastOption = {
            message: message
        }
        if (msgType) {
            msgOption.msgType = msgType;
        }
        if (delayTimes) {
            msgOption.delayTimes = delayTimes;
        }
        this.modalToastAdvance(msgOption);
    }

    /**
      * 显示提示框(高级)支持更多条件
      * @param {ModalToastOption} msgOption 
      */
    modalToastAdvance(msgOption: ModalToastOption) {
        //如果某些属性没有设置,则取默认值
        let msgDefOption: ModalToastOption = this.getDefModalToastOption();
        for (let key in msgDefOption) {
            //不存在 则使用 默认属性
            if (!msgOption[key]) {
                msgOption[key] = msgDefOption[key];
            }
        }
        let newWindow = document.createElement('div');
        let currentWindowID = 'modal_toast_' + Math.random().toString(36).substr(2, 8);
        newWindow.id = currentWindowID;
        newWindow.innerHTML =
            `
        <div>${msgOption.message}</div>
        `;
        document.body.appendChild(newWindow);
        let toast: jqxNotificationComponent = jqwidgets.createInstance('#' + currentWindowID, 'jqxNotification', {
            width: msgOption.width,
            height: msgOption.height,
            position: msgOption.position,
            template: msgOption.msgType,
            animationCloseDelay: msgOption.delayTimes,
            autoClose: msgOption.autoClose,
            opacity: 1,
            autoOpen: true
        }
        );
    }


}